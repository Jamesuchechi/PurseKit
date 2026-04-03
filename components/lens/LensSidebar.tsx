"use client";

import * as React from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AiMessage } from "@/types";

interface LensSidebarProps {
  currentChatId: string | null;
  onSelectChat: (id: string, messages: AiMessage[]) => void;
  onNewChat: () => void;
}

export function LensSidebar({ currentChatId, onSelectChat, onNewChat }: LensSidebarProps) {
  const { items, remove } = useHistory<{ messages: AiMessage[] }>("lens");

  return (
    <div className="w-72 h-full bg-background/50 backdrop-blur-xl border-r border-border/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <Button onClick={onNewChat} className="w-full h-11 gap-2 bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 rounded-xl transition-all shadow-none">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto styled-scrollbar p-3 space-y-1">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">Recent</div>
        {items.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground/60 bg-muted/30 rounded-xl border border-dashed border-border/50">
            No previous chats
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="relative group flex items-center">
              <button
                onClick={() => onSelectChat(item.id, (item.result as { messages: AiMessage[] })?.messages || [])}
                className={cn(
                  "flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm truncate",
                  currentChatId === item.id 
                    ? "bg-accent/10 text-accent font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                <span className="truncate">{item.title}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(item.id);
                  if (currentChatId === item.id) onNewChat();
                }}
                className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-background hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-muted-foreground shadow-sm border border-border/50 hover:border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
