"use client";

import * as React from "react";
import { 
  Book, Search, ChevronRight, Terminal, 
  Cpu, Layers, Zap,
  ArrowRight, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const docSections = [
  {
    title: "Getting Started",
    icon: Zap,
    items: ["Introduction", "Quickstart Guide", "Core Concepts", "Installation"]
  },
  {
    title: "Platform Features",
    icon: Layers,
    items: ["AI Code Analysis", "Workspace Settings", "Collaboration", "Integrations"]
  },
  {
    title: "Advanced Guides",
    icon: Cpu,
    items: ["Custom AI Models", "API Automation", "Data Security", "Performance Tuning"]
  }
];

export function DocsContent() {
  const { getAdaptiveHref } = useAdaptiveLink();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sidebar Nav */}
        <aside className="lg:w-64 shrink-0 space-y-12">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-center gap-3 group">
             <Search className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
             <input 
               type="text" 
               placeholder="Search docs..." 
               className="bg-transparent border-none text-sm font-bold focus:ring-0 placeholder:text-muted/60 w-full"
             />
          </div>

          <nav className="space-y-12">
             {docSections.map((section) => (
               <div key={section.title} className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                     <section.icon className="w-4 h-4 text-muted" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{section.title}</h3>
                  </div>
                  <div className="space-y-1">
                     {section.items.map((item) => (
                       <button 
                         key={item}
                         className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-foreground hover:bg-muted/50 transition-all flex items-center justify-between group"
                       >
                         {item}
                         <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </button>
                     ))}
                  </div>
               </div>
             ))}
          </nav>
          
          <div className="pt-12 border-t border-border/50 space-y-6">
             <Link 
               href={getAdaptiveHref("/api-docs")}
               className="flex items-center gap-3 px-4 text-sm font-black text-muted hover:text-foreground transition-colors"
             >
                <Terminal className="w-4 h-4" />
                API Reference
             </Link>
             <Link 
               href={getAdaptiveHref("/community")}
               className="flex items-center gap-3 px-4 text-sm font-black text-muted hover:text-foreground transition-colors"
             >
                <MessageCircle className="w-4 h-4" />
                Community
             </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                <Book className="w-3 h-3" />
                Documentation Root
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-foreground">
                Technical Blueprint.
             </h1>
             <p className="text-xl text-muted font-medium leading-relaxed">
                Everything you need to master AI-native engineering with PulseKit. From basic setup to advanced model fine-tuning.
             </p>
             
             <div className="grid sm:grid-cols-2 gap-6 pt-12">
                <Link 
                  href="#introduction" 
                  className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/20 group hover:scale-[1.02] transition-all shadow-2xl shadow-blue-500/20"
                >
                   <Zap className="w-8 h-8 text-white mb-6 group-hover:rotate-12 transition-transform" />
                   <h3 className="text-xl font-bold text-white mb-2">Introduction</h3>
                   <p className="text-sm text-blue-50/80 font-medium leading-relaxed">Fundamental concepts and vision of the PulseKit ecosystem.</p>
                </Link>
                
                <Link 
                  href="#quickstart" 
                  className="p-8 rounded-[2.5rem] bg-muted/20 border border-border group hover:bg-muted/30 hover:scale-[1.02] transition-all"
                >
                   <Terminal className="w-8 h-8 text-foreground mb-6 group-hover:translate-x-1 transition-transform" />
                   <h3 className="text-xl font-bold text-foreground mb-2">Quickstart</h3>
                   <p className="text-sm text-muted font-medium leading-relaxed">Get up and running with our core tools in under 5 minutes.</p>
                </Link>
             </div>

             {/* Placeholder for dynamic content */}
             <div className="pt-24 space-y-16">
                <section id="introduction" className="space-y-6">
                   <h2 className="text-3xl font-bold text-foreground">What is PulseKit?</h2>
                   <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-4">
                      <p>
                        PulseKit isn&apos;t just a collection of AI tools; it&apos;s a unified workspace that bridges the gap between raw data and actionable engineering intelligence.
                      </p>
                      <p>
                        Our mission is to reduce cognitive load by automating repetitive tasks, allowing you to focus on high-impact architectural decisions.
                      </p>
                   </div>
                </section>

                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-void to-muted/20 border border-border flex items-center justify-between shadow-2xl">
                   <div className="space-y-2">
                      <h4 className="text-lg font-bold text-foreground">Looking for API details?</h4>
                      <p className="text-sm text-muted font-medium">Explore our comprehensive REST and GraphQL API docs.</p>
                   </div>
                   <Link 
                     href={getAdaptiveHref("/api-docs")}
                     className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-all"
                   >
                      <ArrowRight className="w-6 h-6" />
                   </Link>
                </div>
             </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
