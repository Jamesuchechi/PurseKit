"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  errorLines?: number[];
  className?: string;
}

export function CodeInput({ value, onChange, errorLines = [], className }: CodeInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      
      // Move cursor back after React state updates
      window.requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  const lineCount = React.useMemo(() => {
    return value.split("\n").length;
  }, [value]);

  const lines = React.useMemo(() => {
    return Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);
  }, [lineCount]);

  return (
    <div className={cn("relative flex w-full h-[400px] rounded-2xl border border-border/50 bg-background/50 overflow-hidden group focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent/50 glass-card transition-all", className)}>
      <div 
        ref={lineNumbersRef}
        className="flex flex-col w-12 py-4 items-end pr-3 select-none bg-muted/20 border-r border-border/50 text-muted font-mono text-sm overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {lines.map((line) => {
          const isError = errorLines.includes(line);
          return (
            <div 
              key={line} 
              className={cn(
                "h-6 leading-6", 
                isError ? "text-red-500 font-bold opacity-100" : "opacity-50"
              )}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full bg-transparent py-4 px-4 font-mono text-sm outline-none resize-none whitespace-pre leading-6 text-foreground z-10"
          spellCheck={false}
          placeholder="Paste your code to analyze..."
        />
        {/* Error Highlighting overlay behind text */}
        <div 
          className="absolute inset-0 w-full h-full py-4 px-4 font-mono text-sm leading-6 pointer-events-none z-0 overflow-hidden text-transparent whitespace-pre"
          aria-hidden="true"
        >
          {value.split("\\n").map((lineContent, i) => {
            const line = i + 1;
            const isError = errorLines.includes(line);
            return (
              <div key={line} className={cn("h-6 w-full", isError ? "bg-red-500/10 border-l-2 border-red-500 -ml-4 pl-4" : "")} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
