"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Star,
  Train,
  Route,
  BookOpen,
  BarChart3,
  Bookmark,
  Heart,
  ChevronRight,
  Landmark,
} from "lucide-react";
import { useAppStore, type RouteLog } from "@/stores/app-store";
import {
  getRouteById,
  getStationById,
  getAgencyById,
  demoRoutes,
} from "@/lib/demo-data";
import { PhotoRouteCard } from "@/components/cards/photo-route-card";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

/* ─────────────────────────────────────────────
   Letterboxd-style palette — uses CSS variables
   bg=var(--rb-bg)  text=var(--rb-text)
   muted=var(--rb-text-muted)  dim=var(--rb-text-dim)
   bright=var(--rb-text-bright)  accent=var(--rb-accent)
   borders=var(--rb-border)
   ───────────────────────────────────────────── */

type ProfileTab = "diary" | "reviews" | "stats" | "bucket-list";

// ── Star rating (green accent stars) ──
function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="inline-flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          fill={i <= rating ? "var(--rb-accent)" : "none"}
          stroke={i <= rating ? "var(--rb-accent)" : "var(--rb-text-dim)"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

// ── Route badge pill ──
function RouteBadge({ routeId }: { routeId: string }) {
  const route = getRouteById(routeId);
  if (!route) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
      style={{
        backgroundColor: route.route_color + "22",
        color: route.route_color,
        border: `1px solid ${route.route_color}44`,
      }}
    >
      <Train className="w-3 h-3" />
      {route.short_name}
    </span>
  );
}

// ── Date formatting helpers ──
function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthDay(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
    weekday: d
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
  };
}

// ── Diary entry (Letterboxd-style: date column left, content right) ──
function DiaryEntry({
  log,
}: {
  log: RouteLog;
  showYear?: boolean;
}) {
  const route = getRouteById(log.routeId);
  const startStation = getStationById(log.startStationId);
  const endStation = getStationById(log.endStationId);
  const { month, day, weekday } = formatMonthDay(log.date);

  return (
    <div className="flex gap-0 border-b border-[var(--rb-border)] hover:bg-[var(--rb-bg-card)] transition-colors">
      {/* Date column */}
      <div className="flex-shrink-0 w-[72px] py-3 px-2 text-center border-r border-[var(--rb-border)]">
        <div className="text-[10px] font-semibold tracking-wider text-[var(--rb-text-dim)]">
          {month}
        </div>
        <div className="text-xl font-bold text-[var(--rb-text-bright)] leading-tight">
          {day}
        </div>
        <div className="text-[10px] text-[var(--rb-text-dim)]">{weekday}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-3 px-4 flex items-center gap-3">
        {/* Route color swatch */}
        {route && (
          <div
            className="flex-shrink-0 w-1 h-10 rounded-full"
            style={{ backgroundColor: route.route_color }}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <RouteBadge routeId={log.routeId} />
            {route && (
              <span className="text-[13px] text-[var(--rb-text-bright)] font-medium truncate">
                {route.long_name}
              </span>
            )}
          </div>
          <div className="text-xs text-[var(--rb-text-dim)] mt-0.5">
            {startStation?.name ?? "Unknown"} &rarr;{" "}
            {endStation?.name ?? "Unknown"}
          </div>
        </div>

        {/* Rating + notes indicator */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {log.rating != null && <StarRating rating={log.rating} size={12} />}
          {log.notes && <BookOpen className="w-3.5 h-3.5 text-[var(--rb-text-dim)]" />}
        </div>
      </div>
    </div>
  );
}

// ── Review card ──
function ReviewCard({ log }: { log: RouteLog }) {
  const route = getRouteById(log.routeId);
  const startStation = getStationById(log.startStationId);
  const endStation = getStationById(log.endStationId);

  return (
    <div className="flex gap-3">
      {/* Route poster (left side, Letterboxd-style) */}
      {route && (
        <div
          className="shrink-0 w-[50px] aspect-[2/3] rounded-sm flex flex-col items-center justify-center shadow-md"
          style={{
            background: route.route_color,
            color: route.route_color === "#FFD800" ? "#000" : "var(--rb-text-bright)",
          }}
        >
          <Train className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[10px] font-extrabold mt-0.5">
            {route.short_name}
          </span>
        </div>
      )}

      {/* Review content */}
      <div className="flex-1 min-w-0 border-b border-[var(--rb-border)] pb-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <Link
              href={`/route/${log.routeId}`}
              className="text-[13px] font-bold text-[var(--rb-text-bright)] hover:text-[var(--rb-accent)] transition-colors"
            >
              {route?.long_name ?? "Unknown"}
            </Link>
          </div>
          {log.rating != null && <StarRating rating={log.rating} size={11} />}
        </div>

        <div className="text-[11px] text-[var(--rb-text-dim)] mb-2 flex items-center gap-1">
          <Train className="w-3 h-3" />
          {startStation?.name ?? "Unknown"} &rarr;{" "}
          {endStation?.name ?? "Unknown"}
          <span className="mx-1 text-[var(--rb-border)]">|</span>
          {formatDate(log.date)}
        </div>

        <p className="text-[13px] text-[var(--rb-text)] leading-relaxed">{log.notes}</p>

        {/* Like button row */}
        <div className="flex items-center gap-1 mt-2">
          <Heart className="w-3 h-3 text-[var(--rb-text-dim)]" />
          <span className="text-[10px] text-[var(--rb-text-dim)]">Like this review</span>
        </div>
      </div>
    </div>
  );
}

// ── RoutePosterCard replaced by PhotoRouteCard ──

// ── Stats tab ──
function StatsTab({ routeLogs }: { routeLogs: RouteLog[] }) {
  const stats = useMemo(() => {
    const routeCounts: Record<string, number> = {};
    routeLogs.forEach((l) => {
      routeCounts[l.routeId] = (routeCounts[l.routeId] || 0) + 1;
    });
    const favoriteRouteId = Object.entries(routeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    const favoriteRoute = favoriteRouteId
      ? getRouteById(favoriteRouteId)
      : null;
    const favoriteCount = favoriteRouteId ? routeCounts[favoriteRouteId] : 0;

    const agencyCounts: Record<string, number> = {};
    routeLogs.forEach((l) => {
      const route = getRouteById(l.routeId);
      if (route) {
        const agency = getAgencyById(route.agency_id);
        const name = agency?.name ?? route.agency_id;
        agencyCounts[name] = (agencyCounts[name] || 0) + 1;
      }
    });
    const maxAgency = Math.max(...Object.values(agencyCounts), 1);

    const monthCounts: Record<string, number> = {};
    routeLogs.forEach((l) => {
      const d = new Date(l.date + "T12:00:00");
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    const monthEntries = Object.entries(monthCounts).sort((a, b) => {
      const da = new Date(a[0]);
      const db = new Date(b[0]);
      return da.getTime() - db.getTime();
    });
    const maxMonth = Math.max(...monthEntries.map(([, v]) => v), 1);

    const rated = routeLogs.filter((l) => l.rating != null);
    const avgRating =
      rated.length > 0
        ? rated.reduce((sum, l) => sum + (l.rating ?? 0), 0) / rated.length
        : 0;

    // Rating distribution
    const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rated.forEach((l) => {
      if (l.rating) ratingDist[l.rating] = (ratingDist[l.rating] || 0) + 1;
    });
    const maxRatingCount = Math.max(...Object.values(ratingDist), 1);

    return {
      favoriteRoute,
      favoriteCount,
      agencyCounts,
      maxAgency,
      monthEntries,
      maxMonth,
      avgRating,
      totalRated: rated.length,
      ratingDist,
      maxRatingCount,
    };
  }, [routeLogs]);

  if (routeLogs.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--rb-text-muted)]">
        <div className="mx-auto mb-3 w-fit opacity-40">
          <RailboxdLogo size={40} animate={false} />
        </div>
        <p className="text-sm">No data to analyze yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Distribution (Letterboxd-style bar chart) */}
      {stats.totalRated > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-3 pb-2 border-b border-[var(--rb-border)]">
            Ratings
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-[var(--rb-accent)]">
              {stats.avgRating.toFixed(1)}
            </span>
            <div>
              <StarRating
                rating={Math.round(stats.avgRating)}
                size={14}
              />
              <span className="text-[11px] text-[var(--rb-text-dim)] block mt-0.5">
                {stats.totalRated} rated ride
                {stats.totalRated !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {/* Distribution bars */}
          <div className="flex items-end gap-2 h-20">
            {[1, 2, 3, 4, 5].map((r) => (
              <div
                key={r}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1"
              >
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{ backgroundColor: "var(--rb-accent)" }}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(stats.ratingDist[r] / stats.maxRatingCount) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                />
                <div className="flex gap-px">
                  {Array.from({ length: r }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-2 h-2"
                      fill="var(--rb-accent)"
                      stroke="var(--rb-accent)"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Route */}
      {stats.favoriteRoute && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-3 pb-2 border-b border-[var(--rb-border)]">
            Most Ridden Route
          </h3>
          <Link
            href={`/route/${stats.favoriteRoute.id}`}
            className="flex items-center gap-3 group"
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center text-sm font-black text-white group-hover:ring-1 group-hover:ring-[var(--rb-accent)] transition-all"
              style={{ backgroundColor: stats.favoriteRoute.route_color }}
            >
              {stats.favoriteRoute.short_name}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[var(--rb-text-bright)] font-medium block truncate group-hover:text-[var(--rb-accent)] transition-colors">
                {stats.favoriteRoute.long_name}
              </span>
              <span className="text-xs text-[var(--rb-text-dim)]">
                {stats.favoriteCount} ride
                {stats.favoriteCount !== 1 ? "s" : ""}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--rb-text-dim)]" />
          </Link>
        </div>
      )}

      {/* Rides Per Month */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-4 pb-2 border-b border-[var(--rb-border)]">
          Rides Per Month
        </h3>
        <div className="flex items-end gap-1.5 h-28">
          {stats.monthEntries.map(([month, count]) => (
            <div
              key={month}
              className="flex-1 flex flex-col items-center justify-end h-full gap-1"
            >
              <span className="text-[10px] font-semibold text-[var(--rb-text-bright)]">
                {count}
              </span>
              <motion.div
                className="w-full rounded-t-sm"
                style={{ backgroundColor: "var(--rb-accent)" }}
                initial={{ height: 0 }}
                animate={{
                  height: `${(count / stats.maxMonth) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              />
              <span className="text-[9px] text-[var(--rb-text-dim)] whitespace-nowrap">
                {month.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Routes by Agency */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-3 pb-2 border-b border-[var(--rb-border)]">
          Routes by Agency
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.agencyCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--rb-text)]">{name}</span>
                  <span className="text-xs font-semibold text-[var(--rb-text-bright)]">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--rb-border)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "var(--rb-accent)" }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(count / stats.maxAgency) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Bucket list tab ──
function BucketListTab({ bucketList }: { bucketList: string[] }) {
  const bucketRoutes = useMemo(() => {
    if (bucketList.length === 0) return [];
    return bucketList
      .map((id) => getRouteById(id))
      .filter(Boolean) as (typeof demoRoutes)[number][];
  }, [bucketList]);

  if (bucketRoutes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-3 w-fit opacity-40">
          <RailboxdLogo size={40} animate={false} />
        </div>
        <p className="text-[var(--rb-text-muted)] text-sm mb-1">Your watchlist is empty</p>
        <p className="text-[var(--rb-text-dim)] text-xs max-w-xs mx-auto mb-4">
          Bookmark routes you want to ride from route detail pages.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2 rounded text-sm font-bold transition-colors hover:brightness-110"
          style={{ background: "var(--rb-accent)", color: "var(--rb-bg)" }}
        >
          <RailboxdLogo size={16} animate={false} />
          Browse Routes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-[var(--rb-text-dim)] mb-4">
        {bucketRoutes.length} route{bucketRoutes.length !== 1 ? "s" : ""} on
        your watchlist
      </p>
      {bucketRoutes.map((route) => {
        const agency = getAgencyById(route.agency_id);
        return (
          <Link
            key={route.id}
            href={`/route/${route.id}`}
            className="flex items-center gap-3 py-2.5 border-b border-[var(--rb-border)]/60 last:border-b-0 group"
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center text-xs font-black text-white group-hover:ring-1 group-hover:ring-[var(--rb-accent)] transition-all"
              style={{ backgroundColor: route.route_color }}
            >
              {route.short_name}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[var(--rb-text-bright)] font-medium block truncate group-hover:text-[var(--rb-accent)] transition-colors">
                {route.long_name}
              </span>
              <span className="text-[11px] text-[var(--rb-text-dim)]">
                {agency?.name ?? route.agency_id}
              </span>
            </div>
            <Bookmark
              className="w-4 h-4 text-[var(--rb-accent)] flex-shrink-0"
              fill="var(--rb-accent)"
            />
          </Link>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════
//  MAIN PROFILE PAGE
// ══════════════════════════════════════════════

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("diary");
  const routeLogs = useAppStore((s) => s.routeLogs);
  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);
  const riddenRouteIds = useAppStore((s) => s.riddenRouteIds);
  const loggedStationIds = useAppStore((s) => s.loggedStationIds);
  const profile = useAppStore((s) => s.profile);
  const bucketList = useAppStore((s) => s.bucketList);
  const visitedLandmarkIds = useAppStore((s) => s.visitedLandmarkIds);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  // Guest view: prompt to sign up
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--rb-bg)] flex items-center justify-center pb-24 px-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-5 w-fit">
            <RailboxdLogo size={56} animate={false} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Transit Profile</h1>
          <p className="text-sm text-[var(--rb-text)] mb-2">
            Track your rides, rate routes, and build your transit diary.
          </p>
          <p className="text-xs text-[var(--rb-text-dim)] mb-6">
            Create an account to get started.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110"
              style={{ background: "var(--rb-accent)", color: "#000" }}
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "var(--rb-text)", border: "1px solid var(--rb-border)" }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedLogs = useMemo(
    () => [...routeLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [routeLogs]
  );

  const reviewLogs = useMemo(
    () => sortedLogs.filter((l) => l.notes && l.notes.trim().length > 0),
    [sortedLogs]
  );

  // Pick up to 4 favorite routes
  const favoriteRoutes = useMemo(() => {
    if (routeLogs.length === 0) return demoRoutes.slice(0, 4);
    const counts: Record<string, number> = {};
    routeLogs.forEach((l) => {
      counts[l.routeId] = (counts[l.routeId] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    const routes = sorted
      .map(([id]) => getRouteById(id))
      .filter(Boolean) as (typeof demoRoutes)[number][];
    while (routes.length < 4) {
      const next = demoRoutes.find(
        (r) => !routes.some((fr) => fr.id === r.id)
      );
      if (next) routes.push(next);
      else break;
    }
    return routes;
  }, [routeLogs]);

  const tabs: { key: ProfileTab; label: string; count?: number }[] = [
    { key: "diary", label: "Diary", count: routeLogs.length },
    { key: "reviews", label: "Reviews", count: reviewLogs.length },
    { key: "stats", label: "Stats" },
    { key: "bucket-list", label: "Watchlist" },
  ];

  const isEmpty = routeLogs.length === 0;

  return (
    <div className="min-h-screen bg-[var(--rb-bg)] pb-24">
      {/* ── Banner / Header Backdrop (Letterboxd-style, taller) ── */}
      <div className="relative h-[200px] overflow-hidden">
        {/* Gradient backdrop using multiple route colors */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #122a18 0%, #0a1a0d 30%, var(--rb-bg) 100%)",
          }}
        />
        {/* Transit line decorations (more prominent) */}
        <div className="absolute inset-0">
          {demoRoutes.slice(0, 5).map((route, i) => (
            <div
              key={route.id}
              className="absolute left-0 right-0"
              style={{
                top: `${20 + i * 24}px`,
                height: "2px",
                backgroundColor: route.route_color,
                opacity: 0.06,
              }}
            />
          ))}
        </div>
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, var(--rb-accent) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to top, var(--rb-bg), transparent)",
          }}
        />
      </div>

      {/* ── Profile Info (avatar overlaps banner, Letterboxd-style) ── */}
      <div className="relative max-w-[950px] mx-auto px-6 -mt-16">
        <div className="flex items-end gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-[var(--rb-bg-card)] border-4 border-[var(--rb-bg)] flex items-center justify-center shadow-xl relative z-10 overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[var(--rb-text-muted)]" />
            )}
          </div>

          {/* Name + handle */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-2xl font-bold text-[var(--rb-text-bright)] leading-tight tracking-tight">
              {profile.displayName}
            </h1>
            <p className="text-sm text-[var(--rb-accent)] font-medium">@{profile.username}</p>
          </div>

          {/* Edit profile button */}
          <Link
            href="/settings"
            className="shrink-0 px-4 py-1.5 rounded text-xs font-semibold text-[var(--rb-text)] hover:text-[var(--rb-text-bright)] transition-colors"
            style={{ border: "1px solid var(--rb-border)" }}
          >
            Edit Profile
          </Link>
        </div>

        {/* Bio + location */}
        <div className="mt-3 ml-[116px]">
          <p className="text-[13px] text-[var(--rb-text)]">
            {profile.bio || "No bio yet."}
          </p>
          <div className="flex items-center gap-4 mt-1.5 text-[11px] text-[var(--rb-text-dim)]">
            {profile.homeCity && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.homeCity}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Joined {new Date(profile.joinDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row (Letterboxd-style: inline text stats) ── */}
      <div className="max-w-[950px] mx-auto px-6 mt-6">
        <div className="flex items-center gap-6 py-3 border-t border-b border-[var(--rb-border)]">
          {[
            { label: "Routes", value: new Set([...loggedRouteIds, ...riddenRouteIds]).size },
            { label: "Stations", value: loggedStationIds.size },
            { label: "Landmarks", value: visitedLandmarkIds.size },
            { label: "Rides", value: routeLogs.length },
            { label: "Watchlist", value: bucketList.length },
          ].map((stat) => (
            <button
              key={stat.label}
              className="flex items-center gap-1.5 group"
            >
              <span className="text-sm font-bold text-[var(--rb-text-bright)] group-hover:text-[var(--rb-accent)] transition-colors tabular-nums">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[var(--rb-text-dim)]">
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Favorite Routes (poster row, Letterboxd-style) ── */}
      <div className="max-w-[950px] mx-auto px-6 mt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-3 pb-2 border-b border-[var(--rb-border)]">
          Favorite Routes
        </h2>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {favoriteRoutes.map((route) => (
            <PhotoRouteCard key={route.id} route={route} size="sm" showActions={false} />
          ))}
        </div>
      </div>

      {/* ── Tab Navigation (Letterboxd-style) ── */}
      <div className="max-w-[950px] mx-auto px-6 mt-8">
        <div className="flex border-b border-[var(--rb-border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-4 py-3 transition-colors"
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors"
                style={{
                  color: activeTab === tab.key ? "var(--rb-text-bright)" : "var(--rb-text-muted)",
                }}
              >
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span
                    className="ml-1.5 text-[10px]"
                    style={{
                      color: activeTab === tab.key ? "var(--rb-text)" : "var(--rb-text-dim)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="ptab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                  style={{ backgroundColor: "var(--rb-accent)" }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-[950px] mx-auto px-6 mt-4">
        <AnimatePresence mode="wait">
          {/* ── DIARY TAB ── */}
          {activeTab === "diary" && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {isEmpty ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 w-fit opacity-50">
                    <RailboxdLogo size={48} animate={false} />
                  </div>
                  <p className="text-[var(--rb-text-muted)] text-sm mb-1">
                    Your diary is empty
                  </p>
                  <p className="text-[var(--rb-text-dim)] text-xs max-w-xs mx-auto mb-4">
                    Start logging rides to build your transit diary.
                  </p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded text-sm font-bold transition-colors hover:brightness-110"
                    style={{ background: "var(--rb-accent)", color: "var(--rb-bg)" }}
                  >
                    <RailboxdLogo size={16} animate={false} />
                    Browse Routes
                  </Link>
                </div>
              ) : (
                <div className="border border-[var(--rb-border)] rounded-sm overflow-hidden">
                  {sortedLogs.map((log) => (
                    <DiaryEntry key={log.id} log={log} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {reviewLogs.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 text-[var(--rb-text-dim)]" />
                  <p className="text-[var(--rb-text-muted)] text-sm mb-1">No reviews yet</p>
                  <p className="text-[var(--rb-text-dim)] text-xs">
                    Add notes to your rides to see them here.
                  </p>
                </div>
              ) : (
                reviewLogs.map((log) => (
                  <ReviewCard key={log.id} log={log} />
                ))
              )}
            </motion.div>
          )}

          {/* ── STATS TAB ── */}
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <StatsTab routeLogs={routeLogs} />
            </motion.div>
          )}

          {/* ── BUCKET LIST TAB ── */}
          {activeTab === "bucket-list" && (
            <motion.div
              key="bucket-list"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <BucketListTab bucketList={bucketList} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
