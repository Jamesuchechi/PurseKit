"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Code, BarChart3, FileText } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-violet/5 to-amber/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet/20 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 dark:bg-accent/10 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent">Ready to Transform Your Workflow?</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-black mb-6 leading-[1.1]">
            <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Start Building with
            </span>
            <span className="block mt-2 bg-gradient-to-r from-accent via-violet to-amber bg-clip-text text-transparent">
              PulseKit Today
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto leading-relaxed mb-12">
            Join thousands of engineers and data scientists who&apos;ve accelerated their workflow with AI.
            <span className="block mt-2 text-foreground font-semibold">No credit card required. Start for free.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/devlens"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-bold text-lg shadow-2xl shadow-accent/30 hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className="w-6 h-6" />
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/pricing"
              className="px-10 py-5 rounded-2xl border-2 border-border hover:border-accent/50 bg-background/50 dark:bg-void/50 hover:bg-muted/50 backdrop-blur-sm text-foreground font-bold text-lg transition-all hover:scale-105 active:scale-95"
            >
              View Pricing
            </Link>
          </div>

          {/* Module Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Code, label: "DevLens", href: "/devlens", color: "accent" },
              { icon: FileText, label: "SpecForge", href: "/specforge", color: "amber" },
              { icon: BarChart3, label: "ChartGPT", href: "/chartgpt", color: "violet" },
            ].map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={module.href}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-background/50 dark:bg-void/50 hover:border-${module.color}/50 hover:bg-gradient-to-br from-${module.color}/10 to-transparent transition-all`}
                  >
                    <Icon className={`w-5 h-5 text-${module.color}`} />
                    <span className="font-bold text-foreground">{module.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}