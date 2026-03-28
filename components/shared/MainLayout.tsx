"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <main className={cn(
      "flex-1 min-h-screen",
      !isHomePage && "pt-16 lg:pt-20 pb-12"
    )}>
      {children}
    </main>
  );
}
