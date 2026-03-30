"use client";

import * as React from "react";
import { Target, Rocket, Heart, Zap, Globe, Cpu, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function AboutContent() {
  const milestones = [
    { year: "2024", event: "PulseKit founded with a vision for AI-native engineering." },
    { year: "2025", event: "Reached 10,000 monthly active engineers and launched DevLens." },
    { year: "2026", event: "Global expansion and release of SpecForge and ChartGPT." },
  ];

  const values = [
    {
      title: "First Principles Thinking",
      icon: Target,
      content: "We don't solve symptoms. We find the root cause and build beautiful, enduring solutions from the ground up."
    },
    {
      title: "Radical Transparency",
      icon: Heart,
      content: "Openness is our default. We share our challenges and our wins, fostering trust within our team and our community."
    },
    {
      title: "Engineering Excellence",
      icon: Cpu,
      content: "We are builders first. Every line of code and every UI pixel is crafted with an obsession for performance and quality."
    },
    {
      title: "Speed as a Feature",
      icon: Zap,
      content: "We believe in rapid iteration. Shipping fast allows us to learn from our users and build the future, today."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mb-24 text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4">
          <Rocket className="w-3.5 h-3.5" />
          Our Journey
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-foreground leading-[1.1]">
          Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Future</span> of Engineering
        </h1>
        <p className="text-muted text-xl font-medium leading-relaxed">
          PulseKit is an AI-native workspace designed to augment the workflow of engineers and data scientists. We&apos;re on a mission to automate the tedious so builders can focus on the extraordinary.
        </p>
      </motion.div>

      {/* Philosophy Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
        <div className="space-y-8">
           <h2 className="text-4xl font-bold text-foreground">Our Philosophy</h2>
           <p className="text-lg text-muted-foreground leading-relaxed">
             In an era of generic AI wrappers, we decided to take a different path. We believe AI shouldn&apos;t just be an &quot;add-on&quot; &mdash; it should be at the core of the toolset. 
           </p>
           <p className="text-lg text-muted-foreground leading-relaxed">
             Everything we build at PulseKit starts with a single question: <span className="font-bold text-foreground italic">&quot;How would this work if AI was built into its foundation?&quot;</span> This approach led to our suite of tools like DevLens and SpecForge, changing how over 50,000 developers work every day.
           </p>
        </div>
        
        <div className="relative group">
           <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full group-hover:bg-orange-500/30 transition-all duration-700"></div>
           <div className="relative bg-void/50 border border-border/50 backdrop-blur-3xl rounded-[3rem] p-10 space-y-8 shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              <div className="grid grid-cols-2 gap-4">
                 {milestones.map((m) => (
                    <div key={m.year} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                       <div className="text-xs font-black text-orange-500 mb-1">{m.year}</div>
                       <div className="text-sm font-bold text-foreground leading-tight">{m.event}</div>
                    </div>
                 ))}
                 <div className="bg-orange-500 p-4 rounded-2xl flex items-center justify-center text-white">
                    <Globe className="w-8 h-8 animate-pulse" />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-orange-500" />
                 </div>
                 <div className="flex justify-between text-[10px] font-black uppercase text-muted tracking-widest">
                    <span>Alpha</span>
                    <span>Growth</span>
                    <span>Scale</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mb-32">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">The PulseKit Way</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2rem] bg-muted/20 border border-border/50 flex flex-col items-center text-center space-y-6 hover:bg-muted/30 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <v.icon className="w-8 h-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent border border-orange-500/20 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150">
           <Zap className="w-64 h-64 text-orange-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-8">
           <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
             Wanna build the future with us?
           </h3>
           <p className="text-lg text-muted font-medium">
             We&apos;re a distributed team of engineers, designers, and dreamers. If you are obsessed with quality and have a &quot;bias towards action,&quot; we&apos;d love to chat.
           </p>
           <div className="flex flex-col sm:flex-row items-center gap-6">
             <Link href="/careers" className="px-10 py-4 rounded-2xl bg-orange-600 text-white font-bold shadow-xl shadow-orange-600/20 hover:scale-105 transition-all">
               Join the Team
             </Link>
             <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Coffee className="w-5 h-5" />
                <span>We handle the coffee.</span>
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
