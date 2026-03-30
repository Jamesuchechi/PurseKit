"use client";

import * as React from "react";
import { 
  Terminal, Key, ShieldCheck, 
  ArrowRight, Copy, Check, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdaptiveLink } from "@/hooks/useAdaptiveLink";

const endpoints = [
  {
    method: "POST",
    path: "/v1/analyze",
    description: "Submit a code snippet for deep pulse analysis.",
    parameters: [
      { name: "code", type: "string", required: true },
      { name: "context", type: "object", required: false }
    ],
    response: `{ "pulse_score": 98.2, "insights": [...] }`
  },
  {
    method: "GET",
    path: "/v1/workspace",
    description: "Retrieve comprehensive workspace metadata.",
    parameters: [
      { name: "id", type: "uuid", required: true }
    ],
    response: `{ "id": "uuid-v4", "name": "Main Dev" }`
  }
];

export function ApiDocsContent() {
  const { getAdaptiveHref } = useAdaptiveLink();
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sidebar Nav */}
        <aside className="lg:w-64 shrink-0 space-y-12">
          <nav className="sticky top-32 space-y-12">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-2">Authentication</h3>
                <div className="space-y-1">
                   <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-foreground bg-muted/50 border border-border/50 transition-all flex items-center justify-between group">
                      Bearer Tokens
                      <ChevronRight className="w-3 h-3 opacity-100 transition-opacity" />
                   </button>
                   <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-foreground hover:bg-muted/30 transition-all flex items-center justify-between group">
                      Rate Limits
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-2">Endpoints</h3>
                <div className="space-y-1">
                   {endpoints.map((e) => (
                     <button 
                       key={e.path}
                       className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-muted hover:text-foreground hover:bg-muted/30 transition-all flex items-center gap-3"
                     >
                       <span className={`text-[10px] font-black ${e.method === 'POST' ? 'text-green-500' : 'text-blue-500'}`}>
                          {e.method}
                       </span>
                       <span className="truncate">{e.path}</span>
                     </button>
                   ))}
                </div>
             </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void/50 border border-border/50 text-muted text-[10px] font-black uppercase tracking-widest backdrop-blur-xl mb-4">
                <Terminal className="w-3 h-3 text-foreground" />
                API Protocols
             </div>
             <div>
                <h1 className="text-6xl font-display font-black tracking-tight text-foreground leading-none mb-6">
                   Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 range-600">Access.</span>
                </h1>
                <p className="text-xl text-muted font-medium leading-relaxed italic">
                   Build custom workflows atop the PulseKit core using our high-performance technical interfaces.
                </p>
             </div>

             {/* Authentication Intro */}
             <div className="p-10 rounded-[3rem] bg-muted/20 border border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                   <Key className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-void/50 border border-border flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Bearer Token Auth</h3>
                   </div>
                   <p className="text-muted leading-relaxed font-medium">To access our API, include the authorization header in every request. Rotate your keys regularly within your PulseKit settings.</p>
                   
                   <div className="relative bg-void p-5 rounded-2xl border border-border/50 group/code">
                      <code className="text-sm font-mono text-foreground/90">Authorization: Bearer YOUR_PK_KEY</code>
                      <button 
                        onClick={() => handleCopy("Authorization: Bearer YOUR_PK_KEY")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-muted/20 border border-border opacity-0 group-hover/code:opacity-100 transition-opacity"
                      >
                         {copied === "Authorization: Bearer YOUR_PK_KEY" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted" />}
                      </button>
                   </div>
                </div>
             </div>

             {/* Endpoint Details */}
             <div className="space-y-24">
                {endpoints.map((e) => (
                  <section key={e.path} className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black ${e.method === 'POST' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                              {e.method}
                           </span>
                           <h2 className="text-2xl font-bold font-mono text-foreground">{e.path}</h2>
                        </div>
                        <p className="text-muted leading-relaxed font-medium">
                           {e.description}
                        </p>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-8">
                        {/* Parameters */}
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Body Parameters</h4>
                           <div className="space-y-2">
                              {e.parameters.map(p => (
                                <div key={p.name} className="p-3 rounded-xl bg-muted/20 border border-border/50 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <span className="text-sm font-black font-mono text-foreground">{p.name}</span>
                                      <span className="text-[10px] font-black uppercase italic text-muted opacity-50">{p.type}</span>
                                   </div>
                                   {p.required && <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 italic">Req</span>}
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* Example Response */}
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Response Object</h4>
                           <div className="p-4 rounded-xl bg-void border border-border/50 relative group/resp">
                              <pre className="text-[11px] font-mono text-foreground/80 overflow-x-auto">
                                 {e.response}
                              </pre>
                              <button 
                                onClick={() => handleCopy(e.response)}
                                className="absolute right-3 top-3 p-1.5 rounded-lg bg-muted/10 border border-border opacity-0 group-hover/resp:opacity-100 transition-opacity"
                              >
                                {copied === e.response ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
                              </button>
                           </div>
                        </div>
                     </div>
                  </section>
                ))}
             </div>

             {/* Integration Link */}
             <div className="pt-24 flex items-center justify-center">
                <Link 
                  href={getAdaptiveHref("/docs")}
                  className="px-10 py-4 rounded-[2rem] bg-muted shadow-2xl shadow-black/10 text-foreground font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                   Back to Documentation
                   <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
