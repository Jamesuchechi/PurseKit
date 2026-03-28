"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Brain, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  Zap,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category: "Modules" | "System";
}

const commands: CommandItem[] = [
  { id: "dash", title: "Dashboard", description: "Workspace Command Center", icon: LayoutDashboard, href: "/dashboard", category: "System" },
  { id: "dev", title: "DevLens", description: "AI Code Intelligence", icon: Brain, href: "/devlens", category: "Modules" },
  { id: "spec", title: "SpecForge", description: "PRD & Spec Generation", icon: FileText, href: "/specforge", category: "Modules" },
  { id: "chart", title: "ChartGPT", description: "Data Visualization", icon: BarChart3, href: "/chartgpt", category: "Modules" },
  { id: "set", title: "Settings", description: "General Preferences", icon: Settings, href: "/settings", category: "System" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-background/50 dark:bg-void/50 backdrop-blur-3xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden shadow-accent/5"
          >
            {/* Search Input */}
            <div className="relative p-6 border-b border-border/50">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-muted" />
              <input
                autoFocus
                className="w-full bg-transparent border-none pl-12 pr-4 py-2 text-xl font-display font-medium text-foreground focus:ring-0 outline-none placeholder:text-muted/30"
                placeholder="Search modules, settings, or tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-lg text-[10px] font-bold text-muted uppercase tracking-widest border border-border/50">
                ESC
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-6">
              {filteredCommands.length > 0 ? (
                <>
                  {["Modules", "System"].map((category) => {
                    const catItems = filteredCommands.filter((c) => c.category === category);
                    if (catItems.length === 0) return null;
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="px-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {catItems.map((cmd) => {
                            const Icon = cmd.icon;
                            return (
                              <button
                                key={cmd.id}
                                onClick={() => handleSelect(cmd.href)}
                                className="w-full group flex items-center gap-4 p-4 rounded-2xl hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all text-left"
                              >
                                <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-accent/10 text-muted group-hover:text-accent border border-border/50 group-hover:border-accent/20 transition-all">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-display font-bold text-foreground transition-colors group-hover:text-accent">
                                    {cmd.title}
                                  </div>
                                  <div className="text-xs text-muted font-medium transition-colors">
                                    {cmd.description}
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                  <Zap className="w-12 h-12 text-muted mb-4 animate-pulse" />
                  <p className="font-bold text-muted uppercase tracking-widest text-xs">
                    No matching actions found
                  </p>
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="p-6 pt-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                  <span className="px-1.5 py-0.5 bg-muted/50 rounded border border-border/50">↑↓</span>
                  Navigate
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                  <span className="px-1.5 py-0.5 bg-muted/50 rounded border border-border/50">Enter</span>
                  Select
                </div>
              </div>
              <div className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] animate-pulse">
                Ready for input
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
