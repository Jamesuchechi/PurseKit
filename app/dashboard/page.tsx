"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  FileText, 
  BarChart3, 
  ArrowRight, 
  Zap, 
  Clock, 
  TrendingUp, 
  Shield, 
  Sparkles,
  LayoutDashboard,
  Settings,
  Bell
} from "lucide-react";

const modules = [
  {
    id: "devlens",
    name: "DevLens",
    description: "AI Code Intelligence & Analysis",
    icon: Brain,
    href: "/devlens",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
    stats: "12 Analyses",
    status: "Ready",
  },
  {
    id: "specforge",
    name: "SpecForge",
    description: "Automated PRD & Spec Generation",
    icon: FileText,
    href: "/specforge",
    color: "amber",
    gradient: "from-amber/20 to-amber/5",
    stats: "5 Specs",
    status: "Updated",
  },
  {
    id: "chartgpt",
    name: "ChartGPT",
    description: "Natural Language Data Visualization",
    icon: BarChart3,
    href: "/chartgpt",
    color: "violet",
    gradient: "from-violet/20 to-violet/5",
    stats: "8 Charts",
    status: "Ready",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-bg">
      {/* Dashboard Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest mb-2">
              <LayoutDashboard className="w-4 h-4" />
              PulseKit Workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
              Welcome back, <span className="gradient-text-accent">Builder</span>
            </h1>
            <p className="mt-2 text-muted max-w-lg font-medium">
              Your AI-native workspace is synchronized and ready for the next sprint.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <button className="p-3 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-all">
              <Bell className="w-5 h-5 text-muted" />
            </button>
            <button className="p-3 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-all">
              <Settings className="w-5 h-5 text-muted" />
            </button>
          </motion.div>
        </header>

        {/* Global Stats Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Sessions", value: "48", icon: Zap, color: "accent" },
            { label: "Tokens Used", value: "128k", icon: TrendingUp, color: "violet" },
            { label: "Docs Generated", value: "24", icon: FileText, color: "amber" },
            { label: "Privacy Status", value: "Secure", icon: Shield, color: "green-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl group hover:border-accent/30 transition-all cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-${stat.color === 'green-500' ? 'green-500' : stat.color}/10 border border-${stat.color === 'green-500' ? 'green-500' : stat.color}/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color === 'green-500' ? 'green-500' : stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Module Pulse Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-foreground">Active Modules</h2>
            <div className="h-px flex-1 mx-6 bg-border/50 hidden md:block" />
            <button className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {modules.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group relative"
              >
                <Link href={module.href}>
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${module.gradient} rounded-3xl blur-xl 
                    group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100
                  `} />
                  <div className="relative glass-card p-8 rounded-3xl h-full flex flex-col justify-between overflow-hidden group-hover:border-accent/30 transition-all">
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className={`p-4 rounded-2xl bg-${module.color}/10 border border-${module.color}/20 text-${module.color}`}>
                          <module.icon className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">{module.status}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {module.name}
                      </h3>
                      <p className="text-muted text-sm font-medium leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span className="text-xs font-bold text-muted">{module.stats}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Activity & Quick Start */}
        <section className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-bold">Recent Pipeline</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: "Authentication Flow PRD", time: "2h ago", type: "SpecForge" },
                { title: "Bug Analysis: AuthProvider.tsx", time: "5h ago", type: "DevLens" },
                { title: "Sales Performance Chart", time: "Yesterday", type: "ChartGPT" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{item.title}</div>
                      <div className="text-[10px] text-muted font-bold uppercase mt-0.5">{item.type}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative rounded-3xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-violet/20 to-amber/20 opacity-50" />
            <div className="relative glass-card p-10 h-full flex flex-col justify-center items-center text-center">
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">AI Integration Ready</h3>
              <p className="text-muted text-sm font-medium mb-8 max-w-xs mx-auto">
                Connect your workspace directly to Claude/Anthropic for full power.
              </p>
              <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-white font-bold text-sm shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                Connect API Key
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
