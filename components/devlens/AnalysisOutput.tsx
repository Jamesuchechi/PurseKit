"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, ArrowRight, Terminal, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

// The expected sections per devlensPrompt
const SECTIONS = [
  "Summary",
  "Bugs & Issues",
  "Complexity Analysis",
  "Refactor Suggestions",
  "Security Flags",
  "Explanation",
] as const;

type Section = typeof SECTIONS[number];

interface AnalysisOutputProps {
  markdown: string;
  isStreaming: boolean;
  onApplyFix?: (code: string) => void;
  onTransformToPrd?: () => void;
  onProvision?: () => void;
  onErrorLinesFound?: (lines: number[]) => void;
  className?: string;
}

export function AnalysisOutput({ 
  markdown, 
  isStreaming, 
  onApplyFix, 
  onTransformToPrd,
  onProvision,
  onErrorLinesFound, 
  className 
}: AnalysisOutputProps) {
  // Parse sections dynamically
  const parsedSections = React.useMemo(() => {
    const result: Record<string, string> = {
      Summary: "",
      "Bugs & Issues": "",
      "Complexity Analysis": "",
      "Refactor Suggestions": "",
      "Security Flags": "",
      Explanation: "",
    };

    let currentSection: Section | null = null;
    const lines = markdown.split("\n");

    for (const line of lines) {
      const match = SECTIONS.find((s) => line.trim().startsWith(`### ${s}`));
      if (match) {
        currentSection = match as Section;
        continue;
      }
      
      if (currentSection) {
        result[currentSection] += line + "\n";
      } else if (!currentSection && line.trim() !== "### Summary") {
        // If the AI starts talking before a header
        currentSection = "Summary";
        result[currentSection] += line + "\n";
      }
    }

    // Trim trailing newlines
    for (const key of Object.keys(result)) {
      result[key] = result[key].trim();
    }

    return result;
  }, [markdown]);

  const bugsText = parsedSections["Bugs & Issues"];

  React.useEffect(() => {
    if (onErrorLinesFound && bugsText) {
      const regex = /\[?[Ll]ines?\\s*(\\d+)(?:[-,\\s&]+(\\d+))?\\]?/g;
      const lines = new Set<number>();
      let match;
      while ((match = regex.exec(bugsText)) !== null) {
        if (match[1]) lines.add(parseInt(match[1], 10));
        if (match[2]) lines.add(parseInt(match[2], 10));
      }
      onErrorLinesFound(Array.from(lines));
    }
  }, [bugsText, onErrorLinesFound]);

  if (!markdown && isStreaming) {
    return (
      <div className={cn("space-y-4 w-full", className)}>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!markdown) return null;

  return (
    <div className={cn("space-y-4 flex flex-col items-center w-full", className)}>
      {!isStreaming && onTransformToPrd && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 rounded-[2rem] bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-6 mb-2"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 rounded-2xl bg-accent/20 border border-accent/30 shadow-lg shadow-accent/10">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Transform into Specs</h4>
              <p className="text-[11px] text-muted-foreground font-medium">Generate a comprehensive PRD based on this code analysis.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              onClick={onTransformToPrd}
              className="rounded-2xl gap-2 px-8 bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 group"
            >
              <FileText className="w-4 h-4" />
              Generate PRD
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            {onProvision && (
              <Button 
                onClick={onProvision}
                variant="outline"
                className="rounded-2xl gap-2 px-8 border-accent/30 hover:bg-accent/10 transition-all hover:scale-105 active:scale-95 group"
              >
                <Terminal className="w-4 h-4 text-accent" />
                Provision Cloud
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {SECTIONS.map((section) => {
        const content = parsedSections[section];
        // Don't show empty sections while streaming (or do show them to prove it's coming, but hiding looks cleaner)
        if (!content && isStreaming) return null;
        if (!content && !isStreaming) return null;

        return (
          <CollapsibleSection
            key={section}
            title={section}
            content={content}
            isOpenDefault={true}
            onApplyFix={section === "Refactor Suggestions" || section === "Explanation" ? onApplyFix : undefined}
          />
        );
      })}
    </div>
  );
}

function CollapsibleSection({ 
  title, 
  content, 
  isOpenDefault = false,
  onApplyFix
}: { 
  title: string; 
  content: string; 
  isOpenDefault?: boolean;
  onApplyFix?: (code: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(isOpenDefault);

  return (
    <div className="w-full glass-card rounded-2xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 bg-background/50 hover:bg-muted/10 transition-colors"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 prose prose-invert prose-p:leading-relaxed max-w-none text-foreground">
              <MarkdownRenderer content={content} onApplyFix={onApplyFix} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MarkdownRenderer({ content, onApplyFix }: { content: string; onApplyFix?: (code: string) => void }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!inline && match) {
            return (
              <div className="relative group my-4 rounded-xl overflow-hidden border border-border/50">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
                  <span className="text-xs font-mono text-muted-foreground uppercase">{match[1]}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onApplyFix && (
                      <button 
                        onClick={() => onApplyFix(codeString)}
                        className="text-xs px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent font-bold rounded-lg transition-colors"
                      >
                        Apply to Editor
                      </button>
                    )}
                    <CopyButton text={codeString} className="h-6 w-6" />
                  </div>
                </div>
                <SyntaxHighlighter
                  {...props}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 text-sm"
                  customStyle={{ background: "transparent", padding: "1rem" }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <code className={cn("bg-muted/50 px-1.5 py-0.5 rounded-md text-sm font-mono text-accent", className)} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
