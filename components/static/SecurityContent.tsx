"use client";

import * as React from "react";
import { 
  ShieldCheck, Lock, ShieldAlert, Cpu,  Database, Globe,
  Search, CheckCircle2,
  FileCheck2, Fingerprint, Network
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

export function SecurityContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  
  const pillars = [
    {
      title: "Data Encryption",
      icon: Lock,
      description: "Military-grade encryption for all pulse data.",
      details: "AES-256 at rest and TLS 1.3 in transit. Your code never touches our disks in plain text."
    },
    {
      title: "Ephemeral Compute",
      icon: Cpu,
      description: "Isolated analysis environments.",
      details: "AI analysis happens in hardened, short-lived containers that are purged immediately after execution."
    },
    {
      title: "Identity Protection",
      icon: Fingerprint,
      description: "Advanced auth & authorization.",
      details: "Multi-factor authentication and granular RBAC ensure only you access your workspace."
    }
  ];

  const compliance = [
    { name: "SOC 2 Type II", status: "Certified", date: "2026" },
    { name: "GDPR", status: "Compliant", date: "Global" },
    { name: "ISO 27001", status: "Certified", date: "2025" },
    { name: "HIPAA", status: "Ready", date: "BBA Available" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-32"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-black uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4" />
          Hardened Infrastructure
        </div>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight text-foreground">
          Security is <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">First-Class</span>.
        </h1>
        <p className="text-muted text-xl max-w-2xl mx-auto font-medium">
          PulseKit is built on a Zero Trust architecture. We don&apos;t just protect your data; we ensure we never have to see it.
        </p>
      </motion.div>

      {/* Security Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mb-32">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-10 rounded-[3rem] bg-muted/20 border border-border/50 space-y-8 hover:bg-muted/30 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-void/50 border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <pillar.icon className="w-7 h-7 text-green-500" />
            </div>
            <div className="space-y-3">
               <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
               <p className="text-sm text-muted font-medium leading-relaxed">{pillar.details}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technical Deep Dive */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
         <div className="space-y-12">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">Our Security Stack</h2>
            <div className="space-y-8">
               {[
                 { 
                   title: "Network Isolation", 
                   icon: Network,
                   text: "All AI processing occurs in VPCs with no external ingress routes. Your data stays in its lane."
                 },
                 { 
                   title: "Continuous Auditing", 
                   icon: Search,
                   text: "Real-time threat detection and automated vulnerability scanning at every stage of the CI/CD pipeline."
                 },
                 { 
                   title: "Zero Retention", 
                   icon: Database,
                   text: "We use stateless AI processing systems. Your proprietary logic is never stored beyond the session."
                 }
               ].map((item) => (
                 <div key={item.title} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                       <item.icon className="w-6 h-6 text-muted" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-foreground">{item.title}</h4>
                       <p className="text-muted leading-relaxed font-medium">{item.text}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="relative">
            <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full" />
            <div className="relative p-8 rounded-[4rem] bg-void/50 border border-border/50 backdrop-blur-3xl shadow-2xl space-y-8">
               <div className="flex items-center justify-between border-b border-border/50 pb-6">
                  <h3 className="font-bold text-foreground">Compliance Matrix</h3>
                  <FileCheck2 className="w-6 h-6 text-green-500" />
               </div>
               <div className="space-y-4">
                  {compliance.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                       <div className="space-y-1">
                          <div className="text-sm font-bold text-foreground">{c.name}</div>
                          <div className="text-[10px] text-muted font-black uppercase tracking-widest">{c.date}</div>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase italic">
                          <CheckCircle2 className="w-3 h-3" />
                          {c.status}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-16 rounded-[4rem] bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 text-center space-y-8 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
           <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">
             Ready for enterprise-grade <br />
             <span className="text-green-500">peace of mind.</span>
           </h3>
           <p className="text-lg text-muted font-medium">
             Download our full Security Whitepaper or request our latest SOC 2 report to learn more about how we keep your code safe.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={getAdaptiveHref("/contact")}
                className="px-10 py-4 rounded-2xl bg-foreground text-background font-bold hover:scale-105 active:scale-95 transition-all"
              >
                Request Security Docs
              </Link>
              <Link 
                href={getAdaptiveHref("/about")}
                className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors group"
              >
                About Our Architecture
                <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
           <ShieldAlert className="w-64 h-64 text-green-500" />
        </div>
      </motion.div>
    </div>
  );
}
