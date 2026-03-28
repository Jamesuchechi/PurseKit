import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize logic
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    };

    return (
      <div className="w-full space-y-2">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-2xl border border-border/50 bg-background/50 dark:bg-void/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
            error && "border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500",
            className
          )}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          onInput={handleInput}
          disabled={disabled}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
