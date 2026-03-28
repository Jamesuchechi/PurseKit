import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withGlow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, withGlow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative glass-card p-6 rounded-3xl overflow-hidden group transition-all",
          withGlow && "hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10",
          className
        )}
        {...props}
      >
        {withGlow && (
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };
