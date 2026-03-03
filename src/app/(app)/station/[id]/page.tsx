"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin, ArrowLeft, Train, Heart, Bookmark, Eye,
  Clock, Users, Navigation,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useHeroPhoto } from "@/hooks/use-place-photos";
import { createClient } from "@/lib/supabase/client";
import {
  getStationById,
  getRouteById,
  getAgencyById,
  getStationsForRoute,
  demoStations,
} from "@/lib/demo-data";
import { PhotoRouteCard } from "@/components/cards/photo-route-card";
import { PhotoStationCard } from "@/components/cards/photo-station-card";
import { LandmarkCard } from "@/components/cards/landmark-card";
import { getLandmarksNearStation } from "@/lib/urbanist-data";

const MODE_LABELS: Record<number, string> = {
  0: "Tram", 1: "Heavy Rail", 2: "Commuter Rail", 3: "Bus", 4: "Ferry",
};

function textColor(bg: string) {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#0a0c0f" : "#ffffff";
}

interface StationReview {
  id: string;
  username: string;
  avatarUrl: string | null;
  text: string;
  date: string;
  likes: number;
}

type Tab = "routes" | "info" | "activity";

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("routes");

  const { loggedStationIds, loggedRouteIds, routeLogs, openLogModal } = useAppStore();
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const bucketList = useAppStore((s) => s.bucketList);
  const toggleBucketList = useAppStore((s) => s.toggleBucketList);
  const likedReviews = useAppStore((s) => s.likedReviews);
  const toggleLike = useAppStore((s) => s.toggleLike);
  const fav = favorites.includes(id);
  const bucket = bucketList.includes(id);

  const station = getStationById(id);
  if (!station) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ backgroundColor: "#14181c" }}>
        <MapPin className="w-12 h-12 text-[#456] mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Station Not Found</h1>
        <p className="text-sm text-[#678] mb-6">No station with ID &ldquo;{id}&rdquo;.</p>
        <button onClick={() => router.push("/search")} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#00e054] text-[#0a0c0f]">
          Back to Search
        </button>
      </div>
    );
  }

  const agency = getAgencyById(station.agency_id);
  const routes = station.route_ids
    .map((rid) => getRouteById(rid))
    .filter(Boolean);
  const visited = loggedStationIds.has(station.id);

  // Activity: route logs that mention this station
  const stationActivity = routeLogs.filter(
    (log) => log.startStationId === station.id || log.endStationId === station.id,
  );

  // Community stats + reviews from Supabase
  const [stationReviews, setStationReviews] = useState<StationReview[]>([]);
  const [communityVisitors, setCommunityVisitors] = useState(0);
  const [communityFans, setCommunityFans] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadStationData() {
      try {
        const supabase = createClient();
        // Count distinct users who have logged trips to/from this station
        const { data: logData } = await supabase
          .from("route_logs")
          .select("user_id, start_station_id, end_station_id")
          .or(`start_station_id.eq.${id},end_station_id.eq.${id}`);
        if (!cancelled && logData) {
          const uniqueUsers = new Set(logData.map((r: Record<string, unknown>) => r.user_id as string));
          setCommunityVisitors(uniqueUsers.size);
        }
        // Count favorites for routes serving this station
        const routeIds = station?.route_ids ?? [];
        if (routeIds.length > 0) {
          const { count } = await supabase
            .from("favorites")
            .select("user_id", { count: "exact", head: true })
            .in("route_id", routeIds);
          if (!cancelled) setCommunityFans(count ?? 0);
        }
        // Fetch reviews that mention station routes
        if (routeIds.length > 0) {
          const { data: reviewData } = await supabase
            .from("reviews")
            .select("id, text, rating, created_at, likes(count), profiles(username, avatar_url)")
            .in("route_id", routeIds)
            .order("created_at", { ascending: false })
            .limit(5);
          if (!cancelled && reviewData) {
            const mapped: StationReview[] = reviewData.map((row: Record<string, unknown>) => {
              const profile = row.profiles as Record<string, unknown> | null;
              const likesArr = row.likes as { count: number }[] | undefined;
              const createdAt = row.created_at as string;
              return {
                id: row.id as string,
                username: (profile?.username as string) ?? "rider",
                avatarUrl: (profile?.avatar_url as string | null) ?? null,
                text: row.text as string,
                date: createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
                likes: likesArr?.[0]?.count ?? 0,
              };
            });
            setStationReviews(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load station community data:", err);
      }
    }
    loadStationData();
    return () => { cancelled = true; };
  }, [id, station?.route_ids]);

  // Find nearby/related stations (same agency, not this one)
  const relatedStations = demoStations
    .filter((s) => s.agency_id === station.agency_id && s.id !== station.id)
    .sort((a, b) => {
      const dA = Math.abs(a.lat - station.lat) + Math.abs(a.lng - station.lng);
      const dB = Math.abs(b.lat - station.lat) + Math.abs(b.lng - station.lng);
      return dA - dB;
    })
    .slice(0, 6);

  // Nearby landmarks
  const nearbyLandmarks = getLandmarksNearStation(id);

  // Primary route color for theming
  const primaryRoute = routes[0];
  const themeColor = primaryRoute?.route_color ?? "#00e054";

  // Google Places photo for hero backdrop
  const searchQuery = agency
    ? `${station.name} Station ${agency.name} ${agency.city}`
    : `${station.name} Station`;
  const { heroUrl } = useHeroPhoto(searchQuery, station.lat, station.lng);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#14181c" }}>
      {/* ── Cinematic Backdrop ── */}
      <div ref={heroRef} className="relative w-full h-[220px] sm:h-[300px] lg:h-[380px] overflow-hidden">
        {/* Real photo layer with parallax */}
        {heroUrl && (
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            <Image
              src={heroUrl}
              alt={station.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </motion.div>
        )}
        {/* Gradient overlay (always present — tints photo or stands alone as fallback) */}
        <div className="absolute inset-0" style={{
          background: heroUrl
            ? `linear-gradient(to bottom, rgba(10,26,13,0.3) 0%, rgba(10,26,13,0.5) 50%, #14181c 100%)`
            : `
              radial-gradient(ellipse 100% 70% at 30% 40%, ${themeColor}50 0%, transparent 60%),
              radial-gradient(ellipse 80% 50% at 70% 30%, ${themeColor}25 0%, transparent 50%),
              linear-gradient(160deg, ${themeColor}30 0%, #0a1a0d 40%, #14181c 100%)
            `,
        }} />
        {!heroUrl && (
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${themeColor}15 1px, transparent 0)`,
            backgroundSize: "5px 5px",
          }} />
        )}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%),
            linear-gradient(to bottom, transparent 0%, transparent 50%, #14181c 100%)
          `,
        }} />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-28 sm:-mt-36 lg:-mt-44 relative z-10 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">

          {/* ── Icon / Poster Column ── */}
          <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-0 lg:w-[230px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[120px] sm:w-[150px] lg:w-full aspect-square rounded-2xl shadow-2xl flex-shrink-0 relative overflow-hidden"
              style={{ backgroundColor: "#1c2228", border: `2px solid ${themeColor}30` }}
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, ${themeColor}40 0%, transparent 60%)`,
              }} />
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${themeColor}15` }}>
                  <MapPin className="w-7 h-7 lg:w-10 lg:h-10" style={{ color: themeColor }} />
                </div>
                <div className="text-[9px] lg:text-[10px] font-semibold mt-1 opacity-60 uppercase tracking-[0.2em] text-[#9ab]">
                  Station
                </div>
                {routes.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 flex-wrap justify-center">
                    {routes.slice(0, 4).map((r) => r && (
                      <span key={r.id} className="text-[8px] lg:text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: r.route_color + "25", color: r.route_color }}>
                        {r.short_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Mobile: title next to poster */}
            <div className="lg:hidden flex-1 min-w-0 pt-6 sm:pt-10">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{station.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-[#9ab] flex-wrap">
                <span>{agency?.name}</span>
                {agency && (
                  <>
                    <span className="opacity-40">&middot;</span>
                    <span>{agency.city}, {agency.state}</span>
                  </>
                )}
              </div>
              {/* Visited badge mobile */}
              <div className="mt-2">
                {visited ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00e05420] text-[#00e054]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e054]" />
                    Visited
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#2c344060] text-[#678]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#678]" />
                    Not yet visited
                  </span>
                )}
              </div>
            </div>

            {/* Desktop: action icons below poster */}
            <div className="hidden lg:flex items-center justify-center gap-1.5 mt-4 w-full">
              <button
                onClick={() => { if (routes[0]) openLogModal(routes[0].id); }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{
                  backgroundColor: visited ? "#00e054" : "transparent",
                  borderColor: visited ? "#00e054" : "#456",
                  color: visited ? "#0a0c0f" : "#9ab",
                }}
                title={visited ? "Visited" : "Log a ride through this station"}
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => toggleFavorite(id)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{
                  backgroundColor: fav ? "#e5406520" : "transparent",
                  borderColor: fav ? "#e54065" : "#456",
                  color: fav ? "#e54065" : "#9ab",
                }}
              >
                <Heart className="w-5 h-5" fill={fav ? "#e54065" : "none"} />
              </button>
              <button
                onClick={() => toggleBucketList(id)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{
                  backgroundColor: bucket ? "#40bcf420" : "transparent",
                  borderColor: bucket ? "#40bcf4" : "#456",
                  color: bucket ? "#40bcf4" : "#9ab",
                }}
              >
                <Bookmark className="w-5 h-5" fill={bucket ? "#40bcf4" : "none"} />
              </button>
            </div>

            {/* Desktop: visited badge */}
            <div className="hidden lg:flex justify-center mt-3 w-full">
              {visited ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00e05420] text-[#00e054]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e054]" />
                  Visited
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#2c344060] text-[#678]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#678]" />
                  Not yet visited
                </span>
              )}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Desktop title */}
            <div className="hidden lg:block">
              <h1 className="text-[28px] font-bold text-white leading-tight">{station.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-[15px] text-[#9ab]">
                <span>{agency?.name}</span>
                {agency && (
                  <>
                    <span className="opacity-40">&middot;</span>
                    <span>{agency.city}, {agency.state}</span>
                  </>
                )}
                <span className="opacity-40">&middot;</span>
                <span>{routes.length} {routes.length === 1 ? "route" : "routes"}</span>
              </div>
            </div>

            <p className="text-sm italic text-[#678] mt-3 lg:mt-4">
              {routes.length > 0
                ? `Served by ${routes.map((r) => r?.long_name).filter(Boolean).join(", ")}`
                : "Transit station"}
            </p>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2 mt-4">
              <button
                onClick={() => { if (routes[0]) openLogModal(routes[0].id); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: visited ? themeColor + "20" : themeColor,
                  color: visited ? themeColor : textColor(themeColor),
                  border: visited ? `1.5px solid ${themeColor}` : "none",
                }}
              >
                {visited ? <><Eye className="w-4 h-4" /> Visited</> : <><MapPin className="w-4 h-4" /> Log a Ride</>}
              </button>
              <button onClick={() => toggleFavorite(id)} className="p-2.5 rounded-lg border transition-all" style={{ borderColor: fav ? "#e54065" : "#456", color: fav ? "#e54065" : "#9ab" }}>
                <Heart className="w-5 h-5" fill={fav ? "#e54065" : "none"} />
              </button>
              <button onClick={() => toggleBucketList(id)} className="p-2.5 rounded-lg border transition-all" style={{ borderColor: bucket ? "#40bcf4" : "#456", color: bucket ? "#40bcf4" : "#9ab" }}>
                <Bookmark className="w-5 h-5" fill={bucket ? "#40bcf4" : "none"} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mt-6 border-b border-[#2c3440]">
              {(["routes", "info", "activity"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="relative px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors"
                  style={{ color: tab === t ? "#fff" : "#678" }}>
                  {t === "routes" ? `Routes ${routes.length}` : t === "activity" ? `Activity ${stationActivity.length}` : "Info"}
                  {tab === t && (
                    <motion.div layoutId="stab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00e054]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {tab === "routes" && (
                <motion.div key="routes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
                  {routes.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                      <Train className="w-8 h-8 text-[#456] mb-3 opacity-40" />
                      <p className="text-sm text-[#678]">No routes serve this station.</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                      {routes.map((route) => route && (
                        <PhotoRouteCard key={route.id} route={route} size="sm" showActions={false} />
                      ))}
                    </div>
                  )}

                  {/* Station list: other stations reachable from here */}
                  {routes.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-[0.15em] mb-3">
                        Stations on connecting routes
                      </h3>
                      {routes.map((route) => {
                        if (!route) return null;
                        const rc = route.route_color ?? "#666";
                        const rStations = getStationsForRoute(route.id);
                        const stationIdx = rStations.findIndex((s) => s.id === station.id);
                        return (
                          <div key={route.id} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                                style={{ backgroundColor: rc + "25", color: rc }}>
                                {route.short_name}
                              </span>
                              <span className="text-[11px] text-[#678] truncate">{route.long_name}</span>
                            </div>
                            <div className="space-y-0">
                              {rStations.map((st, idx) => {
                                const isCurrent = st.id === station.id;
                                const isFirst = idx === 0;
                                const isLast = idx === rStations.length - 1;
                                return (
                                  <Link key={st.id} href={isCurrent ? "#" : `/station/${st.id}`}
                                    className={`flex items-center gap-3 px-1 py-1 rounded transition-colors ${isCurrent ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"} group`}>
                                    <div className="flex flex-col items-center flex-shrink-0 w-4 self-stretch">
                                      <div className="w-0.5 flex-1" style={{ backgroundColor: isFirst ? "transparent" : rc + "40" }} />
                                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 border-2"
                                        style={{
                                          backgroundColor: isCurrent ? rc : isFirst || isLast ? rc : "#14181c",
                                          borderColor: rc,
                                        }} />
                                      <div className="w-0.5 flex-1" style={{ backgroundColor: isLast ? "transparent" : rc + "40" }} />
                                    </div>
                                    <span className={`flex-1 text-sm truncate transition-colors ${isCurrent ? "text-white font-semibold" : "text-[#9ab] group-hover:text-white"}`}>
                                      {st.name}
                                      {isCurrent && <span className="text-[9px] text-[#00e054] ml-2 uppercase font-semibold">You are here</span>}
                                      {(isFirst || isLast) && !isCurrent && <span className="text-[10px] text-[#456] ml-2 uppercase">{isFirst ? "origin" : "terminus"}</span>}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === "info" && (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
                  <dl className="divide-y divide-[#2c3440]">
                    {[
                      ["Station Name", station.name],
                      ["Operator", agency?.name ?? "Unknown"],
                      ["Region", agency ? `${agency.city}, ${agency.state}` : "Unknown"],
                      ["Routes Served", routes.map((r) => r?.short_name).filter(Boolean).join(", ") || "None"],
                      ["Latitude", station.lat.toFixed(5)],
                      ["Longitude", station.lng.toFixed(5)],
                      ["Station ID", station.id],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-3">
                        <dt className="text-sm text-[#678]">{label}</dt>
                        <dd className="text-sm text-[#9ab] text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {tab === "activity" && (
                <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
                  {stationActivity.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Train className="w-10 h-10 text-[#456] mb-3 opacity-30" />
                      <p className="text-sm text-[#678]">No activity yet</p>
                      <p className="text-xs text-[#456] mt-1">Log a ride through this station to see it here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2c3440]">
                      {stationActivity.map((log) => {
                        const route = getRouteById(log.routeId);
                        const startStation = getStationById(log.startStationId);
                        const endStation = getStationById(log.endStationId);
                        return (
                          <div key={log.id} className="py-4 first:pt-1">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              {route && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                                  style={{ backgroundColor: route.route_color + "25", color: route.route_color }}>
                                  {route.short_name}
                                </span>
                              )}
                              <span className="text-sm font-medium text-white">
                                {route?.long_name ?? log.routeId}
                              </span>
                              <span className="text-xs text-[#456] ml-auto">{log.date}</span>
                            </div>
                            <p className="text-sm text-[#9ab] ml-0">
                              {startStation?.name ?? log.startStationId} &rarr; {endStation?.name ?? log.endStationId}
                            </p>
                            {log.rating != null && (
                              <div className="flex items-center gap-1 mt-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <div key={s} className="w-2 h-2 rounded-sm"
                                    style={{ backgroundColor: s <= (log.rating ?? 0) ? "#00e054" : "#2c3440" }} />
                                ))}
                                <span className="text-[10px] text-[#456] ml-1">{log.rating}/5</span>
                              </div>
                            )}
                            {log.notes && (
                              <p className="text-xs text-[#678] mt-1.5 italic">&ldquo;{log.notes}&rdquo;</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile: stats */}
            <div className="lg:hidden mt-8">
              <div className="flex items-baseline gap-6 text-xs text-[#678] uppercase tracking-wider mb-4">
                <div><span className="text-lg font-bold text-white block leading-none">{communityVisitors}</span>Visitors</div>
                <div><span className="text-lg font-bold text-white block leading-none">{communityFans}</span>Fans</div>
                <div><span className="text-lg font-bold text-white block leading-none">{stationReviews.length}</span>Reviews</div>
              </div>
            </div>

            {/* Mobile: recent reviews */}
            <div className="lg:hidden mt-4">
              <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-[0.15em] mb-3">Recent Reviews</h3>
              <div className="divide-y divide-[#2c3440]">
                {stationReviews.length === 0 && (
                  <p className="text-xs text-[#567] py-3">No reviews yet. Be the first!</p>
                )}
                {stationReviews.map((rev) => (
                  <div key={rev.id} className="py-3 first:pt-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {rev.avatarUrl ? (
                        <img src={rev.avatarUrl} alt={rev.username} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 bg-[var(--rb-accent)]/30">
                          {rev.username[0].toUpperCase()}
                        </div>
                      )}
                      <Link href={`/profile/${rev.username}`} className="text-[11px] font-semibold text-white hover:text-[var(--rb-accent)] transition-colors">{rev.username}</Link>
                      <span className="text-[10px] text-[#456] ml-auto">{rev.date}</span>
                    </div>
                    <p className="text-[12px] text-[#9ab] leading-relaxed ml-8">{rev.text}</p>
                    <div className="flex items-center gap-3 mt-1.5 ml-8">
                      <button className="flex items-center gap-1 text-[10px] text-[#456] hover:text-[#9ab] transition-colors">
                        <Heart className="w-2.5 h-2.5" /> {rev.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar (Desktop) ── */}
          <div className="hidden lg:block w-[240px] flex-shrink-0 pt-1">
            <div className="mb-6">
              <div className="flex items-baseline gap-5 text-[11px] text-[#678] uppercase tracking-wider">
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">{communityVisitors}</span>Visitors</div>
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">{communityFans}</span>Fans</div>
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">{stationReviews.length}</span>Reviews</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-wider mb-3">Details</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[12px]">
                  <Train className="w-3.5 h-3.5 text-[#456] flex-shrink-0" />
                  <span className="text-[#678]">Routes:</span>
                  <span className="text-[#9ab]">{routes.length}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <Navigation className="w-3.5 h-3.5 text-[#456] flex-shrink-0" />
                  <span className="text-[#678]">Coords:</span>
                  <span className="text-[#9ab] font-mono text-[11px]">{station.lat.toFixed(4)}, {station.lng.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <Users className="w-3.5 h-3.5 text-[#456] flex-shrink-0" />
                  <span className="text-[#678]">Agency:</span>
                  <span className="text-[#9ab]">{agency?.name ?? "Unknown"}</span>
                </div>
                {agency && (
                  <div className="flex items-center gap-2 text-[12px]">
                    <MapPin className="w-3.5 h-3.5 text-[#456] flex-shrink-0" />
                    <span className="text-[#678]">Region:</span>
                    <span className="text-[#9ab]">{agency.city}, {agency.state}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-wider mb-3">Recent Reviews</h3>
              <div className="space-y-3">
                {stationReviews.length === 0 && (
                  <p className="text-[11px] text-[#567]">No reviews yet.</p>
                )}
                {stationReviews.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      {rev.avatarUrl ? (
                        <img src={rev.avatarUrl} alt={rev.username} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white bg-[var(--rb-accent)]/30">
                          {rev.username[0].toUpperCase()}
                        </div>
                      )}
                      <Link href={`/profile/${rev.username}`} className="text-[11px] font-medium text-[#9ab] hover:text-[var(--rb-accent)] transition-colors">{rev.username}</Link>
                      <span className="text-[9px] text-[#456] ml-auto">{rev.date}</span>
                    </div>
                    <p className="text-[11px] text-[#567] line-clamp-2 group-hover:text-[#9ab] transition-colors leading-snug">
                      {rev.text}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Heart className="w-2.5 h-2.5 text-[#456]" />
                      <span className="text-[10px] text-[#456]">{rev.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Nearby Landmarks ── */}
        {nearbyLandmarks.length > 0 && (
          <div className="mt-10 lg:mt-14 border-t border-[#2c3440] pt-6">
            <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-[0.15em] mb-4">
              Nearby Landmarks
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbyLandmarks.map((landmark) => (
                <LandmarkCard key={landmark.id} landmark={landmark} />
              ))}
            </div>
          </div>
        )}

        {/* ── Related Stations ── */}
        {relatedStations.length > 0 && (
          <div className="mt-10 lg:mt-14 border-t border-[#2c3440] pt-6">
            <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-[0.15em] mb-4">
              Nearby Stations
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {relatedStations.map((s) => (
                <PhotoStationCard key={s.id} station={s} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
