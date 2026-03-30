"use client";

import * as React from "react";
import { 
  Target, Heart, Zap, Globe, Cpu, 
  Sparkles, Code2, ShieldCheck, 
  Users2, ArrowRight, Github, Twitter
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

export function AboutContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  const milestones = [
    { 
      year: "2024", 
      title: "The Genesis",
      event: "PulseKit founded in a small London apartment with a singular mission: to make AI a first-class citizen in the developer workspace.",
      icon: Sparkles,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    { 
      year: "2025", 
      title: "DevLens Launch",
      event: "Released our flagship code intelligence engine. Reached 10k monthly active engineers in just 3 months.",
      icon: Code2,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      year: "2026", 
      title: "The Suite Expansion",
      event: "Successfully launched SpecForge and ChartGPT, completing the initial vision of a unified AI-native workbench.",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
  ];

  const values = [
    {
      title: "First Principles",
      icon: Target,
      content: "We strip away the noise and solve for what truly matters. We build tools that handle complexity, not just hide it.",
      gradient: "from-orange-500/20 to-transparent"
    },
    {
      title: "Radical Openness",
      icon: Heart,
      content: "Transparency isn't a policy; it's our identity. We're open about our stack, our failures, and our roadmap.",
      gradient: "from-rose-500/20 to-transparent"
    },
    {
      title: "Elite Engineering",
      icon: Cpu,
      content: "We're obsessed with the craft. From latency to UI fluidity, every millisecond and pixel is deliberate.",
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      title: "Bias for Action",
      icon: Zap,
      content: "We value 'shipped' over 'perfect'. Rapid iteration is how we learn, evolve, and stay ahead of the curve.",
      gradient: "from-amber-500/20 to-transparent"
    }
  ];

  return (
    <div ref={containerRef} className="relative pb-24">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-orange-500/10 to-transparent blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative pt-20 pb-32 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void/50 border border-border/50 backdrop-blur-xl mb-8 shadow-2xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted">A New Era Begins</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-foreground leading-[0.9] mb-8">
            The architect&apos;s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-orange-600">
              AI workbench.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            PulseKit is a distributed collective of engineers building a first-principles workspace for the next generation of builders.
          </p>
        </motion.div>

        {/* Narrative Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
             style={{ opacity, scale }}
             className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-foreground">Our Philosophy</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
              <p>
                In an era dominated by generic wrappers, we chose to build from the ground up. We believe AI shouldn&apos;t just be a feature—it should be the <span className="text-foreground font-bold">substrate</span> of the modern IDE.
              </p>
              <p>
                Everything we ship starts with a single question: <span className="italic text-foreground">&quot;How would this work if intelligence was a native property?&quot;</span> This rigor is why 50,000+ elite engineers trust PulseKit every single day.
              </p>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
               <a href="https://github.com" className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                  GitHub Root
               </a>
               <a href="https://twitter.com" className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                  Engineering Log
               </a>
            </div>
          </motion.div>

          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 blur-[100px] rounded-full" />
             <div className="relative space-y-4">
                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="group"
                  >
                    <div className="p-6 rounded-[2rem] bg-void/40 border border-border/50 backdrop-blur-2xl hover:border-orange-500/30 transition-all duration-500 flex gap-6 items-start">
                       <div className={`shrink-0 w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                          <m.icon className={`w-6 h-6 ${m.color}`} />
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <span className={`text-xs font-black uppercase tracking-widest ${m.color}`}>{m.year}</span>
                             <h3 className="font-bold text-foreground">{m.title}</h3>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">{m.event}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-40">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-foreground">The PulseKit Way</h2>
              <p className="text-muted font-medium">Immutable principles that guide every commit.</p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, idx) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                  <div className="relative h-full p-8 rounded-[2.5rem] bg-muted/20 border border-border/50 backdrop-blur-sm flex flex-col items-center text-center space-y-6 hover:bg-muted/40 transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-void/50 border border-border/50 flex items-center justify-center shadow-inner">
                      <v.icon className="w-8 h-8 text-foreground group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                       <p className="text-sm text-muted leading-relaxed font-medium">{v.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[4rem] bg-gradient-to-br from-void to-muted/20 border border-border p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 space-y-12 max-w-3xl mx-auto">
             <div className="space-y-6">
                <h3 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                   Join the distributed <br />
                   <span className="text-orange-500 italic">revolution.</span>
                </h3>
                <p className="text-xl text-muted font-medium leading-relaxed">
                   We&apos;re looking for obsessive builders who care more about quality than trends. 
                   If that&apos;s you, let&apos;s talk.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                   href={getAdaptiveHref("/careers")} 
                   className="group px-10 py-5 rounded-[2rem] bg-orange-600 text-white font-bold text-lg shadow-2xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                   View Roles
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-muted font-bold font-mono text-sm uppercase tracking-widest">
                   <Users2 className="w-4 h-4" />
                   <span>24/100 Seats Filled</span>
                </div>
             </div>
          </div>
          
          {/* Decorative icons */}
          <div className="absolute top-12 left-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
             <Code2 className="w-48 h-48" />
          </div>
          <div className="absolute bottom-12 right-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
             <Globe className="w-48 h-48" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
