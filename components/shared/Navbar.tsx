"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, FileText, BarChart3, Zap, Home, Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalSession } from "@/components/providers/LocalSessionProvider";
import { User } from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/devlens", label: "DevLens", icon: Brain, color: "accent", activeGradient: "from-accent/20 to-accent/5" },
  { href: "/specforge", label: "SpecForge", icon: FileText, color: "amber", activeGradient: "from-amber/20 to-amber/5" },
  { href: "/chartgpt", label: "ChartGPT", icon: BarChart3, color: "violet", activeGradient: "from-violet/20 to-violet/5" },
];

export default function Navbar() {
  const { user } = useLocalSession();
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (!mounted) return null;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled 
            ? "bg-background/80 dark:bg-void/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5 dark:shadow-accent/5" 
            : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group"
              aria-label="PulseKit Home"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 dark:bg-accent/30 blur-md rounded-lg group-hover:blur-lg transition-all" />
                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent/80 dark:from-accent/90 dark:to-accent/70 flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white drop-shadow-glow" />
                </div>
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
                PulseKit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {nav
                .filter((item) => {
                  const isPublicOrAuthPage = path === "/" || path.startsWith("/auth/");
                  const isProtectedRoute = ["/devlens", "/specforge", "/chartgpt"].includes(item.href);
                  return !(isPublicOrAuthPage && isProtectedRoute);
                })
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = path === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative group flex items-center gap-2 px-4 py-2 rounded-xl
                        text-sm font-medium transition-all duration-300
                        hover:scale-105 active:scale-95
                        ${isActive 
                          ? `bg-gradient-to-r ${item.activeGradient} border border-${item.color}/30 text-${item.color}` 
                          : "text-muted hover:text-foreground hover:bg-muted/50"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className={`absolute inset-0 bg-gradient-to-r ${item.activeGradient} border border-${item.color}/30 rounded-xl`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all hover:scale-105 active:scale-95"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-amber" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-violet" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Try it Button or User Profile */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-accent" />
                  {user.name}
                </div>
              ) : (
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Try it
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background dark:bg-void border-l border-border shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Close Button */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2" role="navigation">
                  {nav
                    .filter((item) => {
                      const isPublicOrAuthPage = path === "/" || path.startsWith("/auth/");
                      const isProtectedRoute = ["/devlens", "/specforge", "/chartgpt"].includes(item.href);
                      return !(isPublicOrAuthPage && isProtectedRoute);
                    })
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = path === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl
                            text-base font-medium transition-all
                            ${isActive 
                              ? `bg-gradient-to-r ${item.activeGradient} border border-${item.color}/30 text-${item.color}` 
                              : "hover:bg-muted/50"
                            }
                          `}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                </nav>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Action Buttons */}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-white text-sm font-bold shadow-lg shadow-accent/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try it
                  </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}