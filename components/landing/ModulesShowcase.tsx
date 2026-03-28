"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Brain, FileText, BarChart3, ArrowRight, Check, Sparkles } from "lucide-react";

const modules = [
  {
    id: "devlens",
    icon: Brain,
    name: "DevLens",
    tagline: "Code Intelligence",
    description: "Paste any code and get instant AI-powered analysis with bug detection, complexity breakdown, and refactor suggestions.",
    color: "accent",
    gradient: "from-accent to-accent/80",
    bgGradient: "from-accent/10 to-transparent",
    features: [
      "Real-time bug detection",
      "Complexity analysis & scoring",
      "AI-powered refactor suggestions",
      "Multi-language support",
      "Security vulnerability scanning",
      "Performance optimization tips",
    ],
    href: "/devlens",
  },
  {
    id: "specforge",
    icon: FileText,
    name: "SpecForge",
    tagline: "PRD Generator",
    description: "Transform rough feature ideas into comprehensive Product Requirements Documents with user stories, acceptance criteria, and technical specs.",
    color: "amber",
    gradient: "from-amber to-amber/80",
    bgGradient: "from-amber/10 to-transparent",
    features: [
      "Automated user story generation",
      "Detailed acceptance criteria",
      "Edge case identification",
      "Data schema suggestions",
      "API endpoint planning",
      "Export to Markdown",
    ],
    href: "/specforge",
  },
  {
    id: "chartgpt",
    icon: BarChart3,
    name: "ChartGPT",
    tagline: "Data Visualizer",
    description: "Upload CSV data and describe your visualization in plain English. AI interprets your intent and renders the perfect chart.",
    color: "violet",
    gradient: "from-violet to-violet/80",
    bgGradient: "from-violet/10 to-transparent",
    features: [
      "Natural language queries",
      "Multiple chart types",
      "Automatic data inference",
      "CSV & JSON support",
      "Interactive visualizations",
      "Export-ready outputs",
    ],
    href: "/chartgpt",
  },
];

export default function ModulesShowcase() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const active = modules.find((m) => m.id === activeModule)!;
  const Icon = active.icon;

  return (
    <section className="relative py-32 bg-muted/20 dark:bg-void/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet/30 bg-violet/5 dark:bg-violet/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-violet" />
            <span className="text-sm font-bold text-violet">Three Powerful Modules</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Complete AI Workspace
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Three specialized tools, one seamless experience. Switch between code analysis, spec generation, and data visualization instantly.
          </p>
        </motion.div>

        {/* Module Tabs */}
        <div className="flex flex-col lg:flex-row gap-4 mb-12 justify-center">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <motion.button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`
                  relative group flex items-center gap-4 p-6 rounded-2xl border transition-all
                  ${isActive
                    ? `border-${module.color}/50 bg-gradient-to-br ${module.bgGradient} shadow-lg`
                    : "border-border bg-background/50 dark:bg-void/50 hover:border-border/80"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} border border-${module.color}/50 rounded-2xl`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${module.bgGradient} border border-${module.color}/20`}>
                    <ModuleIcon className={`w-6 h-6 text-${module.color}`} />
                  </div>
                  
                  <div className="text-left">
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isActive ? `text-${module.color}` : "text-muted"}`}>
                      {module.tagline}
                    </div>
                    <div className={`text-lg font-bold ${isActive ? "text-foreground" : "text-muted"}`}>
                      {module.name}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Details */}
            <div>
              <div className={`inline-flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-br ${active.bgGradient} border border-${active.color}/20`}>
                <Icon className={`w-8 h-8 text-${active.color}`} />
                <div>
                  <div className="text-sm font-bold text-foreground">{active.name}</div>
                  <div className={`text-xs text-${active.color}`}>{active.tagline}</div>
                </div>
              </div>

              <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                {active.description}
              </h3>

              <ul className="space-y-3 mb-8">
                {active.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${active.color}/20 flex items-center justify-center`}>
                      <Check className={`w-3 h-3 text-${active.color}`} />
                    </div>
                    <span className="text-muted">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link
                href={active.href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${active.gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}
              >
                Try {active.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${active.bgGradient} blur-3xl opacity-50`} />
              
              <div className="relative rounded-2xl overflow-hidden border border-border bg-background dark:bg-void shadow-2xl">
                {/* Fake Window */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 dark:bg-void/50 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-xs font-mono text-muted">
                    {active.name} Workspace
                  </div>
                </div>

                {/* Content Area */}
                <div className="aspect-video bg-gradient-to-br from-muted/20 to-transparent p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Icon className={`w-20 h-20 text-${active.color} mx-auto mb-4 opacity-50`} />
                    <p className="text-muted text-sm">Interactive demo coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}