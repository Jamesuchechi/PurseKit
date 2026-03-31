"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layout, 
  Braces, 
  Code2, 
  FileCode 
} from "lucide-react";

interface DraftingFormProps {
  description: string;
  setDescription: (value: string) => void;
  techStack: string;
  setTechStack: (value: string) => void;
  className?: string;
}

const PRESET_STACKS = [
  { id: "html-css", name: "Modern HTML/CSS", icon: Layout, color: "text-amber", stack: "Pure HTML5, CSS3 with Modern variables (no framework)" },
  { id: "nextjs", name: "Next.js + Tailwind", icon: Braces, color: "text-accent", stack: "Next.js 14 (App Router), Tailwind CSS, Lucide icons" },
  { id: "fastapi", name: "FastAPI + Python", icon: Terminal, color: "text-emerald", stack: "FastAPI, Pydantic v2, PostgreSQL (SQLAlchemy)" },
  { id: "go-fiber", name: "Go Fiber + PostgreSQL", icon: Cpu, color: "text-blue-500", stack: "Go 1.21+, Fiber v2, GORM" },
  { id: "vue-vite", name: "Vue 3 + Vite", icon: Code2, color: "text-emerald-400", stack: "Vue 3 (Composition API), Vite, Styles-in-CSS" },
];

export function DraftingForm({
  description,
  setDescription,
  techStack,
  setTechStack,
  className = ""
}: DraftingFormProps) {
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  const handleSelectPreset = (id: string, stack: string) => {
    setActivePreset(id);
    setTechStack(stack);
  };

  return (
    <div className={`flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500 ${className}`}>
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Project Blueprint
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the application or feature you want to build... (e.g., 'A real-time analytics dashboard with dark mode and interactive charts')"
          className="w-full h-[180px] bg-background/50 border border-border/50 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all resize-none custom-scrollbar placeholder:text-muted/40"
        />
      </div>

      <div className="space-y-6">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
          <Terminal className="w-3.5 h-3.5 text-violet" />
          Execution Stack
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_STACKS.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPreset(preset.id, preset.stack)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left group ${
                activePreset === preset.id 
                  ? "bg-accent/10 border-accent/30 shadow-lg shadow-accent/5" 
                  : "bg-muted/10 border-border/30 hover:border-border/60"
              }`}
            >
              <div className={`p-2 rounded-lg bg-background border border-border/50 transition-colors ${activePreset === preset.id ? "text-accent" : preset.color}`}>
                <preset.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                 <div className="text-[11px] font-bold text-foreground group-hover:text-accent transition-colors">{preset.name}</div>
                 <div className="text-[9px] text-muted font-medium mt-0.5 max-w-[140px] truncate">{preset.stack}</div>
              </div>
            </motion.button>
          ))}
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/5 border border-dashed border-border/40">
             <div className="p-2 rounded-lg bg-background/50 border border-border/20 text-muted">
                <FileCode className="w-4 h-4" />
             </div>
             <div className="flex-1 italic text-[11px] text-muted-foreground font-medium">Custom Stack...</div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={techStack}
            onChange={(e) => {
              setTechStack(e.target.value);
              setActivePreset(null);
            }}
            placeholder="Or type a custom stack manually... (e.g. Next.js, FastAPI, Go Fiber, HTML/CSS)"
            className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3.5 pl-11 text-xs font-mono focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-muted/40"
          />
          <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
        </div>
      </div>
      
      <AnimatePresence>
        {description && techStack && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-accent/[0.03] border border-accent/10 mt-auto"
          >
             <div className="flex items-center gap-2 mb-2">
                <Layout className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Draft Configuration</span>
             </div>
             <p className="text-[11px] text-muted font-medium leading-relaxed italic">
                PulseKit will architect a full {techStack} implementation with a ready-to-run main component and project manifest.
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
