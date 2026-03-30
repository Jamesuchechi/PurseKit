"use client";

import * as React from "react";
import { Mail, MessageCircle, MapPin, Globe, Clock, Send, Laptop, HelpCircle, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function ContactContent() {
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
    // Simulate API call
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
      description: "Need help with integration or encountering an issue?",
      email: "support@pulsekit.ai",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Sales & Enterprise",
      icon: MessageCircle,
      description: "Looking for team licenses or enterprise custom features?",
      email: "sales@pulsekit.ai",
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      title: "Security & Legal",
      icon: Globe,
      description: "Inquiries regarding data privacy or reporting vulnerabilities.",
      email: "security@pulsekit.ai",
      color: "bg-amber-500/10 text-amber-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mb-20 text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <PhoneCall className="w-3.5 h-3.5" />
          Get in Touch
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-foreground leading-[1.1]">
          We&apos;re here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">listen.</span>
        </h1>
        <p className="text-muted text-lg font-medium">
          Have a question, feedback, or a partnership idea? Reach out to the right team and we&apos;ll get back to you within 24 hours.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-void/50 border border-border/50 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] transform -rotate-12 scale-150">
                <Send className="w-64 h-64 text-accent" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-foreground">
                   <Mail className="w-6 h-6 text-accent" />
                   Drop us a message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Full Name</label>
                         <input 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            type="text" 
                            className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            placeholder="Alex Thorne"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Work Email</label>
                         <input 
                            required
                            type="email" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            placeholder="alex@company.com"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all appearance-none cursor-pointer"
                      >
                         <option value="support">Technical Support</option>
                         <option value="sales">Sales & Partnerships</option>
                         <option value="billing">Billing Inquiry</option>
                         <option value="other">Other</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">How can we help?</label>
                      <textarea 
                         required
                         rows={4}
                         value={formData.message}
                         onChange={e => setFormData({...formData, message: e.target.value})}
                         className="w-full bg-muted/20 border border-border rounded-2xl px-5 py-4 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                         placeholder="Describe your request in detail..."
                      />
                   </div>

                   <Button 
                     type="submit" 
                     className="w-full h-14 rounded-2xl font-bold bg-accent text-white shadow-xl shadow-accent/20 hover:shadow-accent/40"
                     disabled={formStatus !== "idle"}
                   >
                     {formStatus === "idle" && (
                        <>
                          <Send className="w-5 h-5 mr-3" /> 
                          Send Message
                        </>
                     )}
                     {formStatus === "sending" && <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                     {formStatus === "sent" && "Message Sent Successfully!"}
                   </Button>
                </form>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-6">
              {contactMethods.map((method) => (
                 <div key={method.title} className="p-6 rounded-[2rem] bg-muted/10 border border-border/50 hover:bg-muted/20 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-current/10 ${method.color}`}>
                          <method.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-foreground text-lg">{method.title}</h4>
                          <p className="text-xs text-muted font-medium mb-1">{method.description}</p>
                       </div>
                    </div>
                    <a href={`mailto:${method.email}`} className="text-sm font-black text-accent group-hover:underline underline-offset-4">
                       {method.email}
                    </a>
                 </div>
              ))}
           </div>

           <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
              <div className="flex items-center gap-4">
                 <MapPin className="w-6 h-6 text-indigo-500" />
                 <h4 className="font-bold text-foreground">Our Headquarters</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed font-medium">
                 PulseKit Inc.<br />
                 101 Tech Plaza, Suite 400<br />
                 San Francisco, CA 94105
              </p>
              <div className="flex items-center gap-6 pt-4 border-t border-indigo-500/10">
                 <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Mon-Fri 9-6 PST</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Global Support</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-20 flex flex-col items-center gap-6 text-center">
         <div className="h-12 w-px bg-gradient-to-b from-transparent to-accent/50 mb-4" />
         <h4 className="text-2xl font-bold flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-accent" />
            Quick Answers
         </h4>
         <p className="text-muted max-w-lg mb-4">
            Maybe the answer you&apos;re looking for is already in our documentation or help center.
         </p>
         <div className="flex gap-4">
            <Link href="/docs" className="text-sm font-black text-accent hover:underline">Documentation</Link>
            <span className="text-muted/30">•</span>
            <Link href="/help" className="text-sm font-black text-accent hover:underline">Help Center</Link>
         </div>
      </div>
    </div>
  );
}
