"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, TrendingUp, Info, Download, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface CrucibleVerdictProps {
  verdict: string;
  onRestart: () => void;
  onExport: () => void;
}

export function CrucibleVerdict({ verdict, onRestart, onExport }: CrucibleVerdictProps) {
  // Extract score from the markdown if possible
  const scoreMatch = verdict.match(/\[Score:\s*(\d+)\]/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
  
  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (s >= 65) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-red-500 border-red-500/20 bg-red-500/10";
  };

  const getVerdictLabel = (s: number) => {
    if (s >= 85) return "Market Ready";
    if (s >= 65) return "Potential (Needs Polish)";
    return "High Risk / Pivot Required";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <div className="flex flex-col items-center text-center gap-6 mt-12 mb-16 relative overflow-hidden p-8 rounded-[40px] bg-void/30 border border-border/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="relative group">
           <motion.div 
             animate={{ rotate: 360 }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-[-10px] rounded-full border-2 border-dashed border-accent/20"
           />
           <div className={cn("w-24 h-24 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4", getScoreColor(score))}>
              <span className="text-3xl font-black">{score}</span>
           </div>
        </div>

        <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-accent">Pitch Readiness Score</p>
            <h1 className="text-4xl font-extrabold tracking-tight">{getVerdictLabel(score)}</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto font-medium">
               Based on 4 rounds of interrogation by our VC panel.
            </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={onExport} className="rounded-full gap-2 border-border/50">
              <Download className="w-4 h-4" /> Export Memo
           </Button>
           <Button variant="secondary" size="sm" onClick={onRestart} className="rounded-full gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
              <Zap className="w-4 h-4" /> Try Again
           </Button>
        </div>
      </div>

      <div className="prose prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground max-w-none bg-void/10 p-10 rounded-[40px] border border-border/30 relative shadow-inner overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Award className="w-64 h-64 text-accent" />
        </div>
        
        <ReactMarkdown
          components={{
            h2: ({ ...props }) => <h2 className="text-2xl mt-8 mb-4 flex items-center gap-3" {...props} />,
            ul: ({ ...props }) => <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 list-none p-0" {...props} />,
            li: ({ children, ...props }) => {
                const text = children?.toString() || "";
                const isPositive = text.toLowerCase().includes("strength") || text.toLowerCase().includes("opportunity") || text.startsWith("**S") || text.startsWith("**O");
                return (
                    <li className="flex items-start gap-3 py-1" {...props}>
                        {isPositive ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                        <span className="text-sm">{children}</span>
                    </li>
                );
            }
          }}
        >
          {verdict}
        </ReactMarkdown>
      </div>

      <div className="flex items-center justify-center gap-8 py-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex flex-col items-center">
            <CheckCircle2 className="w-6 h-6 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Market Fit</span>
         </div>
         <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Growth Loop</span>
         </div>
         <div className="flex flex-col items-center">
            <Info className="w-6 h-6 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Risk Mgmt</span>
         </div>
      </div>
    </motion.div>
  );
}
