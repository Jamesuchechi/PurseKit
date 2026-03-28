"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Key } from "lucide-react";

export function ApiKeyBanner() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if any vital API key is missing
    const isKeyMissing = !process.env.GROQ_API_KEY && 
                        !process.env.MISTRAL_API_KEY && 
                        !process.env.OPENROUTER_API_KEY;
    if (isKeyMissing) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-[100] bg-red-500/10 border-b border-red-500/20 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Key className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-sm font-bold text-red-500 uppercase tracking-widest text-[10px]">
                API Key Required
              </span>
              <p className="text-xs font-medium text-red-500/80">
                ANTHROPIC_API_KEY is missing from your environment. Module AI features will be disabled.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="/settings" 
              className="px-4 py-1.5 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              Configure <ExternalLink className="w-3 h-3" />
            </a>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500/50" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
