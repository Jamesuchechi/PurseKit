"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import type { AiMessage } from "@/types";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, User, Code2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import remarkGfm from "remark-gfm";

interface LensChatAreaProps {
  messages: AiMessage[];
  isStreaming: boolean;
  className?: string;
}

function CodeBlockRenderer({ codeString, language }: { codeString: string, language: string }) {
  const isWeb = language === "html" || language === "xml";
  const [view, setView] = React.useState<"code" | "preview">("code");

  return (
    <div className="relative group my-6 rounded-2xl overflow-hidden border border-border/50 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{language}</span>
          {isWeb && (
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
              <button 
                onClick={() => setView("code")}
                className={cn("px-2 py-1 flex items-center gap-1.5 text-xs font-medium rounded-md transition-colors", view === "code" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}
              >
                <Code2 className="w-3.5 h-3.5" /> Code
              </button>
              <button 
                onClick={() => setView("preview")}
                className={cn("px-2 py-1 flex items-center gap-1.5 text-xs font-medium rounded-md transition-colors", view === "preview" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}
              >
                <Play className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          )}
        </div>
        
        <CopyButton text={codeString} className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10" />
      </div>

      {view === "code" ? (
        <SyntaxHighlighter
          style={vscDarkPlus as unknown as React.ComponentProps<typeof SyntaxHighlighter>["style"]}
          language={language}
          PreTag="div"
          className="!m-0 text-sm styled-scrollbar"
          customStyle={{ background: "transparent", padding: "1.25rem", maxHeight: "500px" }}
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        <div className="w-full bg-white relative" style={{ height: "400px" }}>
          <iframe 
            srcDoc={codeString}
            className="w-full h-full border-none"
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}

export function LensChatArea({ messages, isStreaming, className }: LensChatAreaProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const visibleMessages = messages.filter(m => m.role !== "system");

  if (visibleMessages.length === 0) {
    return (
      <div className={cn("flex-1 flex flex-col items-center justify-center p-8", className)}>
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 rotate-3">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">How can Lens help?</h2>
        <p className="text-muted-foreground max-w-md text-center">
          Ask me anything. I can write code, answer questions, draft emails, or just have a chat.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto px-4 py-8 styled-scrollbar", className)} ref={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-8 pb-32">
        {visibleMessages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4 w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shrink-0 mt-1 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={cn(
              "px-5 py-4 max-w-[85%] overflow-hidden",
              msg.role === "user" 
                ? "bg-muted text-foreground rounded-[2rem] rounded-tr-sm border border-border/50" 
                : "bg-transparent text-foreground"
            )}>
              {(() => {
                const text = typeof msg.content === "string" 
                  ? msg.content 
                  : msg.content.filter((part): part is { type: "text"; text: string } => part.type === "text").map(part => part.text).join("");
                const images = typeof msg.content === "string" 
                  ? [] 
                  : msg.content.filter(part => part.type === "image_url");

                return (
                  <div className="space-y-4">
                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative w-48 aspect-video rounded-xl overflow-hidden border border-border/50 shadow-lg">
                            <Image 
                              src={img.image_url?.url || ""} 
                              alt="Uploaded context" 
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap">{text}</div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-foreground prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-a:text-indigo-400">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown }) {
                              const match = /language-(\w+)/.exec(className || "");
                              const codeString = String(children).replace(/\n$/, "");
                              
                              if (!inline && match) {
                                return <CodeBlockRenderer codeString={codeString} language={match[1]} />;
                              }
                              
                              return (
                                <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-accent" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {text || (isStreaming && i === visibleMessages.length - 1 ? "..." : "")}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-accent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
