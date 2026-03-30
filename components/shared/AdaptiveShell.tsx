"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import MarketingLayout from "@/app/(marketing)/layout";
// We import the content-only version of platform layout to avoid circular dependencies or massive prop drilling
import { AppSidebar } from "@/components/shared/AppSidebar";
import { MobileNav } from "@/components/shared/MobileNav";
import { MobileHeader } from "@/components/shared/MobileHeader";
import Footer from "@/components/shared/Footer";
import { ModuleProvider } from "@/context/ModuleContext";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { ChatSidebar } from "@/components/shared/ChatSidebar";
import { ChatToggle } from "@/components/shared/ChatToggle";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { ShortcutCheatsheet } from "@/components/shared/ShortcutCheatsheet";
import { ConnectivityBanner } from "@/components/shared/ConnectivityBanner";
import { ApiKeyBanner } from "@/components/shared/ApiKeyBanner";
import { motion } from "framer-motion";

export function AdaptiveShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const isAppView = view === "app";

  if (isAppView) {
    return (
      <ModuleProvider>
        <PlatformShellInner>{children}</PlatformShellInner>
      </ModuleProvider>
    );
  }

  return <MarketingLayout>{children}</MarketingLayout>;
}

function PlatformShellInner({ children }: { children: React.ReactNode }) {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = React.useState(false);


  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background relative">
      <AppSidebar 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onChatClick={() => setIsChatOpen(true)}
      />
      
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onChatClick={() => setIsChatOpen(true)}
      />

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={[]} // Static pages don't necessarily need history
        onItemClick={() => {}}
        onRemove={() => {}}
        onClearAll={() => {}}
      />

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatToggle 
        isOpen={isChatOpen} 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        hasContext={false}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        setIsOpen={setIsCommandPaletteOpen} 
        onAction={() => {}}
      />

      <ShortcutCheatsheet 
        isOpen={isCheatsheetOpen} 
        onClose={() => setIsCheatsheetOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ConnectivityBanner />
        <ApiKeyBanner />
        <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-8">
           <motion.div
             initial={{ opacity: 0, scale: 0.99 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, ease: "easeOut" }}
           >
             {children}
             <Footer />
           </motion.div>
        </main>
      </div>
    </div>
  );
}
