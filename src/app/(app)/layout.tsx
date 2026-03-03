"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  return (
    <div className="min-h-screen bg-[var(--rb-bg)]">
      {/* Hide sidebar on map page for full-screen experience */}
      {!isMapPage && <Sidebar />}
      <main className={isMapPage ? "" : "md:ml-60 pb-20 md:pb-0"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
