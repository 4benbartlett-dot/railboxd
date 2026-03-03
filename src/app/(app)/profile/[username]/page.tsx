"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Star,
  Train,
  BookOpen,
  UserPlus,
  UserCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAppStore, type RouteLog } from "@/stores/app-store";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserByUsername,
  fetchUserPublicData,
  isFollowing as checkIsFollowing,
  followUser,
  unfollowUser,
} from "@/lib/supabase/api";
import {
  getRouteById,
  getStationById,
  getAgencyById,
  demoRoutes,
} from "@/lib/demo-data";
import { PhotoRouteCard } from "@/components/cards/photo-route-card";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

// ── Star rating ──
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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
    weekday: d
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
  };
}

// ── Diary entry ──
function DiaryEntry({ log }: { log: RouteLog }) {
  const route = getRouteById(log.routeId);
  const startStation = getStationById(log.startStationId);
  const endStation = getStationById(log.endStationId);
  const { month, day, weekday } = formatMonthDay(log.date);

  return (
    <div className="flex gap-0 border-b border-[var(--rb-border)] hover:bg-[var(--rb-bg-card)] transition-colors">
      <div className="flex-shrink-0 w-[72px] py-3 px-2 text-center border-r border-[var(--rb-border)]">
        <div className="text-[10px] font-semibold tracking-wider text-[var(--rb-text-dim)]">
          {month}
        </div>
        <div className="text-xl font-bold text-[var(--rb-text-bright)] leading-tight">
          {day}
        </div>
        <div className="text-[10px] text-[var(--rb-text-dim)]">{weekday}</div>
      </div>
      <div className="flex-1 min-w-0 py-3 px-4 flex items-center gap-3">
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
              <Link
                href={`/route/${log.routeId}`}
                className="text-[13px] text-[var(--rb-text-bright)] font-medium truncate hover:text-[var(--rb-accent)] transition-colors"
              >
                {route.long_name}
              </Link>
            )}
          </div>
          <div className="text-xs text-[var(--rb-text-dim)] mt-0.5">
            {startStation?.name ?? "Unknown"} &rarr;{" "}
            {endStation?.name ?? "Unknown"}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {log.rating != null && <StarRating rating={log.rating} size={12} />}
          {log.notes && (
            <BookOpen className="w-3.5 h-3.5 text-[var(--rb-text-dim)]" />
          )}
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
      {route && (
        <div
          className="shrink-0 w-[50px] aspect-[2/3] rounded-sm flex flex-col items-center justify-center shadow-md"
          style={{
            background: route.route_color,
            color:
              route.route_color === "#FFD800"
                ? "#000"
                : "var(--rb-text-bright)",
          }}
        >
          <Train className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[10px] font-extrabold mt-0.5">
            {route.short_name}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0 border-b border-[var(--rb-border)] pb-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/route/${log.routeId}`}
            className="text-[13px] font-bold text-[var(--rb-text-bright)] hover:text-[var(--rb-accent)] transition-colors"
          >
            {route?.long_name ?? "Unknown"}
          </Link>
          {log.rating != null && <StarRating rating={log.rating} size={11} />}
        </div>
        <div className="text-[11px] text-[var(--rb-text-dim)] mb-2 flex items-center gap-1">
          <Train className="w-3 h-3" />
          {startStation?.name ?? "Unknown"} &rarr;{" "}
          {endStation?.name ?? "Unknown"}
          <span className="mx-1 text-[var(--rb-border)]">|</span>
          {formatDate(log.date)}
        </div>
        <p className="text-[13px] text-[var(--rb-text)] leading-relaxed">
          {log.notes}
        </p>
      </div>
    </div>
  );
}

type ProfileTab = "diary" | "reviews";

// ══════════════════════════════════════════════
//  PUBLIC USER PROFILE PAGE
// ══════════════════════════════════════════════

interface ProfileData {
  id: string;
  displayName?: string;
  username?: string;
  bio?: string;
  homeCity?: string;
  avatarUrl?: string | null;
  joinDate?: string;
  ghostMode?: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const currentUserId = useAppStore((s) => s.userId);
  const currentUsername = useAppStore((s) => s.profile.username);
  const requireAuth = useAppStore((s) => s.requireAuth);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [routeLogs, setRouteLogs] = useState<RouteLog[]>([]);
  const [riddenRouteIds, setRiddenRouteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<{ id: string; routeId: string; rating: number; text: string; date: string; likes: number }[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("diary");
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Is this the current user's profile? Redirect-style: show own profile
  const isOwnProfile = currentUsername === username;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const user = await fetchUserByUsername(supabase, username);
        if (!user || cancelled) {
          if (!cancelled) {
            setNotFound(true);
            setLoading(false);
          }
          return;
        }

        setProfileData(user);

        const publicData = await fetchUserPublicData(supabase, user.id);
        if (cancelled) return;

        setRouteLogs(publicData.routeLogs);
        setRiddenRouteIds(publicData.riddenRouteIds);
        setFavorites(publicData.favorites);
        setReviews(publicData.reviews);
        setFollowerCount(publicData.followerCount);
        setFollowingCount(publicData.followingCount);

        // Check if current user is following this user
        if (currentUserId && currentUserId !== user.id) {
          const following = await checkIsFollowing(
            supabase,
            currentUserId,
            user.id
          );
          if (!cancelled) setIsFollowingUser(following);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username, currentUserId]);

  const handleFollow = useCallback(async () => {
    if (!profileData) return;
    if (!requireAuth("Create an account to follow users.")) return;
    if (!currentUserId) return;

    setFollowLoading(true);
    try {
      const supabase = createClient();
      if (isFollowingUser) {
        await unfollowUser(supabase, currentUserId, profileData.id);
        setIsFollowingUser(false);
        setFollowerCount((c) => Math.max(0, c - 1));
      } else {
        await followUser(supabase, currentUserId, profileData.id);
        setIsFollowingUser(true);
        setFollowerCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Follow action failed:", err);
    } finally {
      setFollowLoading(false);
    }
  }, [profileData, currentUserId, isFollowingUser, requireAuth]);

  const sortedLogs = useMemo(
    () => [...routeLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [routeLogs]
  );

  const reviewLogs = useMemo(
    () => sortedLogs.filter((l) => l.notes && l.notes.trim().length > 0),
    [sortedLogs]
  );

  const favoriteRoutes = useMemo(() => {
    if (routeLogs.length === 0) return [];
    const counts: Record<string, number> = {};
    routeLogs.forEach((l) => {
      counts[l.routeId] = (counts[l.routeId] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    return sorted
      .map(([id]) => getRouteById(id))
      .filter(Boolean) as (typeof demoRoutes)[number][];
  }, [routeLogs]);

  const uniqueRouteCount = useMemo(() => {
    const set = new Set([
      ...routeLogs.map((l) => l.routeId),
      ...riddenRouteIds,
    ]);
    return set.size;
  }, [routeLogs, riddenRouteIds]);

  const uniqueStationCount = useMemo(() => {
    const set = new Set<string>();
    routeLogs.forEach((l) => {
      set.add(l.startStationId);
      set.add(l.endStationId);
    });
    return set.size;
  }, [routeLogs]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--rb-bg)] flex items-center justify-center pb-24">
        <div className="text-center">
          <RailboxdLogo size={40} animate />
          <p className="text-sm text-[var(--rb-text-muted)] mt-3">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFound || !profileData) {
    return (
      <div className="min-h-screen bg-[var(--rb-bg)] flex items-center justify-center pb-24 px-4">
        <div className="text-center max-w-sm">
          <User className="w-16 h-16 mx-auto mb-4 text-[var(--rb-text-dim)]" />
          <h1 className="text-xl font-bold text-white mb-2">User not found</h1>
          <p className="text-sm text-[var(--rb-text-muted)] mb-6">
            No user with the username &ldquo;{username}&rdquo; exists.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2 rounded text-sm font-bold transition-colors hover:brightness-110"
            style={{ background: "var(--rb-accent)", color: "var(--rb-bg)" }}
          >
            Search Users
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { key: ProfileTab; label: string; count?: number }[] = [
    { key: "diary", label: "Diary", count: routeLogs.length },
    { key: "reviews", label: "Reviews", count: reviewLogs.length },
  ];

  return (
    <div className="min-h-screen bg-[var(--rb-bg)] pb-24">
      {/* ── Back button ── */}
      <div className="max-w-[950px] mx-auto px-6 pt-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* ── Banner ── */}
      <div className="relative h-[180px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #122a18 0%, #0a1a0d 30%, var(--rb-bg) 100%)",
          }}
        />
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
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to top, var(--rb-bg), transparent)",
          }}
        />
      </div>

      {/* ── Profile Info ── */}
      <div className="relative max-w-[950px] mx-auto px-6 -mt-14">
        <div className="flex items-end gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-[var(--rb-bg-card)] border-4 border-[var(--rb-bg)] flex items-center justify-center shadow-xl relative z-10 overflow-hidden">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt={profileData.displayName ?? username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-[var(--rb-text-muted)]" />
            )}
          </div>

          {/* Name + handle */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-2xl font-bold text-[var(--rb-text-bright)] leading-tight tracking-tight">
              {profileData.displayName ?? username}
            </h1>
            <p className="text-sm text-[var(--rb-accent)] font-medium">
              @{profileData.username ?? username}
            </p>
          </div>

          {/* Follow / Edit button */}
          {isOwnProfile ? (
            <Link
              href="/settings"
              className="shrink-0 px-4 py-1.5 rounded text-xs font-semibold text-[var(--rb-text)] hover:text-[var(--rb-text-bright)] transition-colors"
              style={{ border: "1px solid var(--rb-border)" }}
            >
              Edit Profile
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50"
              style={
                isFollowingUser
                  ? {
                      border: "1px solid var(--rb-border)",
                      color: "var(--rb-text)",
                    }
                  : {
                      background: "var(--rb-accent)",
                      color: "var(--rb-bg)",
                    }
              }
            >
              {followLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isFollowingUser ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>

        {/* Bio + location */}
        <div className="mt-3 ml-[116px]">
          {profileData.bio && (
            <p className="text-[13px] text-[var(--rb-text)]">
              {profileData.bio}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1.5 text-[11px] text-[var(--rb-text-dim)]">
            {profileData.homeCity && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profileData.homeCity}
              </span>
            )}
            {profileData.joinDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined{" "}
                {new Date(
                  profileData.joinDate + "T12:00:00"
                ).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="max-w-[950px] mx-auto px-6 mt-6">
        <div className="flex items-center gap-6 py-3 border-t border-b border-[var(--rb-border)]">
          {[
            { label: "Routes", value: uniqueRouteCount },
            { label: "Stations", value: uniqueStationCount },
            { label: "Rides", value: routeLogs.length },
            { label: "Reviews", value: reviewLogs.length },
            { label: "Followers", value: followerCount },
            { label: "Following", value: followingCount },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[var(--rb-text-bright)] tabular-nums">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[var(--rb-text-dim)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Favorite Routes row ── */}
      {favoriteRoutes.length > 0 && (
        <div className="max-w-[950px] mx-auto px-6 mt-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--rb-text-muted)] mb-3 pb-2 border-b border-[var(--rb-border)]">
            Most Ridden Routes
          </h2>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {favoriteRoutes.map((route) => (
              <PhotoRouteCard
                key={route.id}
                route={route}
                size="sm"
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
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
                  color:
                    activeTab === tab.key
                      ? "var(--rb-text-bright)"
                      : "var(--rb-text-muted)",
                }}
              >
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span
                    className="ml-1.5 text-[10px]"
                    style={{
                      color:
                        activeTab === tab.key
                          ? "var(--rb-text)"
                          : "var(--rb-text-dim)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="pubptab"
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
          {activeTab === "diary" && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {sortedLogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 w-fit opacity-50">
                    <RailboxdLogo size={48} animate={false} />
                  </div>
                  <p className="text-[var(--rb-text-muted)] text-sm">
                    No public rides yet.
                  </p>
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
                  <p className="text-[var(--rb-text-muted)] text-sm">
                    No reviews yet.
                  </p>
                </div>
              ) : (
                reviewLogs.map((log) => <ReviewCard key={log.id} log={log} />)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
