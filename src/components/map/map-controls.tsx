"use client";

import { type RefObject } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import { Plus, Minus, LocateFixed } from "lucide-react";

interface MapControlsProps {
  mapRef: RefObject<MapRef | null>;
}

export function MapControls({ mapRef }: MapControlsProps) {
  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 13,
          duration: 1500,
        });
      },
      () => {
        // Geolocation denied — stay on current view
      }
    );
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 rounded-lg bg-[var(--rb-bg-card)]/90 backdrop-blur-sm border border-[var(--rb-border)] flex items-center justify-center text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg-hover)] transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 rounded-lg bg-[var(--rb-bg-card)]/90 backdrop-blur-sm border border-[var(--rb-border)] flex items-center justify-center text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg-hover)] transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="h-1" />
      <button
        onClick={handleLocate}
        className="w-10 h-10 rounded-lg bg-[var(--rb-bg-card)]/90 backdrop-blur-sm border border-[var(--rb-border)] flex items-center justify-center text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg-hover)] transition-colors"
        aria-label="My location"
      >
        <LocateFixed className="w-4 h-4" />
      </button>
    </div>
  );
}
