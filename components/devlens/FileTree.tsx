"use client";

import * as React from "react";
import { 
  File, 
  FileCode, 
  ChevronRight,
  FolderTree,
  Terminal,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DevFile {
  name: string;
  content: string;
  language?: string;
}

interface FileTreeProps {
  files: DevFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function FileTree({ files, activeIndex, onSelect, className }: FileTreeProps) {
  if (files.length === 0) return null;

  return (
    <div className={cn("flex flex-col h-full bg-background/40 dark:bg-void/30 backdrop-blur-md border-r border-border/50 w-64", className)}>
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <FolderTree className="w-4 h-4 text-accent" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Project Explorer</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
        {files.map((file, i) => {
          const isActive = i === activeIndex;
          const extension = file.name.split(".").pop()?.toLowerCase();
          
          return (
            <button
              key={file.name}
              onClick={() => onSelect(i)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all group",
                isActive 
                  ? "bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5" 
                  : "text-muted hover:bg-muted/10 hover:text-foreground border border-transparent"
              )}
            >
              <div className={cn(
                "shrink-0",
                isActive ? "text-accent" : "text-muted/60"
              )}>
                {extension === "ts" || extension === "tsx" || extension === "js" || extension === "jsx" ? (
                  <FileCode className="w-4 h-4" />
                ) : extension === "py" || extension === "go" || extension === "rs" ? (
                  <Terminal className="w-4 h-4" />
                ) : extension === "md" || extension === "txt" ? (
                  <Type className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
              </div>
              
              <span className="text-[11px] font-bold truncate flex-1 text-left">
                {file.name}
              </span>
              
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              )} />
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border/50 bg-muted/5">
         <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
            <span>{files.length} Files Generated</span>
            <span className="text-accent/60">V0.1</span>
         </div>
      </div>
    </div>
  );
}
