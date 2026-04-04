"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { InfrastructureDraft } from "@/components/ops/InfrastructureDraft";
import { useAiStream } from "@/hooks/useAiStream";
import { pulseOpsPrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useSearchParams } from "next/navigation";
import { downloadFile } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Terminal, Cloud, ShieldCheck, Zap, RotateCcw, Box, HardDrive, Cpu, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

type EnvType = "docker" | "terraform" | "k8s";

function OpsContent() {
  const [description, setDescription] = React.useState("");
  const [targetEnv, setTargetEnv] = React.useState<EnvType>("docker");
  const [step, setStep] = React.useState<"input" | "result">("input");
  const [files, setFiles] = React.useState<{ name: string; content: string }[]>([]);
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { output, isLoading, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("ops");

  // Handle Imports & History
  React.useEffect(() => {
    const id = searchParams.get("id");
    const isImport = searchParams.get("import") === "devlens";

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
          setDescription(`Infrastructure for: ${data.name || "Custom Project"}\n\nStack: ${data.language}\n\nArchitecture:\n${data.architecture}`);
          toast("Context Imported from DevLens", "success");
        } catch (e) {
             console.error("Context Transfer Error", e);
        }
      }
    }
  }, [searchParams, items, setOutput, toast]);

  // Parse multi-file output
  React.useEffect(() => {
    if (output && !isLoading) {
      const fileRegex = /\[FILE:\s*([^\]]+)\]\s*```(?:...)?\n([\s\S]*?)```/gi;
      const parsedFiles: { name: string; content: string }[] = [];
      let match;
      while ((match = fileRegex.exec(output)) !== null) {
        parsedFiles.push({ name: match[1].trim(), content: match[2].trim() });
      }
      if (parsedFiles.length > 0) {
        setFiles(parsedFiles);
      } else if (output.length > 100) {
           setFiles([{ name: "manifest.yaml", content: output }]);
      }
    }
  }, [output, isLoading]);

  const handleGenerate = async () => {
    if (!description.trim() || isLoading) return;
    setStep("result");
    const prompt = pulseOpsPrompt(description, targetEnv);
    const finalResult = await run(description, { systemPrompt: prompt });
    save({ 
        title: description.split("\n")[0].slice(0, 30), 
        input: description, 
        result: finalResult || output 
    });
  };

  const handleDownload = (file: { name: string; content: string }) => {
    downloadFile(file.content, file.name);
  };

  const environments: { id: EnvType; label: string; icon: LucideIcon; color: string }[] = [
    { id: "docker", label: "Hardened Docker", icon: Box, color: "text-blue-400" },
    { id: "terraform", label: "Cloud Terraform (AWS)", icon: HardDrive, color: "text-emerald-400" },
    { id: "k8s", label: "K8s High-Availability", icon: Cpu, color: "text-violet-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <PageHeader 
        icon={Terminal}
        label="Delivery Engine"
        title="PulseOps" 
        description="Transforming codebases into production-ready infrastructure with security hardening and cloud blueprints." 
      />

      <AnimatePresence mode="wait">
        {step === "input" ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-[3rem] p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <div className="relative space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                    Environment Ecosystem
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {environments.map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setTargetEnv(env.id)}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left group",
                          targetEnv === env.id 
                            ? "bg-blue-500/10 border-blue-400/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20" 
                            : "bg-muted/10 border-border/50 hover:border-muted-foreground/30"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          targetEnv === env.id ? "bg-blue-400/20 text-blue-400" : "bg-muted/20 text-muted-foreground"
                        )}>
                          <env.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={cn(
                            "text-xs font-black uppercase tracking-widest",
                            targetEnv === env.id ? "text-foreground" : "text-muted-foreground"
                          )}>{env.label}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">High-Intensity Baseline</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                    Architecture Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your infrastructure needs, cluster requirements, or provide your DevLens draft context..."
                    className="w-full h-48 bg-void/50 border border-border/50 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium leading-relaxed styled-scrollbar"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SOC2 COMPLIANT BASELINE</span>
                    <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5" /> MULTI-CLOUD READY</span>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!description.trim() || isLoading}
                    className="rounded-2xl px-10 h-14 bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/20 gap-3 group"
                  >
                    <span>Provision Blueprint</span>
                    <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
               <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("input");
                    reset();
                  }}
                  className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
               >
                  <RotateCcw className="w-4 h-4" />
                  Start New Environment
               </Button>
               {isLoading && (
                 <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Architecting Infrastructure...</span>
                 </div>
               )}
            </div>

            <InfrastructureDraft files={files} onDownload={handleDownload} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OpsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse">Loading Ops Cockpit...</div>}>
      <OpsContent />
    </Suspense>
  );
}
