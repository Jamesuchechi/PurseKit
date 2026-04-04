"use client";

import * as React from "react";
import { DraftingForm } from "@/components/devlens/DraftingForm";
import { FileTree } from "@/components/devlens/FileTree";
import { SpecBridge } from "@/components/devlens/SpecBridge";
import { ArrowLeft, Download, Play, RotateCcw, Sparkles, Trash2, Wand2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { CodeInput } from "@/components/devlens/CodeInput";
import { LanguageSelector } from "@/components/devlens/LanguageSelector";
import { AnalysisOutput } from "@/components/devlens/AnalysisOutput";
import { useAiStream } from "@/hooks/useAiStream";
import { devlensPrompt, devlensDraftingPrompt, dryRunPrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useDebounce } from "@/hooks/useDebounce";
import { downloadFile, truncate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalActions } from "@/hooks/useGlobalActions";
import { Suspense } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { TerminalHub, type TabType } from "@/components/devlens/TerminalHub";
import { OutputConsole } from "@/components/devlens/OutputConsole";
import { PreviewFrame } from "@/components/devlens/PreviewFrame";
import { executeJS, executePython, type ExecutionLog, getBabel } from "@/lib/devlens/engine";
import { detectCodeLanguage } from "@/lib/devlens/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PreviewModal } from "@/components/devlens/PreviewModal";

const SAMPLE_CODE = `function processData(input) {
  if (input == null) return false;
  let items = Object.values(input);
  
  for(var i=0; i<items.length; i++) {
    var query = "SELECT * FROM users WHERE id = " + items[i].id;
    db.execute(query);
    // slow loop
    let start = Date.now();
    while(Date.now() < start + 100) {}
  }
  return true;
}`;

type Step = "input" | "result";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function DevLensContent() {
  const [step, setStep] = React.useState<Step>("input");
  const [code, setCode] = React.useState("");
  const [language, setLanguage] = React.useState("auto");
  const [errorLines, setErrorLines] = React.useState<number[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { output, isLoading, error, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("devlens");
  const { addNotification } = useNotifications();
  const [saveInitiated, setSaveInitiated] = React.useState(false);
  const debouncedCode = useDebounce(code, 1000);
  const [isReady, setIsReady] = React.useState(false);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [draftDescription, setDraftDescription] = React.useState("");
  const [draftTechStack, setDraftTechStack] = React.useState("");
  const [draftFiles, setDraftFiles] = React.useState<{ name: string; content: string; language?: string }[]>([]);
  const [activeFileIndex, setActiveFileIndex] = React.useState(0);
  const [isSpecBridgeOpen, setIsSpecBridgeOpen] = React.useState(false);
  const [specData, setSpecData] = React.useState<{ title: string; analysis: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Terminal & Preview State
  const [activeTab, setActiveTab] = React.useState<TabType>("analysis");
  const [logs, setLogs] = React.useState<ExecutionLog[]>([]);
  const [previewHtml, setPreviewHtml] = React.useState("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [executionMode, setExecutionMode] = React.useState<'live' | 'simulation' | null>(null);

  // Load from search params (History or Import)
  React.useEffect(() => {
    const id = searchParams.get("id");
    const isImport = searchParams.get("import") === "specforge";

    if (id && isReady) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setCode(item.input);
        setOutput(item.result as string);
        setSaveInitiated(true);
        setStep("result");
      }
    } else if (isImport && isReady) {
      const transfer = localStorage.getItem("pulsekit_context_transfer");
      if (transfer) {
        try {
          const { source, data } = JSON.parse(transfer);
          if (source === "specforge") {
            setSpecData({ title: data.title, analysis: data.analysis });
            setIsSpecBridgeOpen(true);
            localStorage.removeItem("pulsekit_context_transfer");
          }
        } catch (e) {
          console.error("Failed to parse transfer context", e);
        }
      }
    }
  }, [searchParams, items, isReady, setOutput, toast]);

  React.useEffect(() => {
    try {
      if (!searchParams.get("id")) {
        const draft = window.localStorage.getItem("devlens_draft");
        if (draft) setCode(draft);
      }
    } catch {}
    setIsReady(true);
  }, [searchParams]);

  React.useEffect(() => {
    if (isReady && debouncedCode !== undefined && !searchParams.get("id")) {
      window.localStorage.setItem("devlens_draft", debouncedCode);
    }
  }, [debouncedCode, isReady, searchParams]);

  React.useEffect(() => {
    if (!isLoading && output.length > 0 && !saveInitiated && !error) {
      setSaveInitiated(true);
      setTimeout(() => {
        save({
          title: truncate(code.split("\n")[0]?.trim() || "Analysis", 60),
          input: code,
          result: output,
        }).then((item) => {
          toast("Analysis saved to history", "success");
          addNotification({
            type: "ai",
            title: "Analysis Complete",
            message: `DevLens analysis for '${item?.title}' is ready.`,
            module: "devlens",
            action: "View Report",
            actionHref: `/devlens?id=${item?.id}`
          });
        });
      }, 500);
    }
  }, [isLoading, output, error, saveInitiated, code, draftDescription, isDrafting, save, toast, addNotification]);

  const handleRunCode = React.useCallback(async (customCode?: string, forcedLang?: string) => {
    const codeToExecute = typeof customCode === 'string' ? customCode : code;
    if (!codeToExecute.trim()) return;
    
    setIsRunning(true);
    setStep("result");
    setActiveTab("console");
    const timestamp = new Date();
    const addLog = (log: ExecutionLog) => setLogs(prev => [...prev, log]);

    let effectiveLang = forcedLang || language.toLowerCase();
    if (effectiveLang === "auto") {
      effectiveLang = detectCodeLanguage(codeToExecute);
      addLog({ type: "system", message: `Auto-detected language: ${effectiveLang.toUpperCase()}`, timestamp });
    } else {
      addLog({ type: "system", message: `Preparing ${effectiveLang} snippet...`, timestamp });
    }

    const TIER1 = ["javascript", "typescript", "python", "html", "css", "jsx", "tsx", "react"];
    const TIER2 = ["java", "rust", "go", "cpp", "c", "sql", "bash"];

    try {
      if (TIER1.includes(effectiveLang)) {
        setExecutionMode('live');
        if (effectiveLang === "python") {
          await executePython(codeToExecute, addLog);
        } else if (effectiveLang === "html") {
          setActiveTab("preview");
          setPreviewHtml(codeToExecute);
          addLog({ type: "system", message: "HTML Preview rendered.", timestamp: new Date() });
        } else if (effectiveLang === "css") {
          setActiveTab("preview");
          const template = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                :root { --accent: #6366f1; }
                body { 
                  margin: 0; padding: 0; min-height: 100vh; 
                  background: radial-gradient(at top left, #f8fafc 0%, #f1f5f9 100%); 
                  font-family: 'Outfit', sans-serif; 
                  color: #1e293b;
                }
                .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
                ${codeToExecute}
              </style>
            </head>
            <body>
              <div class="max-w-5xl mx-auto p-12 space-y-16">
                <header class="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div class="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                    Visual Sandbox V2
                  </div>
                  <h1 class="text-6xl font-[900] text-slate-900 tracking-tighter leading-none">
                    CSS <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Mastery</span>
                  </h1>
                  <p class="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Your styles are applied to this isolated environment with premium typography and lighting.</p>
                </header>

                <section class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="container p-12 glass rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center space-y-8 transition-all hover:scale-[1.02] duration-500">
                    <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl rotate-6 shadow-2xl shadow-indigo-500/30 flex items-center justify-center text-white">
                      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                    </div>
                    <div class="space-y-3">
                      <h2 class="text-3xl font-bold tracking-tight">Interactive Surface</h2>
                      <p class="text-slate-500 leading-relaxed font-medium">Precision-crafted surface for testing layout, micro-interactions, and complex animations.</p>
                    </div>
                  </div>

                  <div class="container p-12 glass rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center space-y-10 group">
                    <div class="w-full flex justify-between items-center pb-6 border-b border-slate-200/50">
                      <div class="flex gap-1.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      </div>
                      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Panel</div>
                    </div>
                    <div class="w-full space-y-6">
                      <div class="h-3 w-1/2 bg-slate-200/50 rounded-full"></div>
                      <div class="h-3 w-full bg-slate-200/50 rounded-full"></div>
                      <div class="h-3 w-3/4 bg-slate-200/50 rounded-full"></div>
                    </div>
                  </div>
                </section>
              </div>
            </body>
          </html>
          `;
          setPreviewHtml(template);
          addLog({ type: "system", message: "CSS Styles applied to global manifest.", timestamp: new Date() });
        } else if (["javascript", "typescript", "jsx", "tsx", "react"].includes(effectiveLang)) {
          setActiveTab("preview");
          const babel = await getBabel(addLog);
          if (!babel) {
            addLog({ type: "error", message: "Babel failed to load environment", timestamp: new Date() });
            setIsRunning(false);
            return;
          }

          try {
            const transformed = babel.transform(codeToExecute, {
              presets: ["react", ["typescript", { isTSX: true, allExtensions: true }]],
            }).code;

            const template = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <style>
                  :root { --accent: #6366f1; }
                  body { 
                    margin: 0; min-height: 100vh; background: #ffffff; 
                    font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; 
                    color: #0f172a;
                  }
                  #root { flex: 1; display: flex; flex-direction: column; }
                  .loading-shimmer {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                  }
                  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                </style>
              </head>
              <body>
                <div id="root">
                  <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:40px;">
                     <div style="width:64px; height:64px; border-radius:16px; background:#f1f5f9; position:relative; overflow:hidden;">
                        <div class="loading-shimmer" style="position:absolute; inset:0;"></div>
                     </div>
                     <div style="width:120px; height:12px; border-radius:6px; background:#f1f5f9; position:relative; overflow:hidden;">
                        <div class="loading-shimmer" style="position:absolute; inset:0;"></div>
                     </div>
                  </div>
                </div>
                <script>
                  (function() {
                    const rootElement = document.getElementById('root');
                    const Root = ReactDOM.createRoot(rootElement);
                    try {
                      let codeToRun = \`${transformed.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;
                      window.exports = {};
                      window.module = { exports: window.exports };
                      const script = document.createElement('script');
                      script.text = codeToRun;
                      document.body.appendChild(script);
                      const possibleRoots = ['App', 'Default', 'Main', 'Page', 'Preview', 'Dashboard'];
                      let ComponentToRender = null;
                      if (window.exports && window.exports.default) { ComponentToRender = window.exports.default; } 
                      else if (typeof App !== 'undefined') { ComponentToRender = App; } 
                      else {
                         for (const key in window) {
                            if (key[0] === key[0]?.toUpperCase() && typeof window[key] === 'function' && !['React', 'ReactDOM'].includes(key)) {
                               ComponentToRender = window[key];
                               break;
                            }
                         }
                      }
                      if (ComponentToRender) { Root.render(React.createElement(ComponentToRender)); }
                    } catch (e) {
                      rootElement.innerHTML = \`<div style="color:#ef4444;padding:40px;font-family:monospace;background:#fef2f2;border-radius:24px;margin:20px;border:1px solid #fee2e2;">
                          <h3 style="font-size:18px;font-weight:800;margin-bottom:12px;color:#991b1b;">Runtime Execution Error</h3>
                          <pre style="font-size:12px;overflow-x:auto;padding:20px;background:#ffffff;border-radius:16px;border:1px solid #fee2e2;">\${e.stack || e.message}</pre>
                      </div>\`;
                    }
                  })();
                </script>
              </body>
            </html>
            `;
            setPreviewHtml(template);
            addLog({ type: "system", message: "React Preview rendered.", timestamp: new Date() });
            
            // Also run logs
            await executeJS(codeToExecute, addLog);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            addLog({ type: "error", message: "Execution failed: " + message, timestamp: new Date() });
          }
        }
      } else if (TIER2.includes(effectiveLang)) {
        setExecutionMode('simulation');
        const { system, userMessage } = dryRunPrompt(codeToExecute, effectiveLang);
        const simResult = await run(userMessage, { systemPrompt: system });
        addLog({ type: "info", message: String(simResult || "Simulation complete."), timestamp, isSimulation: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addLog({ type: "error", message, timestamp });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, run]);

  React.useEffect(() => {
    if (!isLoading && isDrafting && output && step === "result") {
      const files: { name: string; content: string }[] = [];
      const fileRegex = /\[FILE:\s*([^\]]+)\]\s*```(?:react|tsx|jsx|javascript|js|html|css|python|go|rust|bash|sql|typescript)?\n([\s\S]*?)```/gi;
      
      let match;
      while ((match = fileRegex.exec(output)) !== null) {
        files.push({ name: match[1].trim(), content: match[2].trim() });
      }

      if (files.length > 0) {
        setDraftFiles(files);
        setActiveFileIndex(0);
        const mainFile = files[0];
        
        setTimeout(() => {
          const ext = mainFile.name.split(".").pop()?.toLowerCase();
          const langMap: Record<string, string> = {
            'html': 'html',
            'css': 'css',
            'js': 'javascript',
            'ts': 'typescript',
            'tsx': 'tsx',
            'jsx': 'jsx',
            'py': 'python'
          };
          const detectedLang = langMap[ext || ""] || "auto";
          const isFrontend = ["tsx", "jsx", "html", "css", "js", "ts"].includes(ext || "");
          
          if (isFrontend) {
            setActiveTab("preview");
          } else {
            setActiveTab("console");
          }

          // Context Injection: If HTML, find CSS in the draft and inject it
          let finalContent = mainFile.content;
          if (detectedLang === "html") {
            const cssFiles = files.filter(f => f.name.endsWith(".css"));
            if (cssFiles.length > 0) {
              const combinedCss = cssFiles.map(f => f.content).join("\n");
              if (finalContent.includes("</head>")) {
                finalContent = finalContent.replace("</head>", `<style>\n${combinedCss}\n</style>\n</head>`);
              } else if (finalContent.includes("<body>")) {
                finalContent = finalContent.replace("<body>", `<style>\n${combinedCss}\n</style>\n<body>`);
              } else {
                finalContent = `<style>\n${combinedCss}\n</style>\n` + finalContent;
              }
            }
          }

          handleRunCode(finalContent, detectedLang);
        }, 800);
      } else {
        // Fallback for single block if no [FILE] tags found
        const singleMatch = output.match(/```(?:react|tsx|jsx|javascript|js|html|css|python|go|rust|bash|sql|typescript)?\n([\s\S]*?)```/i);
        if (singleMatch && singleMatch[1]) {
          const content = singleMatch[1].trim();
          setDraftFiles([{ name: "Main implementation", content }]);
          setTimeout(() => handleRunCode(content), 800);
        }
      }
    }
  }, [isLoading, isDrafting, output, step, handleRunCode]);

  const handleTransformToPrd = () => {
    if (!output) return;
    const summaryMatch = output.match(/### Summary\n([\s\S]*?)(?=###|$)/i);
    const summary = summaryMatch?.[1]?.trim() || "Analysis of source code";
    const transfer = {
      source: "devlens",
      data: {
        title: truncate(code.split("\n")[0]?.trim() || "DevLens Analysis", 40),
        analysis: summary,
        originalCode: code
      }
    };
    localStorage.setItem("pulsekit_context_transfer", JSON.stringify(transfer));
    router.push("/specforge?import=devlens");
  };

  const handleProvision = () => {
    if (!output) return;
    const transfer = {
      source: "devlens",
      data: {
        name: truncate(code.split("\n")[0]?.trim() || "DevLens Project", 40),
        language: language === "auto" ? detectCodeLanguage(code) : language,
        architecture: draftDescription || "Custom implementation generated via DevLens.",
        files: draftFiles.length > 0 ? draftFiles : [{ name: "main", content: code }]
      }
    };
    localStorage.setItem("pulsekit_context_transfer", JSON.stringify(transfer));
    router.push("/ops?import=devlens");
  };

  const handleAnalyze = () => {
    if (isDrafting ? !draftDescription.trim() : !code.trim()) return;
    setSaveInitiated(false);
    setStep("result");
    if (isDrafting) {
      if (!draftDescription.trim()) return;
      setActiveTab("console");
      const systemPrompt = devlensDraftingPrompt(draftDescription, draftTechStack);
      run(draftDescription, { systemPrompt });
    } else {
      setActiveTab("analysis");
      const systemPrompt = devlensPrompt(code, language);
      run(code, { systemPrompt });
    }
  };

  const handleClear = () => {
    setCode("");
    reset();
    setStep("input");
    setLogs([]);
    setPreviewHtml("");
    setExecutionMode(null);
  };

  const handleSample = () => {
    setCode(SAMPLE_CODE);
    setLanguage("javascript");
    reset();
  };

  const handleExport = () => {
    if (!output) return;
    downloadFile(output, "devlens-analysis.md", "text/markdown");
  };

  const handleBackToEditor = () => {
    setStep("input");
  };

  const handleClearLogs = () => setLogs([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast("File exceeds 2MB limit", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext) setLanguage(ext);
      toast(`Imported ${file.name}`, "success");
    };
    reader.readAsText(file);
  };

  const handleSpecImport = (focus: string, description: string) => {
    setIsDrafting(true);
    setDraftDescription(description);
    setDraftTechStack(focus === "data" ? "Python / FastAPI" : focus === "ui" ? "React + Tailwind" : "Next.js 14 / TypeScript");
    setStep("input");
    toast(`Imported specs from SpecForge. Ready for drafting.`, "success");
  };

  useGlobalActions({
    onAnalyze: handleAnalyze,
    onExport: handleExport,
    onClear: handleClear,
  });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 min-h-[calc(100vh-8rem)]">
      <AnimatePresence mode="wait">
        {step === "input" ? (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full space-y-8"
          >
            <PageHeader 
              icon={Wand2}
              label="DevLens"
              title="Code Intelligence"
              description="Transform your source code into structured insights, bug reports, and optimized patterns."
            />

            <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Editor</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    accept=".js,.ts,.tsx,.jsx,.html,.css,.py,.go,.rs,.sql,.md,.txt,.sh"
                  />
                  {!isDrafting && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="text-muted hover:text-accent gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Browse
                    </Button>
                  )}
                  <div className="w-[160px]">
                    <LanguageSelector value={language} onChange={setLanguage} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/20 rounded-xl">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", isDrafting ? "text-accent" : "text-muted")}>
                      Drafting Mode
                    </span>
                    <button 
                      onClick={() => setIsDrafting(!isDrafting)}
                      className={cn(
                        "w-8 h-4 rounded-full relative transition-colors focus:outline-none",
                        isDrafting ? "bg-accent" : "bg-muted"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isDrafting ? 18 : 2 }}
                        className="absolute top-1 w-2 h-2 rounded-full bg-white"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-2">
                {isDrafting ? (
                  <DraftingForm 
                    description={draftDescription} 
                    setDescription={setDraftDescription}
                    techStack={draftTechStack}
                    setTechStack={setDraftTechStack}
                    className="min-h-[400px] sm:min-h-[500px]"
                  />
                ) : (
                  <CodeInput value={code} onChange={setCode} errorLines={errorLines} className="h-[400px] sm:h-[500px]" />
                )}
              </div>

              <div className="px-6 py-4 bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {isDrafting ? `${draftDescription.length} chars description` : `${code.length} chars`}
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {isDrafting ? "Drafting Mode" : `${code.split("\n").filter(Boolean).length} lines`}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button variant="ghost" size="sm" onClick={handleClear} disabled={isDrafting ? !draftDescription.trim() : !code.trim()} className="hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear
                  </Button>
                  {!isDrafting && <Button variant="secondary" size="sm" onClick={handleSample}>Sample</Button>}
                  <div className="flex-1 sm:hidden" />
                  <div className="flex items-center gap-2">
                    {!isDrafting && (
                      <Button onClick={() => handleRunCode()} variant="outline" size="sm" disabled={!code.trim() || isRunning} className="gap-2 border-accent/20 text-accent hover:bg-accent/5">
                        <Play className="h-4 w-4" /> Run
                      </Button>
                    )}
                    <Button onClick={handleAnalyze} disabled={isDrafting ? !draftDescription.trim() || isLoading : !code.trim() || isLoading} className={cn("shadow-lg shadow-accent/20", isDrafting && "bg-indigo-600 hover:bg-indigo-700")}>
                      <Sparkles className="h-4 w-4 mr-2" /> 
                      {isDrafting ? "Draft Project" : "Analyze"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Analysis Failed
                </p>
                <p>{error}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="result-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-2xl border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button variant="ghost" size="sm" onClick={handleBackToEditor} className="group text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Editor
                </Button>
                <div className="h-6 w-px bg-border/50 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Project Phase</span>
                  <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-xs">{code.split("\n")[0]?.slice(0, 40) || "Analysis Result"}</span>
                </div>
               </div>

               <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                 {output && !isLoading && (
                   <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 shrink-0 border-border/50">
                     <Download className="h-4 w-4" />
                     <span className="hidden sm:inline">Export MD</span>
                   </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 shrink-0 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5">
                   <RotateCcw className="h-4 w-4" /> New Code
                 </Button>
               </div>
            </div>

            <div className="h-[calc(100vh-16rem)] min-h-[600px] flex flex-col">
                  <div className="flex flex-col md:flex-row h-full">
                    {isDrafting && draftFiles.length > 0 && (
                      <FileTree 
                        files={draftFiles} 
                        activeIndex={activeFileIndex} 
                        onSelect={(index) => {
                          setActiveFileIndex(index);
                          const selectedFile = draftFiles[index];
                          const ext = selectedFile.name.split(".").pop()?.toLowerCase();
                          const langMap: Record<string, string> = {
                            'html': 'html',
                            'css': 'css',
                            'js': 'javascript',
                            'ts': 'typescript',
                            'tsx': 'tsx',
                            'jsx': 'jsx',
                            'py': 'python'
                          };
                          const detectedLang = langMap[ext || ""] || "auto";
                          
                          let finalContent = selectedFile.content;
                          if (detectedLang === "html") {
                            const cssFiles = draftFiles.filter(f => f.name.endsWith(".css"));
                            if (cssFiles.length > 0) {
                              const combinedCss = cssFiles.map(f => f.content).join("\n");
                              if (finalContent.includes("</head>")) {
                                finalContent = finalContent.replace("</head>", `<style>\n${combinedCss}\n</style>\n</head>`);
                              } else {
                                finalContent = `<style>\n${combinedCss}\n</style>\n` + finalContent;
                              }
                            }
                          }

                          handleRunCode(finalContent, detectedLang);
                        }}
                      />
                    )}
                    <div className="flex-1 overflow-hidden h-full">
                      <TerminalHub activeTab={activeTab} onTabChange={setActiveTab} isStreaming={isLoading}>
                        {activeTab === "analysis" && (
                          <div className="h-full overflow-y-auto styled-scrollbar pr-2 pb-10">
                            <AnalysisOutput 
                              markdown={output} 
                              isStreaming={isLoading} 
                              onApplyFix={(fixedCode) => {
                                setCode(fixedCode);
                                setStep("input");
                                toast("Fix applied", "success");
                              }}
                              onTransformToPrd={handleTransformToPrd}
                              onProvision={handleProvision}
                              onErrorLinesFound={setErrorLines}
                            />
                          </div>
                        )}
                        {activeTab === "console" && (
                          <OutputConsole logs={logs} onClear={handleClearLogs} executionMode={executionMode} />
                        )}
                        {activeTab === "preview" && (
                          <PreviewFrame html={previewHtml} onExpand={() => setIsPreviewModalOpen(true)} />
                        )}
                      </TerminalHub>
                    </div>
                  </div>
            </div>

            <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} html={previewHtml} />

            {specData && (
              <SpecBridge 
                isOpen={isSpecBridgeOpen} 
                onClose={() => setIsSpecBridgeOpen(false)} 
                specData={specData}
                onImport={handleSpecImport}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DevLensPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    }>
      <DevLensContent />
    </Suspense>
  );
}
