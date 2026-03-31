"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { ArchitectureWiki } from "@/components/docs/ArchitectureWiki";
import { useAiStream } from "@/hooks/useAiStream";
import { pulseDocsPrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useSearchParams } from "next/navigation";
import { downloadFile } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { BookOpen, Map, Workflow, Layers, RotateCcw, Sparkles, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

type DiagramType = "c4" | "sequence" | "flow";

function DocsContent() {
  const [description, setDescription] = React.useState("");
  const [diagramType, setDiagramType] = React.useState<DiagramType>("c4");
  const [step, setStep] = React.useState<"input" | "result">("input");
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { output, isLoading, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("docs");

  // Handle Imports & History
  React.useEffect(() => {
    const id = searchParams.get("id");
    const isImport = searchParams.get("import") === "specforge";

    if (id) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setDescription(item.input);
        setOutput(item.result as string);
        setStep("result");
      }
    } else if (isImport) {
      const transfer = localStorage.getItem("pulsekit_context_transfer");
      if (transfer) {
        try {
          const { data } = JSON.parse(transfer);
          setDescription(`Architecture Documentation for: ${data.title}\n\nProject Requirements:\n${data.analysis}`);
          toast("PRD Context Imported", "success");
        } catch (e) {
             console.error("Context Transfer Error", e);
        }
      }
    }
  }, [searchParams, items, setOutput, toast]);

  const handleGenerate = async () => {
    if (!description.trim() || isLoading) return;
    setStep("result");
    const prompt = pulseDocsPrompt(description, diagramType);
    const result = await run(description, { systemPrompt: prompt });
    save({ 
      title: description.split("\n")[0].slice(0, 30), 
      input: description, 
      result: result || output 
    });
  };

  const handleDownload = () => {
    downloadFile(output, `architecture_${Date.now()}.md`, "text/markdown");
  };

  const diagramOptions: { id: DiagramType; label: string; icon: LucideIcon; color: string }[] = [
    { id: "c4", label: "C4 (Structural)", icon: Layers, color: "text-indigo-400" },
    { id: "sequence", label: "Sequence (Logic)", icon: Workflow, color: "text-emerald-400" },
    { id: "flow", label: "Flow (User/Data)", icon: Map, color: "text-amber-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <PageHeader 
        icon={BookOpen}
        label="Architectural Wiki"
        title="PulseDocs" 
        description="Automated engineering documentation and visual system mapping via Mermaid.js logic." 
      />

      <AnimatePresence mode="wait">
        {step === "input" ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="bg-void/50 border border-border/50 rounded-[40px] p-10 shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="relative space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                    Primary Visual Focus
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {diagramOptions.map((opt) => (
                      <Tooltip key={opt.id} content={`Generate a ${opt.label} diagram`}>
                        <button
                          onClick={() => setDiagramType(opt.id)}
                          className={cn(
                            "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left group",
                            diagramType === opt.id 
                              ? "bg-indigo-500/10 border-indigo-400/50 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20" 
                              : "bg-muted/10 border-border/50 hover:border-muted-foreground/30"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            diagramType === opt.id ? "bg-indigo-400/20 text-indigo-400" : "bg-muted/20 text-muted-foreground"
                          )}>
                            <opt.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={cn(
                              "text-xs font-black uppercase tracking-widest",
                              diagramType === opt.id ? "text-foreground" : "text-muted-foreground"
                            )}>{opt.label}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">Architecture Standard</p>
                          </div>
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                    System Architecture Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the system, actors, database relationships, or import from SpecForge PRD..."
                    className="w-full h-48 bg-void/50 border border-border/50 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium leading-relaxed styled-scrollbar"
                  />
                </div>

                <div className="flex items-center justify-end pt-4 relative">
                  <div className="absolute -right-24 top-0 hidden 2xl:flex flex-col gap-4">
                    <TooltipIconButton 
                      icon={RotateCcw} 
                      label="Clear Description" 
                      onClick={() => setDescription("")} 
                    />
                    <TooltipIconButton 
                      icon={Sparkles} 
                      label="Load Example Context" 
                      onClick={() => setDescription("Design a high-performance analytics ingestion engine using Apache Kafka, ClickHouse, and a Node.js consumer layer. Include authentication and rate limiting.")} 
                    />
                  </div>
                  
                  <Tooltip content="Transform description into technical documentation">
                    <Button
                      onClick={handleGenerate}
                      disabled={!description.trim() || isLoading}
                      className="rounded-2xl px-10 h-14 bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 gap-3 group"
                    >
                      <span>Architect Wiki</span>
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
               <Tooltip content="Return to diagram configuration">
                 <Button
                    variant="ghost"
                    onClick={() => {
                      setStep("input");
                      reset();
                    }}
                    className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
                 >
                    <RotateCcw className="w-4 h-4" />
                    Start New Documentation
                 </Button>
               </Tooltip>
               {isLoading && (
                 <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Rendering Architecture...</span>
                 </div>
               )}
            </div>

            <ArchitectureWiki content={output} onDownload={handleDownload} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-indigo-400">Loading Docs Studio...</div>}>
      <DocsContent />
    </Suspense>
  );
}

function TooltipIconButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-3 rounded-2xl bg-void/50 border border-border/30 text-muted hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-indigo-400/10 transition-all duration-300 group relative"
    >
       <Icon className="w-5 h-5" />
       <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          {label}
       </span>
    </button>
  );
}

const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div className="relative group/tooltip">
        {children}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            {content}
        </div>
    </div>
);
