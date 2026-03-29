"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS = ["#06b6d4", "#f59e0b", "#8b5cf6", "#10b981", "#ec4899"];

interface ActivityData {
  date: string;
  total: number;
  devlens: number;
  specforge: number;
  chartgpt: number;
}

interface DistributionData {
  name: string;
  value: number;
}

// ─── Activity Chart ───────────────────────────────────────────

export function ActivityAreaChart({ data }: { data: ActivityData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#666", fontSize: 10 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#666", fontSize: 10 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#111", 
              border: "1px solid #333", 
              borderRadius: "12px",
              fontSize: "12px"
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#colorTotal)"
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Module Distribution Chart ──────────────────────────────

export function ModuleDonutChart({ data }: { data: DistributionData[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#111", 
              border: "1px solid #333", 
              borderRadius: "12px",
              fontSize: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: string;
}

export function AnalyticsStatCard({ label, value, description, icon: Icon, trend, color = "accent" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-accent/30 transition-all border border-border/50"
    >
      <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity bg-" + color)} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border", "bg-" + color + "/10 border-" + color + "/20 text-" + color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-3xl font-black tracking-tight text-foreground">{value}</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-2">{description}</p>
      </div>
    </motion.div>
  );
}
