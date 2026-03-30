"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { 
  Zap, 
  Shield, 
  Cpu, 
  Globe, 
  Lock, 
  Users, 
  Code, 
  Activity, 
  Database, 
  GitBranch, 
  Boxes
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Browser-native execution with zero cold starts. Every operation happens instantly.",
    color: "accent",
    gradient: "from-accent/10 to-transparent",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your code and data never leave your machine. We can't see it, we won't store it.",
    color: "green-500",
    gradient: "from-green-500/10 to-transparent",
  },
  {
    icon: Cpu,
    title: "AI-Native",
    description: "Every module is deeply integrated with Claude for intelligent, context-aware output.",
    color: "violet",
    gradient: "from-violet/10 to-transparent",
  },
  {
    icon: Globe,
    title: "Zero Backend",
    description: "Everything runs in your browser. No servers, no infrastructure, no complexity.",
    color: "blue-500",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "End-to-end encryption, SOC 2 compliant, and built with security as a foundation.",
    color: "amber",
    gradient: "from-amber/10 to-transparent",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "Share results, export in any format, and integrate with your existing workflow.",
    color: "pink-500",
    gradient: "from-pink-500/10 to-transparent",
  },
  {
    icon: Code,
    title: "Developer-First",
    description: "Built by engineers, for engineers. Every detail optimized for technical workflows.",
    color: "cyan-500",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    icon: Activity,
    title: "Real-Time Analysis",
    description: "Streaming AI responses with instant feedback. See results as they're generated.",
    color: "red-500",
    gradient: "from-red-500/10 to-transparent",
  },
  {
    icon: Database,
    title: "Smart Data Handling",
    description: "Automatic CSV/JSON parsing with intelligent column detection and type inference.",
    color: "indigo-500",
    gradient: "from-indigo-500/10 to-transparent",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 dark:bg-accent/10 backdrop-blur-sm mb-6">
            <Boxes className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent">Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Engineered for Excellence
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Every feature meticulously crafted to deliver the fastest, most secure, and most intelligent developer experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Card */}
                <div className="relative p-8 rounded-2xl border border-border bg-background/50 dark:bg-void/50 backdrop-blur-sm hover:border-border/80 hover:bg-background/80 dark:hover:bg-void/80 transition-all h-full">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} border border-${feature.color}/20 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted mb-4">And that&apos;s just the beginning...</p>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all group"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore all features
              <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}