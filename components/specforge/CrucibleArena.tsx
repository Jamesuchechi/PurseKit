"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  History,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Target,
  Quote,
  RotateCcw,
  Zap,
  Cpu,
  Eye,
  LucideIcon,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { crucibleSystemPrompt, crucibleVerdictPrompt } from "@/lib/prompts";
import { useAiStream } from "@/hooks/useAiStream";
import { type AiMessage } from "@/lib/ai";

interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
}

export interface CrucibleMessage {
  id: string;
  role: "investor" | "user";
  investor?: string;
  content: string;
  isPushback?: boolean;
  timestamp: Date;
}

interface VerdictData {
  decision: "PASS" | "CONDITIONAL PASS" | "HARD PASS";
  score: number;
  justification: string;
  strongestMoment: string;
  weakestMoment: string;
  conditions: string[];
  killerQuestion: string;
}

interface CrucibleArenaProps {
  prdText: string;
  onRestart: () => void;
}

type Stage = "INTRO" | "INTERROGATION" | "VERDICT";

const INVESTORS = [
  {
    name: "Marc",
    role: "The VC",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    name: "Sarah",
    role: "The Skeptic",
    icon: Eye,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    name: "Leo",
    role: "The Engineer",
    icon: Cpu,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
];

export function CrucibleArena({ prdText, onRestart }: CrucibleArenaProps) {
  const [messages, setMessages] = React.useState<CrucibleMessage[]>([]);
  const [history, setHistory] = React.useState<AiMessage[]>([]);
  const [stage, setStage] = React.useState<Stage>("INTRO");
  const [turnCount, setTurnCount] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");
  const [verdictState, setVerdictState] = React.useState<VerdictData | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Guards against double-firing the startup call and the output-processing effect
  const hasStarted = React.useRef(false);
  const isProcessingOutput = React.useRef(false);

  // Capture a stable ref to stage so the output effect doesn't need it as a dep
  const stageRef = React.useRef<Stage>(stage);
  stageRef.current = stage;

  const { output, isLoading, run, setOutput } = useAiStream();

  const getInvestorInfo = React.useCallback((name?: string) => {
    const searchName = name?.toLowerCase() || "";
    return INVESTORS.find((i) => searchName.includes(i.name.toLowerCase())) || INVESTORS[0];
  }, []);

  const speak = React.useCallback((text: string, investorName: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Pre-clear to avoid overlapped speech
    window.speechSynthesis.cancel();
    
    // Tiny delay ensures cancel() propagates before speak() starts
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const investor = getInvestorInfo(investorName);
      
      if (investor.name === "Sarah") {
        utterance.pitch = 1.3;
        utterance.rate = 1.1;
      } else if (investor.name === "Leo") {
        utterance.pitch = 0.8;
        utterance.rate = 0.9;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }
      
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [getInvestorInfo]);

  const MAX_TURNS = 8;

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // ── Startup: fire exactly once when the PRD is ready ──────────────────────
  React.useEffect(() => {
    if (prdText && !hasStarted.current) {
      hasStarted.current = true;
      const systemPrompt = crucibleSystemPrompt(prdText);
      run("Begin the Session", { systemPrompt });
    }
  }, [prdText, run]);

  React.useEffect(() => {
    if (isLoading || !output || isProcessingOutput.current) return;

    isProcessingOutput.current = true;
    const currentStage = stageRef.current;

    if (currentStage !== "VERDICT") {
      const investorMatch = output.match(/\[INVESTOR:\s*(.*?)\]/i);
      const contentMatch = output.match(/\[CONTENT:\s*(.*?)\]/i);
      const isPushback = output.includes("[PUSHBACK]");

      const investorName = investorMatch?.[1].trim() || "Marc";
      const content = contentMatch?.[1].trim() || output.replace(/\[.*?\]/g, "").trim();

      if (content) {
        const aiCrucibleMsg: CrucibleMessage = {
          id: `ai-${Date.now()}`,
          role: "investor",
          investor: investorName,
          content,
          isPushback,
          timestamp: new Date(),
        };
        const aiMsg: AiMessage = { role: "assistant", content: output };

        setMessages((prev) => [...prev, aiCrucibleMsg]);
        setHistory((prev) => [...prev, aiMsg]);
        
        // Speak if voice is enabled - BEFORE clearing output
        if (isVoiceEnabled) {
          speak(content, investorName);
        }

        setOutput("");

        if (currentStage === "INTRO") {
          setStage("INTERROGATION");
        }
      }
    } else {
      try {
        const json = JSON.parse(output.replace(/```json|```/g, "").trim());
        setVerdictState(json);
        setOutput("");
      } catch (e) {
        console.error("Failed to parse verdict JSON", e);
      }
    }

    isProcessingOutput.current = false;
  }, [isLoading, output, setOutput, isVoiceEnabled, speak]);

  // Effect to replay last message if voice is enabled AFTER message arrived
  React.useEffect(() => {
    if (isVoiceEnabled && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "investor" && !isLoading) {
        speak(lastMsg.content, lastMsg.investor || "Marc");
      }
    }
  }, [isVoiceEnabled, messages, isLoading, speak]);

  // ── Send user message ─────────────────────────────────────────────────────
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading || stage === "VERDICT") return;

    const userCrucibleMsg: CrucibleMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    const userAiMsg: AiMessage = { role: "user", content: inputValue };
    const newHistory = [...history, userAiMsg];

    setMessages((prev) => [...prev, userCrucibleMsg]);
    setHistory(newHistory);
    setInputValue("");

    if (turnCount + 1 >= MAX_TURNS) {
      setStage("VERDICT");
      const verdictPrompt = crucibleVerdictPrompt(newHistory);
      run("Final Judgment", { systemPrompt: verdictPrompt });
    } else {
      setTurnCount((prev) => prev + 1);
      const systemPrompt = crucibleSystemPrompt(prdText);
      run(inputValue, { systemPrompt, messages: newHistory });
    }
  };


  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Capture initial value for concatenation
    const currentVal = inputValue;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let sessionTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        sessionTranscript += event.results[i][0].transcript;
      }
      setInputValue(currentVal ? `${currentVal.trim()} ${sessionTranscript.trim()}` : sessionTranscript.trim());
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current?.stop();
    };
  }, []);

  if (verdictState) {
    return <VerdictCard verdict={verdictState} onRestart={onRestart} />;
  }

  return (
    <div className="flex flex-col h-[700px] bg-void/30 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* HEADER: STAGE INDICATOR */}
      <div className="bg-muted/20 border-b border-border/50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <StageItem
            label="Intro"
            isActive={stage === "INTRO"}
            isDone={stage === "INTERROGATION" || stage === "VERDICT"}
          />
          <ChevronRight className="w-4 h-4 text-muted/30" />
          <StageItem
            label={`Interrogation (${turnCount}/${MAX_TURNS})`}
            isActive={stage === "INTERROGATION"}
            isDone={stage === "VERDICT"}
          />
          <ChevronRight className="w-4 h-4 text-muted/30" />
          <StageItem label="Verdict" isActive={stage === "VERDICT"} isDone={false} />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              if (isVoiceEnabled) window.speechSynthesis.cancel();
            }}
            className={cn(
              "p-2 rounded-xl border transition-all",
              isVoiceEnabled ? "bg-accent/10 border-accent/30 text-accent" : "text-muted"
            )}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <div className="w-px h-6 bg-border/50 mx-2" />
          
          {INVESTORS.map((inv) => {
            const isSpeaking = messages[messages.length - 1]?.investor === inv.name;
            return (
              <div
                key={inv.name}
                className={cn(
                  "p-2 rounded-xl transition-all duration-500",
                  isSpeaking
                    ? cn(inv.bg, "scale-110 shadow-lg")
                    : "opacity-20 grayscale scale-90"
                )}
              >
                <inv.icon className={cn("w-5 h-5", inv.color)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth styled-scrollbar"
      >
        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const investor = !isUser ? getInvestorInfo(msg.investor) : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  isUser ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        investor?.color
                      )}
                    >
                      {msg.investor}
                    </span>
                    {msg.isPushback && (
                      <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" /> PUSHBACK
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    "p-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300",
                    isUser
                      ? "bg-accent text-white rounded-tr-none shadow-accent/10"
                      : cn(
                          "bg-muted/40 backdrop-blur-md border border-border/50 text-foreground rounded-tl-none font-medium",
                          msg.isPushback &&
                            "border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5"
                        )
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-muted text-xs font-bold bg-muted/10 w-fit px-4 py-2 rounded-full border border-border/30"
            >
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="uppercase tracking-[0.2em] text-[8px] font-black">
                {(() => {
                  const match = output.match(/\[INVESTOR:\s*(.*?)\]/i);
                  const name = match?.[1]?.trim();
                  return name ? `${name} is interrogating...` : "The Panel is deliberating...";
                })()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-muted/10 border-t border-border/50">
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-0">
             <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all",
                  isListening ? "bg-red-500 text-white animate-pulse" : "text-muted hover:text-accent"
                )}
             >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
             </Button>
          </div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || stage === "VERDICT"}
            placeholder={
              isLoading ? "The panel is speaking..." : isListening ? "Listening..." : "Defend your thesis..."
            }
            className="w-full bg-void/50 border border-border/50 rounded-2xl py-5 pl-14 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-muted/50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !inputValue.trim() || stage === "VERDICT"}
            className="absolute right-3 top-3 h-10 w-10 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="mt-4 text-[9px] text-center text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
          Founders Crucible Engine v2.0 | High-Intensity Market Simulation
        </p>
      </div>
    </div>
  );
}

function StageItem({
  label,
  isActive,
  isDone,
}: {
  label: string;
  isActive: boolean;
  isDone: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
        isActive ? "text-accent" : isDone ? "text-emerald-500" : "text-muted-foreground/40"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-full border flex items-center justify-center",
          isActive
            ? "border-accent animate-pulse"
            : isDone
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-muted-foreground/20"
        )}
      >
        {isDone ? (
          <CheckCircle2 className="w-3 h-3" />
        ) : (
          <div
            className={cn(
              "w-1 h-1 rounded-full",
              isActive ? "bg-accent" : "bg-transparent"
            )}
          />
        )}
      </div>
      {label}
    </div>
  );
}

function VerdictCard({
  verdict,
  onRestart,
}: {
  verdict: VerdictData;
  onRestart: () => void;
}) {
  const getDecisionColor = (d: string) => {
    if (d === "PASS") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (d === "CONDITIONAL PASS")
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SCORE & DECISION */}
        <div className="md:col-span-1 bg-void/50 border border-border/50 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-muted/20 flex items-center justify-center">
              <span className="text-5xl font-black">{verdict.score}</span>
              <span className="absolute -bottom-2 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Score
              </span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset--4 border border-dashed border-accent/20 rounded-full"
            />
          </div>

          <div className="space-y-2">
            <div
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest",
                getDecisionColor(verdict.decision)
              )}
            >
              {verdict.decision}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 italic">
              &quot;{verdict.justification}&quot;
            </p>
          </div>

          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full rounded-2xl gap-2 border-border/50 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try New Pitch
          </Button>
        </div>

        {/* FEEDBACK & MOMENTS */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MomentBox
              icon={History}
              title="Strongest Moment"
              content={verdict.strongestMoment}
              color="text-emerald-500"
              bg="bg-emerald-500/5"
            />
            <MomentBox
              icon={Target}
              title="Weakest Moment"
              content={verdict.weakestMoment}
              color="text-red-500"
              bg="bg-red-500/5"
            />
          </div>

          <div className="bg-void/50 border border-border/50 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-border/30 pb-4">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="font-bold uppercase tracking-widest text-xs">
                Non-Negotiable Conditions
              </h3>
            </div>
            <div className="space-y-4">
              {verdict.conditions.map((c, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-bold uppercase tracking-widest text-xs text-accent">
                The Killer Question
              </h3>
            </div>
            <p className="text-lg font-display font-medium text-foreground italic leading-relaxed">
              &quot;{verdict.killerQuestion}&quot;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MomentBox({
  icon: Icon,
  title,
  content,
  color,
  bg,
}: {
  icon: LucideIcon;
  title: string;
  content: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-6 border border-border/50 space-y-3 relative overflow-hidden",
        bg
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</h4>
      </div>
      <div className="relative">
        <Quote className="w-8 h-8 text-muted/10 absolute -top-2 -left-2 rotate-180" />
        <p className="text-sm text-foreground leading-relaxed font-medium pl-2 relative z-10">
          {content}
        </p>
      </div>
    </div>
  );
}