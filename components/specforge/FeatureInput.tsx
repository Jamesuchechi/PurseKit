"use client";

import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FeatureInputProps {
  description: string;
  setDescription: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  scope: string;
  setScope: (val: string) => void;
  context: string;
  setContext: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AUDIENCES = [
  { id: "Technical Engineer", label: "Engineer" },
  { id: "Product Manager", label: "PM" },
  { id: "Executive", label: "Executive" },
];

const SCOPES = [
  { id: "Small feature", label: "Small" },
  { id: "Medium feature", label: "Medium" },
  { id: "Large epic", label: "Epic" },
];

const EXAMPLES = [
  "User auth with OAuth",
  "CSV data export pipeline",
  "Real-time chat notification system",
  "Role-based access control (RBAC)",
];

export function FeatureInput({
  description,
  setDescription,
  audience,
  setAudience,
  scope,
  setScope,
  context,
  setContext,
  onGenerate,
  isGenerating,
}: FeatureInputProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
          Describe the feature.
        </h1>
        <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto">
          Write a plain-English explanation of your idea, or{" "}
          <button 
            onClick={() => setDescription(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)])}
            className="text-accent underline hover:text-accent-foreground transition-colors"
          >
            try a random example
          </button>{" "}
          to see SpecForge in action.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-border/50 p-6 space-y-8">
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Audience</span>
            <div className="flex bg-muted/20 p-1 rounded-xl border border-border/50">
              {AUDIENCES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all",
                    audience === a.id
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Scope</span>
            <div className="flex bg-muted/20 p-1 rounded-xl border border-border/50">
              {SCOPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all",
                    scope === s.id
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Feature Description</span>
          </div>
          
          <div className="relative group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., We need a way for admins to export patient records as a CSV file. It should support date range filtering and background processing for large datasets."
              className="w-full h-48 bg-muted/10 border-2 border-border/30 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent resize-none transition-colors styled-scrollbar"
            />
            <div className="absolute bottom-4 right-4 text-xs font-bold text-muted pointer-events-none">
              {description.length} chars
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted font-semibold mr-1">Examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setDescription(ex)}
                className="text-xs px-2.5 py-1 bg-muted/20 hover:bg-accent/10 hover:text-accent border border-border/50 rounded-full transition-colors font-medium text-muted-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Context */}
        <div className="space-y-3 border-t border-border/30 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showAdvanced && "rotate-180")} />
            Additional Context {context ? "(Active)" : "(Optional)"}
          </button>
          
          {showAdvanced && (
            <div className="pt-2 animate-in slide-in-from-top-2 fade-in">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Tech stack (e.g., Next.js, Postgres), existing UI guidelines, or specific business constraints..."
                className="w-full h-24 bg-muted/10 border border-border/30 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent resize-none transition-colors styled-scrollbar"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          onClick={onGenerate}
          disabled={!description.trim() || isGenerating}
          className="h-14 px-8 rounded-full text-lg shadow-xl shadow-accent/20"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">Generating PRD...</span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Spec
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
