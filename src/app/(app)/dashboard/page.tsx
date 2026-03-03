"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import {
  demoRoutes,
  getRouteById,
  getAgencyById,
} from "@/lib/demo-data";
import {
  Train,
  MapPin,
  Star,
  Route,
  Clock,
  Heart,
  ChevronRight,
  Zap,
  Landmark,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PhotoRouteCard } from "@/components/cards/photo-route-card";
import { MiniPhotoCard } from "@/components/cards/mini-photo-card";
import { useHeroPhoto } from "@/hooks/use-place-photos";
import { getStationsForRoute } from "@/lib/demo-data";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

/* ─── animation variants ─── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/* ─── star rating (half-star support) ─── */

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-px">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          fill={n <= rating ? "#00e054" : "none"}
          stroke={n <= rating ? "#00e054" : "#456"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/* ─── section header (Letterboxd style) ─── */

function SectionHeader({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--rb-border)] pb-2 mb-4">
      <h2
        className="text-[11px] font-semibold uppercase tracking-[0.15em]"
        style={{ color: "#9ab" }}
      >
        {children}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-[11px] font-semibold uppercase tracking-wider hover:text-[#fff] transition-colors"
          style={{ color: "#678" }}
        >
          More <ChevronRight className="inline w-3 h-3 -mt-px" />
        </Link>
      )}
    </div>
  );
}

/* ─── Hero backdrop with auto-rotating featured routes ─── */

const heroRoutes = [
  demoRoutes.find((r) => r.id === "sdmts-blue") ?? demoRoutes[0],
  demoRoutes.find((r) => r.id === "sdmts-copper") ?? demoRoutes[1],
  demoRoutes.find((r) => r.id === "nctd-coaster") ?? demoRoutes[2],
  demoRoutes.find((r) => r.id === "amtrak-surfliner") ?? demoRoutes[3],
].filter(Boolean);

function HeroBackdrop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const profile = useAppStore((s) => s.profile);
  const route = heroRoutes[currentIndex];
  const agency = getAgencyById(route.agency_id);
  const stations = getStationsForRoute(route.id);
  const firstStation = stations[0];
  const { heroUrl } = useHeroPhoto(firstStation?.name, firstStation?.lat, firstStation?.lng);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroRoutes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden h-[220px] md:h-[260px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={route.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background photo */}
          {heroUrl ? (
            <img
              src={heroUrl}
              alt={route.long_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${route.route_color}40 0%, ${route.route_color}15 50%, var(--rb-bg) 100%)`,
              }}
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 photo-card-gradient-strong" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 max-w-[950px] mx-auto px-4 h-full flex flex-col justify-end pb-6">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-6">
          <div className="max-w-[950px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">
                Welcome back, {profile.displayName.split(" ")[0]}.
              </h1>
              <p className="text-xs text-white/50 mt-0.5">
                Here&apos;s what&apos;s happening on the rails.
              </p>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-colors bg-[var(--rb-accent)]/10 hover:bg-[var(--rb-accent)]/20 border border-[var(--rb-accent)]/30"
              style={{ color: "#00e054" }}
            >
              <RailboxdLogo size={18} animate={false} />
              Log a Ride
            </Link>
          </div>
        </div>

        {/* Featured route info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/route/${route.id}`} className="group block">
              <div className="flex items-end gap-4">
                <div
                  className="w-[50px] aspect-[2/3] rounded-sm flex flex-col items-center justify-center shadow-lg shrink-0 group-hover:ring-2 group-hover:ring-[var(--rb-accent)] transition-all"
                  style={{
                    background: route.route_color,
                    color: route.route_color === "#FFD800" ? "#000" : "#fff",
                  }}
                >
                  <span className="text-sm font-extrabold">{route.short_name}</span>
                </div>
                <div className="pb-0.5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-0.5">
                    Featured Route
                  </p>
                  <p className="text-base font-bold text-white leading-tight group-hover:text-[var(--rb-accent)] transition-colors">
                    {route.long_name}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">
                    {agency?.name} &middot; {route.station_ids.length} stations
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="flex gap-1.5 mt-3">
          {heroRoutes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-5 bg-[var(--rb-accent)]" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── mock social data ─── */

const friendActivity = [
  { id: "fa-1", avatar: "AK", username: "alex_k", action: "rode", routeId: "sdmts-blue", rating: 4, timestamp: "2h ago", review: null },
  { id: "fa-2", avatar: "MJ", username: "maria_j", action: "reviewed", routeId: "sdmts-copper", rating: 5, timestamp: "4h ago", review: "The new Copper Line to UCSD is incredible. Ocean views from the elevated sections and the stations are gorgeous." },
  { id: "fa-3", avatar: "TC", username: "transit_chad", action: "rode", routeId: "nctd-coaster", rating: 4, timestamp: "5h ago", review: null },
  { id: "fa-4", avatar: "LP", username: "lily_park", action: "logged a milestone:", routeId: null, rating: null, timestamp: "6h ago", review: null, milestone: "50 rides completed" },
  { id: "fa-5", avatar: "RD", username: "rail_dan", action: "reviewed", routeId: "sdmts-green", rating: 4, timestamp: "8h ago", review: "Green Line to Santee on a Sunday morning. Empty car, sun through the windows in Mission Valley. Peaceful." },
  { id: "fa-6", avatar: "SN", username: "sophie_n", action: "rode", routeId: "amtrak-surfliner", rating: 5, timestamp: "12h ago", review: null },
  { id: "fa-7", avatar: "JW", username: "jake_w", action: "logged a milestone:", routeId: null, rating: null, timestamp: "1d ago", review: null, milestone: "Rode all SD trolley lines" },
  { id: "fa-8", avatar: "KM", username: "kira_m", action: "reviewed", routeId: "sdmts-blue", rating: 5, timestamp: "1d ago", review: "America Plaza to San Ysidro — riding to the border on light rail is a trip. Best cross-border transit in the US." },
];

const popularReviews = [
  { id: "tr-1", avatar: "NR", username: "nate_rides", routeId: "amtrak-surfliner", rating: 5, text: "San Diego to LA on the Surfliner hugging the Pacific coastline. Dolphins off San Clemente, surfers at San Onofre, cold craft beer from the cafe car — this is what American rail should be.", likes: 42, timestamp: "3d ago" },
  { id: "tr-2", avatar: "EL", username: "ella_lines", routeId: "sdmts-copper", rating: 5, text: "The Copper Line through UTC is a revelation. From UCSD's Geisel Library to Old Town tacos in 20 minutes. San Diego finally connects the coast to the campus.", likes: 28, timestamp: "5d ago" },
  { id: "tr-3", avatar: "PW", username: "pete_westbound", routeId: "sdmts-blue", rating: 4, text: "Blue Line from downtown to the border at 7am. The car fills up with commuters heading south, empties, fills again going north. The trolley is an international experience.", likes: 19, timestamp: "1w ago" },
];

/* ─── main page ─── */

export default function DashboardPage() {
  const routeLogs = useAppStore((s) => s.routeLogs);
  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);
  const profile = useAppStore((s) => s.profile);
  const landmarkVisits = useAppStore((s) => s.landmarkVisits);

  const recentLogs = [...routeLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "var(--rb-bg)" }}>
      {/* ══════════════════════════════════════════
          HERO BACKDROP (cinematic auto-rotating)
          ══════════════════════════════════════════ */}
      <HeroBackdrop />

      {/* ══════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════ */}
      <div className="max-w-[950px] mx-auto px-4">
        {/* ── Transit Mode Categories ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-6 mb-4"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: "Subway", icon: Train, color: "#EE1C23", count: demoRoutes.filter((r) => r.route_type === 1).length },
              { label: "Light Rail", icon: Zap, color: "#00A551", count: demoRoutes.filter((r) => r.route_type === 0).length },
              { label: "Commuter Rail", icon: Landmark, color: "#0076A9", count: demoRoutes.filter((r) => r.route_type === 2).length },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.label} variants={fadeUp}>
                  <Link
                    href="/search"
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl shrink-0 transition-all hover:brightness-110"
                    style={{ background: "var(--rb-bg-card)", border: "1px solid var(--rb-border)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: cat.color + "20" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#fff] whitespace-nowrap">{cat.label}</p>
                      <p className="text-[10px] text-[#678]">{cat.count} routes</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Popular Routes (photo poster row) ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-2"
        >
          <SectionHeader href="/search">Popular This Week</SectionHeader>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
            {demoRoutes.map((route) => (
              <motion.div key={route.id} variants={fadeUp} className="shrink-0">
                <PhotoRouteCard route={route} size="sm" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Two-Column Layout (like Letterboxd) ── */}
        <div className="flex gap-8 mt-4">
          {/* ── Left Column: Activity + Reviews ── */}
          <div className="flex-1 min-w-0">
            {/* ── New from Friends (Letterboxd-style activity) ── */}
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <SectionHeader>New from Friends</SectionHeader>

              <div className="flex flex-col">
                {friendActivity.map((item) => {
                  const route = item.routeId
                    ? getRouteById(item.routeId)
                    : null;

                  return (
                    <motion.div
                      key={item.id}
                      variants={fadeUp}
                      className="flex gap-3 py-3 border-b border-[var(--rb-border)]/60 last:border-b-0 group"
                    >
                      {/* Avatar */}
                      <Link
                        href="#"
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold hover:ring-1 hover:ring-[#00e054] transition-all"
                        style={{ background: "var(--rb-border)", color: "#9ab" }}
                      >
                        {item.avatar}
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] leading-snug">
                          <Link
                            href="#"
                            className="font-semibold hover:text-[#00e054] transition-colors"
                            style={{ color: "#fff" }}
                          >
                            {item.username}
                          </Link>{" "}
                          <span style={{ color: "#678" }}>{item.action}</span>{" "}
                          {route && (
                            <Link
                              href={`/route/${route.id}`}
                              className="font-semibold hover:text-[#fff] transition-colors"
                              style={{ color: "#9ab" }}
                            >
                              {route.short_name} Line
                            </Link>
                          )}
                          {(item as { milestone?: string }).milestone && (
                            <span
                              style={{ color: "#00e054" }}
                              className="font-semibold"
                            >
                              {(item as { milestone?: string }).milestone}
                            </span>
                          )}
                        </p>

                        {item.rating && (
                          <div className="mt-1">
                            <StarRating rating={item.rating} size={11} />
                          </div>
                        )}

                        {item.review && (
                          <p
                            className="text-xs mt-1 leading-relaxed line-clamp-2"
                            style={{ color: "#678" }}
                          >
                            {item.review}
                          </p>
                        )}

                        <span
                          className="text-[10px] mt-1 block"
                          style={{ color: "#456" }}
                        >
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Route photo thumbnail */}
                      {route && (
                        <Link href={`/route/${route.id}`} className="shrink-0">
                          <MiniPhotoCard route={route} />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* ── Popular Reviews This Week ── */}
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              <SectionHeader>Popular Reviews This Week</SectionHeader>

              <div className="flex flex-col gap-4">
                {popularReviews.map((review) => {
                  const route = getRouteById(review.routeId);

                  return (
                    <motion.div
                      key={review.id}
                      variants={fadeUp}
                      className="flex gap-3"
                    >
                      {/* Route photo poster */}
                      {route && (
                        <Link href={`/route/${route.id}`} className="shrink-0">
                          <MiniPhotoCard route={route} className="w-[50px]" />
                        </Link>
                      )}

                      {/* Review content */}
                      <div className="flex-1 min-w-0 border-b border-[var(--rb-border)]/60 pb-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            {route && (
                              <Link
                                href={`/route/${route.id}`}
                                className="text-[13px] font-bold hover:text-[#00e054] transition-colors"
                                style={{ color: "#fff" }}
                              >
                                {route.long_name}
                              </Link>
                            )}
                          </div>
                          <StarRating rating={review.rating} size={11} />
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                            style={{ background: "var(--rb-border)", color: "#9ab" }}
                          >
                            {review.avatar}
                          </span>
                          <span className="text-xs" style={{ color: "#9ab" }}>
                            Review by{" "}
                            <Link
                              href="#"
                              className="font-semibold hover:text-[#00e054] transition-colors"
                              style={{ color: "#9ab" }}
                            >
                              {review.username}
                            </Link>
                          </span>
                        </div>

                        <p
                          className="text-[13px] leading-relaxed line-clamp-3"
                          style={{ color: "#9ab" }}
                        >
                          {review.text}
                        </p>

                        <div className="flex items-center gap-1 mt-2">
                          <Heart className="w-3 h-3" style={{ color: "#456" }} />
                          <span className="text-[10px]" style={{ color: "#456" }}>
                            {review.likes} likes
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            {/* Completion Ring */}
            <div className="mb-6 p-4 rounded-xl" style={{ background: "var(--rb-bg-card)", border: "1px solid var(--rb-border)" }}>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--rb-border)" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none"
                      stroke="var(--rb-accent)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(loggedRouteIds.size / demoRoutes.length) * 175.9} 175.9`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {Math.round((loggedRouteIds.size / demoRoutes.length) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">SD Transit</p>
                  <p className="text-[10px] text-[#678]">
                    {loggedRouteIds.size}/{demoRoutes.length} routes
                  </p>
                </div>
              </div>
            </div>

            {/* Your Stats */}
            <div className="mb-6">
              <h3
                className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 pb-2 border-b border-[var(--rb-border)]"
                style={{ color: "#9ab" }}
              >
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Routes", value: loggedRouteIds.size, icon: Route },
                  { label: "Rides", value: routeLogs.length, icon: Train },
                  { label: "Landmarks", value: landmarkVisits.length, icon: Landmark },
                  { label: "Total", value: routeLogs.length + landmarkVisits.length, icon: Compass },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "#456" }} />
                      <p className="text-lg font-bold text-[#fff]">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: "#678" }}>
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Diary */}
            <div className="mb-6">
              <h3
                className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 pb-2 border-b border-[var(--rb-border)]"
                style={{ color: "#9ab" }}
              >
                Recent Diary
              </h3>

              {recentLogs.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentLogs.map((log) => {
                    const route = getRouteById(log.routeId);
                    return (
                      <div key={log.id} className="flex items-center gap-2">
                        {route && (
                          <div
                            className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0 text-[8px] font-extrabold"
                            style={{
                              background: route.route_color,
                              color: route.route_color === "#FFD800" ? "#000" : "#fff",
                            }}
                          >
                            {route.short_name}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ color: "#9ab" }}>
                            {route?.long_name ?? "Unknown"}
                          </p>
                        </div>
                        {log.rating && <StarRating rating={log.rating} size={9} />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto mb-2 w-fit opacity-40">
                    <RailboxdLogo size={28} animate={false} />
                  </div>
                  <p className="text-[11px]" style={{ color: "#678" }}>
                    No rides logged yet.
                  </p>
                  <Link
                    href="/search"
                    className="text-[11px] font-semibold mt-1 inline-block"
                    style={{ color: "#00e054" }}
                  >
                    Log your first ride
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 pb-2 border-b border-[var(--rb-border)]"
                style={{ color: "#9ab" }}
              >
                Quick Links
              </h3>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "Explore", href: "/explore", icon: Compass },
                  { label: "Your Profile", href: "/profile", icon: Route },
                  { label: "Recent Rides", href: "/profile", icon: Clock },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 text-xs py-1 hover:text-[#00e054] transition-colors"
                      style={{ color: "#678" }}
                    >
                      <Icon className="w-3 h-3" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* bottom spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}
