"use client";

import * as React from "react";

/**
 * Hook for one-shot AI calls that return parsed JSON.
 */
export function useAiJSON<T = unknown>() {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async (prompt: string, options?: { systemPrompt?: string; provider?: string; model?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: options?.systemPrompt,
          provider: options?.provider,
          model: options?.model
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");

      const json = await response.json();
      setData(json);
      return json;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setIsLoading(false);
    setError(null);
  };

  return { data, isLoading, error, run, reset, setData };
}
