"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Brain, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  Filter,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  ActivityAreaChart,
  ModuleDonutChart, 
  AnalyticsStatCard 
} from "@/components/analytics/AnalyticsCharts";
import { type HistoryItem } from "@/types";
import { Button } from "@/components/ui/Button";

interface ActivityPoint {
  date: string;
  total: number;
  devlens: number;
  specforge: number;
  chartgpt: number;
}

interface DistributionPoint {
  name: string;
  value: number;
}

interface AnalyticsStats {
  total: number;
  savedHours: string;
  peakDay: string;
  efficiency: string;
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<{
    activity: ActivityPoint[];
    distribution: DistributionPoint[];
    stats: AnalyticsStats;
    recent: HistoryItem[];
  } | null>(null);

  const [timeRange, setTimeRange] = React.useState("14d");
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    const loadAndProcess = () => {
      const modules = ["devlens", "specforge", "chartgpt"];
      let allItems: HistoryItem[] = [];

      modules.forEach(m => {
        const stored = localStorage.getItem(`pulsekit_history_${m}`);
        if (stored) {
          try {
            allItems = [...allItems, ...JSON.parse(stored)];
          } catch (err) {
            console.error(err);
          }
        }
      });

      // Sort by date
      allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // ─── 1. Distribution ──────────────────────────────────────
      const distribution = [
        { name: "DevLens", value: allItems.filter(i => i.module === "devlens").length },
        { name: "SpecForge", value: allItems.filter(i => i.module === "specforge").length },
        { name: "ChartGPT", value: allItems.filter(i => i.module === "chartgpt").length },
      ].filter(d => d.value > 0);

      // ─── 2. Activity (Last 14 Days) ───────────────────────────
      const activityMap: Record<string, ActivityPoint> = {};
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        activityMap[dateStr] = { date: dateStr, total: 0, devlens: 0, specforge: 0, chartgpt: 0 };
      }

      allItems.forEach(item => {
        const d = new Date(item.createdAt);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (activityMap[dateStr]) {
          activityMap[dateStr].total += 1;
          activityMap[dateStr][item.module] += 1;
        }
      });

      const activity = Object.values(activityMap);

      // ─── 3. Stats ─────────────────────────────────────────────

      setData({
        activity,
        distribution,
        recent: allItems.slice(0, 10),
        stats: {
          total: allItems.length,
          savedHours: (allItems.length * 0.45).toFixed(1), // Estimate 27 mins per operation
          peakDay: activity.reduce((max, curr) => curr.total > max.total ? curr : max, activity[0]).date,
          efficiency: allItems.length > 0 ? "98.4%" : "0%"
        }
      });
    };

    loadAndProcess();
  }, [timeRange]);

  if (!data) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-bg">
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-widest mb-2">
              <TrendingUp className="w-4 h-4" />
              Intelligence Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
              Workspace <span className="gradient-text-emerald">Analytics</span>
            </h1>
            <p className="mt-2 text-muted max-w-lg font-medium">
              Real-time insights on your engineering velocity and module activity.
            </p>
          </motion.div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
            {["7d", "14d", "30d", "All Time"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${timeRange === r ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-muted hover:text-foreground hover:bg-muted/50"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* Top Level Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsStatCard 
            label="Total Operations" 
            value={data.stats.total} 
            description="Across all modules"
            icon={Zap}
            trend={{ value: "+12%", positive: true }}
            color="emerald-500"
          />
          <AnalyticsStatCard 
            label="Time Saved (Est)" 
            value={`${data.stats.savedHours}h`} 
            description="Manual effort avoided"
            icon={Clock}
            color="amber"
          />
          <AnalyticsStatCard 
            label="Workspace peak" 
            value={data.stats.peakDay} 
            description="Highest activity day" 
            icon={Sparkles}
            color="violet"
          />
          <AnalyticsStatCard 
            label="Operation Success" 
            value={data.stats.efficiency} 
            description="AI throughput rating" 
            icon={TrendingUp}
            color="accent"
          />
        </section>

        {/* Charts & Distribution */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-8 rounded-[32px] border border-border/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Activity Pulse</h3>
                <p className="text-xs text-muted-foreground">Rolling {timeRange} operations trend</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Ops</div>
              </div>
            </div>
            <ActivityAreaChart data={data.activity} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[32px] border border-border/50"
          >
            <div className="space-y-1 mb-8">
              <h3 className="text-xl font-bold">Module Breakdown</h3>
              <p className="text-xs text-muted-foreground">Distribution of AI generations</p>
            </div>
            <ModuleDonutChart data={data.distribution} />
            <div className="mt-8 space-y-3">
              {data.distribution.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#06b6d4", "#f59e0b", "#8b5cf6"][i] }} />
                    <span className="text-xs font-bold">{d.name}</span>
                  </div>
                  <span className="text-xs text-muted tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Global Activity Feed */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-[32px] border border-border/50"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <h3 className="text-xl font-bold">Audit Trail</h3>
                  <p className="text-xs text-muted-foreground">Latest workspace operations</p>
               </div>
               <button className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all border border-border/50">
                  <Filter className="w-4 h-4 text-muted" />
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted">Operation</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">Module</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted">Created At</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">Reference ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {data.recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-muted text-sm italic">
                         No operations recorded in your workspace yet.
                      </td>
                    </tr>
                  ) : (
                    (isExpanded ? data.recent : data.recent.slice(0, 4)).map((item) => (
                      <tr key={item.id} className="group hover:bg-muted/20 transition-all">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-background border border-border group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
                              {item.module === "devlens" ? <Brain className="w-4 h-4 text-accent" /> : item.module === "specforge" ? <FileText className="w-4 h-4 text-amber" /> : <BarChart3 className="w-4 h-4 text-violet" /> }
                            </div>
                            <span className="text-sm font-bold text-foreground">
                              {item.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${
                            item.module === "devlens" ? "bg-accent/10 text-accent border-accent/20" : 
                            item.module === "specforge" ? "bg-amber/10 text-amber border-amber/20" : 
                            "bg-violet/10 text-violet border-violet/20"
                          }`}>
                            {item.module}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-muted tabular-nums">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-muted tabular-nums uppercase">
                            {item.id.substring(0, 8)} <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data.recent.length > 4 && (
              <div className="mt-8 flex justify-center border-t border-border/30 pt-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-emerald-500 hover:bg-emerald-500/5 gap-2 h-10 px-6"
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", isExpanded && "rotate-180")} />
                  {isExpanded ? "Show Less" : `Show More (${data.recent.length - 5} others)`}
                </Button>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
