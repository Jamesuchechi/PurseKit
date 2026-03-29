"use client";

import * as React from "react";
import { type AiMessage } from "@/types";

interface ChatOptions {
  systemPrompt?: string;
  onSuccess?: (response: string) => void;
  onError?: (error: Error) => void;
}

export function useChat(options: ChatOptions = {}) {
  const [messages, setMessages] = React.useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const sendMessage = React.useCallback(async (content: string, provider = "groq", model?: string) => {
    if (!content.trim()) return;

    const userMessage: AiMessage = { role: "user", content };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    // Placeholder for the assistant message
    const assistantMessage: AiMessage = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: options.systemPrompt,
          provider,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (!reader) throw new Error("Response body is not readable");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep partial line for next chunk
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;

          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content;
            
            if (typeof delta === "string") {
              fullResponse += delta;
              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                updated[lastIndex] = { ...updated[lastIndex], content: fullResponse };
                return updated;
              });
            }
          } catch {
            // Skip malformed lines or incomplete JSON chunks
            console.warn("Malformed SSE line:", line);
          }
        }
      }

      options.onSuccess?.(fullResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      options.onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);

  const clearMessages = React.useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
