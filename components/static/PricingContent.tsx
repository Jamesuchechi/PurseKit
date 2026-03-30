"use client";

import * as React from "react";
import { 
  Zap, Cloud, ShieldCheck, CheckCircle2, 
  HelpCircle, ArrowRight, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  description: string;
  icon: React.ElementType;
  features: string[];
  highlight?: boolean;
  cta: string;
  slug: string;
}

const tiers: PricingTier[] = [
  {
    name: "Hobby",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for exploring AI-native workflows.",
    icon: Cloud,
    features: [
      "10 daily analyses",
      "7-day history retention",
      "Standard LLM access",
      "Community support",
      "Basic visualizations"
    ],
    cta: "Start for free",
    slug: "hobby"
  },
  {
    name: "Pro",
    price: { monthly: 19, annual: 15 },
    description: "Empower your engineering workflow with GPT-4.",
    icon: Zap,
    highlight: true,
    features: [
      "Unlimited daily analyses",
      "30-day history retention",
      "GPT-4 Intelligence models",
      "Priority processing queue",
      "Advanced CSV/JSON exports",
      "Beta access to DevLens V2"
    ],
    cta: "Upgrade to Pro",
    slug: "pro"
  },
  {
    name: "Elite",
    price: { monthly: 49, annual: 39 },
    description: "The ultimate power for high-performance builds.",
    icon: ShieldCheck,
    features: [
      "Custom system prompts",
      "Full API direct access",
      "Unlimited history & snapshots",
      "SOC 2 Security Whitepaper",
      "Dedicated account VPC",
      "Early bird new module access"
    ],
    cta: "Contact Sales",
    slug: "elite"
  }
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time from your settings panel. Pro-rated charges will apply."
  },
  {
    q: "Do you offer education discounts?",
    a: "We provide 50% discount for verified students and academic researchers. Contact our support team to apply."
  },
  {
    q: "Is there a limit on API tokens?",
    a: "Pro and Elite plans have generous fair-use limits. Elite users can request custom quotas for high-scale production."
  }
];

export function PricingContent() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");
  const { getAdaptiveHref } = useAdaptiveLink();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4" />
          Transparent Pricing
        </div>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight text-foreground">
          Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet">Ambition</span>.
        </h1>
        <p className="text-muted text-xl max-w-2xl mx-auto font-medium">
          Choose the plan that fits your engineering needs. Ship faster with the power of PulseKit.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={`text-sm font-bold transition-colors ${billingCycle === "monthly" ? "text-foreground" : "text-muted"}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-14 h-8 rounded-full bg-muted border border-border p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <motion.div 
              animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
              className="w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/20"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${billingCycle === "annual" ? "text-foreground" : "text-muted"}`}>Annual</span>
            <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest italic">Save 20%</span>
          </div>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 mb-32">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`
              relative p-10 rounded-[3.5rem] border transition-all duration-500 group
              ${tier.highlight 
                ? "bg-muted/30 border-accent/30 shadow-2xl shadow-accent/5 scale-105 z-10" 
                : "bg-muted/10 border-border/50 hover:bg-muted/20"
              }
            `}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/30">
                Recommended
              </div>
            )}
            
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-void/50 border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tier.icon className={`w-7 h-7 ${tier.highlight ? "text-accent" : "text-muted"}`} />
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl font-display font-black text-foreground">
                      ${billingCycle === "monthly" ? tier.price.monthly : tier.price.annual}
                    </span>
                    <span className="text-muted text-sm font-bold uppercase tracking-widest">/mo</span>
                  </div>
                  <div className="text-[10px] text-muted font-black uppercase tracking-widest">
                    {billingCycle === "annual" ? "Billed annually" : "Billed monthly"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-sm text-muted font-medium leading-relaxed">{tier.description}</p>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-muted border-b border-border/50 pb-4">Include in plan</div>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 group/item">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.highlight ? "text-accent" : "text-green-500/50"} transition-colors`} />
                      <span className="text-sm text-muted-foreground font-medium group-hover/item:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={getAdaptiveHref(tier.cta === "Contact Sales" ? "/contact" : "/dashboard")}
                className={`
                  w-full py-4 rounded-2xl font-bold text-center block transition-all hover:scale-[1.02] active:scale-[0.98]
                  ${tier.highlight 
                    ? "bg-accent text-white shadow-xl shadow-accent/20" 
                    : "bg-foreground text-background"
                  }
                `}
              >
                {tier.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ & Comparison */}
      <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground tracking-tight leading-none">Frequently asked <br /><span className="text-muted">questions.</span></h2>
            <p className="text-muted font-medium">Standard legalities and billing curiosities answered below.</p>
          </div>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="space-y-3 p-6 rounded-3xl bg-muted/10 border border-border/50 hover:bg-muted/20 transition-all">
                <h4 className="font-bold text-foreground flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-accent" />
                  {faq.q}
                </h4>
                <p className="text-muted text-sm leading-relaxed font-medium pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-12 rounded-[4rem] bg-void/50 border border-border/50 backdrop-blur-3xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <Zap className="w-64 h-64 text-accent" />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black text-foreground tracking-tight">Need Enterprise?</h3>
            <p className="text-lg text-muted font-medium leading-relaxed">
              If your team requires custom GPU quotas, SOC 2 compliance attestations, or dedicated VPC deployments, our Enterprise layer is built for you.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href={getAdaptiveHref("/contact")}
                className="px-10 py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
              >
                Contact Enterprise
              </Link>
              <Link 
                href={getAdaptiveHref("/docs")}
                className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors group"
              >
                Read Documentation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
