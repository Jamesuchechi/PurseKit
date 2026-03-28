"use client";

import * as React from "react";
import { Table, LayoutGrid, Info, Hash, Calendar, ToggleLeft as Toggle, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ParsedData } from "@/lib/csv-parser";

interface DataPreviewProps {
  data: ParsedData;
  className?: string;
}

export function DataPreview({ data, className }: DataPreviewProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "summary">("preview");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "number": return <Hash className="w-3 h-3" />;
      case "date": return <Calendar className="w-3 h-3" />;
      case "boolean": return <Toggle className="w-3 h-3" />;
      default: return <Type className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "number": return "amber";
      case "date": return "violet";
      case "boolean": return "green-500";
      default: return "accent";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 w-fit">
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "preview" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted hover:text-foreground"
          )}
        >
          <Table className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "summary" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted hover:text-foreground"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          Summary
        </button>
      </div>

      <div className="relative rounded-2xl border border-border bg-background/50 backdrop-blur-sm overflow-hidden">
        {activeTab === "preview" ? (
          <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <tr className="border-b border-border">
                  {data.columns.map((col) => (
                    <th key={col} className="px-6 py-4 font-bold text-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="truncate max-w-[150px]">{col}</span>
                        <Badge variant="subtle" className="w-fit text-[10px] px-1.5 py-0 h-4 gap-1">
                          {getTypeIcon(data.types[col])}
                          {data.types[col]}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.data.slice(0, 50).map((row, i) => (
                  <tr key={i} className="hover:bg-accent/5 transition-colors group">
                    {data.columns.map((col) => (
                      <td key={col} className="px-6 py-3 text-muted group-hover:text-foreground transition-colors truncate max-w-[200px]">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.data.length > 50 && (
              <div className="p-4 text-center border-t border-border bg-muted/20 text-xs text-muted">
                Showing first 50 of {data.data.length} rows
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-background/30 space-y-2">
              <div className="flex items-center gap-2 text-muted mb-2">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Rows</span>
              </div>
              <p className="text-3xl font-display font-black text-foreground">
                {data.data.length.toLocaleString()}
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-background/30 space-y-2">
              <div className="flex items-center gap-2 text-muted mb-2">
                <LayoutGrid className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Columns</span>
              </div>
              <p className="text-3xl font-display font-black text-foreground">
                {data.columns.length}
              </p>
            </div>
            {data.columns.slice(0, 1).map(col => (
               <div key={col} className="p-6 rounded-xl border border-border bg-background/30 space-y-2">
               <div className="flex items-center gap-2 text-muted mb-2">
                 <Badge variant="subtle" className="px-1.5">{data.types[col]}</Badge>
                 <span className="text-xs font-bold uppercase tracking-wider truncate">Sample Field: {col}</span>
               </div>
               <p className="text-sm text-muted italic">
                 &quot;{String(data.data[0][col]).slice(0, 50)}...&quot;
               </p>
             </div>
            ))}
          </div>
        )}
      </div>

      {/* Column Type Map */}
      <div className="flex flex-wrap gap-3">
        {data.columns.map(col => (
          <div key={col} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-background/30 hover:border-accent/30 transition-all cursor-default group">
            <span className="text-xs font-medium text-muted group-hover:text-foreground">{col}</span>
            <div className={cn(
              "p-1 rounded bg-background border border-border",
              `text-${getTypeColor(data.types[col])}`
            )}>
              {getTypeIcon(data.types[col])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
