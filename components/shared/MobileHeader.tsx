"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-[40] w-full border-b border-border bg-background/80 backdrop-blur-md px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-lg border border-border/50 overflow-hidden">
          <Image 
            src="/icon.png" 
            alt="PulseKit Logo" 
            width={32} 
            height={32} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          PulseKit
        </span>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="rounded-xl hover:bg-muted/50 transition-colors"
      >
        <Menu className="w-6 h-6 text-muted-foreground" />
      </Button>
    </header>
  );
}
