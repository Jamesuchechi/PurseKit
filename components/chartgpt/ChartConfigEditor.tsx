"use client";

import * as React from "react";
import { ChartConfig } from "./ChartRenderer";
import { Settings2 } from "lucide-react";

interface ChartConfigEditorProps {
  config: ChartConfig;
  columns: string[];
  onChange: (newConfig: ChartConfig) => void;
}

const CHART_TYPES = ["bar", "line", "area", "pie", "scatter", "radar", "composed", "treemap", "funnel", "radialBar"];

export function ChartConfigEditor({ config, columns, onChange }: ChartConfigEditorProps) {
  const handleChange = (key: keyof ChartConfig, value: unknown) => {
    onChange({ ...config, [key]: value });
  };

  const handleDataKeyChange = (index: number, newKey: string) => {
    const newDataKeys = [...config.dataKeys];
    newDataKeys[index] = { ...newDataKeys[index], key: newKey };
    handleChange("dataKeys", newDataKeys);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newDataKeys = [...config.dataKeys];
    newDataKeys[index] = { ...newDataKeys[index], color: newColor };
    handleChange("dataKeys", newDataKeys);
  };

  return (
    <div className="bg-background/50 backdrop-blur-md rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <Settings2 className="w-5 h-5 text-accent" />
        <h3 className="font-display font-black text-foreground">Chart Settings</h3>
      </div>

      <div className="space-y-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Chart Type</span>
          <select 
            value={config.type} 
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-muted/20 border border-border/50 rounded-lg py-2 px-3 text-sm text-foreground outline-none focus:border-accent"
          >
            {CHART_TYPES.map(t => (
              <option key={t} value={t} className="bg-background">{t.toUpperCase()}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Title</span>
          <input 
            type="text" 
            value={config.title} 
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-muted/20 border border-border/50 rounded-lg py-2 px-3 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">X-Axis Column</span>
          <select 
            value={config.xAxis} 
            onChange={(e) => handleChange("xAxis", e.target.value)}
            className="w-full bg-muted/20 border border-border/50 rounded-lg py-2 px-3 text-sm text-foreground outline-none focus:border-accent"
          >
            {columns.map(c => (
              <option key={c} value={c} className="bg-background">{c}</option>
            ))}
          </select>
        </label>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Data Keys (Y-Axis)</span>
          {config.dataKeys.map((dk, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-muted/10 rounded-xl border border-border/30">
              <input
                type="color"
                value={dk.color || "#06b6d4"}
                onChange={(e) => handleColorChange(i, e.target.value)}
                className="w-8 h-8 rounded shrink-0 cursor-pointer bg-transparent border-0 p-0"
              />
              <select 
                value={dk.key} 
                onChange={(e) => handleDataKeyChange(i, e.target.value)}
                className="flex-1 min-w-0 bg-transparent py-1 px-2 text-sm text-foreground outline-none border border-border/50 rounded-lg overflow-hidden text-ellipsis"
              >
                {columns.map(c => (
                  <option key={c} value={c} className="bg-background">{c}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
