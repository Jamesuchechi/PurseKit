import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-10 glass-card rounded-3xl border-red-500/20 bg-red-500/5",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-[320px] leading-relaxed mb-6 font-medium">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="danger"
          size="sm"
          onClick={onRetry}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
