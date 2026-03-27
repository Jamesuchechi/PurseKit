"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Code, Users, Zap, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Code,
    value: 10000,
    suffix: "+",
    label: "Lines of Code Analyzed",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Active Users",
    color: "violet",
    gradient: "from-violet/20 to-violet/5",
  },
  {
    icon: Zap,
    value: 99,
    suffix: "%",
    label: "Uptime SLA",
    color: "amber",
    gradient: "from-amber/20 to-amber/5",
  },
  {
    icon: TrendingUp,
    value: 150,
    suffix: "%",
    label: "Developer Productivity",
    color: "green-500",
    gradient: "from-green-500/20 to-green-500/5",
  },
];

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsSection() {
  return (
    <section className="relative py-20 border-y border-border bg-muted/20 dark:bg-void/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative p-6 rounded-2xl border border-border bg-background/50 dark:bg-void/50 backdrop-blur-sm hover:border-border/80 transition-all">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  
                  <div className={`text-3xl sm:text-4xl font-display font-black text-${stat.color} mb-2`}>
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </div>
                  
                  <p className="text-sm text-muted font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}