import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] active:opacity-90",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:from-accent/90 hover:to-accent",
        secondary:
          "bg-muted/50 text-foreground border border-border/50 hover:bg-muted hover:border-border transition-colors",
        ghost: "text-muted hover:bg-muted/50 hover:text-foreground",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/20",
        outline: "bg-transparent border border-border/50 text-foreground hover:bg-muted/50",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
