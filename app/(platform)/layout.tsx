"use client";

import * as React from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/navigation";
import { type HistoryItem } from "@/types";
import Footer from "@/components/shared/Footer";
import { MobileHeader } from "@/components/shared/MobileHeader";
import { MobileNav } from "@/components/shared/MobileNav";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const router = useRouter();
  
  // Aggregated history from all modules for the shared sidebar
  const { items: devlensItems, remove: removeDevLens, clear: clearDevLens } = useHistory("devlens");
  const { items: specforgeItems, remove: removeSpecForge, clear: clearSpecForge } = useHistory("specforge");
  const { items: chartgptItems, remove: removeChartGPT, clear: clearChartGPT } = useHistory("chartgpt");

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
    await clearChartGPT();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Fixed on desktop, hidden on mobile */}
      <AppSidebar onHistoryClick={() => setIsHistoryOpen(true)} />

      {/* Mobile Navigation Area */}
      <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onHistoryClick={() => setIsHistoryOpen(true)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto overflow-x-hidden styled-scrollbar pb-20 lg:pb-8 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* History Drawer */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={allItems}
        onItemClick={handleHistoryItemClick}
        onRemove={handleRemoveItem}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
