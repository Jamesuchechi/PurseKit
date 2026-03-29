"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BarChart2, TrendingUp, Info, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChartInsightProps {
  insight: string;
  isLoading: boolean;
}

export function ChartInsight({ insight, isLoading }: ChartInsightProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Automatically expand when loading starts
  React.useEffect(() => {
    if (isLoading) setIsExpanded(true);
  }, [isLoading]);

  if (!insight && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 rounded-[32px] border border-border/50 relative overflow-hidden group transition-all duration-500"
    >
      {/* Decorative pulse */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-shimmer" />
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              AI Data Intelligence
            </h3>
            <p className="text-xs text-muted font-medium">Automatic trend analysis & observations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Analyzing...</span>
            </div>
          )}
          {!isLoading && insight && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-all text-muted hover:text-foreground"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <motion.div
        animate={{ height: isExpanded ? "auto" : "100px" }}
        className="relative overflow-hidden"
      >
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground dark:prose-p:text-muted prose-p:leading-relaxed prose-strong:text-accent prose-strong:font-black">
          <ReactMarkdown
            components={{
              h3: ({ ...props }) => <h3 className="text-lg mt-8 mb-4 flex items-center gap-2 group/h" {...props} />,
            }}
          >
            {insight || "Hang tight! ChartGPT is crunching the numbers..."}
          </ReactMarkdown>
        </div>

        {/* Gradient mask when collapsed */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
        )}
      </motion.div>

      {/* Actionable Footer */}
      <AnimatePresence>
        {isExpanded && !isLoading && insight && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-10 pt-6 border-t border-border/30 flex flex-wrap gap-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              Trend Identified
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-widest">
              <BarChart2 className="w-3.5 h-3.5 text-violet" />
              Visualized
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-widest">
              <Info className="w-3.5 h-3.5 text-amber" />
              Strategic Context
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && !isLoading && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-4 text-xs font-bold text-accent hover:underline flex items-center gap-1 mx-auto"
        >
          View Full Intelligence Analysis <ChevronDown className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}
