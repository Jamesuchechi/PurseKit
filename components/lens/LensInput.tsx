"use client";

import * as React from "react";
import { Send, Plus, Loader2, Paperclip, Mic, X, Command } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AttachedFile {
  name: string;
  content: string;
  size: number;
  type: string;
}

interface LensInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (attachments?: AttachedFile[]) => void;
  isLoading: boolean;
  className?: string;
  onNewChat?: () => void;
}

interface ISpeechRecognitionEvent {
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

// Quick Commands Data
const SLASH_COMMANDS = [
  { trigger: "/summarize", description: "Summarize the following text", prefix: "Please summarize the following context in an easily digestible format:\n\n" },
  { trigger: "/code", description: "Write structured code", prefix: "Act as a senior software engineer. Please write well-structured, bug-free code for the following request:\n\n" },
  { trigger: "/debug", description: "Analyze stack trace for bugs", prefix: "Analyze this stack trace/code block and explain why it's breaking, then provide the fix:\n\n" },
  { trigger: "/explain", description: "Explain like I'm 5", prefix: "Please explain the following concept or code snippet as if I were a 5-year-old:\n\n" }
];

export function LensInput({ value, onChange, onSubmit, isLoading, className, onNewChat }: LensInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // File Attachment State
  const [attachments, setAttachments] = React.useState<AttachedFile[]>([]);
  
  // Voice Dictation State
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null);

  // Slash Command State
  const [showCommands, setShowCommands] = React.useState(false);
  const [commandIndex, setCommandIndex] = React.useState(0);

  // 1. Text resizing & command pallet tracking
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }

    if (value === "/") {
      setShowCommands(true);
      setCommandIndex(0);
    } else if (showCommands && !value.startsWith("/")) {
      setShowCommands(false);
    }
  }, [value, showCommands]);

  // 2. Keyboard Handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCommandIndex((prev) => (prev + 1) % SLASH_COMMANDS.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCommandIndex((prev) => (prev - 1 + SLASH_COMMANDS.length) % SLASH_COMMANDS.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applyCommand(SLASH_COMMANDS[commandIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowCommands(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachments.length > 0) && !isLoading) {
        handleSubmit();
      }
    }
  };

  const applyCommand = (command: typeof SLASH_COMMANDS[0]) => {
    setShowCommands(false);
    onChange({ target: { value: command.prefix } } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(command.prefix.length, command.prefix.length);
      }
    }, 10);
  };

  const handleSubmit = () => {
    onSubmit(attachments);
    setAttachments([]); // Clear attachments after sending
    onChange({ target: { value: "" } } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
  };

  // 3. File Input Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttachments: AttachedFile[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit.`);
        continue;
      }
      try {
        const isImage = file.type.startsWith("image/");
        let content: string;
        
        if (isImage) {
          content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } else {
          content = await file.text();
        }

        newAttachments.push({ 
          name: file.name, 
          size: file.size, 
          type: file.type,
          content 
        });
      } catch {
        alert(`Failed to read ${file.name}`);
      }
    }
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 4. Voice Dictation
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Store the initial value to append from
    const currentVal = value;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let sessionTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        sessionTranscript += event.results[i][0].transcript;
      }
      
      const newValue = currentVal 
        ? `${currentVal.trim()} ${sessionTranscript.trim()}` 
        : sessionTranscript.trim();
        
      onChange({ target: { value: newValue } } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  React.useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div className={cn("relative flex flex-col p-2 bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-xl shadow-black/5 focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10 transition-all", className)}>
      
      {/* Command Popover */}
      {showCommands && (
        <div className="absolute bottom-full mb-4 left-0 w-64 bg-background border border-border shadow-2xl rounded-2xl overflow-hidden z-50">
          <div className="bg-muted/30 px-3 py-2 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Command className="w-3 h-3" /> Quick Commands
          </div>
          <div className="p-1">
            {SLASH_COMMANDS.map((cmd, idx) => (
              <button
                key={cmd.trigger}
                onClick={() => applyCommand(cmd)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl transition-all",
                  idx === commandIndex ? "bg-accent/10 text-accent" : "hover:bg-muted text-foreground"
                )}
              >
                <div className="font-mono text-sm font-bold">{cmd.trigger}</div>
                <div className="text-xs text-muted-foreground/80 mt-0.5">{cmd.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Tray */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 px-3 pb-0 max-h-40 overflow-y-auto styled-scrollbar">
          {attachments.map((att, i) => (
            <div key={i} className="relative group">
              {att.type.startsWith("image/") ? (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border/50 bg-muted/50">
                  <Image 
                    src={att.content} 
                    alt={att.name} 
                    fill
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border/50 rounded-xl text-xs font-medium h-14">
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[120px]">{att.name}</span>
                </div>
              )}
              <button 
                onClick={() => removeAttachment(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Core */}
      <div className="flex items-end text-foreground placeholder:text-muted-foreground w-full">
        <div className="flex items-center h-[52px] px-1 shrink-0">
          {onNewChat && (
            <button
              onClick={onNewChat}
              type="button"
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Attach Files"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lens anything... (type '/' for commands)"
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[200px] py-[15px] pl-2 pr-28 text-[15px] styled-scrollbar outline-none"
          rows={1}
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
          <button
            onClick={toggleListening}
            type="button"
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
              isListening ? "bg-rose-500/10 text-rose-500 animate-pulse" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Voice Dictation"
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={(!value.trim() && attachments.length === 0) || isLoading}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
              (value.trim() || attachments.length > 0) && !isLoading
                ? "bg-gradient-to-tr from-accent to-indigo-500 text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95" 
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
