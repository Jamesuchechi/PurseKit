"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  BarChart2, 
  TrendingUp, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  AlertTriangle, 
  Target, 
  Activity, 
  Search,
  Fingerprint,
  Zap,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartInsightProps {
  insight: string;
  isLoading: boolean;
  error?: string;
  totalRows?: number;
  onRetry?: () => void;
}

interface InsightItem {
  category: "Trend" | "Anomaly" | "Correlation" | "Observation";
  finding: string;
  details: string;
  evidence: string;
  significance: "critical" | "high" | "medium" | "low";
  suggestion: string;
}

interface InsightData {
  analysisTitle: string;
  intelligenceScore: number;
  sentiment: "positive" | "negative" | "neutral";
  summary: string;
  keyMetrics: string[];
  insights: InsightItem[];
  recommendation: string;
}

const CategoryIcon = ({ category }: { category: InsightItem["category"] }) => {
  switch (category) {
    case "Trend": return <Activity className="w-4 h-4" />;
    case "Anomaly": return <AlertTriangle className="w-4 h-4" />;
    case "Correlation": return <Search className="w-4 h-4" />;
    default: return <Info className="w-4 h-4" />;
  }
};

export function ChartInsight({ insight, isLoading, error, totalRows, onRetry }: ChartInsightProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);
  
  const parsedData = React.useMemo<InsightData | null>(() => {
    if (!insight) return null;
    
    try {
      const cleanJson = insight.replace(/```json\n?|```/g, "").trim();
      
      // Basic check for JSON start/end to avoid partial parsing errors during streaming
      if (!cleanJson.startsWith("{") || !cleanJson.endsWith("}")) {
        return null;
      }

      return JSON.parse(cleanJson);
    } catch {
      // If it's not JSON yet (streaming), we return null silently
      return null;
    }
  }, [insight]);

  if (error) {
    return (
      <div className="glass-card p-10 rounded-[32px] border border-danger/20 bg-danger/5 flex flex-col items-center text-center gap-6 shadow-2xl">
        <div className="p-4 rounded-3xl bg-danger/10 text-danger border border-danger/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Intelligence Service Offline</h3>
          <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={onRetry}
          className="px-8 py-3 rounded-2xl bg-danger text-white font-bold hover:bg-danger/90 transition-all flex items-center gap-2 group shadow-lg shadow-danger/20"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Reconnect & Analyze
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-[32px] border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-shimmer" />
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted/20 rounded-lg animate-pulse" />
              <div className="h-3 w-60 bg-muted/10 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Generating Intelligence...</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted/5 border border-border/30 rounded-2xl animate-pulse" />
            ))}
        </div>

        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="p-6 rounded-3xl border border-border/30 space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-muted/20 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-muted/20 rounded-lg animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted/10 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!parsedData && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 rounded-[32px] border border-border/50 relative overflow-hidden group transition-all duration-500 shadow-2xl"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[22px] bg-accent/10 border border-accent/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Fingerprint className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight leading-none mb-1">
              {parsedData?.analysisTitle || "Data Intelligence Briefing"}
            </h3>
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent/50" />
                <p className="text-[11px] text-muted font-bold uppercase tracking-widest opacity-60">Automatic Neural Analysis v2.0</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sentiment Badge */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-[11px] uppercase tracking-wider shadow-sm",
            parsedData?.sentiment === "positive" ? "bg-emerald/10 border-emerald/20 text-emerald" :
            parsedData?.sentiment === "negative" ? "bg-danger/10 border-danger/20 text-danger" :
            "bg-violet/10 border-violet/20 text-violet"
          )}>
            <Zap className="w-3.5 h-3.5" />
            {parsedData?.sentiment} trend
          </div>

          {/* Intelligence Score */}
          <div className="flex flex-col items-end px-4 py-2 bg-foreground/5 rounded-2xl border border-foreground/10 min-w-[100px]">
            <span className="text-[9px] font-black uppercase text-muted tracking-tighter opacity-50">Intel Score</span>
            <span className="text-lg font-black text-foreground tabular-nums leading-none">
                {parsedData?.intelligenceScore}
                <span className="text-[10px] opacity-30 ml-0.5">/100</span>
            </span>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-all text-muted hover:text-foreground shadow-sm ml-2"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-10 overflow-hidden"
          >
            {/* KEY METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parsedData?.keyMetrics.map((metric, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/5 border border-border/20 flex items-center gap-3 hover:bg-muted/10 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
                            <Target className="w-4 h-4 text-orange" />
                        </div>
                        <p className="text-[11px] font-bold text-foreground leading-tight tracking-tight uppercase">
                            {metric}
                        </p>
                    </div>
                ))}
            </div>

            {/* EXECUTIVE SUMMARY */}
            <div className="p-8 rounded-[28px] bg-accent/5 border border-accent/10 relative overflow-hidden group/summary shadow-inner">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/summary:opacity-10 transition-opacity">
                    <Sparkles className="w-20 h-20 text-accent" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">Executive Summary</h4>
                </div>
                <p className="text-base font-medium text-foreground/80 leading-relaxed max-w-3xl">
                    {parsedData?.summary}
                </p>
            </div>

            {/* INSIGHT CARDS */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 ml-2 mb-4">Granular Observations</h4>
              {parsedData?.insights.length === 0 ? (
                <div className="p-12 text-center space-y-4 bg-muted/5 rounded-[32px] border border-dashed border-border/50">
                  <div className="w-12 h-12 bg-muted/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted max-w-xs mx-auto font-medium">
                    Analysis complete. No outliers or significant granular patterns detected in this data segment.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {parsedData?.insights.map((item, idx) => {
                    const isItemExpanded = expandedIndex === idx;
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                            "rounded-[28px] border transition-all duration-500 overflow-hidden",
                            isItemExpanded 
                                ? "bg-muted/20 border-accent/30 ring-1 ring-accent/10 shadow-xl" 
                                : "bg-muted/5 border-border/40 hover:bg-muted/10 hover:border-border/60 shadow-sm"
                        )}
                      >
                        <button 
                            onClick={() => setExpandedIndex(isItemExpanded ? null : idx)}
                            className="w-full p-6 flex items-start text-left gap-5"
                        >
                            <div className={cn(
                                "p-3 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm",
                                item.category === "Anomaly" ? "bg-danger/10 border-danger/20 text-danger" :
                                item.category === "Trend" ? "bg-emerald/10 border-emerald/20 text-emerald" :
                                item.category === "Correlation" ? "bg-violet/10 border-violet/20 text-violet" :
                                "bg-muted/20 border-border/30 text-muted"
                            )}>
                                <CategoryIcon category={item.category} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5 pt-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-40">{item.category}</span>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border shadow-sm",
                                        item.significance === "critical" && "text-danger bg-danger/5 border-danger/20",
                                        item.significance === "high" && "text-amber bg-amber/5 border-amber/20",
                                        item.significance === "medium" && "text-violet bg-violet/5 border-violet/20",
                                        item.significance === "low" && "text-emerald bg-emerald/5 border-emerald/20"
                                    )}>
                                        {item.significance}
                                    </span>
                                </div>
                                <h5 className="text-base font-bold text-foreground leading-snug tracking-tight">{item.finding}</h5>
                            </div>

                            <div className="mt-4 shrink-0 p-1.5 rounded-lg bg-foreground/5 opacity-30">
                                {isItemExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {isItemExpanded && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-6"
                                >
                                    <div className="pt-6 border-t border-border/10 space-y-5">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                                    Detailed Analysis <ArrowRight className="w-2.5 h-2.5" />
                                                </p>
                                                <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
                                                    {item.details}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-void/30 rounded-2xl border border-border/20 font-mono text-[10px] space-y-2 h-fit">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-black text-accent uppercase tracking-tighter">Verified Evidence</p>
                                                    <div className="flex gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                                                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse delay-75" />
                                                    </div>
                                                </div>
                                                <p className="text-foreground/80 leading-relaxed tabular-nums">{item.evidence}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-2xl border border-accent/10 shadow-sm">
                                            <div className="w-8 h-8 rounded-xl bg-accent text-background flex items-center justify-center shrink-0">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-bold text-accent italic">
                                                Suggestion: {item.suggestion}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STRATEGIC RECOMMENDATION */}
            <div className="pt-10 border-t border-border/30">
                <div className="p-8 rounded-[32px] bg-foreground text-background flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group/verdict">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
                    <div className="w-16 h-16 rounded-[22px] bg-background/10 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner group-hover/verdict:scale-110 transition-transform duration-700">
                        <Target className="w-8 h-8 text-background" />
                    </div>
                    <div className="flex-1 space-y-1.5 text-center md:text-left relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Strategic Blueprint</h4>
                        <p className="text-lg font-bold leading-tight">
                            {parsedData?.recommendation}
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTIONABLE FOOTER */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-10 border-t border-border/20 opacity-80">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-[0.15em]">
                    <TrendingUp className="w-3.5 h-3.5 text-accent" />
                    Trend Identified
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-[0.15em]">
                    <BarChart2 className="w-3.5 h-3.5 text-violet" />
                    Visualized
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-bold text-muted uppercase tracking-[0.15em]">
                    <Info className="w-3.5 h-3.5 text-amber" />
                    Strategic Context
                </div>
                
                {totalRows && (
                    <div className="ml-auto text-[10px] text-muted font-bold italic opacity-50">
                        Data Volume: {totalRows.toLocaleString()} rows verified
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-6 text-xs font-black text-accent hover:underline flex items-center gap-2 mx-auto uppercase tracking-widest bg-accent/5 px-6 py-2.5 rounded-full border border-accent/20 border-dashed"
        >
          View Full Intelligence Analysis <ChevronDown className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}
