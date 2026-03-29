"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Download } from "lucide-react";
import { PreviewFrame } from "./PreviewFrame";
import { Button } from "@/components/ui/Button";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  title?: string;
}

export function PreviewModal({ isOpen, onClose, html, title = "Live Preview" }: PreviewModalProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Lock scroll
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full max-w-[1600px] flex flex-col bg-void/30 border border-white/10 rounded-none sm:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Immersive Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-b border-white/5 backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/20 rounded-xl border border-accent/30">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">
                     {title}
                   </h3>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                     Immersive Sandbox View
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 mr-4">
                   <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5">
                      <Share2 className="w-3 h-3 mr-2" /> Share
                   </Button>
                   <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5">
                      <Download className="w-3 h-3 mr-2" /> Snap
                   </Button>
                </div>

                <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />

                <button 
                  onClick={onClose}
                  className="p-3 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-2xl border border-white/10 transition-all group"
                  title="Close Preview"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
               <PreviewFrame 
                 html={html} 
                 showExpand={false}
                 className="rounded-none border-none bg-transparent"
               />
            </div>
            
            {/* Bottom Bar / Shortcuts */}
            <div className="px-8 py-3 bg-muted/10 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-muted-foreground">ESC</kbd>
                     <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">to close</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-muted-foreground">R</kbd>
                     <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">to refresh</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <span className="text-[9px] text-white/20 font-mono italic">
                    Powered by PursekKit DevLens Engine v2.0
                  </span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
