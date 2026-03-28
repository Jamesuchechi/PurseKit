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
  ZAxis,
  Sankey,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, RefreshCw, BarChart2, TrendingUp, PieChartIcon, FileText, FileCode, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
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

/**
 * Catches rendering errors in Recharts so the whole page doesn't crash on bad data/configs.
 */
type ChartErrorBoundaryProps = { children: React.ReactNode, onReset?: () => void };
type ChartErrorBoundaryState = { hasError: boolean, error?: Error };

class ChartErrorBoundary extends React.Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("Chart Render Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 h-full text-center space-y-4 bg-red-500/5 rounded-2xl border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500/80" />
          <p className="text-red-500 font-medium">Unable to render this chart configuration.</p>
          <p className="text-sm text-muted">The AI generated an incompatible configuration for the given data.</p>
          {this.props.onReset && (
            <Button variant="outline" size="sm" onClick={() => { this.setState({ hasError: false }); this.props.onReset?.(); }}>
              Regenerate Chart
            </Button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
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
  const { theme } = useTheme();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const colors = config.colors || DEFAULT_COLORS;
  const isDark = theme === "dark";
  const gridStroke = isDark ? "#333" : "#e5e7eb";
  const textStroke = isDark ? "#888" : "#4b5563";
  const tooltipBg = isDark ? "#111" : "#fff";
  const tooltipBorder = isDark ? "#333" : "#e5e7eb";
  const tooltipText = isDark ? "#fff" : "#111";

  // --- PNG Export ---
  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
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

  // --- CSV Export ---
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const { unparse } = await import("papaparse");
      const csv = unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.title.replace(/\s+/g, "_").toLowerCase()}_data.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // --- SVG Export ---
  const handleExportSVG = () => {
    if (!chartRef.current) return;
    try {
      const svg = chartRef.current.querySelector("svg");
      if (!svg) return;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.title.replace(/\s+/g, "_").toLowerCase()}_chart.svg`;
      link.click();
    } catch (err) {
      console.error("SVG export failed:", err);
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

    // Use outer colors variable

    switch (config.type) {
      case "bar":
        return (
          <BarChart {...commonProps} layout={config.options?.horizontal ? "vertical" : "horizontal"}>
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />}
            <XAxis 
              dataKey={config.xAxis} 
              type={config.options?.horizontal ? "number" : "category"}
              stroke={textStroke} 
              fontSize={12} 
            />
            <YAxis 
              type={config.options?.horizontal ? "category" : "number"}
              stroke={textStroke} 
              fontSize={12} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                border: `1px solid ${tooltipBorder}`, 
                borderRadius: "8px" 
              }} 
              itemStyle={{ color: tooltipText }} 
            />
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
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />}
            <XAxis dataKey={config.xAxis} stroke={textStroke} fontSize={12} />
            <YAxis stroke={textStroke} fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
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
            {config.options?.showGrid !== false && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />}
            <XAxis dataKey={config.xAxis} stroke={textStroke} fontSize={12} />
            <YAxis stroke={textStroke} fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
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
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} stroke={textStroke} fontSize={12} />
            <YAxis type="number" dataKey={config.dataKeys[0].key} name={config.dataKeys[0].label} stroke={textStroke} fontSize={12} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
            <Scatter name={config.title} data={data} fill={colors[0]} />
          </ScatterChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={gridStroke} />
            <PolarAngleAxis dataKey={config.xAxis} stroke={textStroke} fontSize={12} />
            <PolarRadiusAxis stroke={gridStroke} fontSize={10} />
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
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
          </RadarChart>
        );

      case "treemap":
        return (
          <Treemap
            data={data}
            dataKey={config.dataKeys[0].key}
            aspectRatio={4 / 3}
            stroke={isDark ? "#111" : "#fff"}
            fill={colors[0]}
          >
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
          </Treemap>
        );

      case "funnel":
        return (
          <FunnelChart {...commonProps}>
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Funnel dataKey={config.dataKeys[0].key} data={data} isAnimationActive>
              <LabelList position="right" fill={textStroke} stroke="none" dataKey={config.xAxis} />
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        );

      case "radialBar":
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
            <RadialBar label={{ position: "insideStart", fill: isDark ? "#fff" : "#111" }} background dataKey={config.dataKeys[0].key} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
          </RadialBarChart>
        );

      case "composed":
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid stroke={gridStroke} />
            <XAxis dataKey={config.xAxis} stroke={textStroke} fontSize={12} />
            <YAxis stroke={textStroke} fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
            {config.dataKeys.map((dk, i) => {
              const color = dk.color || colors[i % colors.length];
              if (dk.type === "area") return <Area key={dk.key} type="monotone" dataKey={dk.key} fill={color} stroke={color} />;
              if (dk.type === "bar") return <Bar key={dk.key} dataKey={dk.key} barSize={20} fill={color} />;
              return <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={color} />;
            })}
          </ComposedChart>
        );

      case "bubble":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} stroke={textStroke} fontSize={12} />
            <YAxis type="number" dataKey={config.dataKeys[0]?.key} name={config.dataKeys[0]?.label} stroke={textStroke} fontSize={12} />
            {config.dataKeys.length > 1 && (
              <ZAxis type="number" dataKey={config.dataKeys[1].key} range={[20, 400]} name={config.dataKeys[1].label} />
            )}
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
            <Scatter name={config.title} data={data} fill={colors[0]} opacity={0.7} />
          </ScatterChart>
        );

      case "sankey":
        return (
          <Sankey
            {...commonProps}
            data={data as unknown as React.ComponentProps<typeof Sankey>["data"]}
            nodePadding={50}
            link={{ stroke: isDark ? "#444" : "#ccc" }}
          >
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
          </Sankey>
        );

      case "heatmap": {
        let maxVal = 0;
        data.forEach(d => {
          config.dataKeys.forEach(dk => {
            const v = Number(d[dk.key]) || 0;
            if (v > maxVal) maxVal = v;
          });
        });

        const HeatmapGrid = (props: React.HTMLAttributes<HTMLDivElement> & { width?: number; height?: number }) => {
          const width = props.width || 800;
          const height = props.height || 400;
          const margin = { top: 30, right: 30, left: 100, bottom: 40 };
          const innerWidth = width - margin.left - margin.right;
          const innerHeight = height - margin.top - margin.bottom;
          
          const rowHeight = Math.max(innerHeight / Math.max(data.length, 1), 20);
          const colWidth = Math.max(innerWidth / Math.max(config.dataKeys.length, 1), 40);

          const actualHeight = Math.max(height, rowHeight * data.length + margin.top + margin.bottom);

          return (
            <svg width={width} height={actualHeight} viewBox={`0 0 ${width} ${actualHeight}`} className="overflow-visible">
              <g transform={`translate(${margin.left},${margin.top})`}>
                {/* Columns (X-Axis) */}
                {config.dataKeys.map((dk, i) => (
                  <text
                    key={`col-${i}`}
                    x={i * colWidth + colWidth / 2}
                    y={-10}
                    textAnchor="middle"
                    fill={textStroke}
                    fontSize={11}
                    fontWeight="semibold"
                  >
                    {dk.label.length > 15 ? dk.label.substring(0, 15) + "..." : dk.label}
                  </text>
                ))}

                {/* Rows (Y-Axis) */}
                {data.map((row, i) => (
                  <text
                    key={`row-${i}`}
                    x={-15}
                    y={i * rowHeight + rowHeight / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    fill={textStroke}
                    fontSize={11}
                  >
                    {String(row[config.xAxis]).length > 15 
                      ? String(row[config.xAxis]).substring(0, 15) + "..." 
                      : String(row[config.xAxis])}
                  </text>
                ))}

                {/* Cells */}
                {data.map((row, i) =>
                  config.dataKeys.map((dk, j) => {
                    const val = Number(row[dk.key]) || 0;
                    const opacity = maxVal > 0 ? (val / maxVal) * 0.8 + 0.2 : 0;
                    return (
                      <g key={`cell-${i}-${j}`}>
                        <rect
                          x={j * colWidth}
                          y={i * rowHeight}
                          width={colWidth - 2}
                          height={rowHeight - 2}
                          fill={dk.color || colors[0]}
                          fillOpacity={opacity}
                          rx={4}
                          className="transition-all hover:opacity-80 cursor-pointer"
                        >
                          <title>{`${String(row[config.xAxis])} - ${dk.label}: ${val}`}</title>
                        </rect>
                        {colWidth > 40 && rowHeight > 20 && (
                          <text
                            x={j * colWidth + colWidth / 2}
                            y={i * rowHeight + rowHeight / 2}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={isDark && opacity > 0.5 ? "#fff" : (!isDark && opacity > 0.5 ? "#fff" : textStroke)}
                            fontSize={10}
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {val}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}
              </g>
            </svg>
          );
        };

        return (
          <ResponsiveContainer width="100%" height="100%">
            <HeatmapGrid />
          </ResponsiveContainer>
        );
      }

      default:
        // Graceful fallback to Bar chart for unsupported advanced types
        return (
          <BarChart {...commonProps} layout={config.options?.horizontal ? "vertical" : "horizontal"}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis 
              dataKey={config.xAxis} 
              type={config.options?.horizontal ? "number" : "category"}
              stroke={textStroke} 
              fontSize={12} 
            />
            <YAxis 
              type={config.options?.horizontal ? "category" : "number"}
              stroke={textStroke} 
              fontSize={12} 
            />
            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px" }} />
            <Legend />
            {config.dataKeys.map((dk, i) => (
              <Bar 
                key={dk.key} 
                dataKey={dk.key} 
                name={dk.label} 
                fill={dk.color || colors[i % colors.length]} 
                radius={config.options?.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
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
      <div className="relative rounded-2xl border border-border bg-background/50 dark:bg-void/50 backdrop-blur-xl overflow-hidden p-4 sm:p-8 shadow-2xl">
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
          
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence>
              <motion.div className="flex flex-wrap items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border"
                  onClick={handleExportCSV}
                  title="Export data as CSV"
                >
                  <FileText className="w-4 h-4" /> <span className="hidden sm:inline">CSV</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border"
                  onClick={handleExportSVG}
                  title="Export chart as SVG"
                >
                  <FileCode className="w-4 h-4" /> <span className="hidden sm:inline">SVG</span>
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

        {/* Render Warning if fallback occurred */}
        {!["bar", "line", "area", "pie", "scatter", "radar", "treemap", "funnel", "radialBar", "composed", "bubble", "sankey", "heatmap"].includes(config.type) && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
             <AlertTriangle className="w-5 h-5 text-amber-500" />
             <p className="text-sm text-amber-600 dark:text-amber-400">
               Advanced chart type <strong className="font-bold">&quot;{config.type}&quot;</strong> is not natively supported yet. Displaying as a fallback Bar Chart so you can still view the data.
             </p>
          </div>
        )}

        {/* Chart Container */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted rounded-xl">
          <div 
            className="w-full min-w-[700px] aspect-[16/9] min-h-[400px] relative pr-6" 
            ref={chartRef}
          >
            <ChartErrorBoundary onReset={onReset}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </ChartErrorBoundary>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/50">
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
