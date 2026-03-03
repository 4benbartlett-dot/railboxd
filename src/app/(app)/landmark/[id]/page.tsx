"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Calendar,
  Bookmark,
  Share2,
  Info,
  MessageSquare,
  Navigation,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";
import {
  getLandmarkById,
  LANDMARK_TYPE_LABELS,
  LANDMARK_TYPE_COLORS,
} from "@/lib/urbanist-data";
import { getStationById } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";
import Link from "next/link";

export default function LandmarkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const landmark = getLandmarkById(id);

  const visitedLandmarkIds = useAppStore((s) => s.visitedLandmarkIds);
  const landmarkReviews = useAppStore((s) => s.landmarkReviews);
  const addLandmarkVisit = useAppStore((s) => s.addLandmarkVisit);
  const addLandmarkReview = useAppStore((s) => s.addLandmarkReview);
  const landmarkFavorites = useAppStore((s) => s.landmarkFavorites);
  const toggleLandmarkFavorite = useAppStore((s) => s.toggleLandmarkFavorite);
  const landmarkVisits = useAppStore((s) => s.landmarkVisits);

  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { heroUrl, loading } = useLazyPlacePhoto(
    landmark?.photoQuery ?? "",
    landmark?.lat ?? 0,
    landmark?.lng ?? 0
  );

  const isVisited = landmark ? visitedLandmarkIds.has(landmark.id) : false;
  const isFavorited = landmark ? landmarkFavorites.includes(landmark.id) : false;

  const myVisits = useMemo(
    () =>
      landmark
        ? landmarkVisits.filter((v) => v.landmarkId === landmark.id)
        : [],
    [landmark, landmarkVisits]
  );

  const myReviews = useMemo(
    () =>
      landmark
        ? landmarkReviews.filter((r) => r.landmarkId === landmark.id)
        : [],
    [landmark, landmarkReviews]
  );

  const nearbyStations = useMemo(
    () =>
      landmark
        ? landmark.nearbyStationIds
            .map((sid) => getStationById(sid))
            .filter(Boolean)
        : [],
    [landmark]
  );

  if (!landmark) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--rb-bg)" }}
      >
        <div className="text-center">
          <p className="text-[#9ab] text-lg">Landmark not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 rounded-lg text-sm"
            style={{ background: "var(--rb-accent)", color: "#000" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const typeColor = LANDMARK_TYPE_COLORS[landmark.type];
  const typeLabel = LANDMARK_TYPE_LABELS[landmark.type];
  const displayRating = hoverRating || reviewRating;

  function handleLogVisit() {
    addLandmarkVisit({
      id: crypto.randomUUID(),
      landmarkId: landmark!.id,
      date: new Date().toISOString().split("T")[0],
      privacy: "public",
    });
    toast.success(`Visit logged at ${landmark!.name}!`);
  }

  function handleSubmitReview() {
    if (!reviewText.trim() || reviewRating === 0) {
      toast.error("Please add a rating and review text");
      return;
    }
    addLandmarkReview({
      id: crypto.randomUUID(),
      landmarkId: landmark!.id,
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    });
    setReviewText("");
    setReviewRating(0);
    toast.success("Review posted!");
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--rb-bg)" }}>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {heroUrl ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={heroUrl}
            alt={landmark.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: loading
                ? "var(--rb-bg-card)"
                : `linear-gradient(135deg, ${typeColor}40 0%, var(--rb-bg) 100%)`,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--rb-bg) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => {
              toggleLandmarkFavorite(landmark.id);
              toast(
                isFavorited ? "Removed from favorites" : "Added to favorites"
              );
            }}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorited ? "#ff4444" : "transparent"}
              stroke={isFavorited ? "#ff4444" : "white"}
            />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Title area */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: typeColor, color: "#fff" }}
            >
              {typeLabel}
            </span>
            {landmark.yearCompleted && (
              <span className="text-[11px] text-white/60">
                Est. {landmark.yearCompleted}
              </span>
            )}
            {isVisited && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--rb-accent)]">
                <Check className="w-3 h-3" /> Visited
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">
            {landmark.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-2 relative z-10">
        {/* Quick actions */}
        <div className="flex gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogVisit}
            className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{ background: typeColor, color: "#fff" }}
          >
            <Bookmark className="w-4 h-4" />
            {isVisited ? "Log Another Visit" : "Log Visit"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("reviews")}
            className="px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{
              background: "var(--rb-bg-card)",
              color: "var(--rb-text-bright)",
              border: "1px solid var(--rb-border)",
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Review
          </motion.button>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-around py-3 rounded-xl mb-6"
          style={{
            background: "var(--rb-bg-card)",
            border: "1px solid var(--rb-border)",
          }}
        >
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: typeColor }}>
              {myVisits.length}
            </p>
            <p className="text-[10px] text-[#678] uppercase tracking-wider">
              Your Visits
            </p>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "var(--rb-border)" }}
          />
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {myReviews.length > 0
                ? (
                    myReviews.reduce((sum, r) => sum + r.rating, 0) /
                    myReviews.length
                  ).toFixed(1)
                : "--"}
            </p>
            <p className="text-[10px] text-[#678] uppercase tracking-wider">
              Avg Rating
            </p>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "var(--rb-border)" }}
          />
          <div className="text-center">
            <p className="text-lg font-bold text-white">{myReviews.length}</p>
            <p className="text-[10px] text-[#678] uppercase tracking-wider">
              Reviews
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-5"
          style={{ background: "var(--rb-bg-card)" }}
        >
          {(["info", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background:
                  activeTab === tab ? "var(--rb-bg-elevated)" : "transparent",
                color:
                  activeTab === tab
                    ? "var(--rb-text-bright)"
                    : "var(--rb-text-muted)",
              }}
            >
              {tab === "info" ? "Info" : `Reviews (${myReviews.length})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Description */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "var(--rb-bg-card)",
                  border: "1px solid var(--rb-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" style={{ color: typeColor }} />
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--rb-text-bright)" }}
                  >
                    About
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--rb-text)" }}
                >
                  {landmark.description}
                </p>
              </div>

              {/* Fun fact */}
              {landmark.funFact && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: `${typeColor}10`,
                    border: `1px solid ${typeColor}30`,
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: typeColor }}
                  >
                    Fun Fact
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--rb-text-bright)" }}
                  >
                    {landmark.funFact}
                  </p>
                </motion.div>
              )}

              {/* Nearby stations */}
              {nearbyStations.length > 0 && (
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: "var(--rb-text-muted)" }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Nearby Stations
                  </h3>
                  <div className="space-y-2">
                    {nearbyStations.map(
                      (station) =>
                        station && (
                          <Link
                            key={station.id}
                            href={`/station/${station.id}`}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                              style={{
                                background: "var(--rb-bg-card)",
                                border: "1px solid var(--rb-border)",
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: "var(--rb-bg-elevated)" }}
                              >
                                <MapPin
                                  className="w-4 h-4"
                                  style={{ color: "var(--rb-accent)" }}
                                />
                              </div>
                              <div>
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "var(--rb-text-bright)" }}
                                >
                                  {station.name}
                                </p>
                                <p
                                  className="text-[11px]"
                                  style={{ color: "var(--rb-text-muted)" }}
                                >
                                  Tap to view station
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Visit History */}
              {myVisits.length > 0 && (
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: "var(--rb-text-muted)" }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Your Visit History
                  </h3>
                  <div className="space-y-2">
                    {myVisits
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((visit) => (
                        <div
                          key={visit.id}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            background: "var(--rb-bg-card)",
                            border: "1px solid var(--rb-border)",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${typeColor}20` }}
                          >
                            <Check
                              className="w-4 h-4"
                              style={{ color: typeColor }}
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--rb-text-bright)" }}
                            >
                              Visited{" "}
                              {new Date(visit.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            {visit.notes && (
                              <p
                                className="text-[11px]"
                                style={{ color: "var(--rb-text-muted)" }}
                              >
                                {visit.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Write a review */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "var(--rb-bg-card)",
                  border: "1px solid var(--rb-border)",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--rb-text-bright)" }}
                >
                  Write a Review
                </h3>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setReviewRating(s === reviewRating ? 0 : s)
                      }
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-6 h-6 cursor-pointer transition-colors"
                        fill={s <= displayRating ? typeColor : "transparent"}
                        stroke={s <= displayRating ? typeColor : "#456"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  {displayRating > 0 && (
                    <span className="text-xs text-[#678] ml-2">
                      {displayRating}/5
                    </span>
                  )}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think? What should people know?"
                  rows={3}
                  className="w-full rounded-lg border border-[var(--rb-border)] bg-[var(--rb-bg)] px-3 py-2.5 text-sm text-white placeholder-[#456] focus:outline-none transition-colors resize-none mb-3"
                  style={{
                    borderColor: reviewText ? typeColor : "var(--rb-border)",
                  }}
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim() || reviewRating === 0}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: typeColor, color: "#fff" }}
                >
                  Post Review
                </motion.button>
              </div>

              {/* Existing reviews */}
              {myReviews.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#345]" />
                  <p className="text-sm text-[#678]">
                    No reviews yet. Be the first!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReviews
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                    )
                    .map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl"
                        style={{
                          background: "var(--rb-bg-card)",
                          border: "1px solid var(--rb-border)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className="w-3.5 h-3.5"
                                fill={
                                  s <= review.rating ? typeColor : "transparent"
                                }
                                stroke={
                                  s <= review.rating ? typeColor : "#456"
                                }
                                strokeWidth={1.5}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#678]">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--rb-text)" }}
                        >
                          {review.text}
                        </p>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
