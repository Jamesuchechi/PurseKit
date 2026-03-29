"use client";

import * as React from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Brain, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  Zap,
  ArrowRight,
  MessageSquare,
  History,
  Trash2,
  Download
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useHistory } from "@/hooks/useHistory";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAction?: (action: string) => void;
}

export function CommandPalette({ isOpen, setIsOpen, onAction }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Aggregate history from all modules
  const { items: devHistory } = useHistory("devlens");
  const { items: specHistory } = useHistory("specforge");
  const { items: chartHistory } = useHistory("chartgpt");

  const historyItems = React.useMemo(() => {
    return [...devHistory, ...specHistory, ...chartHistory]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [devHistory, specHistory, chartHistory]);

  // Navigation commands
  const navCommands = [
    { id: "home", title: "Home", icon: LayoutDashboard, href: "/dashboard" },
    { id: "devlens", title: "DevLens", icon: Brain, href: "/devlens" },
    { id: "specforge", title: "SpecForge", icon: FileText, href: "/specforge" },
    { id: "chartgpt", title: "ChartGPT", icon: BarChart3, href: "/chartgpt" },
  ];

  // Actions based on current page
  const getContextActions = () => {
    const actions = [
      { id: "open-chat", title: "Open AI Assistant", icon: MessageSquare, shortcut: "⌘ /" },
      { id: "open-history", title: "Toggle History Vault", icon: History, shortcut: "⌘ H" },
    ];

    if (pathname !== "/dashboard") {
      actions.push(
        { id: "analyze", title: "Run Analysis / Generate", icon: Zap, shortcut: "⌘ ↵" },
        { id: "export", title: "Export Result", icon: Download, shortcut: "⌘ E" },
        { id: "clear", title: "Clear Workspace", icon: Trash2, shortcut: "" }
      );
    }

    return actions;
  };

  const handleSelect = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Command.Dialog
          open={isOpen}
          onOpenChange={setIsOpen}
          label="Global Command Palette"
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-background/40 dark:bg-void/40 backdrop-blur-3xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden shadow-accent/5 flex flex-col"
          >
            <div className="flex items-center px-6 border-b border-border/50">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <Command.Input
                autoFocus
                placeholder="Type a command or search history..."
                className="flex-1 bg-transparent border-none py-6 px-4 text-lg font-display font-medium text-foreground focus:ring-0 outline-none placeholder:text-muted/30"
              />
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-muted/20 rounded-lg text-[10px] font-bold text-muted uppercase tracking-widest border border-border/50">
                ESC
              </div>
            </div>

            <Command.List className="max-h-[450px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <Command.Empty className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                <Zap className="w-10 h-10 text-muted mb-4 animate-pulse" />
                <p className="font-bold text-muted uppercase tracking-widest text-xs">
                  No matching commands found
                </p>
              </Command.Empty>

              <Command.Group heading="Navigation" className="space-y-2">
                {navCommands.map((nav) => (
                  <Command.Item
                    key={nav.id}
                    onSelect={() => handleSelect(() => router.push(nav.href))}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-accent/10 aria-selected:bg-accent/10 group cursor-pointer transition-all border border-transparent aria-selected:border-accent/20"
                  >
                    <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-accent/10 text-muted group-hover:text-accent border border-border/50 group-hover:border-accent/20 transition-all">
                      <nav.icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-display font-bold text-foreground group-hover:text-accent transition-colors">
                      {nav.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all" />
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Actions" className="space-y-2">
                {getContextActions().map((action) => (
                  <Command.Item
                    key={action.id}
                    onSelect={() => handleSelect(() => onAction?.(action.id))}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-accent/10 aria-selected:bg-accent/10 group cursor-pointer transition-all border border-transparent aria-selected:border-accent/20"
                  >
                    <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-accent/10 text-muted group-hover:text-accent border border-border/50 group-hover:border-accent/20 transition-all">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-display font-bold text-foreground group-hover:text-accent transition-colors">
                      {action.title}
                    </span>
                    {action.shortcut && (
                      <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-muted/30 text-[10px] font-bold text-muted border border-border/50 group-hover:border-accent/20 group-hover:text-accent transition-all">
                        {action.shortcut}
                      </kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>

              {historyItems.length > 0 && (
                <Command.Group heading="Recent History" className="space-y-2">
                  {historyItems.slice(0, 5).map((item) => (
                    <Command.Item
                      key={item.id}
                      onSelect={() => handleSelect(() => router.push(`/${item.module}?id=${item.id}`))}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-accent/10 aria-selected:bg-accent/10 group cursor-pointer transition-all border border-transparent aria-selected:border-accent/20"
                    >
                      <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-accent/10 text-muted group-hover:text-accent border border-border/50 group-hover:border-accent/20 transition-all">
                        <History className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-foreground transition-colors group-hover:text-accent truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
                          {item.module} • {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>

            <div className="p-4 bg-muted/10 border-t border-border/50 flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-muted/30 px-1 rounded">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-muted/30 px-1 rounded">Enter</kbd> Select</span>
              </div>
              <span className="text-accent animate-pulse">PulseKit Command Center</span>
            </div>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
