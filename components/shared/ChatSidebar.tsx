"use client";

import * as React from "react";
import { 
  X, 
  Trash2, 
  Send, 
  Sparkles, 
  Activity, 
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useChat } from "@/hooks/useChat";
import { useModuleContext } from "@/context/ModuleContext";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { Tooltip } from "@/components/ui/Tooltip";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { activeModule, lastResult } = useModuleContext();
  const [includeContext, setIncludeContext] = React.useState(true);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const getSystemPrompt = React.useCallback(() => {
    let prompt = "You are Pulse Assistant, an AI expert in software engineering and data science. You are helpful, precise, and professional.";
    
    if (includeContext && lastResult) {
      prompt += `\n\nCURRENT CONTEXT (${activeModule}):\n${JSON.stringify(lastResult, null, 2)}`;
      
      if (activeModule === "devlens") {
        prompt += "\n\nYou are acting as a Code Auditor. Focus on technical accuracy and idiomatic patterns.";
      } else if (activeModule === "specforge") {
        prompt += "\n\nYou are acting as a Product Architect. Focus on user experience and technical feasibility.";
      } else if (activeModule === "chartgpt") {
        prompt += "\n\nYou are acting as a Data Analyst. Focus on statistical significance and visual storytelling.";
      }
    }
    
    return prompt;
  }, [activeModule, lastResult, includeContext]);

  const { messages, isLoading, error: chatError, sendMessage, clearMessages } = useChat({
    systemPrompt: getSystemPrompt(),
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-void/60 backdrop-blur-sm lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[210] w-full max-w-[420px] bg-background dark:bg-void border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg uppercase tracking-tight">AI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Contextual Brain</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Clear Chat">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="h-8 w-8 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg text-muted hover:bg-muted/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Context Status */}
            {activeModule !== "home" && !!lastResult && (
              <div className="px-6 py-3 bg-muted/20 border-b border-border/10 flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Connected: {activeModule}
                  </span>
                </div>
                <button
                  onClick={() => setIncludeContext(!includeContext)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                    includeContext 
                      ? "text-accent bg-accent/10 ring-1 ring-accent/20" 
                      : "text-muted-foreground bg-muted ring-1 ring-border/20"
                  )}
                >
                  {includeContext ? "Context Active" : "Context Inactive"}
                </button>
              </div>
            )}

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 styled-scrollbar bg-void/5 transition-all duration-500"
            >
              {chatError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10">
                    <X className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-widest text-[10px] mb-1">AI Communication Error</p>
                    <p className="leading-relaxed">{chatError}</p>
                  </div>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center border border-border/50 relative">
                    <MessageSquare className="w-8 h-8 text-muted" />
                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground text-lg">Ask Pulse Assistant</h4>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
                      I&apos;m your {activeModule !== "home" ? activeModule : "universal"} AI expert. How can I help you today?
                    </p>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="w-full space-y-2 mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Try asking:</p>
                    
                    {activeModule === "devlens" && (
                      <>
                        <button onClick={() => sendMessage("What is the most critical bug in this code?")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;What is the most critical bug in this code?&quot;
                        </button>
                        <button onClick={() => sendMessage("Explain this code in simple terms for a junior developer.")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;Explain this code in simple terms&quot;
                        </button>
                      </>
                    )}

                    {activeModule === "specforge" && (
                      <>
                        <button onClick={() => sendMessage("What major edge cases am I missing in this PRD?")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;What major edge cases am I missing?&quot;
                        </button>
                        <button onClick={() => sendMessage("Draft 3 technical challenges for implementing this feature.")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;Draft 3 technical challenges&quot;
                        </button>
                      </>
                    )}

                    {activeModule === "chartgpt" && (
                      <>
                        <button onClick={() => sendMessage("What surprising trends or anomalies do you see in this data?")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;What surprising trends do you see?&quot;
                        </button>
                        <button onClick={() => sendMessage("Suggest a better chart type for visualizing these specific columns.")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;Suggest a better chart type&quot;
                        </button>
                      </>
                    )}

                    {activeModule === "home" && (
                      <>
                        <button onClick={() => sendMessage("Explain how PulseKit can help me as a Principal Engineer.")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;How can PulseKit help me today?&quot;
                        </button>
                        <button onClick={() => sendMessage("Compare the pros and cons of Groq vs Mistral models.")} className="w-full text-left p-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors text-xs text-accent font-medium">
                          &quot;Groq vs Mistral models&quot;
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role as "user" | "assistant"} content={msg.content} />
                  ))}
                  {isLoading && messages[messages.length - 1].role === "user" && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs p-4 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Assitant is thinking...
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
              <div className="relative group">
                <Textarea
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-12 min-h-[100px] max-h-[300px] bg-muted/20 border-border/50 focus:ring-accent/20 transition-all rounded-2xl resize-none"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "absolute right-2 bottom-2 rounded-xl h-10 w-10 transition-all",
                    input.trim() ? "bg-accent hover:bg-accent/90" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className={cn("w-5 h-5 translate-x-0.5 -translate-y-0.5", isLoading && "animate-pulse")} />
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground mt-3 text-center uppercase tracking-widest font-bold">
                PulseKit AI can make mistakes. Verify important facts.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Simple MessageSquare icon placeholder since I already imported it above or use standard Lucide
