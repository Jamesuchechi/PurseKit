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
import * as React from "react";
import { getCookie, formatTimeAgo } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";
import { useNotifications } from "@/hooks/useNotifications";
import { type HistoryItem } from "@/types";
import { Button } from "@/components/ui/Button";

const MODULE_DEFS = [
  {
    id: "devlens",
    name: "DevLens",
    description: "AI Code Intelligence & Analysis",
    icon: Brain,
    href: "/devlens",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    id: "specforge",
    name: "SpecForge",
    description: "Automated PRD & Spec Generation",
    icon: FileText,
    href: "/specforge",
    color: "amber",
    gradient: "from-amber/20 to-amber/5",
  },
  {
    id: "chartgpt",
    name: "ChartGPT",
    description: "Natural Language Data Visualization",
    icon: BarChart3,
    href: "/chartgpt",
    color: "violet",
    gradient: "from-violet/20 to-violet/5",
  },
] as const;

export default function DashboardPage() {
  const [guestName, setGuestName] = React.useState("Builder");
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const { items: devHistory } = useHistory("devlens");
  const { items: specHistory } = useHistory("specforge");
  const { items: chartHistory } = useHistory("chartgpt");

  const [combinedHistory, setCombinedHistory] = React.useState<HistoryItem[]>([]);

  React.useEffect(() => {
    const name = getCookie("guest-name");
    if (name) setGuestName(name);

    const all = [...devHistory, ...specHistory, ...chartHistory]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    setCombinedHistory(all);
  }, [devHistory, specHistory, chartHistory]);

  const stats = [
    { label: "Analyses", value: devHistory.length, icon: Zap, color: "accent" },
    { label: "AI Visuals", value: chartHistory.length, icon: TrendingUp, color: "violet" },
    { label: "Specs", value: specHistory.length, icon: FileText, color: "amber" },
    { label: "Inbox", value: unreadCount, icon: Bell, color: "accent" },
  ];
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
              Welcome back, <span className="gradient-text-accent">{guestName}</span>
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
            <Link href="/notifications">
              <button className="p-3 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-all relative">
                <Bell className="w-5 h-5 text-muted" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link>
            <Link href="/settings">
              <button className="p-3 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-all">
                <Settings className="w-5 h-5 text-muted" />
              </button>
            </Link>
          </motion.div>
        </header>

        {/* Global Stats Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
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
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workspace</span>
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
            {MODULE_DEFS.map((module, i) => (
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
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
                            {module.id === 'devlens' ? (devHistory.length > 0 ? 'Active' : 'Ready') : 
                             module.id === 'specforge' ? (specHistory.length > 0 ? 'Updated' : 'Ready') : 
                             (chartHistory.length > 0 ? 'Ready' : 'Initial')}
                          </span>
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
                        <span className="text-xs font-bold text-muted">
                          {module.id === 'devlens' ? `${devHistory.length} Analyses` : 
                           module.id === 'specforge' ? `${specHistory.length} Specs` : 
                           `${chartHistory.length} Charts`}
                        </span>
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

        {/* Recent Activity & Workspace Insights */}
        <section className="grid lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-8 glass-card p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Recent Pipeline</h3>
              </div>
              {combinedHistory.length > 0 && (
                <Link href="/analytics" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">
                  View Analytics
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {combinedHistory.length > 0 ? (
                combinedHistory.map((item) => (
                  <Link key={item.id} href={`/${item.module}?id=${item.id}`}>
                    <div className="flex items-center justify-between p-5 rounded-3xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all cursor-pointer group hover:border-accent/20">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          item.module === 'devlens' ? 'bg-accent/10 text-accent' : 
                          item.module === 'specforge' ? 'bg-amber/10 text-amber' : 
                          'bg-violet/10 text-violet'
                        }`}>
                          {item.module === 'devlens' ? <Brain className="w-5 h-5" /> : 
                           item.module === 'specforge' ? <FileText className="w-5 h-5" /> : 
                           <BarChart3 className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate max-w-[200px] sm:max-w-md">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-muted font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
                             {item.module}
                             <span className="w-1 h-1 rounded-full bg-muted/50" />
                             {formatTimeAgo(item.createdAt)}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl">
                   <Zap className="w-8 h-8 text-muted mx-auto mb-4 opacity-50" />
                   <h4 className="text-base font-bold text-foreground mb-1">Your pipeline is empty</h4>
                   <p className="text-sm text-muted font-medium max-w-xs mx-auto">
                     Start your first analysis in DevLens or create a spec in SpecForge to see your activity here.
                   </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Insights/Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="glass-card p-8 rounded-3xl border-accent/20 bg-accent/[0.02] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:scale-125 transition-all" />
              <div className="relative z-10">
                <Sparkles className="w-8 h-8 text-accent mb-6" />
                <h3 className="text-lg font-bold mb-2">Ready for Scale?</h3>
                <p className="text-sm text-muted font-medium mb-6 leading-relaxed">
                  Connect your Anthropic or OpenAI API keys to unlock advanced reasoning and larger context windows.
                </p>
                <Link href="/settings">
                  <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                    Configure API Keys
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border-border/50">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-4">Workspace Tips</h4>
              <ul className="space-y-4">
                {[
                  { icon: Shield, text: "All your data stays local by default.", color: "text-green-500" },
                  { icon: Zap, text: "Use '/' for quick commands.", color: "text-amber" },
                  { icon: TrendingUp, text: "Export charts as high-res PNGs.", color: "text-violet" },
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-medium text-muted-foreground leading-snug">
                    <tip.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tip.color}`} />
                    {tip.text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
