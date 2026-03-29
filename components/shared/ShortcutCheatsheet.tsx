"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Command } from "lucide-react";

interface ShortcutCheatsheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { group: "Global Navigation", items: [
    { keys: ["⌘", "K"], label: "Open Command Palette" },
    { keys: ["⌘", "/"], label: "Toggle AI Assistant" },
    { keys: ["⌘", "H"], label: "Toggle History Vault" },
    { keys: ["⌘", "A"], label: "Jump to Analytics" },
    { keys: ["?"], label: "Show Shortcuts", meta: false },
    { keys: ["Esc"], label: "Close Panel / Modal", meta: false },
  ]},
  { group: "Active Module Actions", items: [
    { keys: ["⌘", "↵"], label: "Run Analysis / Generate" },
    { keys: ["⌘", "E"], label: "Export Current Result" },
    { keys: ["⌘", "C"], label: "Copy Result as Markdown" },
  ]},
  { group: "App State", items: [
    { keys: ["L"], label: "Toggle Sidebar Collapse", meta: false },
    { keys: ["D"], label: "Toggle Dark/Light Mode", meta: false },
  ]}
];

export function ShortcutCheatsheet({ isOpen, onClose }: ShortcutCheatsheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-background dark:bg-void border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-3 text-accent text-sm font-bold uppercase tracking-widest">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {shortcuts.map((group) => (
                <div key={group.group} className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] px-1">
                    {group.group}
                  </h4>
                  <div className="grid gap-2">
                    {group.items.map((item) => (
                      <div 
                        key={item.label}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-transparent hover:border-border transition-all"
                      >
                        <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key) => (
                            <kbd 
                              key={key}
                              className="min-w-[24px] h-6 flex items-center justify-center px-1.5 rounded bg-muted border border-border text-[10px] font-bold text-muted-foreground shadow-sm"
                            >
                              {key === "⌘" ? <Command className="w-3 h-3" /> : key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 pt-4 border-t border-border bg-muted/5 text-center">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">
                Press any key to continue <br />
                <span className="text-accent underline cursor-pointer" onClick={onClose}>or click here to close</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
