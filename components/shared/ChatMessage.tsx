"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles, Copy, Check, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { type AiMessageContent } from "@/types";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: AiMessageContent;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const { copied, copy } = useCopyToClipboard();
  const isAssistant = role === "assistant";

  const textContent = React.useMemo(() => {
    if (typeof content === "string") return content;
    return content
      .filter((part) => part.type === "text")
      .map((part) => ("text" in part ? part.text : ""))
      .join("\n");
  }, [content]);

  const images = React.useMemo(() => {
    if (typeof content === "string") return [];
    return content
      .filter((part) => part.type === "image_url")
      .map((part) => ("image_url" in part ? part.image_url.url : ""));
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full gap-4 p-4 rounded-2xl transition-all duration-300 group",
        isAssistant 
          ? "bg-muted/30 border border-border/50" 
          : "bg-accent/5 border border-accent/10"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 shadow-sm",
        isAssistant ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
      )}>
        {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {isAssistant ? "Pulse Assistant" : "You"}
          </span>
          {isAssistant && textContent && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copy(textContent)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </Button>
          )}
        </div>

        <div className={cn(
          "prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-sans",
          "prose-pre:bg-void prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl",
          "prose-code:text-accent prose-code:bg-accent/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
        )}>
          {isAssistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textContent || "Thinking..."}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{textContent}</p>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {images.map((url, i) => (
              <div key={i} className="relative group/img rounded-xl overflow-hidden border border-border/50 bg-muted/20 aspect-video">
                <Image 
                  src={url} 
                  alt={`Attachment ${i + 1}`} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover/img:scale-110" 
                />
                <div className="absolute inset-0 bg-void/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
