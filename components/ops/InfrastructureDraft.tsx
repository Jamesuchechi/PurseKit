"use client";

import * as React from "react";
import { Terminal, Download, ShieldCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InfrastructureFile {
  name: string;
  content: string;
}

interface InfrastructureDraftProps {
  files: InfrastructureFile[];
  onDownload: (file: InfrastructureFile) => void;
}

export function InfrastructureDraft({ files, onDownload }: InfrastructureDraftProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const activeFile = files[activeIndex];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* File Tree */}
      <div className="lg:col-span-1 bg-void/50 border border-border/50 rounded-3xl p-4 overflow-y-auto styled-scrollbar">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manifest</span>
        </div>
        <div className="space-y-1">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between group",
                activeIndex === idx 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5" 
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground border border-transparent"
              )}
            >
              <span className="truncate">{file.name}</span>
              <ShieldCheck className={cn(
                "w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                activeIndex === idx ? "opacity-100" : "text-muted-foreground/50"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="lg:col-span-3 flex flex-col bg-void/50 border border-border/50 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="bg-muted/20 border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground/80">
              {activeFile?.name || "Provisioning..."}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 rounded-lg"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(activeFile)}
              className="h-8 w-8 rounded-lg"
            >
              <Download className="w-4 h-4 text-muted" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-0 relative font-mono text-sm group">
          <pre className="p-6 text-foreground/90 leading-relaxed bg-void/50 h-full">
            <code>{activeFile?.content}</code>
          </pre>
          
          {/* Decorative Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-void to-transparent pointer-events-none opacity-50" />
        </div>

        {/* Footer Stats */}
        <div className="p-4 bg-muted/10 border-t border-border/50 flex items-center justify-between">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Ready for Deploy</span>
              <span className="flex items-center gap-1.5 text-emerald-500/80"><ShieldCheck className="w-3 h-3" /> Hardened Config</span>
           </div>
           <div className="text-[9px] text-muted-foreground/40 font-mono">
              V{activeFile?.content.length}B_HASH
           </div>
        </div>
      </div>
    </div>
  );
}
