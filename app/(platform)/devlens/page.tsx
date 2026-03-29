"use client";

import * as React from "react";
import { ArrowLeft, Download, History, Play, RotateCcw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { CodeInput } from "@/components/devlens/CodeInput";
import { LanguageSelector } from "@/components/devlens/LanguageSelector";
import { AnalysisOutput } from "@/components/devlens/AnalysisOutput";
import { useAiStream } from "@/hooks/useAiStream";
import { devlensPrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useDebounce } from "@/hooks/useDebounce";
import { downloadFile, truncate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useSearchParams } from "next/navigation";
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
    while(Date.now() < start + 100) {}
  }
  return true;
}`;

type Step = "input" | "result";

function DevLensContent() {
  const [step, setStep] = React.useState<Step>("input");
  const [code, setCode] = React.useState("");
  const [language, setLanguage] = React.useState("auto");
  const [errorLines, setErrorLines] = React.useState<number[]>([]);
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { output, isLoading, error, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("devlens");
  const { addNotification } = useNotifications();
  const [saveInitiated, setSaveInitiated] = React.useState(false);
  const debouncedCode = useDebounce(code, 1000);
  const [isReady, setIsReady] = React.useState(false);

  // Terminal & Preview State
  const [activeTab, setActiveTab] = React.useState<TabType>("analysis");
  const [logs, setLogs] = React.useState<ExecutionLog[]>([]);
  const [previewHtml, setPreviewHtml] = React.useState("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);

  // Load from search params (History)
  React.useEffect(() => {
    const id = searchParams.get("id");
    if (id && isReady) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setCode(item.input);
        setOutput(item.result as string);
        setSaveInitiated(true);
        setStep("result");
      }
    }
  }, [searchParams, items, isReady, setOutput]);

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
  }, [isLoading, output, error, saveInitiated, code, save, toast, addNotification]);

  const handleAnalyze = () => {
    if (!code.trim()) return;
    setSaveInitiated(false);
    setStep("result");
    setActiveTab("analysis");
    
    // Fall back to auto if language is strictly empty somehow
    const lang = language;
    
    const prompt = code;
    const systemPrompt = devlensPrompt(code, lang);
    
    run(prompt, { systemPrompt });
  };

  const handleClear = () => {
    setCode("");
    reset();
    setStep("input");
    setLogs([]);
    setPreviewHtml("");
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

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setStep("result");
    setActiveTab("console");
    const timestamp = new Date();
    const addLog = (log: ExecutionLog) => setLogs(prev => [...prev, log]);

    // Intelligent language detection if "auto"
    let effectiveLang = language.toLowerCase();
    if (effectiveLang === "auto") {
      effectiveLang = detectCodeLanguage(code);
      addLog({ type: "system", message: `Auto-detected language: ${effectiveLang.toUpperCase()}`, timestamp });
    } else {
      addLog({ type: "system", message: `Executing ${language} snippet...`, timestamp });
    }
    if (effectiveLang === "python") {
      await executePython(code, addLog);
    } else if (effectiveLang === "html") {
      setActiveTab("preview");
      setPreviewHtml(code);
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
              ${code}
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
                <p class="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Your styles are applied to this high-fidelity isolated environment with premium typography and lighting.</p>
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
                  <div class="button-group flex gap-4">
                    <button class="btn btn-primary px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Primary Action</button>
                    <button class="btn btn-secondary px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Secondary</button>
                  </div>
                </div>

                <div class="p-12 bg-slate-900 rounded-[3rem] shadow-[0_48px_80px_-20px_rgba(15,23,42,0.3)] flex flex-col justify-center space-y-8 text-white overflow-hidden relative group">
                   <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
                   <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"></div>
                   
                   <div class="relative z-10 space-y-2">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                           <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                        </div>
                        <h2 class="text-2xl font-black uppercase tracking-widest text-white/90">Onyx Core</h2>
                      </div>
                      <p class="text-slate-400 text-lg leading-relaxed font-medium">Test dark-mode aesthetics, high-contrast ratios, and cinematic glow effects across your component library.</p>
                   </div>
                   <div class="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                      <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">System.Stable.Active</span>
                      </div>
                      <div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 tracking-tighter uppercase">
                        V-Stream 8.1
                      </div>
                   </div>
                </div>
              </section>

              <section class="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-8 relative overflow-hidden">
                 <div class="flex items-center justify-between relative z-10">
                    <div class="space-y-2">
                       <div class="h-8 w-64 bg-gradient-to-r from-slate-100 to-transparent rounded-xl"></div>
                       <div class="h-4 w-40 bg-slate-50 rounded-lg"></div>
                    </div>
                    <div class="w-16 h-16 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                       <div class="w-8 h-8 rounded-full bg-indigo-200 animate-bounce"></div>
                    </div>
                 </div>
                 <div class="grid grid-cols-3 gap-6 relative z-10">
                    <div class="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center group overflow-hidden">
                       <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transform translate-y-24 group-hover:translate-y-0 transition-all duration-500">
                          <span class="text-xl font-bold text-slate-400">01</span>
                       </div>
                    </div>
                    <div class="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center group overflow-hidden">
                       <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transform translate-y-24 group-hover:translate-y-0 transition-all duration-500 delay-75">
                          <span class="text-xl font-bold text-slate-400">02</span>
                       </div>
                    </div>
                    <div class="h-48 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center group overflow-hidden">
                       <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transform translate-y-24 group-hover:translate-y-0 transition-all duration-500 delay-150">
                          <span class="text-xl font-bold text-slate-400">03</span>
                       </div>
                    </div>
                 </div>
              </section>
            </div>
          </body>
        </html>
      `;
      setPreviewHtml(template);
      addLog({ type: "system", message: "CSS Preview rendered in sandbox.", timestamp: new Date() });
    } else if (effectiveLang === "react" || effectiveLang === "tsx" || effectiveLang === "jsx") {
      setActiveTab("preview");
      const babel = await getBabel(addLog);
      if (!babel) {
        addLog({ type: "error", message: "Babel failed to load environment", timestamp: new Date() });
        setIsRunning(false);
        return;
      }

      try {
        const transpiled = babel.transform(code, {
          presets: ["react", ["typescript", { isTSX: true, allExtensions: true }]],
        }).code;

        // Enhanced React preview template with robust root detection
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
                    // Handle "export default" if present in transpiled code
                    let codeToRun = \`${transpiled.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;
                    
                    // Simple polyfill for exports if the user used ES modules syntax that Babel left in
                    window.exports = {};
                    window.module = { exports: window.exports };
                    
                    const script = document.createElement('script');
                    script.text = codeToRun;
                    document.body.appendChild(script);
                    
                    // Search for a likely root component
                    const possibleRoots = ['App', 'Default', 'Main', 'Page', 'Preview', 'Dashboard'];
                    let ComponentToRender = null;
                    
                    // Priority 1: Explicitly assigned to window.exports.default
                    if (window.exports && window.exports.default) {
                       ComponentToRender = window.exports.default;
                    } 
                    // Priority 2: Named App component
                    else if (typeof App !== 'undefined') {
                       ComponentToRender = App;
                    } 
                    // Priority 3: Any uppercase function in window
                    else {
                       for (const key in window) {
                          if (key[0] === key[0]?.toUpperCase() && typeof window[key] === 'function' && 
                              !['React', 'ReactDOM'].includes(key)) {
                             ComponentToRender = window[key];
                             break;
                          }
                       }
                    }
                    
                    if (ComponentToRender) {
                      Root.render(React.createElement(ComponentToRender));
                    }
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
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        addLog({ type: "error", message: "Transpilation failed: " + message, timestamp: new Date() });
      }
    } else if (["java", "rust", "go", "cpp", "c", "sql", "bash"].includes(effectiveLang)) {
       addLog({ type: "warn", message: `Live execution for ${effectiveLang.toUpperCase()} is currently unavailable in the browser environment.`, timestamp: new Date() });
       addLog({ type: "system", message: "Try analyzing the code with DevLens instead to get deep-structural insights.", timestamp: new Date() });
    } else {
      // Default to JS/TS with a final sanity check
      const isDefinitelyNotJS = code.trim().startsWith("#include") || code.trim().startsWith("SELECT") || code.trim().startsWith("package ");
      
      if (isDefinitelyNotJS && effectiveLang === "auto") {
        addLog({ type: "warn", message: "This snippet doesn't look like valid executable JavaScript. We've blocked execution to prevent errors.", timestamp: new Date() });
        addLog({ type: "system", message: "Tip: Use the Analysis tab for deep language-specific insights.", timestamp: new Date() });
      } else {
        await executeJS(code, addLog);
      }
    }
    
    setIsRunning(false);
  };

  const handleClearLogs = () => setLogs([]);

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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full space-y-8"
          >
            <PageHeader 
              icon={Wand2}
              label="DevLens"
              title="Code Intelligence"
              description="Transform your source code into structured insights, bug reports, and optimized patterns."
            />

            <div className="bg-void/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Editor</span>
                </div>
                <div className="w-[160px]">
                  <LanguageSelector value={language} onChange={setLanguage} />
                </div>
              </div>

              <div className="flex-1 p-2">
                <CodeInput 
                  value={code} 
                  onChange={setCode} 
                  errorLines={errorLines} 
                  className="h-[400px] sm:h-[500px]" 
                />
              </div>

              <div className="px-6 py-4 bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{code.length} chars</span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-xs font-mono text-muted-foreground">{code.split("\n").filter(Boolean).length} lines</span>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button variant="ghost" size="sm" onClick={handleClear} disabled={!code.trim()} className="hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleSample}>
                    Sample
                  </Button>
                  <div className="flex-1 sm:hidden" />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleRunCode} variant="outline" size="sm" disabled={!code.trim() || isRunning} className="gap-2 border-accent/20 text-accent hover:bg-accent/5">
                      <Play className="h-4 w-4" />
                      Run
                    </Button>
                    <Button onClick={handleAnalyze} disabled={!code.trim() || isLoading} className="shadow-lg shadow-accent/20">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Analysis Failed
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
            {/* STICKY ACTION HEADER */}
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
                     <span className="sm:hidden">Export</span>
                   </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 shrink-0 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5">
                   <RotateCcw className="h-4 w-4" />
                   New Code
                 </Button>
                 <div className="h-8 w-px bg-border/50 mx-1" />
                 <Button variant="outline" size="sm" onClick={() => {}} className="gap-2 shrink-0 border-border/50">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                 </Button>
               </div>
            </div>

            {/* FULL WIDTH RESULTS */}
            <div className="h-[calc(100vh-16rem)] min-h-[600px] flex flex-col">
              <TerminalHub 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                isStreaming={isLoading}
              >
                {activeTab === "analysis" && (
                  <div className="h-full overflow-y-auto styled-scrollbar pr-2 pb-10">
                    <AnalysisOutput 
                      markdown={output} 
                      isStreaming={isLoading} 
                      onApplyFix={(fixedCode) => {
                        setCode(fixedCode);
                        setStep("input");
                        toast("Fix applied successfully", "success");
                      }}
                      onErrorLinesFound={setErrorLines}
                    />
                  </div>
                )}
                {activeTab === "console" && (
                  <OutputConsole logs={logs} onClear={handleClearLogs} />
                )}
                {activeTab === "preview" && (
                  <PreviewFrame 
                    html={previewHtml} 
                    onExpand={() => setIsPreviewModalOpen(true)}
                  />
                )}
              </TerminalHub>
            </div>

            <PreviewModal 
              isOpen={isPreviewModalOpen} 
              onClose={() => setIsPreviewModalOpen(false)} 
              html={previewHtml} 
            />
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
