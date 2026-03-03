"use client";

import { X, Star, Plus, Train, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import {
  getRouteById,
  getStationsForRoute,
  getAgencyById,
} from "@/lib/demo-data";
import Link from "next/link";

const MODE_LABELS: Record<number, string> = {
  1: "Heavy Rail",
  2: "Commuter Rail",
  3: "Bus",
  0: "Tram",
  4: "Ferry",
};

interface RoutePanelProps {
  routeId: string;
  onClose: () => void;
}

export function RoutePanel({ routeId, onClose }: RoutePanelProps) {
  const { loggedRouteIds, routeLogs, openLogModal } = useAppStore();

  const route = getRouteById(routeId);
  if (!route) return null;

  const agency = getAgencyById(route.agency_id);
  const stations = getStationsForRoute(routeId);
  const isLogged = loggedRouteIds.has(routeId);
  const myLogs = routeLogs.filter((l) => l.routeId === routeId);
  const avgRating =
    myLogs.filter((l) => l.rating).length > 0
      ? myLogs.reduce((sum, l) => sum + (l.rating ?? 0), 0) /
        myLogs.filter((l) => l.rating).length
      : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8 md:w-96 z-30 rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex flex-col bg-[var(--rb-bg-card)] border border-[var(--rb-border)] rounded-t-2xl md:rounded-2xl overflow-hidden" style={{ maxHeight: "75vh" }}>
          {/* Route color bar */}
          <div
            className="h-1 w-full flex-shrink-0"
            style={{ backgroundColor: route.route_color }}
          />

          {/* Header */}
          <div className="flex items-start gap-3 p-4 pb-3 flex-shrink-0">
            {/* Route badge */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shadow-lg"
              style={{
                backgroundColor: route.route_color + "20",
                border: `2px solid ${route.route_color}`,
                color: route.route_color,
              }}
            >
              {route.short_name}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[var(--rb-text-bright)] leading-tight truncate">
                {route.long_name}
              </h2>
              <p className="text-xs text-[var(--rb-text-muted)] mt-0.5">
                {agency?.name} · {MODE_LABELS[route.route_type] ?? "Rail"}
              </p>
              {/* Rating */}
              {avgRating && (
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3 h-3"
                      fill={s <= Math.round(avgRating) ? route.route_color : "transparent"}
                      stroke={s <= Math.round(avgRating) ? route.route_color : "var(--rb-text-muted)"}
                    />
                  ))}
                  <span className="text-[10px] text-[var(--rb-text-muted)] ml-0.5">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 px-4 pb-3 flex-shrink-0">
            <button
              onClick={() => { openLogModal(routeId); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: isLogged ? route.route_color + "20" : route.route_color,
                color: isLogged ? route.route_color : "var(--rb-map-bg)",
                border: isLogged ? `1.5px solid ${route.route_color}` : "none",
              }}
            >
              {isLogged ? (
                <>
                  <Plus className="w-4 h-4" />
                  Log Another Ride
                </>
              ) : (
                <>
                  <Train className="w-4 h-4" />
                  Log This Route
                </>
              )}
            </button>
            <Link
              href={`/route/${routeId}`}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold bg-[var(--rb-bg-elevated)] text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg-hover)] transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Details
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-0 border-t border-b border-[var(--rb-border)] flex-shrink-0">
            <div className="flex-1 py-3 text-center border-r border-[var(--rb-border)]">
              <p className="text-lg font-bold text-[var(--rb-text-bright)]">{stations.length}</p>
              <p className="text-[10px] text-[var(--rb-text-muted)] uppercase tracking-wide">Stations</p>
            </div>
            <div className="flex-1 py-3 text-center border-r border-[var(--rb-border)]">
              <p className="text-lg font-bold" style={{ color: myLogs.length > 0 ? route.route_color : undefined }}>
                {myLogs.length}
              </p>
              <p className="text-[10px] text-[var(--rb-text-muted)] uppercase tracking-wide">Your Rides</p>
            </div>
            <div className="flex-1 py-3 text-center">
              <p className="text-lg font-bold text-[var(--rb-text-bright)]">
                {isLogged ? "✓" : "—"}
              </p>
              <p className="text-[10px] text-[var(--rb-text-muted)] uppercase tracking-wide">Logged</p>
            </div>
          </div>

          {/* Station list */}
          <div className="overflow-y-auto flex-1 py-1">
            <p className="text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-widest px-4 py-2">
              Stations ({stations.length})
            </p>
            {stations.map((station, idx) => (
              <div
                key={station.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors"
              >
                {/* Line indicator */}
                <div className="flex flex-col items-center flex-shrink-0 w-4">
                  {idx > 0 && (
                    <div className="w-0.5 h-2 -mt-2 mb-0.5" style={{ backgroundColor: route.route_color + "60" }} />
                  )}
                  <div
                    className="w-2 h-2 rounded-full border-2 border-[var(--rb-bg-card)]"
                    style={{ backgroundColor: route.route_color }}
                  />
                  {idx < stations.length - 1 && (
                    <div className="w-0.5 h-2 mt-0.5" style={{ backgroundColor: route.route_color + "60" }} />
                  )}
                </div>
                <span className="text-xs text-[var(--rb-text)] truncate">{station.name}</span>
                {/* Show if it's a transfer station */}
                {station.route_ids.length > 1 && (
                  <div className="ml-auto flex gap-1">
                    {station.route_ids
                      .filter((rid) => rid !== routeId)
                      .slice(0, 2)
                      .map((rid) => {
                        const r = getRouteById(rid);
                        return r ? (
                          <span
                            key={rid}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: r.route_color + "25",
                              color: r.route_color,
                              border: `1px solid ${r.route_color}40`,
                            }}
                          >
                            {r.short_name}
                          </span>
                        ) : null;
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
