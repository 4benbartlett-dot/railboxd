"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { demoRoutes } from "@/lib/demo-data";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Train } from "lucide-react";

export function CompletionPanel() {
  const { loggedRouteIds, routeLogs } = useAppStore();
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const totalRoutes = demoRoutes.length;
    const loggedCount = loggedRouteIds.size;
    const percent = totalRoutes > 0 ? Math.round((loggedCount / totalRoutes) * 100) : 0;

    const routeStats = demoRoutes.map((route) => {
      const rides = routeLogs.filter((l) => l.routeId === route.id).length;
      return {
        id: route.id,
        name: route.short_name,
        color: route.route_color,
        logged: loggedRouteIds.has(route.id),
        rides,
      };
    });

    return { totalRoutes, loggedCount, percent, routeStats };
  }, [loggedRouteIds, routeLogs]);

  return (
    <div className="absolute top-4 left-4 z-10">
      <motion.div
        layout
        className="bg-[var(--rb-bg-card)]/90 backdrop-blur-sm border border-[var(--rb-border)] rounded-xl overflow-hidden"
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full hover:bg-[var(--rb-bg-hover)] transition-colors"
        >
          {/* Circular progress */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--rb-bg-elevated)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="var(--rb-accent)"
                strokeWidth="3"
                strokeDasharray={`${stats.percent * 0.88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[var(--rb-text-bright)]">
              {stats.percent}%
            </span>
          </div>

          <div className="text-left">
            <p className="text-xs font-medium text-[var(--rb-text-bright)]">
              {stats.loggedCount}/{stats.totalRoutes} routes
            </p>
            <p className="text-[10px] text-[var(--rb-text-muted)]">
              {stats.loggedCount === 0 ? "Tap a line to start" : "Keep riding!"}
            </p>
          </div>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--rb-text-muted)] ml-auto" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--rb-text-muted)] ml-auto" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[var(--rb-border)]"
            >
              <div className="px-3.5 py-2 space-y-2">
                {stats.routeStats.map((route) => (
                  <div key={route.id} className="flex items-center gap-2">
                    <span
                      className="w-6 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: route.color + (route.logged ? "ff" : "30"), color: route.logged ? "var(--rb-map-bg)" : route.color }}
                    >
                      {route.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-[var(--rb-bg-elevated)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: route.logged ? "100%" : "0%", backgroundColor: route.color }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--rb-text-muted)] w-14 text-right">
                      {route.rides > 0 ? `${route.rides} ride${route.rides > 1 ? "s" : ""}` : "—"}
                    </span>
                    {route.logged && <Train className="w-3 h-3 flex-shrink-0" style={{ color: route.color }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
