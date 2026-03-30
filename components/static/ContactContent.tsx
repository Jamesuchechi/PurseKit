"use client";

import * as React from "react";
import { 
  Send, 
  Laptop, PhoneCall, ArrowRight,
  Sparkles, ShieldCheck, Globe, Clock,
  Zap, MapPin, HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

export function ContactContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [formStatus, setFormStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "support",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("sent");
      setFormData({ name: "", email: "", subject: "support", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      title: "Technical Support",
      icon: Laptop,
      description: "Deep-dive integration help.",
      email: "support@pulsekit.ai",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Sales & Enterprise",
      icon: Sparkles,
      description: "Custom licensing & deployments.",
      email: "sales@pulsekit.ai",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      title: "Security & Legal",
      icon: ShieldCheck,
      description: "Trust & compliance inquiries.",
      email: "security@pulsekit.ai",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em]">
          <PhoneCall className="w-4 h-4" />
          Transmission Center
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-foreground leading-[1.1]">
           Establish a <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-rose-500 to-accent/70 italic">
              connection.
           </span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
           Our engineering and support teams are distributed globally, ensuring a response within one orbit (24 hours).
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-20 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="relative p-12 md:p-16 rounded-[4rem] bg-void/50 border border-border/50 backdrop-blur-3xl shadow-2xl overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Send className="w-64 h-64 text-accent" />
             </div>
             
             <div className="relative z-10 space-y-12">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-foreground tracking-tight">Initiate Inquiry</h3>
                   <p className="text-muted font-medium">Describe your challenge or vision below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Identity</label>
                         <input 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-6 py-5 text-foreground font-medium placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all outline-none"
                            placeholder="Alex Thorne"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Secure Email</label>
                         <input 
                            required
                            type="email" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-6 py-5 text-foreground font-medium placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all outline-none"
                            placeholder="alex@company.com"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Mission Category</label>
                      <div className="relative">
                         <select 
                           value={formData.subject}
                           onChange={e => setFormData({...formData, subject: e.target.value})}
                           className="w-full bg-muted/20 border border-border/50 rounded-2xl px-6 py-5 text-foreground font-medium focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all appearance-none cursor-pointer outline-none"
                         >
                            <option value="support">Technical Support</option>
                            <option value="sales">Sales & Partnerships</option>
                            <option value="billing">Billing Inquiry</option>
                            <option value="other">Other</option>
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ArrowRight className="w-4 h-4 text-muted rotate-90" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">The Pulse</label>
                      <textarea 
                         required
                         rows={5}
                         value={formData.message}
                         onChange={e => setFormData({...formData, message: e.target.value})}
                         className="w-full bg-muted/20 border border-border/50 rounded-2xl px-6 py-5 text-foreground font-medium placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all outline-none resize-none"
                         placeholder="Detail your requirements..."
                      />
                   </div>

                   <button 
                     type="submit" 
                     disabled={formStatus !== "idle"}
                     className={`
                        w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                        ${formStatus === 'sent' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-foreground text-background hover:bg-accent hover:text-white shadow-xl shadow-black/10'}
                     `}
                   >
                     {formStatus === "idle" && (
                        <>
                          Transmit Message
                          <Send className="w-4 h-4" />
                        </>
                     )}
                     {formStatus === "sending" && <Zap className="w-5 h-5 animate-pulse" />}
                     {formStatus === "sent" && <ShieldCheck className="w-5 h-5" />}
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-12">
           <div className="space-y-6">
              {contactMethods.map((method) => (
                 <div key={method.title} className="p-8 rounded-[3rem] bg-muted/10 border border-border/50 hover:bg-muted/20 transition-all group flex items-start gap-6">
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${method.bg} border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       <method.icon className={`w-6 h-6 ${method.color}`} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-lg font-bold text-foreground">{method.title}</h4>
                       <p className="text-xs text-muted font-medium pr-4">{method.description}</p>
                       <a href={`mailto:${method.email}`} className="block text-sm font-black text-accent hover:underline pt-2">
                          {method.email}
                       </a>
                    </div>
                 </div>
              ))}
           </div>

           <div className="p-10 rounded-[3rem] bg-accent/5 border border-accent/10 space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold text-foreground">Global HQ</h3>
                 </div>
                 <p className="text-sm text-muted leading-relaxed font-medium italic">
                    PulseKit Inc.<br />
                    101 Tech Plaza, Suite 400<br />
                    San Francisco, CA 94105
                 </p>
                 <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-accent/10">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-accent" />
                       <span className="text-[10px] font-black uppercase text-muted tracking-widest">9-6 PST</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Globe className="w-4 h-4 text-accent" />
                       <span className="text-[10px] font-black uppercase text-muted tracking-widest">Distributed Support</span>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Globe className="w-40 h-40" />
              </div>
           </div>
        </div>
      </div>
      
      {/* Footer Support Links */}
      <div className="mt-32 pt-20 border-t border-border/50 flex flex-col items-center gap-12 text-center">
         <div className="space-y-4">
            <h4 className="text-3xl font-black text-foreground tracking-tight">Rapid Resolution</h4>
            <p className="text-muted font-medium max-w-lg mb-4">
               Many answers are instantaneous within our technical documentation or help center.
            </p>
         </div>
         <div className="flex flex-wrap justify-center gap-8">
            {[
               { label: "Documentation", href: "/docs" },
               { label: "Help Center", href: "/help" },
               { label: "API Reference", href: "/api-docs" },
               { label: "Security Portal", href: "/security" }
            ].map(l => (
               <Link key={l.label} href={getAdaptiveHref(l.href)} className="text-xs font-black uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors">
                  {l.label}
               </Link>
            ))}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-muted/40 uppercase tracking-[0.3em]">
            <HelpCircle className="w-3 h-3" />
            <span>Support Version 4.2.0</span>
         </div>
      </div>
    </div>
  );
}
