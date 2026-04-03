"use client";

import * as React from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const TONES = [
  { id: "normal", label: "Normal" },
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "sarcastic", label: "Sarcastic" },
  { id: "empathetic", label: "Empathetic" },
];

export const FORMATS = [
  { id: "auto", label: "Auto-detect" },
  { id: "short", label: "Short & Precise" },
  { id: "detailed", label: "Highly Detailed" },
  { id: "bullet", label: "Bullet Points" },
  { id: "code", label: "Code Only" },
];

export const THEMES = [
  { id: "default", label: "Void (Default)" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "glass", label: "Glassmorphism" },
  { id: "minimal", label: "Minimalist" },
];

interface SettingsMenuProps {
  tone: string;
  setTone: (t: string) => void;
  format: string;
  setFormat: (f: string) => void;
  theme: string;
  setTheme: (t: string) => void;
  isSearchEnabled: boolean;
  setIsSearchEnabled: (s: boolean) => void;
}

export function SettingsMenu({ 
  tone, setTone, 
  format, setFormat, 
  theme, setTheme,
  isSearchEnabled, setIsSearchEnabled 
}: SettingsMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all", isOpen && "bg-accent/10 text-accent")}
        title="AI Style Settings"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-64 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden z-[100] max-h-[80vh] overflow-y-auto styled-scrollbar">
          <div className="p-3 border-b border-border/50 bg-muted/20">
            <h4 className="text-sm font-bold tracking-tight text-foreground">AI Personality</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Adjust how the AI responds.</p>
          </div>
          
          <div className="p-2 space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1">Tone</div>
            {TONES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTone(t.id); }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <span className={cn("truncate", tone === t.id ? "text-accent font-medium" : "text-foreground")}>{t.label}</span>
                {tone === t.id && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-border/50 space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1">Format Length</div>
            {FORMATS.map(f => (
              <button
                key={f.id}
                onClick={() => { setFormat(f.id); }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <span className={cn("truncate", format === f.id ? "text-accent font-medium" : "text-foreground")}>{f.label}</span>
                {format === f.id && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-border/50 space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1">Theme Style</div>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <span className={cn("truncate", theme === t.id ? "text-accent font-medium" : "text-foreground")}>{t.label}</span>
                {theme === t.id && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-border/50 bg-accent/5">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Web Search</span>
                <span className="text-[10px] text-muted-foreground">Allow AI to search the web</span>
              </div>
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isSearchEnabled}
                onChange={(e) => setIsSearchEnabled(e.target.checked)}
              />
              <div className="relative w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
