"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Bookmark, Train } from "lucide-react";
import { useAppStore, type RouteLog } from "@/stores/app-store";
import { getRouteById, getStationById } from "@/lib/demo-data";

type ActivityType = "ride" | "rating" | "bucket" | "like" | "milestone";

interface ActivityItem {
  id: string;
  username: string;
  avatarColor: string;
  type: ActivityType;
  text: string;
  timestamp: string;
  rating?: number;
  routeColor?: string;
  routeId?: string;
  isReal?: boolean;
}

interface ActivityFeedProps {
  maxItems?: number;
}

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function ActivityIcon({ type }: { type: ActivityType }) {
  const cls = "w-3 h-3";
  switch (type) {
    case "ride":
      return <MapPin className={cls} />;
    case "rating":
      return <Star className={cls} />;
    case "bucket":
      return <Bookmark className={cls} />;
    case "like":
      return <Heart className={cls} />;
    case "milestone":
      return <Star className={cls} />;
  }
}

function Stars({ count, color }: { count: number; color?: string }) {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i < count ? (color ?? "var(--rb-accent)") : "none"}
          stroke={i < count ? (color ?? "var(--rb-accent)") : "var(--rb-text-muted)"}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr + "T12:00:00").getTime();
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function logToActivity(log: RouteLog, username: string): ActivityItem {
  const route = getRouteById(log.routeId);
  const startStation = getStationById(log.startStationId);
  const endStation = getStationById(log.endStationId);
  const routeName = route?.short_name ?? log.routeId;
  const startName = startStation?.name ?? "Unknown";
  const endName = endStation?.name ?? "Unknown";

  if (log.rating && log.notes) {
    return {
      id: log.id,
      username,
      avatarColor: "#00e054",
      type: "rating",
      text: `reviewed the ${routeName} Line (${startName} → ${endName})`,
      timestamp: timeAgo(log.date),
      rating: log.rating,
      routeColor: route?.route_color ?? "#00e054",
      routeId: log.routeId,
      isReal: true,
    };
  }

  return {
    id: log.id,
    username,
    avatarColor: "#00e054",
    type: "ride",
    text: `rode the ${routeName} from ${startName} to ${endName}`,
    timestamp: timeAgo(log.date),
    rating: log.rating,
    routeColor: route?.route_color ?? "#00e054",
    routeId: log.routeId,
    isReal: true,
  };
}

// Mock community activity for when user has few/no logs
const MOCK_COMMUNITY: ActivityItem[] = [
  {
    id: "m1", username: "sarah_rails", avatarColor: "#e5a100",
    type: "ride", text: "rode the Yellow Line from Embarcadero to Daly City",
    timestamp: "2h ago", routeColor: "#e5a100",
  },
  {
    id: "m2", username: "mike_transit", avatarColor: "#e74c3c",
    type: "rating", text: "rated the Red Line",
    timestamp: "5h ago", rating: 4, routeColor: "#e74c3c",
  },
  {
    id: "m3", username: "bay_rider", avatarColor: "#3498db",
    type: "bucket", text: "added Blue Line to their watchlist",
    timestamp: "1d ago", routeColor: "#3498db",
  },
  {
    id: "m4", username: "transit_guru", avatarColor: "#2ecc71",
    type: "milestone", text: "completed 50 rides!",
    timestamp: "1d ago", routeColor: "#2ecc71",
  },
  {
    id: "m5", username: "la_commuter", avatarColor: "#9b59b6",
    type: "rating", text: "rated the A Line (Blue)",
    timestamp: "2d ago", rating: 5, routeColor: "#0072bc",
  },
  {
    id: "m6", username: "norcal_rider", avatarColor: "#e67e22",
    type: "ride", text: "rode the Orange Line from Berryessa to Fremont",
    timestamp: "2d ago", routeColor: "#e67e22",
  },
];

export function ActivityFeed({ maxItems }: ActivityFeedProps) {
  const routeLogs = useAppStore((s) => s.routeLogs);
  const profile = useAppStore((s) => s.profile);

  const items = useMemo(() => {
    // Generate real activities from user's route logs
    const realActivities = [...routeLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10)
      .map((log) => logToActivity(log, profile.username));

    // Interleave with mock community activity
    const all: ActivityItem[] = [];
    let rIdx = 0;
    let mIdx = 0;

    // Alternate: 2 real, 1 mock (when real data exists)
    while (all.length < 20 && (rIdx < realActivities.length || mIdx < MOCK_COMMUNITY.length)) {
      if (rIdx < realActivities.length) {
        all.push(realActivities[rIdx++]);
        if (rIdx < realActivities.length) all.push(realActivities[rIdx++]);
      }
      if (mIdx < MOCK_COMMUNITY.length) {
        all.push(MOCK_COMMUNITY[mIdx++]);
      }
    }

    // If no real activities, just show mock
    if (all.length === 0) return MOCK_COMMUNITY;

    return maxItems ? all.slice(0, maxItems) : all;
  }, [routeLogs, profile.username, maxItems]);

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" as const }}
          className="flex items-start gap-3 px-4 py-3 rounded-lg bg-[var(--rb-bg-card)] border border-[var(--rb-border)] hover:border-[var(--rb-accent)]/30 transition-colors"
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{
              backgroundColor: item.avatarColor + "25",
              color: item.avatarColor,
            }}
          >
            {getInitials(item.username)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug">
              <span className="font-semibold text-[var(--rb-text-bright)]">
                {item.username}
              </span>{" "}
              <span className="text-[var(--rb-text-muted)]">{item.text}</span>
              {item.rating !== undefined && (
                <Stars count={item.rating} color={item.routeColor} />
              )}
            </p>

            <div className="flex items-center gap-1.5 mt-1 text-[var(--rb-text-muted)]">
              <ActivityIcon type={item.type} />
              <span className="text-xs">{item.timestamp}</span>
              {item.routeId && (
                <Link
                  href={`/route/${item.routeId}`}
                  className="text-xs text-[var(--rb-accent)] hover:underline ml-1"
                >
                  View route
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
