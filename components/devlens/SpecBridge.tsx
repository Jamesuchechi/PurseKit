"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  Database, 
  Zap, 
  Layout, 
  X,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SpecBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  specData: {
    title: string;
    analysis: string;
    originalCode?: string;
  };
  onImport: (focus: string, description: string) => void;
}

const FOCUS_OPTIONS = [
  { 
    id: "full", 
    label: "End-to-End System", 
    icon: Zap, 
    color: "text-accent", 
    desc: "Draft a complete working application including UI and logic." 
  },
  { 
    id: "data", 
    label: "Persistence Layer", 
    icon: Database, 
    color: "text-amber", 
    desc: "Focus on data schemas, models, and specialized persistence logic." 
  },
  { 
    id: "ui", 
    label: "Interface & Layout", 
    icon: Layout, 
    color: "text-violet", 
    desc: "Architect the frontend components, design system, and user flows." 
  },
];

export function SpecBridge({ isOpen, onClose, specData, onImport }: SpecBridgeProps) {
  const [selectedFocus, setSelectedFocus] = React.useState("full");

  const handleImport = () => {
    const focus = FOCUS_OPTIONS.find(f => f.id === selectedFocus);
    const complexDescription = `Build a ${focus?.label} for '${specData.title}'.\n\nContext from SpecForge:\n${specData.analysis}`;
    onImport(selectedFocus, complexDescription);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-background border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-border/50 flex flex-col items-center">
               <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-xl text-muted hover:bg-muted/10 transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="w-16 h-16 rounded-[2rem] bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                 <FileText className="w-8 h-8 text-accent" />
               </div>
               
               <h2 className="text-3xl font-display font-black tracking-tight text-center">
                 Spec-to-Code Bridge
               </h2>
               <p className="text-muted text-sm font-medium mt-2 text-center max-w-md">
                 Synchronizing your PRD with the implementation engine. Select your primary engineering focus.
               </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
               <div className="p-5 rounded-3xl bg-muted/5 border border-border/30">
                  <div className="flex items-center gap-3 mb-2 text-[10px] font-black uppercase tracking-widest text-muted">
                     <Sparkles className="w-3.5 h-3.5 text-accent" />
                     Source: {specData.title}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed italic line-clamp-3">
                    &quot;{specData.analysis}&quot;
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {FOCUS_OPTIONS.map((option) => (
                   <button
                    key={option.id}
                    onClick={() => setSelectedFocus(option.id)}
                    className={`flex flex-col items-center text-center p-6 rounded-3xl border transition-all ${
                      selectedFocus === option.id 
                        ? "bg-accent/10 border-accent/30 ring-4 ring-accent/5 shadow-xl" 
                        : "bg-muted/5 border-border/20 hover:bg-muted/10 hover:border-border/40"
                    }`}
                   >
                     <div className={`p-3 rounded-2xl bg-background border border-border/50 mb-4 ${selectedFocus === option.id ? "text-accent" : option.color}`}>
                        <option.icon className="w-6 h-6" />
                     </div>
                     <div className="text-[11px] font-black uppercase tracking-widest mb-2">
                        {option.label}
                     </div>
                     <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                        {option.desc}
                     </p>
                   </button>
                 ))}
               </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-muted/5 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4 text-xs font-bold text-muted">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-accent border-2 border-background" />
                     <div className="w-6 h-6 rounded-full bg-void border-2 border-background flex items-center justify-center text-[8px]">AI</div>
                  </div>
                  Adaptive Blueprint Generation
               </div>
               
               <Button 
                onClick={handleImport}
                className="w-full md:w-auto h-12 px-10 rounded-2xl gap-2 bg-accent hover:opacity-90 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20 transition-all hover:scale-[1.02]"
               >
                 Activate Drafting
                 <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
