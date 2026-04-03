"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Brain, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  History, 
  ChevronLeft,
  Moon,
  Sun,
  Settings,
  Terminal,
  BookOpen,
  LineChart,
  Bell,
  Sparkles,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-muted-foreground" },
  { href: "/devlens", label: "DevLens", icon: Brain, color: "text-accent" },
  { href: "/specforge", label: "SpecForge", icon: FileText, color: "text-amber" },
  { href: "/ops", label: "PulseOps", icon: Terminal, color: "text-blue-400" },
  { href: "/docs", label: "PulseDocs", icon: BookOpen, color: "text-indigo-400" },
  { href: "/lens", label: "Lens", icon: MessageSquare, color: "text-rose-500" },
  { href: "/chartgpt", label: "ChartGPT", icon: BarChart3, color: "text-violet" },
  { href: "/analytics", label: "Analytics", icon: LineChart, color: "text-emerald-500" },
  { href: "/notifications", label: "Notifications", icon: Bell, color: "text-indigo-500" },
  { href: "/settings", label: "Settings", icon: Settings, color: "text-slate-400" },
];

interface AppSidebarProps {
  onHistoryClick: () => void;
  onChatClick: () => void;
}

export function AppSidebar({ onHistoryClick, onChatClick }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "relative h-screen flex flex-col bg-background border-r border-border transition-all duration-300 z-50",
        "hidden lg:flex"
      )}
    >
        {/* Logo Section */}
        <div className={cn(
          "p-6 flex items-center h-20 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}>
          <Link href="/" className={cn("flex items-center gap-3 group", isCollapsed && "hidden")}>
            <div className="relative w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-lg shadow-accent/5 overflow-hidden border border-border/50">
              <Image 
                src="/icon.png" 
                alt="PulseKit Logo" 
                width={36} 
                height={36} 
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                PulseKit
              </span>
            )}
          </Link>

          {isCollapsed && (
            <div className="relative w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-lg shadow-accent/5 overflow-hidden border border-border/50">
              <Image 
                src="/icon.png" 
                alt="PulseKit Logo" 
                width={36} 
                height={36} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 rounded-lg hover:bg-muted/50 transition-all duration-300",
              isCollapsed ? "absolute -right-4 top-6 bg-background border border-border shadow-md z-50" : ""
            )}
          >
            <ChevronLeft className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto styled-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-muted text-foreground ring-1 ring-border/50" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? item.color : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && (
                  <span className="font-medium text-sm transition-all duration-200">
                    {item.label}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-5 bg-accent rounded-r-full"
                  />
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} content={item.label} position="right">
                  {linkContent}
                </Tooltip>
              );
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/50 space-y-1.5 bg-muted/5">
          {/* AI Assistant Button */}
          {isCollapsed ? (
            <Tooltip content="AI Assistant" position="right">
              <button
                onClick={onChatClick}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  "text-accent bg-accent/5 hover:bg-accent/10 border border-accent/10"
                )}
              >
                <Sparkles className="w-5 h-5 shrink-0" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={onChatClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                "text-accent bg-accent/5 hover:bg-accent/10 border border-accent/10"
              )}
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="font-bold text-sm">AI Assistant</span>
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </button>
          )}

          {/* History Button */}
          {isCollapsed ? (
            <Tooltip content="Session History" position="right">
              <button
                onClick={onHistoryClick}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <History className="w-5 h-5 shrink-0" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={onHistoryClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <History className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm">Session History</span>
            </button>
          )}

          {/* Theme Toggle */}
          {isCollapsed ? (
            <Tooltip content="Toggle Theme" position="right">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 shrink-0 text-amber" />
                ) : (
                  <Moon className="w-5 h-5 shrink-0 text-violet" />
                )}
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 shrink-0 text-amber" />
              ) : (
                <Moon className="w-5 h-5 shrink-0 text-violet" />
              )}
              <span className="font-medium text-sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          )}
        </div>
      </motion.aside>
  );
}
