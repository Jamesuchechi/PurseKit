"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const MODELS = [
  { id: "openai/gpt-4o", name: "ChatGPT (GPT-4o)", provider: "openrouter" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "openrouter" },
  { id: "anthropic/claude-3-5-haiku", name: "Claude 3.5 Haiku", provider: "openrouter" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "openrouter" },
  { id: "x-ai/grok-2-1212", name: "Grok 2", provider: "openrouter" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 (Fast) - Groq", provider: "groq" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", provider: "openrouter" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", provider: "openrouter" },
  { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder (Free)", provider: "openrouter" },
];

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string, provider: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const selectedModel = MODELS.find((m) => m.id === value) || MODELS[0];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted text-sm font-medium rounded-xl border border-border/50 text-foreground transition-all"
      >
        <span>{selectedModel.name}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-background border border-border shadow-2xl rounded-xl overflow-hidden z-50">
          <div className="p-1 space-y-0.5">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id, model.provider);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all",
                  value === model.id ? "bg-accent/10 text-accent font-medium" : "hover:bg-muted text-foreground"
                )}
              >
                <span>{model.name}</span>
                {value === model.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
