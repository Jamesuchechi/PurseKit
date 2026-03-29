"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Layout, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "analysis" | "console" | "preview";

interface TerminalHubProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
  className?: string;
  isStreaming?: boolean;
}

export function TerminalHub({ activeTab, onTabChange, children, className, isStreaming = false }: TerminalHubProps) {
  const tabs = [
    { id: "analysis", label: "Analysis", icon: Search },
    { id: "console", label: "Console", icon: Terminal },
    { id: "preview", label: "Live Preview", icon: Layout },
  ] as const;

  return (
    <div className={cn("flex flex-col h-full bg-void/30 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden transition-all duration-300", className)}>
      {/* Tab Bar */}
      <div className="flex items-center justify-between px-2 bg-muted/20 border-b border-border/50">
        <div className="flex items-center gap-1 py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeTab === tab.id ? "text-foreground" : "text-muted hover:text-foreground/80 hover:bg-muted/10"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-accent" : "text-muted")} />
              <span className="relative z-10">{tab.label}</span>
              {tab.id === "analysis" && isStreaming && (
                <span className="relative flex h-1.5 w-1.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4">
           {/* Possible status or shortcut info */}
           <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted uppercase tracking-wider">
              {activeTab === "preview" && (
                <span className="flex items-center gap-1 animate-pulse text-accent">
                  <Eye className="w-3 h-3" /> Live
                </span>
              )}
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
