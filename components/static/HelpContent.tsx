"use client";

import * as React from "react";
import { 
  HelpCircle, Search, MessageSquare,
  Settings, CreditCard, Shield, Plus, Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const helpCategories = [
  {
    title: "Account & Billing",
    icon: CreditCard,
    topics: ["Standard Plans", "Enterprise Subscriptions", "Updating Payment Methods", "Account Deletion"]
  },
  {
    title: "Platform Setup",
    icon: Settings,
    topics: ["Initial Configuration", "API Keys & Secrets", "Team Access Controls", "Workspace Optimization"]
  },
  {
    title: "Security & Trust",
    icon: Shield,
    topics: ["Data Encryption", "Single Sign-On (SSO)", "Audit Logs", "Security Audits"]
  }
];

const faqs = [
  {
    q: "How does PulseKit handle my proprietary code?",
    a: "We use isolated, ephemeral compute environments for all code analysis. Your data is encrypted at rest and in transit, and we never use your proprietary code for global model training without explicit consent."
  },
  {
    q: "Can I use PulseKit with my existing enterprise stack?",
    a: "Yes, PulseKit integrates seamlessly with GitHub, GitLab, Bitbucket, and various CI/CD pipelines via our comprehensive API and webhook system."
  },
  {
    q: "Do you offer priority support for startups?",
    a: "Our Scale and Enterprise plans include priority slack support and dedicated architectural reviews. Contact our sales team for custom startup pricing."
  }
];

export function HelpContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      {/* Search Hero */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-void/50 border border-border/50 rounded-[4rem] p-12 md:p-24 overflow-hidden mb-32 shadow-2xl"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-30 pointer-events-none" />
         
         <div className="relative z-10 text-center space-y-12 max-w-3xl mx-auto">
            <div className="space-y-6">
               <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight text-foreground leading-[1.1]">
                  Self-serve <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-600">Intelligence.</span>
               </h1>
               <p className="text-xl text-muted font-medium italic">
                  Search 500+ technical guides and architectural blueprints.
               </p>
            </div>
            
            <div className="relative group">
               <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative p-6 rounded-[2.5rem] bg-muted/40 border-2 border-border/50 flex items-center gap-4 group-focus-within:border-indigo-500/30 transition-all">
                  <Search className="w-6 h-6 text-muted" />
                  <input 
                    type="text" 
                    placeholder="Describe your technical challenge..." 
                    className="bg-transparent border-none text-lg font-bold focus:ring-0 placeholder:text-muted/50 w-full"
                  />
               </div>
            </div>
         </div>
      </motion.div>

      {/* Grid Categories */}
      <div className="grid md:grid-cols-3 gap-8 mb-40">
         {helpCategories.map((cat, idx) => (
           <motion.div
             key={cat.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: idx * 0.1 }}
             className="p-10 rounded-[3rem] bg-muted/20 border border-border/50 space-y-8 hover:bg-muted/30 transition-all flex flex-col items-center text-center shadow-xl shadow-black/5"
           >
              <div className="w-16 h-16 rounded-2xl bg-void/50 border border-border/50 flex items-center justify-center">
                 <cat.icon className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-foreground">{cat.title}</h3>
                 <div className="space-y-2">
                    {cat.topics.map(topic => (
                      <p key={topic} className="text-xs text-muted font-bold hover:text-foreground transition-colors cursor-pointer">{topic}</p>
                    ))}
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* FAQs */}
      <div className="space-y-12">
         <h2 className="text-4xl font-bold text-foreground text-center sm:text-left">Standard Inquiries</h2>
         <div className="space-y-4 max-w-3xl mx-auto sm:mx-0">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`
                    group rounded-3xl border transition-all duration-500
                    ${isExpanded ? "bg-muted/40 border-indigo-500/30" : "bg-muted/10 border-border/50 hover:bg-muted/20"}
                  `}
                >
                   <button 
                     onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                     className="w-full text-left p-8 flex items-center justify-between gap-6"
                   >
                      <h4 className="text-lg font-bold text-foreground">{faq.q}</h4>
                      <div className="w-8 h-8 rounded-full bg-void border border-border flex items-center justify-center transition-all group-hover:border-indigo-500/50">
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
                           <div className="px-8 pb-8 text-muted leading-relaxed font-medium">
                              {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              );
            })}
         </div>
      </div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-40 p-16 rounded-[4rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 text-center space-y-12 relative overflow-hidden shadow-2xl"
      >
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h3 className="text-5xl font-black text-foreground tracking-tight leading-none italic">
               Still haven&apos;t found <br />
               <span className="text-indigo-500">The One?</span>
            </h3>
            <p className="text-xl text-muted font-medium leading-relaxed">
               Our human-in-the-loop support team is available 24/7 for technical escalation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link 
                 href="mailto:support@pulsekit.ai"
                 className="px-10 py-5 rounded-[2rem] bg-foreground text-background font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
               >
                  Contact Human Support
               </Link>
               <Link 
                 href={getAdaptiveHref("/community")}
                 className="flex items-center gap-2 text-sm font-black text-muted hover:text-foreground transition-colors group"
               >
                  PulseKit Community
                  <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </Link>
            </div>
         </div>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <HelpCircle className="w-80 h-80 text-indigo-500" />
         </div>
      </motion.div>
    </div>
  );
}
