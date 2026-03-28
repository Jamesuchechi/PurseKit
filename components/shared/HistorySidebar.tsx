"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Clock, FileText, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HistoryItem {
  id: string;
  module: "devlens" | "specforge" | "chartgpt";
  title: string;
  timestamp: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onItemClick?: (item: HistoryItem) => void;
}

const moduleIcons = {
  devlens: Brain,
  specforge: FileText,
  chartgpt: BarChart3,
};

const moduleColors = {
  devlens: "text-accent",
  specforge: "text-amber",
  chartgpt: "text-violet",
};

export function HistorySidebar({
  isOpen,
  onClose,
  items,
  onItemClick,
}: HistorySidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-void/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-[400px] bg-background dark:bg-void border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-xl uppercase tracking-tight">
                  Session History
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted/50"
              >
                <X className="w-5 h-5 text-muted" />
              </Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length > 0 ? (
                items.map((item) => {
                  const Icon = moduleIcons[item.module];
                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      className="w-full group p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-accent/30 transition-all text-left flex items-start gap-4"
                    >
                      <div className={cn("p-3 rounded-xl bg-background/50 border border-border/50", moduleColors[item.module])}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground truncate group-hover:text-accent transition-colors">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                  <Clock className="w-12 h-12 text-muted mb-4" />
                  <p className="font-bold text-muted uppercase tracking-widest text-xs">
                    No history found
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-muted/10">
              <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs h-12">
                Clear All History
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
