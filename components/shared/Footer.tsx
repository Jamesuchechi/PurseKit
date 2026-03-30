"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Zap, Github, Twitter, Linkedin, Youtube, Mail, 
  ArrowUpRight, Heart, Globe, Shield, Rocket, 
  Brain, FileText, BarChart3, Book, HelpCircle,
  Users, Briefcase, Code, MessageCircle
} from "lucide-react";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "DevLens", href: "/devlens", icon: Brain },
    { label: "SpecForge", href: "/specforge", icon: FileText },
    { label: "ChartGPT", href: "/chartgpt", icon: BarChart3 },
    { label: "Pricing", href: "/pricing", icon: Rocket },
  ],
  resources: [
    { label: "Documentation", href: "/docs", icon: Book },
    { label: "API Reference", href: "/api-docs", icon: Code },
    { label: "Help Center", href: "/help", icon: HelpCircle },
    { label: "Community", href: "/community", icon: MessageCircle },
  ],
  company: [
    { label: "About Us", href: "/about", icon: Users },
    { label: "Careers", href: "/careers", icon: Briefcase },
    { label: "Blog", href: "/blog", icon: Globe },
    { label: "Contact", href: "/contact", icon: Mail },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
};

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github, color: "hover:text-foreground" },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter, color: "hover:text-blue-400" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, color: "hover:text-blue-500" },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube, color: "hover:text-red-500" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  // Determine if we are in app view context
  const isAppView = 
    pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/devlens") || 
    pathname?.startsWith("/specforge") || 
    pathname?.startsWith("/chartgpt") || 
    pathname?.startsWith("/analytics") || 
    pathname?.startsWith("/notifications") || 
    pathname?.startsWith("/settings");

  const getAdaptiveHref = (slug: string) => {
    return isAppView ? `${slug}?view=app` : slug;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="relative border-t border-border bg-background/50 dark:bg-void/50 backdrop-blur-sm">
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Stay in the loop
              </h3>
              <p className="text-muted text-sm">
                Get the latest updates on new features, AI advancements, and engineering insights delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-background dark:bg-void/50 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  aria-label="Email address"
                />
              </div>
              <motion.button
                type="submit"
                disabled={subscribed}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-6 py-3.5 rounded-xl font-bold text-sm transition-all
                  ${subscribed
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg shadow-accent/20 hover:shadow-accent/30"
                  }
                `}
              >
                {subscribed ? (
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-white" />
                    Subscribed!
                  </span>
                ) : (
                  "Subscribe"
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 dark:bg-accent/30 blur-md rounded-lg" />
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 dark:from-accent/90 dark:to-accent/70 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-display text-xl font-bold text-foreground">PulseKit</span>
            </Link>
            
            <p className="text-muted text-sm mb-6 leading-relaxed max-w-xs">
              The AI-native workspace built for engineers and data scientists. Code smarter, ship faster.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={getAdaptiveHref(link.href)}
                      className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={getAdaptiveHref(link.href)}
                      className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={getAdaptiveHref(link.href)}
                      className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getAdaptiveHref(link.href)}
                    className="text-muted hover:text-foreground transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-muted">
            <p>© {new Date().getFullYear()} PulseKit. All rights reserved.</p>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-medium">SOC 2 Type II Certified</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>for builders everywhere</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />
    </footer>
  );
}