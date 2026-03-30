"use client";

import * as React from "react";
import {  ArrowRight, Clock, Github, Twitter,Sparkles, Code2} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const blogPosts = [
  {
    title: "The Architecture of Ephemeral Compute",
    excerpt: "How we achieved sub-50ms isolation for AI code analysis using Firecracker microVMs and custom Rust orchestrators.",
    author: "James Uchechi",
    date: "March 28, 2026",
    readTime: "12 min read",
    tag: "Engineering",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Designing for the Elite 1%",
    excerpt: "Moving beyond generic UI components to build a hyper-fluid engineering workbench for technical power users.",
    author: "Sarah Chen",
    date: "March 24, 2026",
    readTime: "8 min read",
    tag: "Design",
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "PulseKit v2.4: The Intelligence Substrate",
    excerpt: "Introducing native context-injection and multi-modal SpecForge capabilities. Building the future of IDEs.",
    author: "Product Team",
    date: "March 20, 2026",
    readTime: "5 min read",
    tag: "Product",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

export function BlogContent() {
  const { getAdaptiveHref } = useAdaptiveLink();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      {/* Featured Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-20 pb-32 space-y-12 text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void/50 border border-border/50 backdrop-blur-xl mb-4 shadow-2xl">
           <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
           <span className="text-xs font-black uppercase tracking-[0.2em] text-muted">Weekly Log</span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-display font-black tracking-tight text-foreground leading-[0.9] text-balance">
           Engineering <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-orange-600">
              Intelligence.
           </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted max-w-2xl font-medium leading-relaxed">
           Deep dives into the technical stack, architectural decisions, and design philosophy behind PulseKit.
        </p>
      </motion.div>

      {/* Featured Post */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="group relative rounded-[4rem] bg-gradient-to-br from-void to-muted/20 border border-border/50 overflow-hidden mb-32 shadow-2xl"
      >
         <div className="grid lg:grid-cols-2 gap-12 items-center p-12 md:p-20">
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                     Latest Transmission
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                     <Clock className="w-3.5 h-3.5" />
                     12 min read
                  </div>
               </div>
               
               <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                  The Architecture of Ephemeral Compute
               </h2>
               
               <p className="text-lg text-muted font-medium leading-relaxed">
                  How we achieved sub-50ms isolation for AI code analysis using Firecracker microVMs and custom Rust orchestrators.
               </p>
               
               <div className="pt-4 flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl" />
                     <div className="text-sm font-bold text-foreground">James Uchechi</div>
                  </div>
                  <Link 
                    href={getAdaptiveHref("/blog/ephemeral-compute")}
                    className="flex items-center gap-2 text-sm font-black text-foreground hover:gap-3 transition-all"
                  >
                     Read Log <ArrowRight className="w-5 h-5 text-blue-500" />
                  </Link>
               </div>
            </div>
            
            <div className="relative aspect-square lg:aspect-video rounded-[3rem] bg-muted/40 border border-border/50 overflow-hidden group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                  <Code2 className="w-48 h-48 text-blue-500" />
               </div>
               <div className="absolute bottom-8 left-8 p-4 rounded-2xl bg-void/50 border border-border/50 backdrop-blur-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted">Isolated Stack</div>
                  <div className="text-sm font-bold text-foreground font-mono italic">Firecracker v1.7</div>
               </div>
            </div>
         </div>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
         {blogPosts.slice(1).map((post, idx) => (
           <motion.div
             key={post.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: idx * 0.1 }}
             className="group space-y-8"
           >
              <div className="relative aspect-[4/3] rounded-[3rem] bg-muted/20 border border-border overflow-hidden hover:border-border/80 transition-all shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                    <Sparkles className="w-32 h-32 text-foreground" />
                 </div>
                 <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-void/50 border border-border/50 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-muted">
                    {post.tag}
                 </div>
              </div>
              
              <div className="space-y-4 px-4 text-center sm:text-left">
                 <div className="flex items-center justify-center sm:justify-start gap-4 text-[10px] text-muted font-bold font-mono">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{post.readTime}</span>
                 </div>
                 <h3 className="text-2xl font-bold text-foreground leading-tight group-hover:text-orange-500 transition-colors">
                    {post.title}
                 </h3>
                 <p className="text-sm text-muted leading-relaxed font-medium line-clamp-3">
                    {post.excerpt}
                 </p>
                 <Link 
                   href={getAdaptiveHref(`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`)}
                   className="inline-flex items-center gap-2 text-xs font-black text-foreground hover:gap-3 transition-all pt-2"
                 >
                    Read Entry <ArrowRight className="w-4 h-4 text-orange-500" />
                 </Link>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Simple CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center space-y-8"
      >
         <h4 className="text-lg font-bold text-muted italic">Never miss a pulse.</h4>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="https://twitter.com" className="group flex items-center gap-3 text-sm font-black text-foreground hover:text-blue-400 transition-all">
               <Twitter className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
               Twitter
            </a>
            <a href="https://github.com" className="group flex items-center gap-3 text-sm font-black text-foreground hover:text-muted transition-all">
               <Github className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
               GitHub
            </a>
         </div>
      </motion.div>
    </div>
  );
}
