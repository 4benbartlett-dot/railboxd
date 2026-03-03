"use client";

import { getRouteById } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";
import { X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StationPopupProps {
  station: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    routeIds: string[];
  };
  onClose: () => void;
}

export function StationPopup({ station, onClose }: StationPopupProps) {
  const { setSelectedRouteId, loggedStationIds } = useAppStore();
  const routes = station.routeIds.map((id) => getRouteById(id)).filter(Boolean);
  const isLoggedEndpoint = loggedStationIds.has(station.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="absolute bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-auto md:w-72 md:left-1/2 md:-translate-x-1/2 z-20"
      >
        <div className="bg-[var(--rb-bg-card)] border border-[var(--rb-border)] rounded-xl p-4 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--rb-text-muted)] flex-shrink-0" />
                <h3 className="text-sm font-semibold text-[var(--rb-text-bright)] truncate">
                  {station.name}
                </h3>
                {isLoggedEndpoint && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--rb-accent)]/20 text-[var(--rb-accent)] font-medium flex-shrink-0">
                    Logged
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {routes.map((route) => route && (
                  <button
                    key={route.id}
                    onClick={() => { setSelectedRouteId(route.id); onClose(); }}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: route.route_color + "20",
                      color: route.route_color,
                      border: `1px solid ${route.route_color}50`,
                    }}
                  >
                    {route.short_name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg-hover)] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[var(--rb-text-muted)]">
            Tap a line badge above to view and log that route
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
