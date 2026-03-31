"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Brain, 
  FileText, 
  BarChart3, 
  Command,
  Key,
  Zap,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to PulseKit",
    description: "The AI-native workspace built for Principal Engineers and Data Scientists. Let's get you synchronized.",
    icon: Sparkles,
    color: "accent",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted leading-relaxed">
          PulseKit is a unified platform designed to accelerate your engineering workflow through structural code analysis, automated documentation, and natural language data visualization.
        </p>
        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">Workspace Modules</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[80px] flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
              <Brain className="w-5 h-5 text-accent" />
              <span className="text-[10px] font-bold uppercase">DevLens</span>
            </div>
            <div className="flex-1 min-w-[80px] flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
              <FileText className="w-5 h-5 text-amber" />
              <span className="text-[10px] font-bold uppercase">SpecForge</span>
            </div>
            <div className="flex-1 min-w-[80px] flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
              <BarChart3 className="w-5 h-5 text-violet" />
              <span className="text-[10px] font-bold uppercase">ChartGPT</span>
            </div>
            <div className="flex-1 min-w-[80px] flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase">PulseOps</span>
            </div>
            <div className="flex-1 min-w-[80px] flex flex-col items-center gap-2 p-3 rounded-xl bg-background border border-border/50">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase">PulseDocs</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Modular Intelligence",
    description: "Three powerful tools, one unified experience. Each designed for the deepest engineering tasks.",
    icon: Brain,
    color: "amber",
    content: (
      <div className="space-y-3">
        {[
          { icon: Brain, label: "DevLens", text: "Deep code analysis, bug detection, and structural refactoring suggestions.", c: "text-accent" },
          { icon: FileText, label: "SpecForge", text: "Transform feature descriptions into professional PRDs and system specs.", c: "text-amber" },
          { icon: BarChart3, label: "ChartGPT", text: "Talk to your data. Upload CSVs and generate stunning visualizations via Chat.", c: "text-violet" },
          { icon: Zap, label: "PulseOps", text: "Automate cloud infrastructure and delivery pipelines with hardened blueprints.", c: "text-emerald-500" },
          { icon: BookOpen, label: "PulseDocs", text: "Generate comprehensive system documentation and visual architecture wikis.", c: "text-indigo-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group">
            <div className={`p-2 rounded-xl bg-muted group-hover:bg-white/10 ${item.c}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-foreground mb-0.5">{item.label}</div>
              <p className="text-[11px] text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Power-User Command Center",
    description: "Navigate and control PulseKit at the speed of thought using global keyboard shortcuts.",
    icon: Command,
    color: "violet",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { keys: ["⌘", "K"], label: "Command Palette" },
            { keys: ["⌘", "/"], label: "AI Assistant" },
            { keys: ["⌘", "↵"], label: "Run Analysis" },
            { keys: ["⌘", "H"], label: "History Vault" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
              <span className="text-[10px] font-bold uppercase text-muted tracking-wide">{item.label}</span>
              <div className="flex gap-1">
                {item.keys.map(k => <kbd key={k} className="px-1.5 py-0.5 rounded bg-background border border-border text-[9px] font-bold shadow-sm">{k}</kbd>)}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-violet/5 border border-violet/10 text-center">
            <p className="text-[10px] font-medium text-violet italic">
              &quot;Fuzzy search navigation and instant contextual actions. Press ? anytime to see the guide.&quot;
            </p>
        </div>
      </div>
    )
  },
  {
    title: "Final Step: Synchronization",
    description: "To enable the full power of PulseKit, connect your AI providers in the settings.",
    icon: Key,
    color: "accent",
    content: (
      <div className="space-y-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/20 animate-pulse group-hover:scale-125 transition-transform" />
          <Key className="w-10 h-10 text-accent relative z-10" />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm text-muted">
            Configure Anthropic, Mistral, or OpenAI keys locally. Your keys are <strong>never stored centrally</strong> — they remain in your browser session or environment.
          </p>
        </div>
        <div className="w-full p-4 rounded-2xl bg-muted/20 border border-border/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest px-1">
              <span>Security Check</span>
              <span className="text-emerald-500">Passed</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
            </div>
        </div>
      </div>
    )
  }
];

export function WelcomeModal({ isOpen, onClose, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-background dark:bg-void border border-border rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[480px]"
          >
            {/* Sidebar Visual */}
            <div className={`hidden md:flex w-40 p-8 flex-col justify-between items-center transition-colors duration-500 bg-${step.color}/10 border-r border-border/50`}>
                <div className="space-y-1">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1 w-6 rounded-full transition-all duration-300 ${i === currentStep ? `bg-${step.color} w-8` : `bg-${step.color}/20`}`} />
                    ))}
                </div>
                
                <motion.div 
                    key={currentStep}
                    initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    className={`p-4 rounded-3xl bg-${step.color}/20 text-${step.color} shadow-lg shadow-${step.color}/10`}
                >
                    <step.icon className="w-10 h-10" />
                </motion.div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap -rotate-90 origin-center mb-4">
                    PulseKit v0.1
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6 md:p-10 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted transition-colors text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full flex flex-col"
                  >
                    <div className="space-y-2 mb-5 md:mb-8 pr-8">
                      <h2 className="text-2xl md:text-4xl font-display font-black tracking-tighter text-foreground group">
                        {step.title}
                      </h2>
                      <p className="text-muted text-sm font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                      {step.content}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 md:mt-10 flex items-center justify-between pt-6 border-t border-border/50">
                <button 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-opacity ${currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:text-foreground text-muted"}`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-4">
                    <Button 
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="text-muted hover:text-foreground text-[10px] font-black uppercase tracking-widest h-10 md:h-12 px-6"
                    >
                        Skip
                    </Button>
                    <Button 
                        onClick={handleNext}
                        className={`h-10 md:h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-${step.color} shadow-lg shadow-${step.color}/20 hover:scale-[1.02] active:scale-[0.98] transition-all`}
                    >
                        {currentStep === steps.length - 1 ? "Get Started" : "Continue"} 
                        {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
