"use client";

import * as React from "react";
import { 
  Cookie, Shield, Settings, 
  CheckCircle2, ChevronRight,
  Database, EyeOff, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const cookieCategories = [
  {
    title: "Essential Protocol",
    icon: Lock,
    description: "Strictly necessary for the platform to function. They handle authentication, security, and load balancing.",
    required: true,
    cookies: ["_pk_session", "_pk_auth", "_pk_csrf"]
  },
  {
    title: "Preference Logic",
    icon: Settings,
    description: "Remember your workspace layouts, theme choices, and local development configurations.",
    required: false,
    cookies: ["_pk_theme", "_pk_sidebar_collapsed", "_pk_recent_repos"]
  },
  {
    title: "Analysis Insights",
    icon: Database,
    description: "Anonymized technical metadata that helps us understand platform performance and common bottlenecks.",
    required: false,
    cookies: ["_pk_analytics", "_pk_performance_id"]
  }
];

export function CookiesContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [preferences, setPreferences] = React.useState({
    essential: true,
    preference: true,
    analysis: true
  });

  const togglePreference = (key: 'essential' | 'preference' | 'analysis') => {
    if (key === 'essential') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sidebar Header */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <Cookie className="w-3 h-3" />
                Cookie Identity
              </div>
              <h1 className="text-5xl font-display font-black tracking-tight text-foreground leading-[1.1]">
                Tracking <br />
                <span className="italic text-orange-500">Substrate.</span>
              </h1>
              <p className="text-lg text-muted font-medium leading-relaxed">
                We use cookies to maintain your workspace state and ensure high-performance infrastructure delivery.
              </p>
            </motion.div>

            <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/50 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center">
                     <Shield className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="font-bold text-foreground">Privacy Shield</h4>
               </div>
               <p className="text-xs text-muted leading-relaxed font-medium">
                  We follow a strict zero-tracking-pixel policy for non-essential technical metadata.
               </p>
               <Link 
                 href={getAdaptiveHref("/privacy")}
                 className="flex items-center gap-2 text-xs font-black text-orange-500 hover:gap-3 transition-all"
               >
                  Full Policy <ChevronRight className="w-3 h-3" />
               </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-24 max-w-2xl mx-auto lg:mx-0">
           <div className="space-y-16">
              <section className="space-y-6">
                 <h2 className="text-3xl font-black text-foreground">Operational Protocol</h2>
                 <p className="text-lg text-muted font-medium leading-relaxed italic">
                    PulseKit is an AI-native workspace; cookies are our only way of keeping your pulse consistent across sessions. 
                 </p>
              </section>

              <div className="space-y-6">
                 {cookieCategories.map((cat, idx) => (
                   <motion.div
                     key={cat.title}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1 }}
                     className={`
                       p-8 rounded-[2.5rem] border transition-all duration-500
                       ${cat.required ? "bg-muted/30 border-orange-500/20 shadow-xl shadow-orange-500/5" : "bg-muted/10 border-border/50 hover:bg-muted/20"}
                     `}
                   >
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-void border border-border flex items-center justify-center">
                               <cat.icon className={`w-6 h-6 ${cat.required ? "text-orange-500" : "text-muted"}`} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{cat.title}</h3>
                         </div>
                         {cat.required ? (
                           <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase">
                              Required
                           </div>
                         ) : (
                           <button 
                             onClick={() => togglePreference(cat.title.toLowerCase().split(' ')[0] as 'essential' | 'preference' | 'analysis')}
                             className={`
                               p-2 rounded-lg border flex items-center gap-2 transition-all
                               ${preferences[cat.title.toLowerCase().split(' ')[0] as keyof typeof preferences] 
                                 ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                 : "bg-void border-border text-muted"
                               }
                             `}
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                         )}
                      </div>
                      <p className="text-sm text-muted font-medium leading-relaxed mb-6">
                         {cat.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono font-black italic text-muted/60">
                         {cat.cookies.map(c => <span key={c}>[{c}]</span>)}
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Manual Controls */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-void to-muted/20 border border-border flex flex-col items-center text-center space-y-8"
           >
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-foreground tracking-tight italic">Pure Identity Controls.</h3>
                 <p className="text-muted font-medium leading-relaxed">
                    Adjusting these settings will immediately purge current local storage tokens and reset your session state.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <button className="px-10 py-5 rounded-[2rem] bg-orange-600 text-white font-black text-lg shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all">
                    Commit Protocol Changes
                 </button>
                 <button className="text-sm font-black text-muted hover:text-foreground transition-colors flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Reset to Factory
                 </button>
              </div>
           </motion.div>
        </main>
      </div>
    </div>
  );
}
