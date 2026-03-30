"use client";

import * as React from "react";
import { 
  Gavel, CheckCircle2, AlertTriangle, Cloud, 
  FileCheck, Ban, CreditCard, Scale, 
  HelpCircle, ArrowRight, LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

interface TermsSection {
  id: string;
  title: string;
  icon: LucideIcon;
  content: string;
}

const sections: TermsSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: CheckCircle2,
    content: `By accessing or using PulseKit, you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms.`
  },
  {
    id: "description",
    title: "2. Service Description",
    icon: Cloud,
    content: `PulseKit is an AI-native workspace providing code intelligence, documentation generation, and data visualization tools. We reserve the right to modify or discontinue any part of the service to maintain our standard of excellence.`
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    icon: FileCheck,
    content: `You are responsible for maintaining the confidentiality of your credentials. Any activity under your account is your responsibility. Notify us immediately of any security breaches.`
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    icon: Ban,
    content: `PulseKit must be used for lawful purposes. Prohibited activities include attempting to disrupt our infrastructure, reverse-engineering our AI models, or uploading malicious content.`
  },
  {
    id: "ip",
    title: "5. Intellectual Property",
    icon: Gavel,
    content: `You retain ownership of your code and data. PulseKit retains ownership of the platform, brand, and proprietary algorithms used to provide the service.`
  },
  {
    id: "billing",
    title: "6. Fees & Payment",
    icon: CreditCard,
    content: `Subscription fees are processed via secure third-party providers. All fees are non-refundable unless otherwise specified by local law or explicit agreement.`
  },
  {
    id: "liability",
    title: "7. Liability Limits",
    icon: AlertTriangle,
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, PULSEKIT SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM SERVICE USE.`
  }
];

export function TermsContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [activeSection, setActiveSection] = React.useState("acceptance");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted ml-4 mb-4">Agreement sections</h3>
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                      ${activeSection === section.id 
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                        : "text-muted hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? "text-blue-500" : "text-muted group-hover:text-foreground"}`} />
                    <span className="truncate">{section.title.replace(/^\d+\.\s+/, '')}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
               <Scale className="w-8 h-8 text-blue-500" />
               <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Fair Use Policy</h4>
                  <p className="text-xs text-muted leading-relaxed">Our commitment to a balanced and secure platform ecosystem.</p>
               </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
              <Gavel className="w-3 h-3" />
              Legal Protocol
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xl text-muted font-medium leading-relaxed">
              Establishing the boundaries of excellence. Effective March 29, 2026.
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
                     <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:border-blue-500/30 transition-colors">
                        <section.icon className="w-5 h-5 text-muted group-hover:text-blue-500 transition-colors" />
                     </div>
                     <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="pl-14 text-muted-foreground leading-relaxed text-lg font-medium space-y-6">
                    <p>{section.content}</p>
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
            <div className="relative z-10 space-y-8 text-center sm:text-left">
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Questions on legality?</h3>
                  <p className="text-muted font-medium leading-relaxed">
                    Our compliance team is happy to walk you through our terms for enterprise-level deployments.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link 
                    href={getAdaptiveHref("/contact")}
                    className="px-10 py-4 rounded-2xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
                  >
                    Contact Support
                  </Link>
                  <Link 
                    href={getAdaptiveHref("/privacy")}
                    className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors group"
                  >
                    Privacy Policy
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <HelpCircle className="w-64 h-64" />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
