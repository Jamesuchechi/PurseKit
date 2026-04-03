"use client";

import * as React from "react";
import { LensSidebar } from "@/components/lens/LensSidebar";
import { LensChatArea } from "@/components/lens/LensChatArea";
import { LensInput } from "@/components/lens/LensInput";
import { ModelSelector, MODELS } from "@/components/lens/ModelSelector";
import { SettingsMenu } from "@/components/lens/SettingsMenu";
import { useChat } from "@/hooks/useChat";
import { useHistory } from "@/hooks/useHistory";
import { Sparkles, Menu, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AiMessage, AiMessageContent } from "@/types";

export default function LensPage() {
  const [inputValue, setInputValue] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState(MODELS[0].id);
  const [selectedProvider, setSelectedProvider] = React.useState(MODELS[0].provider);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // AI Settings
  const [tone, setTone] = React.useState("normal");
  const [format, setFormat] = React.useState("auto");
  const [theme, setTheme] = React.useState("default");
  const [isSearchEnabled, setIsSearchEnabled] = React.useState(false);
  
  const { save, update } = useHistory<{ messages: AiMessage[] }>("lens");

  const systemInstructions = React.useMemo(() => {
    let base = "You are a helpful and intelligent AI assistant. Use markdown for your responses. Structure code blocks clearly with the appropriate programming language.\n\n";
    if (tone !== "normal") {
      base += `Tone Directive: Adopt a strictly ${tone} tone and personality in all your responses.\n`;
    }
    if (format !== "auto") {
      if (format === "short") base += "Format Directive: Be incredibly concise, short, and precise. No fluff.\n";
      if (format === "detailed") base += "Format Directive: Be highly detailed, comprehensive, and robust in your explanation.\n";
      if (format === "bullet") base += "Format Directive: Respond exclusively using bullet points.\n";
      if (format === "code") base += "Format Directive: Only provide the code block payload. No explanations, no greetings.\n";
    }
    if (isSearchEnabled) {
      base += "capability: You have access to real-time web search results. If you need current data, acknowledge that you are searching and provide the most up-to-date information possible.\n";
    }
    return base;
  }, [tone, format, isSearchEnabled]);

  const {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    clearMessages,
  } = useChat({
    systemPrompt: systemInstructions,
    onSuccess: (fullResponse) => {
      handleSaveHistory(fullResponse);
    }
  });

  const handleSaveHistory = React.useCallback((latestAssistantContent?: string) => {
    const currentMsgs = [...messages];
    if (latestAssistantContent) {
        const lastIndex = currentMsgs.length - 1;
        if (currentMsgs[lastIndex]?.role === "assistant") {
           currentMsgs[lastIndex].content = latestAssistantContent;
        }
    }

    if (currentMsgs.length === 0) return;

    if (currentChatId) {
      update(currentChatId, { result: { messages: currentMsgs } });
    } else {
      const userMessage = currentMsgs.find(m => m.role === "user");
      // Handle array or string content extraction for title
      let rawTitle = "New Conversation";
      if (userMessage) {
        if (typeof userMessage.content === "string") {
          rawTitle = userMessage.content;
        } else if (Array.isArray(userMessage.content)) {
          const textPart = userMessage.content.find((c) => c.type === "text");
          if (textPart && 'text' in textPart) rawTitle = textPart.text;
        }
      }
      
      const title = rawTitle.slice(0, 40) + "...";
      
      save({
        title,
        input: title,
        result: { messages: currentMsgs }
      }).then(item => {
        if (item) setCurrentChatId(item.id);
      });
    }
  }, [messages, currentChatId, update, save]);

  const handleSubmit = (attachments?: { name: string; content: string; size: number; type: string }[]) => {
    if (!inputValue.trim() && (!attachments || attachments.length === 0)) return;
    
    let textContent = inputValue;
    const images = attachments?.filter(a => a.type.startsWith("image/")) || [];
    const files = attachments?.filter(a => !a.type.startsWith("image/")) || [];
    
    if (files.length > 0) {
      const parts = files.map(att => 
        `[FILE: ${att.name}]\n\`\`\`\n${att.content}\n\`\`\``
      );
      textContent = `${parts.join("\n\n")}\n\n${inputValue}`;
    }

    let finalContent: AiMessageContent = textContent;

    if (images.length > 0) {
      finalContent = [
        { type: "text" as const, text: textContent || "What's in these images?" },
        ...images.map(img => ({
          type: "image_url" as const,
          image_url: { url: img.content }
        }))
      ];
    }

    setInputValue("");
    sendMessage(finalContent, selectedProvider, selectedModel);
  };

  const handleNewChat = () => {
    clearMessages();
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (id: string, historyMsgs: AiMessage[]) => {
    setCurrentChatId(id);
    setMessages(historyMsgs);
    setIsSidebarOpen(false);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    let exportText = "# Lens Chat Export\n\n";
    messages.forEach(m => {
      const contentStr = typeof m.content === "string" 
        ? m.content 
        : m.content.map(c => c.type === "text" ? c.text : "[IMAGE]").join("\n");
        
      exportText += `### ${m.role.toUpperCase()}:\n${contentStr}\n\n---\n\n`;
    });
    
    const blob = new Blob([exportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Lens_Export_${new Date().toISOString().split("T")[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      "flex h-[100dvh] w-full transition-all duration-700 overflow-hidden",
      theme === "default" && "bg-void",
      theme === "cyberpunk" && "bg-[#050505] text-[#00f3ff] [text-shadow:0_0_10px_rgba(0,243,255,0.3)]",
      theme === "glass" && "bg-gradient-to-br from-indigo-950/20 to-rose-950/20 backdrop-blur-3xl",
      theme === "minimal" && "bg-white text-black"
    )}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-72 lg:w-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        theme === "minimal" && "border-r border-black/5"
      )}>
        <LensSidebar 
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col relative w-full h-full max-w-full min-w-0 transition-colors duration-500",
        theme === "cyberpunk" && "border-l border-[#00f3ff]/20",
        theme === "minimal" && "bg-gray-50/50"
      )}>
        
        {/* Header */}
        <header className={cn(
          "h-16 flex-shrink-0 flex justify-between items-center px-4 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 transition-all",
          theme === "cyberpunk" && "bg-black/90 border-[#00f3ff]/30 shadow-[0_4px_20px_rgba(0,243,255,0.1)]",
          theme === "minimal" && "bg-white border-black/5"
        )}>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg",
                theme === "default" && "bg-gradient-to-br from-indigo-500 to-rose-500 shadow-indigo-500/20",
                theme === "cyberpunk" && "bg-[#00f3ff] shadow-[#00f3ff]/40",
                theme === "minimal" && "bg-black shadow-none rounded-lg"
              )}>
                <Sparkles className={cn("w-4 h-4", theme === "minimal" ? "text-white" : "text-white")} />
              </div>
              <h1 className={cn(
                "font-bold tracking-tight hidden sm:block",
                theme === "cyberpunk" && "text-[#00f3ff] uppercase tracking-[0.2em]",
                theme === "minimal" && "text-black font-medium"
              )}>Lens</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {messages.length > 0 && (
              <Button variant="ghost" size="icon" onClick={handleExportChat} title="Export Chat as Markdown" className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 transition-colors",
                theme === "cyberpunk" ? "text-[#00f3ff] hover:bg-[#00f3ff]/10" : "text-muted-foreground hover:text-foreground"
              )}>
                <Download className="w-4 h-4" />
              </Button>
            )}
            <SettingsMenu 
              tone={tone} setTone={setTone} 
              format={format} setFormat={setFormat}
              theme={theme} setTheme={setTheme}
              isSearchEnabled={isSearchEnabled} setIsSearchEnabled={setIsSearchEnabled}
            />
            <div className="scale-90 sm:scale-100 origin-right">
              <ModelSelector 
                value={selectedModel}
                onChange={(id, provider) => {
                  setSelectedModel(id);
                  setSelectedProvider(provider);
                }}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <LensChatArea 
          messages={messages}
          isStreaming={isLoading}
          className={cn(
            theme === "cyberpunk" && "[&_*]:!font-mono",
            theme === "minimal" && "[&_p]:!tracking-normal"
          )}
        />

        {/* Input */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[90%] sm:max-w-4xl sm:mx-auto sm:-translate-x-1/2 sm:left-1/2 z-30">
           <LensInput 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onSubmit={handleSubmit}
             isLoading={isLoading}
             onNewChat={handleNewChat}
             className={cn(
               "transition-all duration-500",
               theme === "cyberpunk" && "bg-black/90 border-[#00f3ff]/50 rounded-none shadow-[0_0_30px_rgba(0,243,255,0.1)]",
               theme === "minimal" && "bg-white border-black/10 rounded-2xl shadow-none"
             )}
           />
        </div>
      </div>
    </div>
  );
}
