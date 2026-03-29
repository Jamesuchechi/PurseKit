"use client";

import * as React from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/navigation";
import { type HistoryItem } from "@/types";
import Footer from "@/components/shared/Footer";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const router = useRouter();
  
  // Aggregated history from all modules for the shared sidebar
  const { items: devlensItems } = useHistory("devlens");
  const { items: specforgeItems } = useHistory("specforge");
  const { items: chartgptItems } = useHistory("chartgpt");

  const allItems = React.useMemo(() => {
    return [...devlensItems, ...specforgeItems, ...chartgptItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  }, [devlensItems, specforgeItems, chartgptItems]);

  const handleHistoryItemClick = (item: HistoryItem) => {
    setIsHistoryOpen(false);
    router.push(`/${item.module}?id=${item.id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed on desktop, hidden on mobile */}
      <AppSidebar onHistoryClick={() => setIsHistoryOpen(true)} />

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
      />
    </div>
  );
}
