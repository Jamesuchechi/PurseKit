"use client";

import * as React from "react";

/**
 * Hook for copying text to clipboard with feedback state.
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = React.useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error("Copy failed", err);
      setCopied(false);
      return false;
    }
  };

  return { copied, copy };
}
