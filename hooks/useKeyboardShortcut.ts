"use client";

import * as React from "react";

/**
 * Hook for registering global keyboard shortcuts.
 */
export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  metaKey = false
) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = metaKey ? e.metaKey || e.ctrlKey : true;
      if (e.key.toLowerCase() === key.toLowerCase() && isMeta) {
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, metaKey]);
}
