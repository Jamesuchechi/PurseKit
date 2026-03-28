"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  withSearch?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  withSearch = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.id === value);
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-2xl border border-border/50 bg-background/50 dark:bg-void/50 px-4 py-3 text-sm ring-offset-background transition-all outline-none",
          isOpen && "border-accent/50 ring-2 ring-accent/20"
        )}
      >
        <span className={cn("font-medium", !selectedOption && "text-muted/50")}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-accent"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute z-50 w-full glass-card rounded-2xl border border-border/50 shadow-2xl shadow-black/20 overflow-hidden"
          >
            {withSearch && (
              <div className="p-2 border-b border-border/50">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted" />
                  <input
                    className="w-full bg-muted/30 border-none rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-0 outline-none"
                    placeholder="Search options..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="max-h-[240px] overflow-y-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors text-left",
                      option.id === value
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted font-bold">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
