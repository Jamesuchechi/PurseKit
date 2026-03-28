"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Treemap,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, RefreshCw, Info, BarChart2, TrendingUp, PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Enhanced Chart Configuration Schema for AI
 */
export interface ChartConfig {
  type: 
    | "bar" | "line" | "area" | "pie" | "scatter" 
    | "radar" | "composed" | "treemap" | "radialBar" 
    | "funnel" | "bubble" | "heatmap" | "sankey" 
    | "gantt" | "violin" | "box" | "chord" | "wordCloud";
  title: string;
  description: string;
  xAxis: string;
  yAxis?: string;
  dataKeys: {
    key: string;
    label: string;
    color?: string;
    type?: "bar" | "line" | "area";
  }[];
  colors?: string[];
  options?: {
    stacked?: boolean;
    horizontal?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    step?: boolean;
    smooth?: boolean;
  };
}

/**
 * Runtime validation guard for AI-generated ChartConfig.
 * Prevents render crashes if the AI returns an incomplete or malformed config.
 */
export function isValidChartConfig(config: unknown): config is ChartConfig {
  if (!config || typeof config !== "object") return false;
  const c = config as Record<string, unknown>;
  return (
    typeof c.type === "string" &&
    typeof c.title === "string" &&
    typeof c.xAxis === "string" &&
    Array.isArray(c.dataKeys) &&
    c.dataKeys.length > 0 &&
    (c.dataKeys as unknown[]).every(
      (dk) => typeof dk === "object" && dk !== null && typeof (dk as Record<string, unknown>).key === "string"
    )
  );
}

interface ChartRendererProps {
  config: ChartConfig;
  data: Record<string, unknown>[];
  onReset?: () => void;
  isLoading?: boolean;
}

const DEFAULT_COLORS = [
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ec4899", // pink
  "#3b82f6", // blue
  "#ef4444", // red
  "#6366f1", // indigo
];

export function ChartRenderer({ config, data, onReset, isLoading }: ChartRendererProps) {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  // --- PNG Export ---
  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.title.replace(/\s+/g, "_").toLowerCase()}_chart.png`;
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Copy Config as JSON ---
  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-[16/9] rounded-2xl border border-border bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
        <p className="text-muted font-medium animate-pulse">Generating your visualization...</p>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const colors = config.colors || DEFAULT_COLORS;

    switch (config.type) {
      case "bar":
        return (
          <BarChart {...commonProps} layout={config.options?.horizontal ? "vertical" : "horizontal"}>
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />}
            <XAxis 
              dataKey={config.xAxis} 
              type={config.options?.horizontal ? "number" : "category"}
              stroke="#888" 
              fontSize={12} 
            />
            <YAxis 
              type={config.options?.horizontal ? "category" : "number"}
              stroke="#888" 
              fontSize={12} 
            />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
            {config.options?.showLegend !== false && <Legend />}
            {config.dataKeys.map((dk, i) => (
              <Bar 
                key={dk.key} 
                dataKey={dk.key} 
                name={dk.label} 
                fill={dk.color || colors[i % colors.length]} 
                stackId={config.options?.stacked ? "a" : undefined}
                radius={config.options?.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              >
                {!config.options?.stacked && <LabelList dataKey={dk.key} position="top" fill="#888" fontSize={10} />}
              </Bar>
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />}
            <XAxis dataKey={config.xAxis} stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            {config.options?.showLegend !== false && <Legend />}
            {config.dataKeys.map((dk, i) => (
              <Line 
                key={dk.key} 
                type={config.options?.smooth ? "monotone" : "linear"}
                dataKey={dk.key} 
                name={dk.label} 
                stroke={dk.color || colors[i % colors.length]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {config.dataKeys.map((dk, i) => (
                <linearGradient key={`gradient-${dk.key}`} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dk.color || colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={dk.color || colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />}
            <XAxis dataKey={config.xAxis} stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            {config.options?.showLegend !== false && <Legend />}
            {config.dataKeys.map((dk, i) => (
              <Area 
                key={dk.key} 
                type="monotone" 
                dataKey={dk.key} 
                name={dk.label} 
                stroke={dk.color || colors[i % colors.length]} 
                fillOpacity={1} 
                fill={`url(#grad-${dk.key})`} 
                stackId={config.options?.stacked ? "a" : undefined}
              />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={config.dataKeys[0].key}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={config.options?.stacked ? 70 : 0}
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            <Legend />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} stroke="#888" fontSize={12} />
            <YAxis type="number" dataKey={config.dataKeys[0].key} name={config.dataKeys[0].label} stroke="#888" fontSize={12} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            <Legend />
            <Scatter name={config.title} data={data} fill={colors[0]} />
          </ScatterChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey={config.xAxis} stroke="#888" fontSize={12} />
            <PolarRadiusAxis stroke="#444" fontSize={10} />
            {config.dataKeys.map((dk, i) => (
              <Radar
                key={dk.key}
                name={dk.label}
                dataKey={dk.key}
                stroke={dk.color || colors[i % colors.length]}
                fill={dk.color || colors[i % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            <Legend />
          </RadarChart>
        );

      case "treemap":
        return (
          <Treemap
            width={730}
            height={350}
            data={data}
            dataKey={config.dataKeys[0].key}
            aspectRatio={4 / 3}
            stroke="#111"
            fill={colors[0]}
          >
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
          </Treemap>
        );

      case "funnel":
        return (
          <FunnelChart {...commonProps}>
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            <Funnel dataKey={config.dataKeys[0].key} data={data} isAnimationActive>
              <LabelList position="right" fill="#888" stroke="none" dataKey={config.xAxis} />
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        );

      case "radialBar":
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
            <RadialBar label={{ position: "insideStart", fill: "#fff" }} background dataKey={config.dataKeys[0].key} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
          </RadialBarChart>
        );

      case "composed":
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey={config.xAxis} stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
            <Legend />
            {config.dataKeys.map((dk, i) => {
              const color = dk.color || colors[i % colors.length];
              if (dk.type === "area") return <Area key={dk.key} type="monotone" dataKey={dk.key} fill={color} stroke={color} />;
              if (dk.type === "bar") return <Bar key={dk.key} dataKey={dk.key} barSize={20} fill={color} />;
              return <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={color} />;
            })}
          </ComposedChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center space-y-3">
              <Info className="w-10 h-10 mx-auto opacity-20" />
              <p className="text-sm font-medium">Chart type <strong>&quot;{config.type}&quot;</strong> is not yet natively rendered.</p>
              <p className="text-xs text-muted/70">Try regenerating with: bar, line, area, pie, scatter, radar, funnel, treemap, radialBar, or composed.</p>
              <Button variant="ghost" size="sm" onClick={onReset} className="text-accent underline mt-2">
                Try again
              </Button>
            </div>
          </div>
        );
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "pie": return <PieChartIcon className="w-4 h-4" />;
      case "line":
      case "area": return <TrendingUp className="w-4 h-4" />;
      default: return <BarChart2 className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="relative rounded-2xl border border-border bg-void/50 backdrop-blur-xl overflow-hidden p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="capitalize gap-1.5 px-2 bg-accent/20 border-accent/30 text-accent">
                {getIconForType(config.type)}
                {config.type}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-muted" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{data.length} datapoints</span>
            </div>
            <h2 className="text-3xl font-display font-black text-foreground tracking-tight">
              {config.title}
            </h2>
            <p className="text-muted text-sm max-w-2xl leading-relaxed">{config.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <AnimatePresence>
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-2 border-border hover:border-accent/50 hover:bg-accent/5 transition-all", isCopied && "border-emerald-500/50 text-emerald-500")}
                  onClick={handleCopyConfig}
                  title="Copy chart configuration as JSON"
                >
                  <Copy className="w-4 h-4" />
                  {isCopied ? "Copied!" : "Copy Config"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2 shadow-lg shadow-accent/20 px-4"
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  title="Export chart as PNG"
                >
                  {isExporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isExporting ? "Exporting..." : "Export PNG"}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Chart Container */}
        <div 
          className="w-full aspect-[16/9] min-h-[450px] relative" 
          ref={chartRef}
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Info Footer */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-tighter text-muted font-bold">X-Axis</span>
              <span className="text-sm font-medium text-foreground">{config.xAxis}</span>
            </div>
            {config.dataKeys.map(dk => (
              <div key={dk.key} className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-tighter text-muted font-bold">{dk.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dk.color || DEFAULT_COLORS[0] }} />
                  <span className="text-sm font-medium text-foreground">{dk.key}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="text-muted hover:text-accent gap-2" onClick={onReset}>
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
