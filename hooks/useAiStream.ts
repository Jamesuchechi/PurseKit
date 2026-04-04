"use client";

import * as React from "react";
import { type AiMessage } from "@/lib/ai";
import { AuditService } from "@/lib/audit";
import { type Module } from "@/types";

export function useAiStream() {
  const [output, setOutput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isLoadingRef = React.useRef(false);

  const run = React.useCallback(async (
    prompt: string,
    options?: { 
      systemPrompt?: string; 
      provider?: string; 
      model?: string; 
      messages?: AiMessage[];
      module?: Module | "system";
    }
  ) => {
    if (isLoadingRef.current) return "";

    const startTime = performance.now();
    let ttft: number | null = null;
    let tokenCount = 0;

    isLoadingRef.current = true;
    setIsLoading(true); 
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          messages: options?.messages,
          systemPrompt: options?.systemPrompt,
          provider: options?.provider,
          model: options?.model,
        }),
      });

      if (!response.ok) throw new Error("Failed to start AI stream");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Response body is not readable");

      let buffer = "";
      let finalOutput = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Log SUCCESS with performance metadata
          AuditService.log({
            event: "GENERATE",
            module: options?.module || "system",
            message: `Generated AI response using ${options?.provider || "default"}/${options?.model || "auto"}.`,
            metadata: {
              duration: Math.round(duration),
              ttft: ttft ? Math.round(ttft) : null,
              tokens: tokenCount,
              provider: options?.provider,
              model: options?.model
            }
          });

          // Handle dangling code blocks
          const backtickCount = finalOutput.split("```").length - 1;
          if (backtickCount % 2 !== 0) {
            finalOutput += "\n```";
            setOutput(finalOutput);
          }
          break;
        }

        // Measure TTFT on first value chunk
        if (ttft === null) {
          ttft = performance.now() - startTime;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          
          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === "string") {
              finalOutput += delta;
              tokenCount++;
              setOutput(finalOutput);
            }
          } catch {
            // Malformed SSE line — skip
          }
        }
      }

      return finalOutput;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during streaming.";
      setError(message);
      
      // Log ERROR
      AuditService.log({
        event: "ERROR",
        module: options?.module || "system",
        message: `AI Stream failed: ${message}`,
        metadata: {
          error: message,
          provider: options?.provider,
          model: options?.model
        }
      });

      return "";
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const reset = React.useCallback(() => {
    setOutput("");
    setIsLoading(false);
    setError(null);
  }, []);

  const stableSetOutput = React.useCallback((val: string | ((prev: string) => string)) => {
    setOutput(val);
  }, []);

  return { output, isLoading, error, run, reset, setOutput: stableSetOutput };
}