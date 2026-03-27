"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/auth/actions";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-bg">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-background/40 dark:bg-void/40 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 dark:bg-accent/30 blur-md rounded-lg group-hover:blur-lg transition-all" />
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 dark:from-accent/90 dark:to-accent/70 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white drop-shadow-glow" />
                  </div>
                </div>
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
                  PulseKit
                </span>
              </Link>
              <h2 className="text-3xl font-display font-bold tracking-tight text-foreground mb-2">
                Create account
              </h2>
              <p className="text-muted text-sm font-medium">
                Start your journey with PulseKit today
              </p>
            </div>

            <form action={loginAction} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-background/50 dark:bg-void/50 border border-border/50 focus:border-accent/50 rounded-2xl text-sm placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Full name"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-background/50 dark:bg-void/50 border border-border/50 focus:border-accent/50 rounded-2xl text-sm placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-background/50 dark:bg-void/50 border border-border/50 focus:border-accent/50 rounded-2xl text-sm placeholder:text-muted/50 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Create password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-accent focus:ring-accent border-border/50 rounded bg-background/50 dark:bg-void/50"
                  />
                </div>
                <label htmlFor="terms" className="text-xs text-muted leading-snug">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="font-semibold text-accent hover:text-accent/80 transition-colors">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="font-semibold text-accent hover:text-accent/80 transition-colors">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-bold text-base shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground font-semibold">Or join with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 text-sm font-bold transition-all hover:scale-105 active:scale-95">
                <Github className="h-5 w-5" />
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 text-sm font-bold transition-all hover:scale-105 active:scale-95">
                <Chrome className="h-5 w-5" />
                Google
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted font-medium py-3 px-4 rounded-xl bg-accent/5 border border-accent/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Enterprise-grade security included</span>
            </div>
          </div>

          <div className="px-8 py-6 bg-muted/30 dark:bg-void/50 border-t border-border/50 text-center text-sm">
            <span className="text-muted">Already have an account? </span>
            <Link href="/auth/signin" className="font-bold text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
