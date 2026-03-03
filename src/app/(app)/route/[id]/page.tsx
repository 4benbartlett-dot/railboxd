"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Train, Star, ArrowLeft, Heart, Bookmark, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore, type Review } from "@/stores/app-store";
import { useHeroPhoto } from "@/hooks/use-place-photos";
import {
  getRouteById,
  getStationsForRoute,
  getAgencyById,
  demoRoutes,
} from "@/lib/demo-data";

const MODE_LABELS: Record<number, string> = {
  0: "Tram", 1: "Heavy Rail", 2: "Commuter Rail", 3: "Bus", 4: "Ferry",
};

const MOCK_REVIEWS = [
  {
    id: "r1",
    username: "transitnerd",
    avatarColor: "#e54065",
    rating: 5,
    text: "Easily one of BART's finest. Beautiful views through the East Bay hills. Comfortable and reliable, though rush hour at Embarcadero tests your patience.",
    date: "Feb 14",
    likes: 23,
  },
  {
    id: "r2",
    username: "sfcommuter",
    avatarColor: "#40bcf4",
    rating: 3,
    text: "Gets the job done. Stations are clean but trains are showing their age. Excited for the new fleet.",
    date: "Jan 28",
    likes: 8,
  },
  {
    id: "r3",
    username: "bayarea_rides",
    avatarColor: "#00e054",
    rating: 5,
    text: "My daily ride and I genuinely love it. Something meditative about the East Bay stretch at golden hour.",
    date: "Jan 15",
    likes: 15,
  },
];

type Tab = "stations" | "details" | "reviews";

function textColor(bg: string) {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#0a0c0f" : "#ffffff";
}

/** Compute rating distribution from mock + user reviews for a given route */
function computeRatingDist(
  mockReviews: typeof MOCK_REVIEWS,
  userReviews: Review[],
) {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of mockReviews) {
    const s = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[s] = (counts[s] ?? 0) + 1;
  }
  for (const r of userReviews) {
    const s = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: counts[stars] }));
}

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("stations");

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Store: log data
  const { loggedRouteIds, routeLogs, openLogModal } = useAppStore();

  // Store: favorites
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const fav = favorites.includes(id);

  // Store: bucket list / watchlist
  const bucketList = useAppStore((s) => s.bucketList);
  const toggleBucketList = useAppStore((s) => s.toggleBucketList);
  const bucket = bucketList.includes(id);

  // Store: reviews
  const storeReviews = useAppStore((s) => s.reviews);
  const addReview = useAppStore((s) => s.addReview);
  const userReviewsForRoute = storeReviews.filter((r) => r.routeId === id);

  // Store: liked reviews
  const likedReviews = useAppStore((s) => s.likedReviews);
  const toggleLike = useAppStore((s) => s.toggleLike);

  // Store: profile (for review author name)
  const profile = useAppStore((s) => s.profile);

  const route = getRouteById(id);
  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Train className="w-12 h-12 text-[#456] mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Route Not Found</h1>
        <p className="text-sm text-[#678] mb-6">No route with ID &ldquo;{id}&rdquo;.</p>
        <button onClick={() => router.push("/search")} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#00e054] text-[#0a0c0f]">
          Back to Search
        </button>
      </div>
    );
  }

  const agency = getAgencyById(route.agency_id);
  const stations = getStationsForRoute(id);
  const isLogged = loggedRouteIds.has(id);
  const myLogs = routeLogs.filter((l) => l.routeId === id);
  const avgRating = myLogs.filter((l) => l.rating).length > 0
    ? myLogs.reduce((s, l) => s + (l.rating ?? 0), 0) / myLogs.filter((l) => l.rating).length
    : null;
  const rc = route.route_color ?? "#00e054";
  const tc = textColor(rc);
  const first = stations[0]?.name ?? "Start";
  const last = stations[stations.length - 1]?.name ?? "End";
  const related = demoRoutes.filter((r) => r.id !== id).slice(0, 4);

  // Google Places photo for hero backdrop — search using route name + agency
  const heroStation = stations[0];
  const heroQuery = agency
    ? `${route.long_name} ${agency.name} ${agency.city}`
    : route.long_name;
  const { heroUrl } = useHeroPhoto(heroQuery, heroStation?.lat, heroStation?.lng);

  // Computed rating distribution from mock + user reviews
  const RATING_DIST = computeRatingDist(MOCK_REVIEWS, userReviewsForRoute);
  const maxDist = Math.max(...RATING_DIST.map((r) => r.count), 1);
  const totalRatings = RATING_DIST.reduce((s, r) => s + r.count, 0);

  // All reviews for this route (user reviews first, then mock)
  const allReviews = [
    ...userReviewsForRoute.map((r) => ({
      id: r.id,
      username: profile.username,
      avatarColor: "#00e054",
      rating: r.rating,
      text: r.text,
      date: r.date,
      likes: r.likes,
      isUserReview: true as const,
    })),
    ...MOCK_REVIEWS.map((r) => ({ ...r, isUserReview: false as const })),
  ];

  // Compute community average rating from all reviews
  const communityAvg = allReviews.length > 0
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : 0;
  const communityAvgRounded = Math.round(communityAvg);

  function handleSubmitReview() {
    if (reviewRating === 0) {
      toast("Please select a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast("Please write something in your review.");
      return;
    }
    addReview({
      id: crypto.randomUUID(),
      routeId: id,
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    });
    setReviewRating(0);
    setReviewText("");
    toast("Review submitted!");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--rb-bg)" }}>
      {/* ── Cinematic Backdrop ── */}
      <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[380px] overflow-hidden">
        {/* Real photo layer */}
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={route.long_name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        {/* Gradient overlay (tints photo or standalone) */}
        <div className="absolute inset-0" style={{
          background: heroUrl
            ? `linear-gradient(to bottom, ${rc}30 0%, rgba(10,26,13,0.6) 50%, var(--rb-bg) 100%)`
            : `
              radial-gradient(ellipse 120% 80% at 20% 30%, ${rc}60 0%, transparent 60%),
              radial-gradient(ellipse 100% 60% at 80% 20%, ${rc}30 0%, transparent 50%),
              linear-gradient(160deg, ${rc}40 0%, #0a1a0d 40%, var(--rb-bg) 100%)
            `,
        }} />
        {/* Rail lines + noise (only when no photo) */}
        {!heroUrl && (
          <>
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 49%, ${rc} 49%, ${rc} 51%, transparent 51%),
                linear-gradient(0deg, transparent 24%, ${rc}40 24%, ${rc}40 26%, transparent 26%),
                linear-gradient(0deg, transparent 74%, ${rc}40 74%, ${rc}40 76%, transparent 76%)
              `,
              backgroundSize: "100% 120px, 100% 80px, 100% 160px",
            }} />
            <div className="absolute inset-0 opacity-[0.15]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${rc}20 1px, transparent 0)`,
              backgroundSize: "4px 4px",
            }} />
          </>
        )}
        {/* Dramatic vignette */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%),
            linear-gradient(to bottom, transparent 0%, transparent 50%, var(--rb-bg) 100%)
          `,
        }} />
        {/* Route name watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[120px] sm:text-[180px] lg:text-[240px] font-black tracking-tighter leading-none opacity-[0.04]" style={{ color: rc }}>
            {route.short_name}
          </span>
        </div>
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

          {/* ── Poster Column ── */}
          <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-0 lg:w-[230px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[120px] sm:w-[150px] lg:w-full aspect-[2/3] rounded shadow-2xl flex-shrink-0 relative overflow-hidden"
              style={{ backgroundColor: rc }}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)",
              }} />
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                <Train className="w-6 h-6 lg:w-8 lg:h-8 mb-2 opacity-50" style={{ color: tc }} />
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none" style={{ color: tc }}>
                  {route.short_name}
                </div>
                <div className="text-[9px] lg:text-[10px] font-semibold mt-2 opacity-60 uppercase tracking-[0.2em]" style={{ color: tc }}>
                  {MODE_LABELS[route.route_type] ?? "Rail"}
                </div>
                <div className="absolute bottom-3 lg:bottom-4 text-[8px] lg:text-[9px] font-medium opacity-40 uppercase tracking-wider" style={{ color: tc }}>
                  {agency?.name}
                </div>
              </div>
            </motion.div>

            {/* Mobile: title next to poster */}
            <div className="lg:hidden flex-1 min-w-0 pt-6 sm:pt-10">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{route.long_name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-[#9ab] flex-wrap">
                <span>{agency?.name}</span>
                <span className="opacity-40">&middot;</span>
                <span>{MODE_LABELS[route.route_type] ?? "Rail"}</span>
              </div>
              {avgRating && (
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5" fill={s <= Math.round(avgRating) ? "#00e054" : "transparent"} stroke={s <= Math.round(avgRating) ? "#00e054" : "#456"} />
                  ))}
                  <span className="text-xs text-[#678] ml-1">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Desktop: action icons below poster */}
            <div className="hidden lg:flex items-center justify-center gap-1.5 mt-4 w-full">
              <button onClick={() => openLogModal(id)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{ backgroundColor: isLogged ? "#00e054" : "transparent", borderColor: isLogged ? "#00e054" : "#456", color: isLogged ? "#0a0c0f" : "#9ab" }}
                title={isLogged ? "Log another ride" : "Log this route"}>
                <Eye className="w-5 h-5" />
              </button>
              <button onClick={() => toggleFavorite(id)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{ backgroundColor: fav ? "#e5406520" : "transparent", borderColor: fav ? "#e54065" : "#456", color: fav ? "#e54065" : "#9ab" }}>
                <Heart className="w-5 h-5" fill={fav ? "#e54065" : "none"} />
              </button>
              <button onClick={() => toggleBucketList(id)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border"
                style={{ backgroundColor: bucket ? "#40bcf420" : "transparent", borderColor: bucket ? "#40bcf4" : "#456", color: bucket ? "#40bcf4" : "#9ab" }}>
                <Bookmark className="w-5 h-5" fill={bucket ? "#40bcf4" : "none"} />
              </button>
            </div>

            {/* Desktop: your rating below actions */}
            <div className="hidden lg:block mt-3 w-full">
              <div className="flex justify-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                    fill={avgRating && s <= Math.round(avgRating) ? "#00e054" : "transparent"}
                    stroke={avgRating && s <= Math.round(avgRating) ? "#00e054" : "#456"} />
                ))}
              </div>
              {avgRating && <p className="text-center text-xs text-[#456] mt-1">Your rating: {avgRating.toFixed(1)}</p>}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Desktop title */}
            <div className="hidden lg:block">
              <h1 className="text-[28px] font-bold text-white leading-tight">{route.long_name}</h1>
              <div className="flex items-center gap-2 mt-1 text-[15px] text-[#9ab]">
                <span>{agency?.name}</span>
                <span className="opacity-40">&middot;</span>
                <span>{MODE_LABELS[route.route_type] ?? "Rail"}</span>
                <span className="opacity-40">&middot;</span>
                <span>{stations.length} stations</span>
              </div>
            </div>

            <p className="text-sm italic text-[#678] mt-3 lg:mt-4">
              Connecting {first} to {last}
            </p>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2 mt-4">
              <button onClick={() => openLogModal(id)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: isLogged ? rc + "20" : rc, color: isLogged ? rc : tc, border: isLogged ? `1.5px solid ${rc}` : "none" }}>
                {isLogged ? <><Eye className="w-4 h-4" /> Logged</> : <><Train className="w-4 h-4" /> Log This Route</>}
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
              {(["stations", "details", "reviews"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="relative px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors"
                  style={{ color: tab === t ? "#fff" : "#678" }}>
                  {t === "stations" ? `Stations ${stations.length}` : t === "reviews" ? `Reviews ${allReviews.length}` : "Details"}
                  {tab === t && (
                    <motion.div layoutId="rtab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00e054]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {tab === "stations" && (
                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
                  {stations.map((st, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === stations.length - 1;
                    const transfers = st.route_ids.filter((rid) => rid !== id);
                    return (
                      <Link key={st.id} href={`/station/${st.id}`}
                        className="flex items-center gap-3 px-1 py-1.5 hover:bg-white/[0.03] rounded transition-colors group">
                        <div className="flex flex-col items-center flex-shrink-0 w-4 self-stretch">
                          <div className="w-0.5 flex-1" style={{ backgroundColor: isFirst ? "transparent" : rc + "40" }} />
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 border-2"
                            style={{ backgroundColor: isFirst || isLast ? rc : "var(--rb-bg)", borderColor: rc }} />
                          <div className="w-0.5 flex-1" style={{ backgroundColor: isLast ? "transparent" : rc + "40" }} />
                        </div>
                        <span className="flex-1 text-sm text-[#9ab] group-hover:text-white transition-colors truncate">
                          {st.name}
                          {(isFirst || isLast) && <span className="text-[10px] text-[#456] ml-2 uppercase">{isFirst ? "origin" : "terminus"}</span>}
                        </span>
                        {transfers.length > 0 && (
                          <div className="flex gap-1 flex-shrink-0">
                            {transfers.slice(0, 3).map((rid) => {
                              const r = getRouteById(rid);
                              return r ? (
                                <span key={rid} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: r.route_color + "20", color: r.route_color }}>
                                  {r.short_name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}

              {tab === "details" && (
                <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
                  <dl className="divide-y divide-[#2c3440]">
                    {[
                      ["Operator", agency?.name ?? "Unknown"],
                      ["Transit Mode", MODE_LABELS[route.route_type] ?? "Rail"],
                      ["Region", agency ? `${agency.city}, ${agency.state}` : "Unknown"],
                      ["Stations", `${stations.length} stops`],
                      ["Route ID", route.id],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-3">
                        <dt className="text-sm text-[#678]">{label}</dt>
                        <dd className="text-sm text-[#9ab]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {tab === "reviews" && (
                <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3">
                  {/* Write a Review */}
                  <div className="border border-[#2c3440] rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-white mb-3">Write a Review</h4>
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setReviewRating(s)} className="transition-transform hover:scale-110">
                          <Star
                            className="w-5 h-5 cursor-pointer"
                            fill={s <= reviewRating ? "#00e054" : "transparent"}
                            stroke={s <= reviewRating ? "#00e054" : "#456"}
                          />
                        </button>
                      ))}
                      {reviewRating > 0 && (
                        <span className="text-xs text-[#678] ml-2">{reviewRating}/5</span>
                      )}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts on this route..."
                      rows={3}
                      className="w-full rounded-lg border border-[#2c3440] px-3 py-2 text-sm text-white placeholder-[#456] focus:outline-none focus:border-[#00e054] transition-colors resize-none"
                      style={{ background: "var(--rb-bg)" }}
                    />
                    <button
                      onClick={handleSubmitReview}
                      className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#00e054] text-[#0a0c0f] hover:brightness-110 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>

                  {/* Reviews list */}
                  <div className="divide-y divide-[#2c3440]">
                    {allReviews.map((rev) => {
                      const isLiked = likedReviews.includes(rev.id);
                      const displayLikes = rev.likes + (isLiked ? 1 : 0);
                      return (
                        <div key={rev.id} className="py-4 first:pt-1">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                              style={{ backgroundColor: rev.avatarColor }}>
                              {rev.username[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-white">{rev.username}</span>
                            {rev.isUserReview && (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#00e054]/15 text-[#00e054]">You</span>
                            )}
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className="w-3 h-3" fill={s <= rev.rating ? "#00e054" : "transparent"} stroke={s <= rev.rating ? "#00e054" : "#456"} />
                              ))}
                            </div>
                            <span className="text-xs text-[#456] ml-auto">{rev.date}</span>
                          </div>
                          <p className="text-sm text-[#9ab] leading-relaxed ml-[38px]">{rev.text}</p>
                          <div className="flex items-center gap-3 mt-2 ml-[38px]">
                            <button
                              onClick={() => toggleLike(rev.id)}
                              className="flex items-center gap-1 text-xs transition-colors"
                              style={{ color: isLiked ? "#e54065" : "#456" }}
                            >
                              <Heart className="w-3 h-3" fill={isLiked ? "#e54065" : "none"} /> {displayLikes}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile: stats + histogram inline */}
            <div className="lg:hidden mt-8">
              <div className="flex items-baseline gap-6 text-xs text-[#678] uppercase tracking-wider mb-4">
                <div><span className="text-lg font-bold text-white block leading-none">293</span>Riders</div>
                <div><span className="text-lg font-bold text-white block leading-none">48</span>Fans</div>
                <div><span className="text-lg font-bold text-white block leading-none">15</span>Lists</div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-white">{communityAvg > 0 ? communityAvg.toFixed(1) : "---"}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3" fill={s <= communityAvgRounded ? "#00e054" : "transparent"} stroke={s <= communityAvgRounded ? "#00e054" : "#456"} />)}
                  </div>
                  <span className="text-[10px] text-[#456]">{totalRatings} ratings</span>
                </div>
              </div>
              <div className="space-y-1">
                {RATING_DIST.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#456] w-3 text-right">{stars}</span>
                    <div className="flex-1 h-[6px] bg-[#2c3440] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#00e054]" style={{ width: `${(count / maxDist) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="hidden lg:block w-[240px] flex-shrink-0 pt-1">
            <div className="mb-6">
              <div className="flex items-baseline gap-5 text-[11px] text-[#678] uppercase tracking-wider">
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">293</span>Riders</div>
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">48</span>Fans</div>
                <div><span className="text-lg font-bold text-white block leading-none mb-0.5">15</span>Lists</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-wider mb-3">Ratings</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold text-white">{communityAvg > 0 ? communityAvg.toFixed(1) : "---"}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5" fill={s <= communityAvgRounded ? "#00e054" : "transparent"} stroke={s <= communityAvgRounded ? "#00e054" : "#456"} />)}
                  </div>
                  <span className="text-[10px] text-[#456]">{totalRatings} ratings</span>
                </div>
              </div>
              <div className="space-y-1">
                {RATING_DIST.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#456] w-3 text-right">{stars}</span>
                    <div className="flex-1 h-2 bg-[#2c3440] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#00e054]" style={{ width: `${(count / maxDist) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-wider mb-3">Popular Reviews</h3>
              <div className="space-y-3">
                {allReviews.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: rev.avatarColor }}>
                        {rev.username[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] font-medium text-[#9ab]">{rev.username}</span>
                      <div className="flex gap-px ml-auto">
                        {[1,2,3,4,5].map((s) => <Star key={s} className="w-2 h-2" fill={s <= rev.rating ? "#00e054" : "transparent"} stroke={s <= rev.rating ? "#00e054" : "#456"} />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#567] line-clamp-2 group-hover:text-[#9ab] transition-colors leading-snug">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Routes ── */}
        {related.length > 0 && (
          <div className="mt-10 lg:mt-14 border-t border-[#2c3440] pt-6">
            <h3 className="text-[11px] font-semibold text-[#678] uppercase tracking-[0.15em] mb-4">
              Related Routes
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {related.map((r) => {
                const rtc = textColor(r.route_color ?? "#666");
                const rLogged = loggedRouteIds.has(r.id);
                return (
                  <Link key={r.id} href={`/route/${r.id}`} className="flex-shrink-0 w-[110px] group">
                    <div className="w-full aspect-[2/3] rounded shadow-lg relative overflow-hidden group-hover:ring-2 group-hover:ring-[#00e054] transition-all"
                      style={{ backgroundColor: r.route_color ?? "#666" }}>
                      <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.1) 6px, rgba(255,255,255,0.1) 12px)",
                      }} />
                      <div className="relative h-full flex flex-col items-center justify-center p-2">
                        <Train className="w-4 h-4 mb-1 opacity-40" style={{ color: rtc }} />
                        <div className="text-2xl font-black" style={{ color: rtc }}>{r.short_name}</div>
                        <div className="text-[7px] mt-1 opacity-50 uppercase tracking-widest" style={{ color: rtc }}>
                          {MODE_LABELS[r.route_type] ?? "Rail"}
                        </div>
                      </div>
                      {rLogged && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#00e054] flex items-center justify-center">
                          <Eye className="w-2.5 h-2.5 text-[#0a0c0f]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9ab] mt-1.5 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                      {r.long_name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
