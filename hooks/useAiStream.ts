"use client";

import * as React from "react";

/**
 * Hook for token-by-token AI streaming.
 * In a real app, this would call a server-side route that wraps callClaude.
 * Since we are building the frontend first, this is a skeleton for the module implementation.
 */
export function useAiStream() {
  const [output, setOutput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async (prompt: string, options?: { systemPrompt?: string; provider?: string; model?: string }) => {
    setIsLoading(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: options?.systemPrompt,
          provider: options?.provider,
          model: options?.model
        }),
      });

      if (!response.ok) throw new Error("Failed to start AI stream");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Response body is not readable");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setOutput((prev) => prev + chunk);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during streaming.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setOutput("");
    setIsLoading(false);
    setError(null);
  };

  return { output, isLoading, error, run, reset };
}
