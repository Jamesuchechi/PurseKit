"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  content,
  children,
  className,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-[100] px-3 py-1.5 text-xs font-bold text-white bg-background border border-border shadow-lg rounded-xl whitespace-nowrap pointer-events-none shadow-2xl shadow-black/20",
              positionClasses[position],
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-2 h-2 bg-background border-r border-b border-border rotate-45",
                position === "top" && "bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                position === "bottom" && "top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0 border-t border-l",
                position === "left" && "right-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0 border-t border-r",
                position === "right" && "left-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0 border-b border-l"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
