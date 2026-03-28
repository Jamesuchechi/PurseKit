import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50",
  {
    variants: {
      variant: {
        accent: "border-accent/20 bg-accent/10 text-accent",
        amber: "border-amber/20 bg-amber/10 text-amber",
        violet: "border-violet/20 bg-violet/10 text-violet",
        subtle: "border-border/50 bg-muted/50 text-muted",
        success: "border-green-500/20 bg-green-500/10 text-green-500",
        danger: "border-red-500/20 bg-red-500/10 text-red-500",
      },
    },
    defaultVariants: {
      variant: "accent",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
