"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, TrendingUp, AlertCircle, Send, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CrucibleMessage {
  id: string;
  role: "investor" | "user";
  investor?: string;
  content: string;
  timestamp: Date;
}

interface CrucibleArenaProps {
  messages: CrucibleMessage[];
  isThinking: boolean;
  onSend: (answer: string) => void;
  round: number;
  maxRounds: number;
  onFinish?: () => void;
}

const INVESTORS = [
  {
    name: "Skeptic Alex",
    role: "Tech Lead",
    icon: UserCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    description: "Focuses on technical debt, scalability, and execution risk."
  },
  {
    name: "Growth Grace",
    role: "Market Analyst",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "Focuses on GTM, CAC/LTV, and competitive moats."
  },
  {
    name: "Conservative Ben",
    role: "General Partner",
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    description: "Focuses on ROI, compliance, and long-term exit paths."
  }
];

export function CrucibleArena({ messages, isThinking, onSend, round, maxRounds, onFinish }: CrucibleArenaProps) {
  const [inputValue, setInputValue] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;
    onSend(inputValue);
    setInputValue("");
  };

  const getInvestorInfo = (name?: string) => {
    return INVESTORS.find(i => name?.includes(i.name)) || INVESTORS[0];
  };

  const tensionPercent = (round / maxRounds) * 100;

  return (
    <div className="flex flex-col h-[700px] bg-void/30 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* ARENA HEADER: THE PANEL */}
      <div className="bg-muted/20 border-b border-border/50 p-6 flex items-center justify-between">
        <div className="flex gap-4">
          {INVESTORS.map((investor) => {
            const isActive = messages[messages.length - 1]?.investor === investor.name;
            return (
              <div 
                key={investor.name} 
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-500",
                  isActive ? "scale-110 opacity-100" : "scale-90 opacity-40 grayscale"
                )}
              >
                <div className={cn("p-3 rounded-2xl", investor.bg)}>
                  <investor.icon className={cn("w-6 h-6", investor.color)} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{investor.role}</p>
                  <p className="text-xs font-bold">{investor.name}</p>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="h-1 w-1 rounded-full bg-accent"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Tension Level</span>
            <div className="w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${tensionPercent}%` }}
                className={cn(
                    "h-full transition-all duration-700",
                    tensionPercent < 40 ? "bg-emerald-500" : tensionPercent < 75 ? "bg-amber-500" : "bg-red-500"
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted">
            <span>Round {round} of {maxRounds}</span>
          </div>
        </div>
      </div>

      {/* CHAT ARENA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth styled-scrollbar bg-noise opacity-90"
      >
        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const investor = !isUser ? getInvestorInfo(msg.investor) : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  isUser ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <span className={cn("text-[10px] font-extrabold uppercase", investor?.color)}>
                      {msg.investor}
                    </span>
                    <span className="text-[10px] text-muted-foreground">• {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  isUser 
                    ? "bg-accent text-white rounded-tr-none" 
                    : "bg-muted/40 backdrop-blur-md border border-border/50 text-foreground rounded-tl-none font-medium"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}

          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted text-xs font-bold animate-pulse"
            >
              <Sparkles className="w-3 h-3" />
              <span>Investment panel is huddling...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER: INPUT */}
      <div className="p-6 bg-muted/10 border-t border-border/50">
        {round < maxRounds ? (
          <form onSubmit={handleSubmit} className="relative">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isThinking}
              placeholder="Defend your decision..."
              className="w-full bg-void/50 border border-border/50 rounded-2xl py-4 px-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-muted/50"
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isThinking || !inputValue.trim()}
              className="absolute right-2 top-2 h-10 w-10 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center pb-2">
            <div className="flex items-center gap-2 text-emerald-500 font-bold group">
               <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span>Interrogation complete. The panel is deliberating.</span>
            </div>
            <Button onClick={onFinish} className="rounded-full px-12 group">
              Get Final Verdict 
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity }} className="ml-2">→</motion.span>
            </Button>
          </div>
        )}
        
        <p className="mt-3 text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-50">
           PulseKit Pitch Arena | Real-time Market Simulation
        </p>
      </div>

      {/* DANGER INDICATOR */}
      {tensionPercent > 80 && (
         <div className="absolute inset-0 border-2 border-red-500/20 animate-pulse pointer-events-none rounded-3xl" />
      )}
    </div>
  );
}
