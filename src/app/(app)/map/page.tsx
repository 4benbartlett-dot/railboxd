"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with mapbox-gl
const TransitMap = dynamic(
  () => import("@/components/map/transit-map").then((mod) => mod.TransitMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-[#0a0c0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--rb-accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--rb-text-muted)]">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return <TransitMap />;
}
