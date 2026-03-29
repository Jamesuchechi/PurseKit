"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  Brain, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  History, 
  Sun, 
  Moon,
  Zap,
  Sparkles
} from "lucide-react";
import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-muted-foreground" },
  { href: "/devlens", label: "DevLens", icon: Brain, color: "text-accent" },
  { href: "/specforge", label: "SpecForge", icon: FileText, color: "text-amber" },
  { href: "/chartgpt", label: "ChartGPT", icon: BarChart3, color: "text-violet" },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onHistoryClick: () => void;
  onChatClick: () => void;
}

export function MobileNav({ isOpen, onClose, onHistoryClick, onChatClick }: MobileNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-void/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-[110] w-[280px] bg-background dark:bg-void border-r border-border shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">PulseKit</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted/50"
              >
                <X className="w-5 h-5 text-muted" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                      isActive 
                        ? "bg-muted text-foreground ring-1 ring-border/50" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", isActive ? item.color : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="font-semibold text-sm">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator-mobile"
                        className="absolute left-0 w-1.5 h-6 bg-accent rounded-r-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="p-4 border-t border-border/50 space-y-2 bg-muted/5">
              <button
                onClick={() => {
                  onChatClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-accent bg-accent/5 border border-accent/10 hover:bg-accent/10"
              >
                <Sparkles className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm">AI Assistant</span>
                <div className="absolute right-4 w-2 h-2 rounded-full bg-accent animate-pulse" />
              </button>

              <button
                onClick={() => {
                  onHistoryClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <History className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">Session History</span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-5 h-5 shrink-0 text-amber" />
                    <span className="font-semibold text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 shrink-0 text-violet" />
                    <span className="font-semibold text-sm">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
