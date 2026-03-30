"use client";

import * as React from "react";
import { Shield, Lock, Eye, FileText, Globe, Server, Bell, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function PrivacyContent() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Eye,
      content: `We collect information you provide directly to us when you use PulseKit. This includes account information (name, email), code snippets or data you input for analysis, and technical metadata about your interactions with our platform. We also collect usage data through cookies and similar technologies to understand how our services are being used.`
    },
    {
      title: "2. How We Use Your Information",
      icon: FileText,
      content: `Your data is used to provide, maintain, and improve PulseKit services. This includes processing code for analysis, generating documentation, optimizing our AI models (only with your explicit consent for non-sensitive data), and communicating important updates or security alerts. We do not sell your personal information to third parties.`
    },
    {
      title: "3. Data Security & Encryption",
      icon: Lock,
      content: `Security is our top priority. We employ industry-standard encryption (AES-256 for data at rest and TLS 1.3 for data in transit). PulseKit is SOC 2 Type II certified, meaning our security controls are independently audited to ensure they meet the highest standards for data protection.`
    },
    {
      title: "4. AI & Data Privacy",
      icon: Shield,
      content: `When you submit code for AI analysis, it is processed in a secure, ephemeral environment. Your proprietary code is never used to train global AI models without your authenticated opt-in. We use enterprise-grade AI providers with strict data privacy agreements that prevent them from retaining or using your data for their own purposes.`
    },
    {
      title: "5. Third-Party Services",
      icon: Globe,
      content: `We share information with service providers who perform services on our behalf, such as cloud hosting (AWS/Vercel), database management, and analytics. These providers are contractually obligated to protect your data and are prohibited from using it for any other purpose.`
    },
    {
      title: "6. Data Retention",
      icon: Server,
      content: `We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. You can request deletion of your account and associated data at any time through your settings.`
    },
    {
      title: "7. Your Rights & Choices",
      icon: UserCheck,
      content: `Depending on your location (e.g., GDPR in the EU/UK or CCPA in California), you have specific rights regarding your personal data. This includes the right to access, correct, or delete your data, as well as the right to object to or restrict certain processing activities.`
    },
    {
      title: "8. Changes to This Policy",
      icon: Bell,
      content: `We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the PulseKit platform or via the email address associated with your account. Continued use of our services after such changes constitutes acceptance of the new policy.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
          <Shield className="w-3.5 h-3.5" />
          Trust &amp; Security
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          Last updated: March 29, 2026. Your privacy is fundamental to our mission of building a secure, AI-native workspace.
        </p>
      </motion.div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <motion.section 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-2xl bg-muted/50 items-center justify-center border border-border group-hover:border-accent/30 group-hover:bg-accent/5 transition-all duration-500">
                <section.icon className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-accent sm:hidden" />
                  {section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed text-lg font-medium space-y-4">
                  {section.content.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
            {idx !== sections.length - 1 && (
              <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mt-12" />
            )}
          </motion.section>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 p-8 rounded-[2.5rem] bg-void/30 border border-border/50 backdrop-blur-xl text-center space-y-6"
      >
        <h3 className="text-2xl font-bold text-foreground">Have questions about your data?</h3>
        <p className="text-muted max-w-lg mx-auto">
          Our dedicated Privacy Team is here to help. Reach out to us for any clarifications regarding our data practices.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="mailto:privacy@pulsekit.ai" className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity">
            Contact Privacy Team
          </Link>
          <Link href="/security" className="px-8 py-3 rounded-2xl bg-muted/50 border border-border text-foreground font-bold hover:bg-muted transition-all">
            Security Overview
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
