"use client";

import * as React from "react";
import { 
  Shield, Lock, Eye, FileText, Globe, Server, 
  UserCheck, ChevronRight, ExternalLink,
  ShieldCheck, Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

export function PrivacyContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [activeSection, setActiveSection] = React.useState("info-we-collect");

  const sections = [
    {
      id: "info-we-collect",
      title: "1. Information We Collect",
      icon: Eye,
      content: `We collect information you provide directly to us when you use PulseKit. This includes account information (name, email), code snippets or data you input for analysis, and technical metadata about your interactions with our platform. 

      We also collect usage data through cookies and similar technologies to understand how our services are being used. This helps us optimize performance and deliver a superior user experience.`
    },
    {
      id: "how-we-use",
      title: "2. How We Use Data",
      icon: FileText,
      content: `Your data is used to provide, maintain, and improve PulseKit services. This includes processing code for analysis, generating documentation, and communicating important updates. 
      
      We do NOT sell your personal information. We believe your data belongs to you, and we are merely the custodians of it while you use our workspace.`
    },
    {
      id: "security",
      title: "3. Security & Encryption",
      icon: Lock,
      content: `Security is our top priority. We employ industry-standard encryption (AES-256 for data at rest and TLS 1.3 for data in transit). 
      
      PulseKit is built with a 'Security by Design' philosophy, ensuring that every feature undergoes rigorous security review before it reaches your browser.`
    },
    {
      id: "ai-privacy",
      title: "4. AI & Data Privacy",
      icon: Shield,
      content: `When you submit code for AI analysis, it is processed in a secure, ephemeral environment. Your proprietary code is never used to train global AI models without your explicit, authenticated opt-in. 
      
      We partner only with AI providers who adhere to strict data privacy standards (e.g., Anthropic's enterprise privacy terms).`
    },
    {
      id: "third-party",
      title: "5. Third-Party Services",
      icon: Globe,
      content: `We use a limited number of trusted service providers to help us run PulseKit (e.g., Vercel for hosting, Neon for database). Each provider is vetted for security compliance and is contractually prohibited from using your data for any other purpose.`
    },
    {
      id: "retention",
      title: "6. Data Retention",
      icon: Server,
      content: `We retain your data for as long as your account is active. If you choose to delete your account, we will purge all associated data from our systems within 30 days, except where required by law.`
    },
    {
      id: "rights",
      title: "7. Your Rights",
      icon: UserCheck,
      content: `Regardless of your location, we believe in giving you control over your data. You have the right to access, export, correct, or delete your information at any time via your account settings.`
    }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-32 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted ml-4 mb-4">On this page</h3>
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                      ${activeSection === section.id 
                        ? "bg-accent/10 text-accent border border-accent/20" 
                        : "text-muted hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? "text-accent" : "text-muted group-hover:text-foreground"}`} />
                    <span className="truncate">{section.title.split('. ')[1]}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
               <ShieldCheck className="w-8 h-8 text-accent" />
               <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">SOC 2 Certified</h4>
                  <p className="text-xs text-muted leading-relaxed">Independently audited for security and privacy.</p>
               </div>
               <Link 
                 href={getAdaptiveHref("/security")}
                 className="flex items-center gap-2 text-xs font-black text-accent hover:underline"
               >
                 Security Portal <ExternalLink className="w-3 h-3" />
               </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
              <Fingerprint className="w-3 h-3" />
              Privacy Identity
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-foreground">
              Privacy Framework
            </h1>
            <p className="text-xl text-muted font-medium leading-relaxed">
              We process data to empower your engineering workflow, not to track it. Last modified: March 29, 2026.
            </p>
          </motion.div>

          <div className="space-y-24">
            {sections.map((section) => (
              <section 
                key={section.id} 
                id={section.id}
                className="scroll-mt-32 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:border-accent/30 transition-colors">
                        <section.icon className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                     </div>
                     <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="pl-14 text-muted-foreground leading-relaxed text-lg font-medium space-y-6">
                    {section.content.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Footer CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-[3.5rem] bg-gradient-to-br from-void to-muted/20 border border-border relative overflow-hidden"
          >
            <div className="relative z-10 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Need more clarity?</h3>
                  <p className="text-muted font-medium leading-relaxed">
                    Our privacy engineering team is available for deep-dives into our encryption and data handling practices.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link 
                    href="mailto:privacy@pulsekit.ai"
                    className="px-10 py-4 rounded-2xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Contact Privacy Team
                  </Link>
                  <Link 
                    href={getAdaptiveHref("/contact")}
                    className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors group"
                  >
                    Support Center
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-[0.03]">
               <Shield className="w-64 h-64" />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
