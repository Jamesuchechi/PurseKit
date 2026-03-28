import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 group">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-2xl border border-border/50 bg-background/50 dark:bg-void/50 px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              icon && "pl-11",
              error && "border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
