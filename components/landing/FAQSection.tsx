"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HelpCircle, Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is PulseKit really free?",
    answer: "Yes! PulseKit offers a generous free tier that includes full access to all three modules. For power users, we offer Pro and Team plans with enhanced limits and priority support.",
  },
  {
    question: "How does the privacy model work?",
    answer: "All processing happens in your browser. Your code and data are sent directly to the Anthropic API for AI analysis, but never stored on our servers. We have zero visibility into your work.",
  },
  {
    question: "Which languages does DevLens support?",
    answer: "DevLens works with any programming language, including JavaScript, TypeScript, Python, Go, Rust, Java, C++, SQL, and more. The AI model is trained on hundreds of languages.",
  },
  {
    question: "Can I export my work?",
    answer: "Absolutely. SpecForge outputs can be downloaded as Markdown files. ChartGPT visualizations can be exported as PNG or SVG. All modules support clipboard copy for quick sharing.",
  },
  {
    question: "Do you offer an API?",
    answer: "Not yet, but we're building one! Join our waitlist to be notified when API access becomes available. Enterprise customers can request early access.",
  },
  {
    question: "What AI model powers PulseKit?",
    answer: "We use Anthropic's Claude Sonnet 4.5, which offers the best balance of speed, accuracy, and cost. We continuously evaluate new models to provide the best experience.",
  },
  {
    question: "Can I use PulseKit offline?",
    answer: "The AI features require an internet connection to reach the Anthropic API. However, file uploads and data previews work offline. We're exploring local AI options for future releases.",
  },
  {
    question: "How secure is my API key?",
    answer: "In production, API keys are never exposed to the browser. They're stored securely server-side. For local development, we recommend using environment variables and never committing keys to version control.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet/30 bg-violet/5 dark:bg-violet/10 backdrop-blur-sm mb-6">
            <HelpCircle className="w-4 h-4 text-violet" />
            <span className="text-sm font-bold text-violet">FAQ</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Questions? Answered.
          </h2>
          
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about PulseKit. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 rounded-2xl border border-border bg-background/50 dark:bg-void/50 hover:border-border/80 hover:bg-background/80 dark:hover:bg-void/80 transition-all"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-foreground pr-8">
                      {faq.question}
                    </h3>
                    
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center transition-all ${isOpen ? "bg-accent text-white" : "group-hover:bg-muted/80"}`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted leading-relaxed pt-4 pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-accent font-bold hover:underline"
          >
            Contact Support
            <HelpCircle className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}