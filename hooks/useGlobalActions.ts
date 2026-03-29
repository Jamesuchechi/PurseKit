"use client";

import * as React from "react";

interface GlobalActionHandlers {
  onAnalyze?: () => void;
  onExport?: () => void;
  onClear?: () => void;
}

/**
 * Hook to listen for global app-wide actions dispatched from the 
 * Command Palette or Global Keyboard Shortcuts.
 */
export function useGlobalActions({ onAnalyze, onExport, onClear }: GlobalActionHandlers) {
  React.useEffect(() => {
    const handleAnalyze = () => onAnalyze?.();
    const handleExport = () => onExport?.();
    const handleClear = () => onClear?.();

    window.addEventListener("pulsekit:analyze", handleAnalyze);
    window.addEventListener("pulsekit:export", handleExport);
    window.addEventListener("pulsekit:clear", handleClear);

    return () => {
      window.removeEventListener("pulsekit:analyze", handleAnalyze);
      window.removeEventListener("pulsekit:export", handleExport);
      window.removeEventListener("pulsekit:clear", handleClear);
    };
  }, [onAnalyze, onExport, onClear]);
}
