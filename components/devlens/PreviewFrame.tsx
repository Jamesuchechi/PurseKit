"use client";

import * as React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw, Maximize2, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type ViewportSize = "desktop" | "tablet" | "mobile";

interface PreviewFrameProps {
  html: string;
  className?: string;
  onExpand?: () => void;
  showExpand?: boolean;
}

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  desktop: 0, // Dynamic
  tablet: 768,
  mobile: 375,
};

const EMPTY_HTML = `
  <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; font-family:sans-serif; text-align:center; padding:40px; background:radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%);">
    <div style="padding:24px; background:white; border-radius:32px; box-shadow:0 20px 50px -12px rgba(0,0,0,0.05); border:1px solid #e2e8f0; margin-bottom:24px;">
      <svg style="width:48px; height:48px; color:#6366f1;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    </div>
    <h3 style="margin:0; font-size:20px; font-weight:700; color:#1e293b;">Waiting for Code...</h3>
    <p style="font-size:14px; margin:12px 0 0; color:#64748b; max-width:280px; line-height:1.6;">Click <span style="color:#6366f1; font-weight:600;">"Run"</span> on your HTML, CSS, or React code to see the magic happen here.</p>
  </div>
`;

export function PreviewFrame({ html, className, onExpand, showExpand = true }: PreviewFrameProps) {
  const [viewport, setViewport] = React.useState<ViewportSize>("desktop");
  const [refreshKey, setRefreshKey] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  // Measure container for scaling
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const srcDoc = html.trim() ? html : EMPTY_HTML;
  const handleRefresh = () => setRefreshKey(k => k + 1);

  // Calculate scaling factor
  const targetWidth = viewport === "desktop" ? containerWidth : VIEWPORT_WIDTHS[viewport];
  const padding = 32; // Total padding from p-4 on each side
  const availableWidth = containerWidth - padding;
  
  const scale = (viewport !== "desktop" && availableWidth > 0 && targetWidth > availableWidth)
    ? availableWidth / targetWidth
    : 1;

  return (
    <div className={cn("flex flex-col h-full bg-void/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl", className)}>
      {/* Header / Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-2xl border border-border/40">
          <button 
            onClick={() => setViewport("desktop")}
            className={cn(
              "p-2 rounded-xl transition-all duration-300 flex items-center gap-2", 
              viewport === "desktop" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground hover:bg-muted"
            )}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-300", viewport === "desktop" ? "max-w-20 opacity-100" : "max-w-0 opacity-0")}>Desktop</span>
          </button>
          <button 
            onClick={() => setViewport("tablet")}
            className={cn(
              "p-2 rounded-xl transition-all duration-300 flex items-center gap-2", 
              viewport === "tablet" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground hover:bg-muted"
            )}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-300", viewport === "tablet" ? "max-w-20 opacity-100" : "max-w-0 opacity-0")}>Tablet</span>
          </button>
          <button 
            onClick={() => setViewport("mobile")}
            className={cn(
              "p-2 rounded-xl transition-all duration-300 flex items-center gap-2", 
              viewport === "mobile" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground hover:bg-muted"
            )}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-300", viewport === "mobile" ? "max-w-20 opacity-100" : "max-w-0 opacity-0")}>Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mr-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Live System</span>
          </div>

          {showExpand && onExpand && (
            <button 
              onClick={onExpand}
              className="p-2 hover:bg-muted rounded-xl transition-all text-muted hover:text-foreground group"
              title="Expand to Full View"
            >
              <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <div className="h-6 w-px bg-border/50 mx-1" />
          
          <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-muted rounded-xl transition-all text-muted hover:text-accent group"
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Viewport Area */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 bg-void/25 overflow-auto flex justify-center items-start scroll-smooth styled-scrollbar relative group"
      >
        {/* Dimensions Indicator */}
        <div className="absolute top-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-void/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 flex items-center gap-2 shadow-2xl">
            <Info className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-mono text-white/70">
              {viewport === "desktop" ? `${Math.round(containerWidth)}px (Auto)` : `${VIEWPORT_WIDTHS[viewport]}px`}
              {scale < 1 && ` • Scaled ${Math.round(scale * 100)}%`}
            </span>
          </div>
        </div>

        <motion.div 
          layout
          animate={{ 
            width: viewport === "desktop" ? "100%" : VIEWPORT_WIDTHS[viewport],
            scale: scale,
          }}
          style={{ transformOrigin: "top center" }}
          className={cn(
            "bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 transition-all duration-500 flex flex-col",
            viewport === "desktop" ? "h-full" : "h-[800px] mt-4"
          )}
        >
          {/* Iframe Header (Device like) */}
          {viewport !== "desktop" && (
             <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative">
                <div className="w-20 h-4 bg-slate-200 rounded-full" />
                <div className="absolute right-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                   <div className="w-4 h-1.5 bg-slate-300 rounded-full" />
                </div>
             </div>
          )}
          
          <iframe
            key={refreshKey}
            title="devlens-preview"
            className="w-full flex-1 bg-white"
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            srcDoc={srcDoc}
          />
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="px-6 py-2.5 bg-muted/20 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Sandboxed Environment Active
          </span>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase text-muted tracking-tighter">Status</span>
              <span className="text-[10px] font-mono text-emerald-400">Stable</span>
           </div>
           <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase text-muted tracking-tighter">Res</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{viewport}</span>
           </div>
        </div>
      </div>
    </div>
  );
}