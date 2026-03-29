"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Lightbulb, BarChart3, PieChart, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface ChartPromptInputProps {
  onAnalyze: (prompt: string) => void;
  isLoading?: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
}

const suggestions = [
  { label: "Show monthly sales", icon: BarChart3 },
  { label: "Distribution of categories", icon: PieChart },
  { label: "Trend over last quarter", icon: LineChart },
  { label: "Correlation between age and spend", icon: Sparkles },
];

export function ChartPromptInput({ onAnalyze, isLoading, prompt, setPrompt }: ChartPromptInputProps) {

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isLoading) {
      onAnalyze(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-bold text-foreground">AI Instructions</span>
      </div>

      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-violet/20 to-accent/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the chart you want to see... (e.g., 'monthly growth in sales as a line chart')"
            className="pr-20 min-h-[100px] bg-background/50 backdrop-blur-sm border-border hover:border-accent/50 focus:border-accent transition-all resize-none rounded-2xl"
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-medium text-muted transition-opacity",
              prompt.length > 0 ? "opacity-100" : "opacity-0"
            )}>
              {prompt.length} chars
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={!prompt.trim() || isLoading}
              className="rounded-xl h-10 w-10 p-0 flex items-center justify-center bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 px-1">
        <div className="flex items-center gap-1.5 text-muted mr-2">
          <Lightbulb className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Try:</span>
        </div>
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.label}
              onClick={() => {
                setPrompt(suggestion.label);
                onAnalyze(suggestion.label);
              }}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-border bg-background/50 hover:border-accent/50 hover:bg-accent/5 transition-all text-muted hover:text-accent flex items-center gap-1.5 group"
            >
              <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
              {suggestion.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
