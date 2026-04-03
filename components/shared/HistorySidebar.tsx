"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  X, 
  Clock, 
  FileText, 
  BarChart3, 
  Brain, 
  Search, 
  Trash2, 
  Download,
  AlertCircle,
  Zap,
  BookOpen
} from "lucide-react";
import { cn, downloadFile } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";

import { type HistoryItem, type Module } from "@/types";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onItemClick?: (item: HistoryItem) => void;
  onRemove?: (item: HistoryItem) => void;
  onClearAll?: () => void;
}

const moduleIcons: Record<Module, React.ElementType> = {
  devlens: Brain,
  specforge: FileText,
  chartgpt: BarChart3,
  ops: Zap,
  docs: BookOpen,
  lens: Search,
};

const moduleColors: Record<Module, string> = {
  devlens: "text-accent",
  specforge: "text-amber",
  chartgpt: "text-violet",
  ops: "text-emerald-500",
  docs: "text-indigo-400",
  lens: "text-blue-400",
};

const TABS = [
  { id: "all", label: "All" },
  { id: "devlens", label: "DevLens", icon: <Brain className="w-3.5 h-3.5" /> },
  { id: "specforge", label: "SpecForge", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "chartgpt", label: "ChartGPT", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "ops", label: "PulseOps", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "docs", label: "PulseDocs", icon: <BookOpen className="w-3.5 h-3.5" /> },
];

export function HistorySidebar({
  isOpen,
  onClose,
  items,
  onItemClick,
  onRemove,
  onClearAll,
}: HistorySidebarProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);

  // Filter items based on tab and search query
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === "all" || item.module === activeTab;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.input.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const handleExport = () => {
    if (items.length === 0) return;
    const data = JSON.stringify(items, null, 2);
    downloadFile(data, `pulsekit-history-${new Date().toISOString().split('T')[0]}.json`, "application/json");
  };

  const handleClearConfirm = () => {
    onClearAll?.();
    setIsClearModalOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[150] bg-void/60 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-[420px] bg-background dark:bg-void border-l border-border shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-accent" />
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight">
                      Session History
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input 
                    placeholder="Search history..." 
                    icon={<Search className="w-4 h-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-muted/20"
                  />
                  
                  <Tabs 
                    tabs={TABS} 
                    activeTab={activeTab} 
                    onChange={setActiveTab} 
                    className="w-full justify-start overflow-x-auto no-scrollbar"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 styled-scrollbar">
                {filteredItems.length > 0 ? (
                  <div className="space-y-3 pb-20">
                    <AnimatePresence mode="popLayout">
                      {filteredItems.map((item) => {
                        const Icon = moduleIcons[item.module];
                        return (
                          <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative group"
                          >
                            <button
                              onClick={() => onItemClick?.(item)}
                              className="w-full p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-accent/30 transition-all text-left flex items-start gap-4 pr-12"
                            >
                              <div className={cn("p-3 rounded-xl bg-background/50 border border-border/50 shadow-sm", moduleColors[item.module])}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-foreground truncate group-hover:text-accent transition-colors">
                                  {item.title}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted font-bold uppercase tracking-wider">
                                  <Clock className="w-3 h-3" />
                                  {item.timestamp}
                                </div>
                              </div>
                            </button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove?.(item);
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500 text-muted"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <EmptyState 
                    icon={searchQuery ? Search : History}
                    title={searchQuery ? "No matches" : "History is empty"}
                    description={searchQuery ? "We couldn't find any results matching your search terms." : "Start exploring modules to build your session history."}
                    className="border-none bg-transparent h-[400px]"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md sticky bottom-0 space-y-3">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    className="flex-1 font-bold uppercase tracking-widest text-[10px] h-11"
                    onClick={handleExport}
                    disabled={items.length === 0}
                  >
                    <Download className="w-3.5 h-3.5 mr-2" />
                    Export JSON
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 font-bold uppercase tracking-widest text-[10px] h-11 text-red-500 hover:bg-red-500/10"
                    onClick={() => setIsClearModalOpen(true)}
                    disabled={items.length === 0}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear History"
        description="Are you sure you want to delete all history across all modules? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-red-500 hover:bg-red-600 border-red-500" onClick={handleClearConfirm}>
              Clear Everything
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm font-medium">
            This will permanently remove all {items.length} saved results from your browser.
          </p>
        </div>
      </Modal>
    </>
  );
}
