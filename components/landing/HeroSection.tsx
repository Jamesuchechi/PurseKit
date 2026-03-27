"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, PlayCircle, Code, Zap, Star, Check } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <motion.div 
        style={{ opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 dark:bg-accent/10 backdrop-blur-sm mb-8"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-sm font-bold text-accent">AI-Native Workspace</span>
          </div>
          <div className="w-px h-4 bg-accent/30" />
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber fill-amber" />
            <span className="text-xs font-medium text-muted">100+ Early Adopters</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-6"
        >
          <span className="block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            The AI workspace
          </span>
          <span className="block mt-2">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-accent via-violet to-amber blur-2xl opacity-50" />
              <span className="relative bg-gradient-to-r from-accent via-violet to-amber bg-clip-text text-transparent">
                built for builders
              </span>
            </span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed mb-10 font-medium"
        >
          An elite suite of AI-native tools — code intelligence, spec generation, and data visualization —
          <span className="text-foreground font-semibold"> reimagined for speed, privacy, and architectural excellence</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-bold text-base shadow-2xl shadow-accent/30 hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <div className="flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5" />
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-border hover:border-accent/50 bg-background/50 dark:bg-void/50 hover:bg-muted/50 backdrop-blur-sm text-foreground font-bold text-base transition-all hover:scale-105 active:scale-95">
            <PlayCircle className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Free tier available</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Open source core</span>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative max-w-6xl mx-auto"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent blur-3xl" />
          
          {/* Screenshot Placeholder */}
          <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 dark:from-void/80 dark:to-void/50 backdrop-blur-sm p-8">
              {/* Fake Terminal/IDE */}
              <div className="bg-background dark:bg-void rounded-xl border border-border shadow-xl overflow-hidden h-full">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 dark:bg-void/50 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-mono text-muted">PulseKit Workspace</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 font-mono text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-accent" />
                    <span className="text-muted">$ pulsekit analyze code.tsx</span>
                  </div>
                  <div className="pl-6 text-green-500">✓ Analysis complete in 1.2s</div>
                  <div className="pl-6 space-y-1">
                    <div className="text-muted">• Detected 3 optimization opportunities</div>
                    <div className="text-muted">• Complexity score: 7/10</div>
                    <div className="text-muted">• Generated refactor suggestions</div>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Zap className="w-4 h-4 text-amber animate-pulse" />
                    <span className="text-amber">AI-powered insights ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -left-8 hidden lg:block"
          >
            <div className="px-4 py-3 rounded-xl bg-background dark:bg-void border border-border shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <Code className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Code Analysis</div>
                  <div className="text-xs text-muted">Real-time AI insights</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-8 -right-8 hidden lg:block"
          >
            <div className="px-4 py-3 rounded-xl bg-background dark:bg-void border border-border shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-violet/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Zero Config</div>
                  <div className="text-xs text-muted">Works in your browser</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}