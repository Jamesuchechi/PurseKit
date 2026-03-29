"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Key, AlertCircle } from "lucide-react";

export function ApiKeyBanner() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [missingKeys, setMissingKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    // For this demonstration, we'll only show it if the user explicitly wants to see it based on environment
    if (process.env.NEXT_PUBLIC_SHOW_KEY_BANNER === "true") {
      setIsVisible(true);
      setMissingKeys(["Anthropic", "Groq"]);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-[100] bg-indigo-500/10 border-b border-indigo-500/20 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <Key className="w-4 h-4 text-indigo-500 animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                AI Configuration
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing keys for: {missingKeys.join(", ")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://console.anthropic.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Get Keys <ExternalLink className="w-3 h-3" />
            </a>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-indigo-500/10 rounded-lg transition-colors border border-transparent hover:border-indigo-500/20"
            >
              <X className="w-4 h-4 text-indigo-500/50" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
