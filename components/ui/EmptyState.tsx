import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 glass-card rounded-3xl border-dashed border-2 border-border/50",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-muted/30 mb-4">
        <Icon className="w-10 h-10 text-muted" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-[280px] leading-relaxed mb-6 font-medium">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
