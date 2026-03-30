"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Terminal, Trash2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionLog } from "@/lib/devlens/engine";

interface OutputConsoleProps {
  logs: ExecutionLog[];
  onClear: () => void;
  executionMode?: 'live' | 'simulation' | null;
  className?: string;
}

export function OutputConsole({ logs, onClear, className, executionMode }: OutputConsoleProps) {
  const [copied, setCopied] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    const text = logs.map(l => `[${l.type.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col h-full bg-void/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden font-mono text-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-muted uppercase tracking-widest">Console Output</span>
          
          {executionMode === 'live' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 ml-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Execution</span>
            </div>
          )}

          {executionMode === 'simulation' && (
            <div 
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 ml-2 cursor-help"
              title="This language runs in AI simulation mode. Output is predicted, not executed."
            >
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">AI Dry Run</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors text-muted hover:text-foreground"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={onClear}
            className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors text-muted hover:text-danger"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto styled-scrollbar space-y-1 select-text"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted/50 italic py-8">
            No output. Run code to see logs here.
          </div>
        ) : (
          logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "py-0.5 border-l-2 pl-3 break-words",
                log.type === "info" && "text-foreground border-accent/20",
                log.type === "warn" && "text-amber border-amber/40 bg-amber/5",
                log.type === "error" && "text-danger border-danger/40 bg-danger/5",
                log.type === "system" && "text-violet border-violet/40 italic font-medium"
              )}
            >
              <span className="text-[10px] opacity-30 mr-2">
                {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {log.message}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
