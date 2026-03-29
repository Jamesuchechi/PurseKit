"use client";

import * as React from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { useHistory } from "@/hooks/useHistory";
import { useRouter, usePathname } from "next/navigation";
import { type HistoryItem } from "@/types";
import Footer from "@/components/shared/Footer";
import { MobileHeader } from "@/components/shared/MobileHeader";
import { MobileNav } from "@/components/shared/MobileNav";
import { ModuleProvider, useModuleContext } from "@/context/ModuleContext";
import { ChatSidebar } from "@/components/shared/ChatSidebar";
import { ChatToggle } from "@/components/shared/ChatToggle";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { ShortcutCheatsheet } from "@/components/shared/ShortcutCheatsheet";
import { WelcomeModal } from "@/components/shared/WelcomeModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ConnectivityBanner } from "@/components/shared/ConnectivityBanner";
import { ApiKeyBanner } from "@/components/shared/ApiKeyBanner";
import { AnimatePresence, motion } from "framer-motion";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModuleProvider>
      <PlatformLayoutContent>{children}</PlatformLayoutContent>
    </ModuleProvider>
  );
}

function PlatformLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = React.useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = React.useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { activeModule, lastResult } = useModuleContext();
  const { isOnboarded, completeOnboarding } = useOnboarding();

  // Show welcome modal if not onboarded
  React.useEffect(() => {
    if (isOnboarded === false) {
      setIsWelcomeOpen(true);
    }
  }, [isOnboarded]);

  const handleOnboardingComplete = () => {
    setIsWelcomeOpen(false);
    completeOnboarding();
  };
  
  // ─── Global Keyboard Shortcuts ────────────────────────────────
  useKeyboardShortcut("k", () => setIsCommandPaletteOpen(true));
  useKeyboardShortcut("/", () => setIsChatOpen(true));
  useKeyboardShortcut("h", () => setIsHistoryOpen(true));
  useKeyboardShortcut("a", () => router.push("/analytics"), { metaKey: true });
  useKeyboardShortcut("?", () => setIsCheatsheetOpen(prev => !prev), { metaKey: false, preventDefault: true, ignoreInputs: true });
  
  // Dispatchable actions
  useKeyboardShortcut("enter", () => {
    window.dispatchEvent(new CustomEvent("pulsekit:analyze"));
  }, { metaKey: true, preventDefault: true, ignoreInputs: true });

  useKeyboardShortcut("e", () => {
    window.dispatchEvent(new CustomEvent("pulsekit:export"));
  }, { metaKey: true, preventDefault: true, ignoreInputs: true });

  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case "open-chat": setIsChatOpen(true); break;
      case "open-history": setIsHistoryOpen(true); break;
      case "analyze": window.dispatchEvent(new CustomEvent("pulsekit:analyze")); break;
      case "export": window.dispatchEvent(new CustomEvent("pulsekit:export")); break;
      case "clear": window.dispatchEvent(new CustomEvent("pulsekit:clear")); break;
    }
  };

  // Aggregated history from all modules for the shared sidebar
  const { items: devlensItems, remove: removeDevLens, clear: clearDevLens } = useHistory("devlens");
  const { items: specforgeItems, remove: removeSpecForge, clear: clearSpecForge } = useHistory("specforge");
  const { items: chartgptItems, remove: removeChartGPT, clear: clearSpecChartGPT } = useHistory("chartgpt");

  const allItems = React.useMemo(() => {
    return [...devlensItems, ...specforgeItems, ...chartgptItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  }, [devlensItems, specforgeItems, chartgptItems]);

  const handleHistoryItemClick = (item: HistoryItem) => {
    setIsHistoryOpen(false);
    router.push(`/${item.module}?id=${item.id}`);
  };

  const handleRemoveItem = async (item: HistoryItem) => {
    if (item.module === "devlens") await removeDevLens(item.id);
    if (item.module === "specforge") await removeSpecForge(item.id);
    if (item.module === "chartgpt") await removeChartGPT(item.id);
  };

  const handleClearAll = async () => {
    await clearDevLens();
    await clearSpecForge();
    await clearSpecChartGPT();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background relative">
      {/* Desktop Sidebar - Fixed on desktop, hidden on mobile */}
      <AppSidebar 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onChatClick={() => setIsChatOpen(true)}
      />

      {/* Mobile Navigation Sidebar */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onChatClick={() => setIsChatOpen(true)}
      />

      {/* Global UI Components */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={allItems}
        onItemClick={handleHistoryItemClick}
        onRemove={handleRemoveItem}
        onClearAll={handleClearAll}
      />

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatToggle 
        isOpen={isChatOpen} 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        hasContext={activeModule !== "home" && lastResult !== null}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        setIsOpen={setIsCommandPaletteOpen} 
        onAction={handleCommandAction}
      />

      <ShortcutCheatsheet 
        isOpen={isCheatsheetOpen} 
        onClose={() => setIsCheatsheetOpen(false)} 
      />

      <WelcomeModal 
        isOpen={isWelcomeOpen} 
        onClose={() => setIsWelcomeOpen(false)} 
        onComplete={handleOnboardingComplete}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ConnectivityBanner />
        <ApiKeyBanner />
        <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />
        
        <AnimatePresence mode="wait">
          <motion.main 
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 overflow-y-auto custom-scrollbar relative"
          >
            {children}
            <Footer />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}




