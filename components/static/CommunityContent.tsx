"use client";

import * as React from "react";
import { 
  Users2, MessageSquare, Twitter, Github, 
  Globe, ArrowRight, 
  Sparkles, Code2, Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

export function CommunityContent() {
  const { getAdaptiveHref } = useAdaptiveLink();

  const channels = [
    { 
      name: "Discord", 
      icon: MessageSquare, 
      color: "text-indigo-500", 
      bg: "bg-indigo-500/10",
      description: "Real-time technical discussions and architectural peer reviews.",
      count: "12.4k members",
      href: "https://discord.com"
    },
    { 
      name: "Twitter/X", 
      icon: Twitter, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10",
      description: "Latest product transsmissions and ecosystem updates.",
      count: "50k followers",
      href: "https://twitter.com"
    },
    { 
      name: "GitHub", 
      icon: Github, 
      color: "text-foreground", 
      bg: "bg-foreground/10",
      description: "Open-source adapters, technical RFCs, and bug reports.",
      count: "8.2k stars",
      href: "https://github.com"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-12 mb-32"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-black uppercase tracking-[0.2em]">
          <Users2 className="w-4 h-4" />
          The Collective
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-foreground leading-[1.1]">
           Where elite <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
              builders converge.
           </span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
           PulseKit is more than a tool; it&apos;s a distributed network of engineers dedicated to the craft of AI-native engineering.
        </p>
      </motion.div>

      {/* Grid Channels */}
      <div className="grid md:grid-cols-3 gap-8 mb-40">
         {channels.map((channel, idx) => (
           <motion.a
             key={channel.name}
             href={channel.href}
             target="_blank"
             rel="noopener noreferrer"
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: idx * 0.1 }}
             className="group p-10 rounded-[3rem] bg-muted/20 border border-border/50 space-y-8 hover:bg-muted/30 transition-all flex flex-col items-center text-center shadow-xl shadow-black/5"
           >
              <div className={`w-16 h-16 rounded-2xl ${channel.bg} border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                 <channel.icon className={`w-8 h-8 ${channel.color}`} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-xl font-bold text-foreground">{channel.name}</h3>
                 <p className="text-sm text-muted font-medium leading-relaxed">{channel.description}</p>
                 <div className="text-[10px] font-black uppercase tracking-widest text-muted">{channel.count}</div>
              </div>
              <div className="pt-4 flex items-center gap-2 text-xs font-black text-foreground opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                 Join Channel <ArrowRight className="w-4 h-4 text-indigo-500" />
              </div>
           </motion.a>
         ))}
      </div>

      {/* Contribution Section */}
      <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
         >
            <h2 className="text-4xl font-black text-foreground tracking-tight leading-tight">
               Contributing to the <br />
               <span className="italic text-indigo-500">Substrate.</span>
            </h2>
            <p className="text-lg text-muted font-medium leading-relaxed">
               We believe the future of AI-native engineering should be open. From core adapters to documentation, your contributions help shape the pulse of the industry.
            </p>
            
            <div className="space-y-6">
               {[
                 { title: "Technical RFCs", text: "Join monthly discussions on engineering direction.", icon: Cpu },
                 { title: "Adapter Ecosystem", text: "Build and share custom integrations for PulseKit.", icon: Code2 },
                 { title: "Bug Squad", text: "Help us reach 100% stability at scale.", icon: Sparkles }
               ].map(v => (
                 <div key={v.title} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                       <v.icon className="w-5 h-5 text-muted" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-foreground text-sm">{v.title}</h4>
                       <p className="text-xs text-muted font-medium leading-relaxed">{v.text}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <Link 
              href="https://github.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-foreground text-background font-black text-sm hover:opacity-90 transition-opacity"
            >
               Contribution Guide
               <ArrowRight className="w-4 h-4" />
            </Link>
         </motion.div>

         <div className="relative aspect-square lg:aspect-video rounded-[4rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-void border border-border/50 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
               <Globe className="w-80 h-80 text-foreground" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="p-8 rounded-[3rem] bg-void/50 border border-border/50 backdrop-blur-2xl shadow-2xl text-center space-y-6 group-hover:scale-105 transition-all duration-700">
                  <div className="flex -space-x-4 justify-center">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className={`w-12 h-12 rounded-full border-2 border-void bg-gradient-to-br from-indigo-500 to-purple-500`} />
                     ))}
                     <div className="w-12 h-12 rounded-full border-2 border-void bg-muted/50 flex items-center justify-center text-[10px] font-black">+12k</div>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-bold text-foreground">Global Registry</h4>
                     <p className="text-xs text-muted font-medium italic">82 Countries. 1 Mission.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Meetups CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-16 rounded-[4rem] bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-transparent border border-indigo-500/20 text-center space-y-8 relative overflow-hidden shadow-2xl"
      >
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">
              Hosting a <span className="text-indigo-500">Meetup?</span>
            </h3>
            <p className="text-lg text-muted font-medium">
               We support local PulseKit gatherings with technical speakers, workshop templates, and swag packs.
            </p>
            <Link 
              href={getAdaptiveHref("/contact")}
              className="px-10 py-4 rounded-2xl bg-foreground text-background font-black text-sm hover:scale-105 active:scale-95 transition-all"
            >
               Request Meetup Pack
            </Link>
         </div>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <Sparkles className="w-80 h-80 text-indigo-500" />
         </div>
      </motion.div>
    </div>
  );
}
