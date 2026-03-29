"use client";

import * as React from "react";

/**
 * Hook for registering global keyboard shortcuts.
 */
export function useKeyboardShortcut(
  key: string | string[],
  callback: (e: KeyboardEvent) => void,
  options: {
    metaKey?: boolean;
    preventDefault?: boolean;
    ignoreInputs?: boolean;
  } = { metaKey: true, preventDefault: true, ignoreInputs: true }
) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input/textarea and ignoreInputs is true
      if (options.ignoreInputs) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }

      const keys = Array.isArray(key) ? key : [key];
      const isKeyMatch = keys.some(k => e.key.toLowerCase() === k.toLowerCase());
      const isMetaMatch = options.metaKey ? e.metaKey || e.ctrlKey : true;

      if (isKeyMatch && isMetaMatch) {
        if (options.preventDefault) e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options]);
}
