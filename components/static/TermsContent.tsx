"use client";

import * as React from "react";
import { Gavel, CheckCircle2, AlertTriangle, Cloud, CreditCard, Ban, HelpCircle, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function TermsContent() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle2,
      content: `By accessing or using PulseKit, you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms. If you do not agree to these terms, you must not access or use our services.`
    },
    {
      title: "2. Description of Service",
      icon: Cloud,
      content: `PulseKit is an AI-native workspace providing code analysis, documentation generation, data visualization, and other developer-centric tools. We reserve the right to modify, suspend, or discontinue any part of the service with or without notice. We are constantly innovating, and new features may be added frequently.`
    },
    {
      title: "3. User Accounts & Security",
      icon: FileCheck,
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We cannot and will not be liable for any loss or damage arising from your failure to protect your account.`
    },
    {
      title: "4. Acceptable Use Policy",
      icon: Ban,
      content: `You agree not to use PulseKit to:
      • Upload or transmit any content that is illegal, harmful, or violates third-party rights.
      • Attempt to gain unauthorized access to our systems or disrupt our infrastructure.
      • Use our AI tools for the purpose of reverse-engineering our proprietary algorithms.
      • Exceed reasonable usage limits that may impact the experience of other users.`
    },
    {
      title: "5. Intellectual Property",
      icon: Gavel,
      content: `You retain all rights to the code and data you submit to PulseKit. PulseKit owns the platform, including all original software, UI components, and the "PulseKit" brand. We grant you a non-exclusive, non-transferable license to use the service for your internal business or personal purposes.`
    },
    {
      title: "6. Fees & Payment",
      icon: CreditCard,
      content: `Certain features of PulseKit are provided under a subscription model. You agree to pay all applicable fees as described on our pricing page. Fees are non-refundable unless otherwise specified by law or in writing by PulseKit. We use secure third-party payment processors to handle all financial transactions.`
    },
    {
      title: "7. Limitation of Liability",
      icon: AlertTriangle,
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, PULSEKIT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES.`
    },
    {
      title: "8. Termination",
      icon: Ban,
      content: `We may terminate or suspend your account and access to the services immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the services will immediately cease.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-4">
          <Gavel className="w-3.5 h-3.5" />
          General Terms
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium text-balance">
          Effective Date: March 29, 2026. Please read these terms carefully before using the PulseKit platform.
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
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-2xl bg-muted/50 items-center justify-center border border-border group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-500">
                <section.icon className="w-6 h-6 text-muted group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-blue-500 sm:hidden" />
                  {section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed text-lg font-medium space-y-4">
                  {section.content.split('\n').map((para, pIdx) => (
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
        <HelpCircle className="w-12 h-12 text-blue-500 mx-auto" />
        <h3 className="text-2xl font-bold text-foreground text-balance">Unclear on any of these terms?</h3>
        <p className="text-muted max-w-lg mx-auto">
          We believe in transparent legal agreements. If something doesn&apos;t make sense, our legal team is available for clarification.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/contact" className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity">
            Contact Support
          </Link>
          <Link href="/privacy" className="px-8 py-3 rounded-2xl bg-muted/50 border border-border text-foreground font-bold hover:bg-muted transition-all">
            Review Privacy
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
