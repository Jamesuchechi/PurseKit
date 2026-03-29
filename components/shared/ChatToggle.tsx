"use client";

import * as React from "react";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
  hasContext?: boolean;
}

export function ChatToggle({ isOpen, onClick, hasContext }: ChatToggleProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[250] flex items-center gap-3">
      <AnimatePresence>
        {!isOpen && hasContext && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="hidden md:flex flex-col items-end pointer-events-none"
          >
            <div className="px-3 py-1.5 rounded-xl bg-accent text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent/30 animate-pulse">
              Context Connected
            </div>
            <div className="w-2 h-2 bg-accent rotate-45 -mt-1 mr-4" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onClick}
          className={cn(
            "relative h-14 w-14 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden",
            isOpen 
              ? "bg-muted text-foreground border border-border" 
              : "bg-accent text-white shadow-accent/40"
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="relative"
              >
                <MessageSquare className="w-6 h-6" />
                {!isOpen && hasContext && (
                  <motion.div
                    layoutId="context-indicator"
                    className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-2 h-2 text-accent" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Glow Effect */}
          {!isOpen && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
