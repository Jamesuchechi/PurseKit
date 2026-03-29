"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCcw } from "lucide-react";

export function ConnectivityBanner() {
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Initial check
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white z-[301] relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>Connection Interrupted — Some features may be local-only</span>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors ml-4"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
