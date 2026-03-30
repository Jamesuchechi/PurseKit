"use client";

import * as React from "react";
import { 
  Rocket, Zap, Globe, Users2, 
  ArrowUpRight, Star, Coffee,
  Plus, Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const roles = [
  {
    category: "Engineering",
    openings: [
      { 
        title: "Senior AI Engineer (Inference Optimization)", 
        location: "Remote / London",
        type: "Full-time",
        description: "Optimizing Claude 4.5 and GPT-5 inference for sub-100ms browser response times."
      },
      { 
        title: "Frontend Architect (Framer Motion focus)", 
        location: "Remote / NYC",
        type: "Full-time",
        description: "Building the world's most fluid engineering workbench using Next.js 15."
      }
    ]
  },
  {
    category: "Product & Design",
    openings: [
      { 
        title: "Product Designer (Elite UI/UX)", 
        location: "Remote",
        type: "Full-time",
        description: "Designing minimalistic, high-fidelity interfaces for technical users."
      }
    ]
  }
];

export function CareersContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [expandedIndex, setExpandedIndex] = React.useState<string | null>(null);

  const perks = [
    { icon: Globe, title: "Distributed First", text: "Work from anywhere in the world." },
    { icon: Coffee, title: "Deep Work Culture", text: "Four-day weeks and zero pointless meetings." },
    { icon: Star, title: "Equity & Ownership", text: "Generous stock options for all early hires." },
    { icon: Zap, title: "Elite Tools", text: "Top-tier hardware and software budgets." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 pb-40">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-12 mb-32"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-[0.2em]">
          <Rocket className="w-4 h-4" />
          Join the Collective
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-foreground leading-[1.1]">
          We build for the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 italic">
            1% of builders.
          </span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          PulseKit is a group of obsessive engineers, designers, and dreamers. If you care about quality more than anything else, you fit in here.
        </p>
      </motion.div>

      {/* Culture Perks */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-40">
         {perks.map((perk, idx) => (
           <motion.div
             key={perk.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: idx * 0.1 }}
             className="p-8 rounded-[2rem] bg-muted/20 border border-border/50 hover:bg-muted/30 transition-all flex flex-col items-center text-center space-y-4 shadow-xl shadow-black/5"
           >
              <div className="w-12 h-12 rounded-xl bg-void/50 flex items-center justify-center border border-border/50 mb-2">
                 <perk.icon className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-bold text-foreground">{perk.title}</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">{perk.text}</p>
           </motion.div>
         ))}
      </div>

      {/* Job Board */}
      <div className="space-y-12">
         <h2 className="text-4xl font-bold text-foreground text-center sm:text-left">Open Transmissions</h2>
         <div className="space-y-16">
            {roles.map((category) => (
              <div key={category.category} className="space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted border-b border-border pb-4 w-fit">
                    {category.category}
                 </h3>
                 <div className="space-y-4">
                    {category.openings.map((role) => {
                      const id = `${category.category}-${role.title}`;
                      const isExpanded = expandedIndex === id;
                      
                      return (
                        <div 
                          key={role.title} 
                          className={`
                            group rounded-[2rem] border transition-all duration-500
                            ${isExpanded ? "bg-muted/40 border-rose-500/30" : "bg-muted/20 border-border/50 hover:border-muted-foreground/30 hover:bg-muted/30"}
                          `}
                        >
                           <button 
                             onClick={() => setExpandedIndex(isExpanded ? null : id)}
                             className="w-full text-left p-8 flex items-center justify-between gap-6"
                           >
                              <div className="space-y-1">
                                 <h4 className="text-xl font-bold text-foreground group-hover:text-rose-500 transition-colors">
                                    {role.title}
                                 </h4>
                                 <div className="flex items-center gap-4 text-xs font-mono text-muted">
                                    <span>{role.location}</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>{role.type}</span>
                                 </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-void border border-border flex items-center justify-center transition-all group-hover:bg-rose-500 group-hover:border-rose-500 group-hover:text-white">
                                 {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              </div>
                           </button>

                           <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                   <div className="px-8 pb-8 space-y-6">
                                      <p className="text-muted leading-relaxed font-medium">
                                         {role.description}
                                      </p>
                                      <Link 
                                        href={getAdaptiveHref("/contact")}
                                        className="inline-flex items-center gap-2 text-sm font-black text-rose-500 hover:gap-3 transition-all"
                                      >
                                         Initiate Application
                                         <ArrowUpRight className="w-4 h-4" />
                                      </Link>
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      );
                    })}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Cultural Manifesto */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mt-40 p-12 md:p-20 rounded-[4rem] bg-void/50 border border-border/50 backdrop-blur-3xl relative overflow-hidden"
      >
         <div className="relative z-10 max-w-2xl space-y-8">
            <div className="flex gap-2">
               {[1, 2, 3].map(i => (
                 <Star key={i} className="w-5 h-5 text-rose-500 fill-rose-500" />
               ))}
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Better thinking, <br />
              not just better <span className="text-rose-500 italic">coding.</span>
            </h3>
            <p className="text-lg text-muted font-medium leading-relaxed italic">
              &quot;We don&apos;t just build PulseKit for engineers; we build it to change how engineering happens.&quot;
            </p>
            <div className="pt-4 flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500" />
               <div>
                  <div className="text-sm font-bold text-foreground">James Uchechi</div>
                  <div className="text-xs text-muted font-mono uppercase tracking-widest">Founder & Lead Architect</div>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Users2 className="w-80 h-80 text-rose-500" />
         </div>
      </motion.div>
    </div>
  );
}
