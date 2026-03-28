import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  label,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted text-lg max-w-2xl font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
