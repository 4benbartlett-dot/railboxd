"use client";

import { useAppStore } from "@/stores/app-store";
import {
  demoRoutes,
  getRouteById,
  getStationById,
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
  Eye,
  Zap,
  Landmark,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

/* ─── route mode label ─── */

function routeTypeLabel(type: number): string {
  switch (type) {
    case 0:
      return "TRAM";
    case 1:
      return "METRO";
    case 2:
      return "RAIL";
    case 3:
      return "BUS";
    default:
      return "TRANSIT";
  }
}

/* ─── mini route poster (for activity feed) ─── */

function MiniPoster({
  route,
  className = "",
}: {
  route: (typeof demoRoutes)[number];
  className?: string;
}) {
  const textColor = route.route_color === "#FFD800" ? "#000" : "#fff";
  return (
    <div
      className={`aspect-[2/3] rounded-sm flex flex-col items-center justify-center shadow-md ${className}`}
      style={{ background: route.route_color, color: textColor }}
    >
      <Train className="w-3.5 h-3.5 opacity-70" />
      <span className="text-[10px] font-extrabold leading-none mt-0.5">
        {route.short_name}
      </span>
    </div>
  );
}

/* ─── mock social data ─── */

const friendActivity = [
  {
    id: "fa-1",
    avatar: "AK",
    username: "alex_k",
    action: "rode",
    routeId: "bart-yellow",
    rating: 4,
    timestamp: "2h ago",
    review: null,
  },
  {
    id: "fa-2",
    avatar: "MJ",
    username: "maria_j",
    action: "reviewed",
    routeId: "lametro-b",
    rating: 5,
    timestamp: "4h ago",
    review:
      "Smooth ride through Hollywood. The underground stations have great tile work.",
  },
  {
    id: "fa-3",
    avatar: "TC",
    username: "transit_chad",
    action: "rode",
    routeId: "bart-red",
    rating: 3,
    timestamp: "5h ago",
    review: null,
  },
  {
    id: "fa-4",
    avatar: "LP",
    username: "lily_park",
    action: "logged a milestone:",
    routeId: null,
    rating: null,
    timestamp: "6h ago",
    review: null,
    milestone: "50 rides completed",
  },
  {
    id: "fa-5",
    avatar: "RD",
    username: "rail_dan",
    action: "reviewed",
    routeId: "bart-blue",
    rating: 4,
    timestamp: "8h ago",
    review:
      "Dublin/Pleasanton to Daly City. Long ride but comfortable seats.",
  },
  {
    id: "fa-6",
    avatar: "SN",
    username: "sophie_n",
    action: "rode",
    routeId: "lametro-a",
    rating: 3,
    timestamp: "12h ago",
    review: null,
  },
  {
    id: "fa-7",
    avatar: "JW",
    username: "jake_w",
    action: "logged a milestone:",
    routeId: null,
    rating: null,
    timestamp: "1d ago",
    review: null,
    milestone: "Visited all BART stations",
  },
  {
    id: "fa-8",
    avatar: "KM",
    username: "kira_m",
    action: "reviewed",
    routeId: "bart-yellow",
    rating: 5,
    timestamp: "1d ago",
    review:
      "SFO to Embarcadero — the best airport connection in the US. Fight me.",
  },
];

const popularReviews = [
  {
    id: "tr-1",
    avatar: "NR",
    username: "nate_rides",
    routeId: "bart-yellow",
    rating: 5,
    text: "The transbay tube crossing at rush hour is a religious experience. Packed car, everyone in their own world, the gentle sway — this is what public transit is about.",
    likes: 42,
    timestamp: "3d ago",
  },
  {
    id: "tr-2",
    avatar: "EL",
    username: "ella_lines",
    routeId: "lametro-b",
    rating: 4,
    text: "Hollywood/Highland station deserves its own review. The deep escalators, the cavernous ceiling — it feels like entering a Bond villain's lair.",
    likes: 28,
    timestamp: "5d ago",
  },
  {
    id: "tr-3",
    avatar: "PW",
    username: "pete_westbound",
    routeId: "bart-red",
    rating: 3,
    text: "Richmond to Daly City on a Saturday morning. Empty car, sun coming through the windows in El Cerrito. Peaceful. Lost a star for the 12th St transfer confusion.",
    likes: 19,
    timestamp: "1w ago",
  },
];

/* ─── main page ─── */

export default function DashboardPage() {
  const routeLogs = useAppStore((s) => s.routeLogs);
  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);

  const recentLogs = [...routeLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Pick a "featured" route for the hero backdrop
  const featuredRoute = demoRoutes[0]; // Yellow line
  const featuredAgency = getAgencyById(featuredRoute.agency_id);

  return (
    <div className="min-h-screen" style={{ background: "var(--rb-bg)" }}>
      {/* ══════════════════════════════════════════
          HERO BACKDROP (like Letterboxd's featured film)
          ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background gradient from route color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${featuredRoute.route_color}18 0%, ${featuredRoute.route_color}08 40%, var(--rb-bg) 100%)`,
          }}
        />
        {/* Decorative transit lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          {[16, 28, 40, 52, 64].map((top) => (
            <div
              key={top}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${top}px`,
                backgroundColor:
                  demoRoutes[top % demoRoutes.length]?.route_color ?? "#fff",
              }}
            />
          ))}
        </div>

        <div className="relative max-w-[950px] mx-auto px-4 pt-8 pb-6">
          {/* Top nav / greeting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-lg font-semibold text-[#fff]">
                Welcome back, Explorer.
              </h1>
              <p className="text-xs text-[#678] mt-0.5">
                Here&apos;s what&apos;s happening on the rails.
              </p>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors hover:bg-[#00e054]/10"
              style={{ color: "#00e054", border: "1px solid #00e05433" }}
            >
              <MapPin className="w-3 h-3" />
              Log a Ride
            </Link>
          </motion.div>

          {/* ── Featured Route (hero card) ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href={`/route/${featuredRoute.id}`}
              className="group block rounded overflow-hidden"
              style={{ border: "1px solid var(--rb-border)" }}
            >
              <div
                className="relative h-[140px] flex items-end p-4"
                style={{
                  background: `linear-gradient(135deg, ${featuredRoute.route_color}40 0%, ${featuredRoute.route_color}15 50%, var(--rb-bg) 100%)`,
                }}
              >
                {/* Large route badge */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Train className="w-24 h-24 text-white" />
                </div>

                <div className="relative z-10 flex items-end gap-4">
                  {/* Poster */}
                  <div
                    className="w-[60px] aspect-[2/3] rounded-sm flex flex-col items-center justify-center shadow-lg shrink-0 group-hover:ring-2 group-hover:ring-[#00e054] transition-all"
                    style={{
                      background: featuredRoute.route_color,
                      color:
                        featuredRoute.route_color === "#FFD800"
                          ? "#000"
                          : "#fff",
                    }}
                  >
                    <Train className="w-5 h-5 opacity-80" />
                    <span className="text-sm font-extrabold mt-0.5">
                      {featuredRoute.short_name}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-widest opacity-50">
                      {routeTypeLabel(featuredRoute.route_type)}
                    </span>
                  </div>

                  <div className="pb-1">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#678] mb-1">
                      Featured Route
                    </p>
                    <p className="text-base font-bold text-[#fff] leading-tight group-hover:text-[#00e054] transition-colors">
                      {featuredRoute.long_name}
                    </p>
                    <p className="text-xs text-[#9ab] mt-0.5">
                      {featuredAgency?.name} &middot;{" "}
                      {featuredRoute.station_ids.length} stations
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════ */}
      <div className="max-w-[950px] mx-auto px-4">
        {/* ── Transit Mode Categories ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-2 mb-4"
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

        {/* ── Popular Routes (poster row) ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-2"
        >
          <SectionHeader href="/search">Popular This Week</SectionHeader>

          <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
            {demoRoutes.map((route) => {
              const agency = getAgencyById(route.agency_id);
              const textColor =
                route.route_color === "#FFD800" ? "#000" : "#fff";
              const isLogged = loggedRouteIds.has(route.id);

              return (
                <motion.div key={route.id} variants={fadeUp}>
                  <Link
                    href={`/route/${route.id}`}
                    className="block w-[100px] shrink-0 group"
                  >
                    {/* Poster */}
                    <div
                      className="relative aspect-[2/3] rounded-sm shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-200 group-hover:ring-2 group-hover:ring-[#00e054] group-hover:-translate-y-1"
                      style={{
                        background: route.route_color,
                        color: textColor,
                      }}
                    >
                      <Train className="w-5 h-5 opacity-70" />
                      <span className="text-base font-extrabold leading-none">
                        {route.short_name}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">
                        {routeTypeLabel(route.route_type)}
                      </span>
                      {/* Logged indicator (like Letterboxd's "watched" eye) */}
                      {isLogged && (
                        <div className="absolute bottom-1.5 right-1.5">
                          <Eye
                            className="w-3 h-3"
                            style={{ color: textColor, opacity: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                    {/* Caption */}
                    <p
                      className="text-[11px] mt-1.5 leading-snug line-clamp-1"
                      style={{ color: "#9ab" }}
                    >
                      {route.long_name}
                    </p>
                    <p
                      className="text-[10px] leading-snug line-clamp-1"
                      style={{ color: "#456" }}
                    >
                      {agency?.name?.replace(
                        /\s*(Rapid Transit|Rail)/,
                        ""
                      ) ?? ""}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
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

                        {/* Rating */}
                        {item.rating && (
                          <div className="mt-1">
                            <StarRating rating={item.rating} size={11} />
                          </div>
                        )}

                        {/* Review snippet */}
                        {item.review && (
                          <p
                            className="text-xs mt-1 leading-relaxed line-clamp-2"
                            style={{ color: "#678" }}
                          >
                            {item.review}
                          </p>
                        )}

                        {/* Timestamp */}
                        <span
                          className="text-[10px] mt-1 block"
                          style={{ color: "#456" }}
                        >
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Route poster thumbnail (Letterboxd shows film poster here) */}
                      {route && (
                        <Link
                          href={`/route/${route.id}`}
                          className="shrink-0"
                        >
                          <MiniPoster
                            route={route}
                            className="w-[40px] hover:ring-1 hover:ring-[#00e054] transition-all"
                          />
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
                      {/* Route poster (left, like Letterboxd) */}
                      {route && (
                        <Link
                          href={`/route/${route.id}`}
                          className="shrink-0"
                        >
                          <MiniPoster
                            route={route}
                            className="w-[50px] hover:ring-1 hover:ring-[#00e054] transition-all"
                          />
                        </Link>
                      )}

                      {/* Review content */}
                      <div className="flex-1 min-w-0 border-b border-[var(--rb-border)]/60 pb-4">
                        {/* Route name + rating row */}
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

                        {/* Reviewer info */}
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

                        {/* Review text */}
                        <p
                          className="text-[13px] leading-relaxed line-clamp-3"
                          style={{ color: "#9ab" }}
                        >
                          {review.text}
                        </p>

                        {/* Likes */}
                        <div className="flex items-center gap-1 mt-2">
                          <Heart
                            className="w-3 h-3"
                            style={{ color: "#456" }}
                          />
                          <span
                            className="text-[10px]"
                            style={{ color: "#456" }}
                          >
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

          {/* ── Right Sidebar (like Letterboxd's right column) ── */}
          <aside className="hidden lg:block w-[240px] shrink-0">
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
                  {
                    label: "Rides",
                    value: routeLogs.length,
                    icon: Train,
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon
                        className="w-3.5 h-3.5 mx-auto mb-1"
                        style={{ color: "#456" }}
                      />
                      <p className="text-lg font-bold text-[#fff]">
                        {stat.value}
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#678" }}
                      >
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
                      <div
                        key={log.id}
                        className="flex items-center gap-2"
                      >
                        {route && (
                          <div
                            className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0 text-[8px] font-extrabold"
                            style={{
                              background: route.route_color,
                              color:
                                route.route_color === "#FFD800"
                                  ? "#000"
                                  : "#fff",
                            }}
                          >
                            {route.short_name}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs truncate"
                            style={{ color: "#9ab" }}
                          >
                            {route?.long_name ?? "Unknown"}
                          </p>
                        </div>
                        {log.rating && (
                          <StarRating rating={log.rating} size={9} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Train
                    className="w-5 h-5 mx-auto mb-2"
                    style={{ color: "#456" }}
                  />
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
                  { label: "Explore Routes", href: "/explore", icon: MapPin },
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
