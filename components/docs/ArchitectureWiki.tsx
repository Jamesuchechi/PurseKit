"use client";

import * as React from "react";
import { BookOpen, Map, Workflow, Layers, Download, Check, Copy, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";

interface ArchitectureWikiProps {
  content: string;
  onDownload: () => void;
}

export function ArchitectureWiki({ content, onDownload }: ArchitectureWikiProps) {
  const [copied, setCopied] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
    });
    
    const renderMermaid = async () => {
      const blocks = containerRef.current?.querySelectorAll(".language-mermaid");
      if (blocks) {
        blocks.forEach(async (block, i) => {
          const code = block.textContent || "";
          try {
            const { svg } = await mermaid.render(`mermaid-${i}`, code);
            const parent = block.parentElement;
            if (parent) {
              const div = document.createElement("div");
              div.className = "flex justify-center p-6 bg-void/30 rounded-2xl border border-border/30 my-4 overflow-x-auto";
              div.innerHTML = svg;
              parent.replaceWith(div);
            }
          } catch (e) {
            console.error("Mermaid Render Error", e);
          }
        });
      }
    };

    renderMermaid();
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-void/50 border border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      <div className="bg-muted/10 border-b border-border/50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80">Architecture Wiki</h3>
          </div>
          <div className="h-4 w-px bg-border/30 mx-2 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
             <span className="flex items-center gap-1.5"><Map className="w-4 h-4" /> System Map</span>
             <span className="flex items-center gap-1.5"><Workflow className="w-4 h-4" /> Logical Flow</span>
             <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> Structural Layers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-9 w-9 rounded-xl transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-9 w-9 rounded-xl transition-all"
          >
            <Download className="w-4 h-4 text-muted" />
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-12 styled-scrollbar relative min-h-[500px]"
      >
        <div className="max-w-4xl mx-auto prose prose-invert prose-indigo">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Floating Controls Sidebar for Docs (Desktop) */}
        <div className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 space-y-4 p-4 rounded-3xl border border-border/30 bg-background/20 backdrop-blur-3xl shadow-2xl">
           <TooltipIconButton icon={Map} label="Jump to Context" />
           <TooltipIconButton icon={Workflow} label="View Flows" />
           <TooltipIconButton icon={Layers} label="Export Diagrams" />
        </div>
      </div>

      <div className="p-4 bg-indigo-500/5 text-center text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] border-t border-indigo-500/10">
        PulseDocs Integrated Systems Architectural Review Ready
      </div>
    </div>
  );
}

function TooltipIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="p-3 rounded-2xl bg-void/50 border border-border/30 text-muted hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-indigo-400/10 transition-all duration-300 group relative">
       <Icon className="w-5 h-5" />
       <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          {label}
       </span>
    </button>
  );
}
