"use client";

import * as React from "react";
import { 
  FileText, Book, Layout, ListChecks, Terminal, 
  Copy, Download, Check, Zap, Package, ShieldCheck,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, downloadFile } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import ReactMarkdown from "react-markdown";

interface BlueprintFile {
  name: string;
  content: string;
  icon: typeof FileText;
  description: string;
}

interface BlueprintViewerProps {
  rawBlueprint: string;
  onBack: () => void;
}

const FILE_CONFIG = [
  { name: "README.md", icon: Book, description: "Official project overview & branding" },
  { name: "Documentation.md", icon: FileText, description: "Technical deep-dive & architecture" },
  { name: "Architecture.md", icon: Layout, description: "System design & Mermaid diagrams" },
  { name: "Todo.md", icon: ListChecks, description: "Prioritized implementation roadmap" },
  { name: "Setup.md", icon: Terminal, description: "Deployment & environment guide" },
];

export function BlueprintViewer({ rawBlueprint, onBack }: BlueprintViewerProps) {
  const [files, setFiles] = React.useState<BlueprintFile[]>([]);
  const [activeFile, setActiveFile] = React.useState<string>("README.md");
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    // Parse the raw AI output delimited by [FILE: filename]
    const parsedFiles: BlueprintFile[] = [];
    const segments = rawBlueprint.split(/\[FILE:\s*(.*?)\]/g).filter(Boolean);
    
    for (let i = 0; i < segments.length; i += 2) {
      const name = segments[i]?.trim();
      const content = segments[i + 1]?.trim();
      if (name && content) {
        const config = FILE_CONFIG.find(f => f.name === name) || { icon: FileText, description: "Project asset" };
        parsedFiles.push({
          name,
          content,
          icon: config.icon,
          description: config.description
        });
      }
    }
    setFiles(parsedFiles);
    if (parsedFiles.length > 0) setActiveFile(parsedFiles[0].name);
  }, [rawBlueprint]);

  const activeFileData = files.find(f => f.name === activeFile);

  const handleCopy = () => {
    if (!activeFileData) return;
    navigator.clipboard.writeText(activeFileData.content);
    setCopied(true);
    toast("File copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeFileData) return;
    downloadFile(activeFileData.content, activeFileData.name, "text/markdown");
    toast(`Downloading ${activeFileData.name}`, "success");
  };

  const handleCopyAll = () => {
    const allText = files.map(f => `--- ${f.name} ---\n\n${f.content}`).join("\n\n");
    navigator.clipboard.writeText(allText);
    toast("Full blueprint suite copied", "success");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
      {/* Blueprint Navigation Sidebar */}
      <aside className="lg:w-80 shrink-0 space-y-8 animate-in slide-in-from-left-8 fade-in duration-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Project Blueprint</h3>
            <span className="text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
              5 Files Ready
            </span>
          </div>
          
          <nav className="flex flex-col gap-2">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={cn(
                  "group relative w-full flex flex-col items-start gap-1 p-5 rounded-3xl transition-all border duration-500",
                  activeFile === file.name 
                    ? "bg-accent/10 border-accent/30 shadow-xl shadow-accent/5" 
                    : "bg-muted/10 border-border/50 hover:bg-muted/20 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-2xl transition-all duration-500",
                    activeFile === file.name ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-void/50 text-muted group-hover:text-foreground"
                  )}>
                    <file.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className={cn("text-sm font-bold block", activeFile === file.name ? "text-foreground" : "text-muted-foreground")}>
                      {file.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted/60">{file.description}</span>
                  </div>
                </div>
                {activeFile === file.name && (
                  <motion.div 
                    layoutId="blueprint-indicator"
                    className="absolute inset-y-0 -left-1 w-1 bg-accent rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-void/40 border border-border/50 backdrop-blur-2xl space-y-6">
           <Package className="w-10 h-10 text-accent/50" />
           <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground">Next Step: Implementation</h4>
              <p className="text-xs text-muted leading-relaxed font-medium">Use these assets to scaffold your local environment. Detailed manifest provided.</p>
           </div>
           <Button variant="outline" size="sm" onClick={handleCopyAll} className="w-full text-[10px] font-black uppercase tracking-widest gap-2">
              <Copy className="w-3.5 h-3.5" /> Copy Entire Suite
           </Button>
        </div>

        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground transition-colors ml-4">
           <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-generate PRD
        </button>
      </aside>

      {/* Main File Content Viewer */}
      <main className="flex-1 flex flex-col min-w-0 bg-void/50 rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl animate-in slide-in-from-right-8 fade-in duration-700">
         <div className="flex items-center justify-between px-10 py-8 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Scaffolding
               </div>
               <h2 className="text-xl font-bold font-display text-foreground">{activeFile}</h2>
            </div>

            <div className="flex items-center gap-3">
               <Button variant="ghost" size="sm" onClick={handleDownload} className="text-muted hover:text-foreground">
                  <Download className="w-4 h-4 mr-2" /> Download
               </Button>
               <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy Content"}
               </Button>
            </div>
         </div>

         <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-background/30 backdrop-blur-3xl prose prose-invert prose-blue max-w-none prose-h1:text-4xl prose-h1:font-black prose-p:text-muted/90 prose-pre:bg-void/50 prose-pre:border prose-pre:border-border/50 prose-code:text-accent">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeFileData ? (
                  <ReactMarkdown>{activeFileData.content}</ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted font-medium">
                    <Zap className="w-12 h-12 mb-4 animate-pulse" />
                    Preparing your project assets...
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
