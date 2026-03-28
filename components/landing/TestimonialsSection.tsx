"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Senior Engineer at Vercel",
    avatar: "AC",
    content: "PulseKit has transformed how our team approaches code reviews. The AI insights are incredibly accurate, and the speed is unmatched.",
    rating: 5,
    color: "accent",
  },
  {
    name: "Sarah Mitchell",
    role: "Product Manager at Stripe",
    avatar: "SM",
    content: "SpecForge saves me hours every week. What used to take a full day of writing specs now takes minutes. The quality is consistently excellent.",
    rating: 5,
    color: "amber",
  },
  {
    name: "Marcus Johnson",
    role: "Data Scientist at OpenAI",
    avatar: "MJ",
    content: "ChartGPT is a game-changer for data exploration. I can iterate on visualizations at the speed of thought. Absolutely essential tool.",
    rating: 5,
    color: "violet",
  },
  {
    name: "Emily Rodriguez",
    role: "Tech Lead at Shopify",
    avatar: "ER",
    content: "The privacy-first approach gives me peace of mind. No data leaves my machine, yet I get enterprise-grade AI assistance. Perfect combination.",
    rating: 5,
    color: "green-500",
  },
  {
    name: "David Park",
    role: "Founder at StartupCo",
    avatar: "DP",
    content: "As a solo founder, PulseKit is like having a senior engineer, PM, and data analyst on my team. It's accelerated our entire product development.",
    rating: 5,
    color: "blue-500",
  },
  {
    name: "Priya Patel",
    role: "VP Engineering at Notion",
    avatar: "PP",
    content: "We've standardized on PulseKit across engineering. The consistency and quality of output has dramatically improved our documentation and code quality.",
    rating: 5,
    color: "pink-500",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber/30 bg-amber/5 dark:bg-amber/10 backdrop-blur-sm mb-6">
            <Star className="w-4 h-4 text-amber fill-amber" />
            <span className="text-sm font-bold text-amber">Testimonials</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Loved by Builders
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Hear from engineering teams and individual developers who&apos;ve transformed their workflow with PulseKit.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${testimonial.color}/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative p-6 rounded-2xl border border-border bg-background/50 dark:bg-void/50 backdrop-blur-sm hover:border-border/80 transition-all h-full flex flex-col">
                {/* Quote Icon */}
                <Quote className={`w-8 h-8 text-${testimonial.color}/20 mb-4`} />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted leading-relaxed mb-6 flex-1">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${testimonial.color}/20 to-${testimonial.color}/10 flex items-center justify-center border border-${testimonial.color}/20`}>
                    <span className={`text-sm font-bold text-${testimonial.color}`}>
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            {["Vercel", "Stripe", "OpenAI", "Shopify", "Notion", "GitHub"].map((company) => (
              <div key={company} className="text-2xl font-bold text-foreground">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}