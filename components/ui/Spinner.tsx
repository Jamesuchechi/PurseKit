import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  size?: "sm" | "md" | "lg";
  variant?: "accent" | "violet" | "amber" | "muted";
}

const Spinner = ({
  className,
  size = "md",
  variant = "accent",
  ...props
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    accent: "text-accent",
    violet: "text-violet",
    amber: "text-amber",
    muted: "text-muted",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export { Spinner };
