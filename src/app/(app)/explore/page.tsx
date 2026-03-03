"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, DollarSign, Landmark, TrendingUp, Clock } from "lucide-react";
import { SectionDivider } from "@/components/graphics/section-divider";
import { PhotoRouteCard } from "@/components/cards/photo-route-card";
import { LandmarkCard } from "@/components/cards/landmark-card";
import { getNewLines, getAllTransitHistory } from "@/lib/transit-history-data";
import {
  getAllLandmarks,
  getLandmarkTypes,
  LANDMARK_TYPE_LABELS,
  LANDMARK_TYPE_COLORS,
  type LandmarkType,
} from "@/lib/urbanist-data";
import { getRouteById, demoRoutes } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function ExplorePage() {
  const [landmarkFilter, setLandmarkFilter] = useState<LandmarkType | "all">("all");
  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);

  // New lines
  const newLines = useMemo(() => getNewLines(), []);
  const newRoutes = useMemo(
    () => newLines.map((l) => ({ info: l, route: getRouteById(l.routeId) })).filter((x) => x.route),
    [newLines],
  );

  // Landmarks
  const allLandmarks = useMemo(() => getAllLandmarks(), []);
  const landmarkTypes = useMemo(() => getLandmarkTypes(), []);
  const filteredLandmarks = useMemo(
    () => landmarkFilter === "all" ? allLandmarks : allLandmarks.filter((l) => l.type === landmarkFilter),
    [allLandmarks, landmarkFilter],
  );

  // Trending routes (most-logged first, then alphabetical)
  const trendingRoutes = useMemo(
    () =>
      [...demoRoutes]
        .sort((a, b) => {
          const aLogged = loggedRouteIds.has(a.id) ? 1 : 0;
          const bLogged = loggedRouteIds.has(b.id) ? 1 : 0;
          if (bLogged !== aLogged) return bLogged - aLogged;
          return a.long_name.localeCompare(b.long_name);
        })
        .slice(0, 10),
    [loggedRouteIds],
  );

  // Timeline milestones (most recent first)
  const timeline = useMemo(() => {
    return getAllTransitHistory()
      .filter((t) => t.openedDate.length >= 4)
      .sort((a, b) => {
        const yearA = parseInt(a.openedDate.substring(0, 4));
        const yearB = parseInt(b.openedDate.substring(0, 4));
        return yearB - yearA;
      })
      .slice(0, 15);
  }, []);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--rb-bg)" }}>
      {/* Header with animated entrance */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 pt-6 pb-2"
      >
        <h1 className="text-2xl font-bold" style={{ color: "var(--rb-text-bright)" }}>
          Explore
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--rb-text-muted)" }}>
          Discover San Diego&rsquo;s transit world
        </p>
      </motion.div>

      {/* ═══ Section 1: New on the Rails ═══ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mt-6 px-4"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 float-animation" style={{ color: "var(--rb-new-badge)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--rb-text-bright)" }}>
            New on the Rails
          </h2>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {newRoutes.map(({ info, route }, idx) => (
            <motion.div
              key={info.routeId}
              variants={fadeUp}
              className="flex-shrink-0 w-[280px]"
            >
              <PhotoRouteCard route={route!} size="lg" isNew />
              <div className="mt-2 px-1">
                <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--rb-text-muted)" }}>
                  <Calendar className="w-3 h-3" />
                  <span>Opened {info.openedDate}</span>
                </div>
                {info.fundingSource && (
                  <div className="flex items-center gap-2 text-[10px] mt-0.5" style={{ color: "var(--rb-text-muted)" }}>
                    <DollarSign className="w-3 h-3" />
                    <span>{info.fundingAmount} &middot; {info.fundingSource}</span>
                  </div>
                )}
                <p className="text-[11px] mt-1 line-clamp-2 leading-snug" style={{ color: "var(--rb-text)" }}>
                  {info.history}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <SectionDivider color="var(--rb-new-badge)" dotCount={5} />

      {/* ═══ Section 2: Urbanist Landmarks ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mt-2 px-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="w-4 h-4" style={{ color: "var(--rb-accent)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--rb-text-bright)" }}>
            Urbanist Landmarks
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ background: "var(--rb-bg-card)", color: "var(--rb-text-muted)" }}>
            {allLandmarks.length} spots
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setLandmarkFilter("all")}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
            style={{
              background: landmarkFilter === "all" ? "var(--rb-accent)" : "var(--rb-bg-card)",
              color: landmarkFilter === "all" ? "#000000" : "var(--rb-text-muted)",
            }}
          >
            All
          </button>
          {landmarkTypes.map((type) => (
            <button
              key={type}
              onClick={() => setLandmarkFilter(type)}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
              style={{
                background: landmarkFilter === type ? LANDMARK_TYPE_COLORS[type] : "var(--rb-bg-card)",
                color: landmarkFilter === type ? "var(--rb-text-bright)" : "var(--rb-text-muted)",
              }}
            >
              {LANDMARK_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={landmarkFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3"
          >
            {filteredLandmarks.map((landmark, idx) => (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.03, duration: 0.35, ease: "easeOut" }}
              >
                <LandmarkCard landmark={landmark} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      <SectionDivider />

      {/* ═══ Section 3: Trending Routes ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mt-2 px-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--rb-accent)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--rb-text-bright)" }}>
            Trending Routes
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {trendingRoutes.map((route, idx) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <PhotoRouteCard route={route} size="md" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <SectionDivider dotCount={7} />

      {/* ═══ Section 4: Transit History Timeline ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mt-2 px-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" style={{ color: "var(--rb-accent)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--rb-text-bright)" }}>
            San Diego Transit Timeline
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line with gradient */}
          <div
            className="absolute left-3 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, var(--rb-accent)40, var(--rb-border), transparent)" }}
          />

          <div className="space-y-0">
            {timeline.map((item, idx) => {
              const route = getRouteById(item.routeId);
              const year = item.openedDate.substring(0, 4);
              const prevYear = idx > 0 ? timeline[idx - 1].openedDate.substring(0, 4) : null;
              const showYear = year !== prevYear;

              return (
                <motion.div
                  key={item.routeId}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: 0.05, duration: 0.4 }}
                >
                  {showYear && (
                    <div className="flex items-center gap-3 py-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold z-10"
                        style={{ background: "var(--rb-bg-elevated)", color: "var(--rb-accent)", border: "1.5px solid var(--rb-accent)" }}
                      >
                        {year.slice(2)}
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--rb-text-bright)" }}>
                        {year}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3 pl-10 py-2 group hover:bg-[var(--rb-bg-card)] rounded-lg transition-colors -ml-1 pl-11">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {route && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: route.route_color, color: "var(--rb-text-bright)" }}
                          >
                            {route.short_name}
                          </span>
                        )}
                        <span className="text-xs font-medium truncate group-hover:text-[var(--rb-accent)] transition-colors" style={{ color: "var(--rb-text-bright)" }}>
                          {route?.long_name ?? item.routeId}
                        </span>
                        {item.isNew && (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                            style={{ background: "var(--rb-new-badge)", color: "#000" }}
                          >
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-2" style={{ color: "var(--rb-text-muted)" }}>
                        {item.history}
                      </p>
                      {item.notableFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.notableFeatures.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{ background: "var(--rb-bg-card)", color: "var(--rb-text-muted)" }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
