"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

interface LeaderboardUser {
  rank: number;
  name: string;
  rides: number;
  stations: number;
  avatarColor: string;
  isCurrentUser?: boolean;
}

const MOCK_USERS: Omit<LeaderboardUser, "rank">[] = [
  { name: "sarah_rails", rides: 342, stations: 87, avatarColor: "#e5a100" },
  { name: "mike_transit", rides: 298, stations: 74, avatarColor: "#e74c3c" },
  { name: "bay_rider", rides: 256, stations: 71, avatarColor: "#3498db" },
  { name: "la_commuter", rides: 221, stations: 65, avatarColor: "#2ecc71" },
  { name: "transit_guru", rides: 198, stations: 59, avatarColor: "#9b59b6" },
  { name: "norcal_rider", rides: 175, stations: 53, avatarColor: "#e67e22" },
  { name: "sf_express", rides: 162, stations: 48, avatarColor: "#1abc9c" },
  { name: "rail_fan_42", rides: 144, stations: 42, avatarColor: "#f1c40f" },
  { name: "metro_iris", rides: 128, stations: 38, avatarColor: "#e84393" },
  { name: "jake_tracks", rides: 110, stations: 34, avatarColor: "#00cec9" },
];

const MEDAL_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

export function Leaderboard() {
  const routeLogs = useAppStore((s) => s.routeLogs);
  const loggedStationIds = useAppStore((s) => s.loggedStationIds);
  const profile = useAppStore((s) => s.profile);

  const users = useMemo(() => {
    const currentUser: Omit<LeaderboardUser, "rank"> = {
      name: profile.username,
      rides: routeLogs.length,
      stations: loggedStationIds.size,
      avatarColor: "#00e054",
      isCurrentUser: true,
    };

    // Merge current user with mock users, sort by rides
    const all = [...MOCK_USERS, currentUser]
      .sort((a, b) => b.rides - a.rides)
      .slice(0, 10)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    return all;
  }, [routeLogs.length, loggedStationIds.size, profile.username]);

  return (
    <div className="rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--rb-border)]">
        <Trophy className="w-4.5 h-4.5 text-[var(--rb-accent)]" />
        <h2 className="text-sm font-bold text-[var(--rb-text-bright)]">
          Top Riders
        </h2>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--rb-border)]">
        {users.map((user, index) => {
          const medal = MEDAL_COLORS[user.rank];
          const isTopThree = user.rank <= 3;

          return (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.35,
                ease: "easeOut" as const,
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--rb-bg-card)]/80",
                isTopThree && "bg-[var(--rb-bg-card)]",
                user.isCurrentUser && "ring-1 ring-inset ring-[var(--rb-accent)]/20",
              )}
            >
              {/* Rank */}
              <span
                className={cn(
                  "w-6 text-center text-sm font-bold flex-shrink-0",
                  medal ? "" : "text-[var(--rb-text-muted)]",
                )}
                style={medal ? { color: medal } : undefined}
              >
                {user.rank}
              </span>

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  backgroundColor: user.avatarColor + "25",
                  color: user.avatarColor,
                  boxShadow: medal ? `0 0 0 2px ${medal}40` : undefined,
                }}
              >
                {getInitials(user.name)}
              </div>

              {/* Name */}
              <span className={cn(
                "flex-1 text-sm font-medium truncate",
                user.isCurrentUser
                  ? "text-[var(--rb-accent)]"
                  : "text-[var(--rb-text-bright)]",
              )}>
                {user.name}
                {user.isCurrentUser && (
                  <span className="text-[10px] text-[var(--rb-text-muted)] ml-1.5">(you)</span>
                )}
              </span>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-[var(--rb-text-muted)]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="font-medium text-[var(--rb-text-bright)]">
                    {user.rides}
                  </span>
                  <span className="hidden sm:inline">rides</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[var(--rb-text-muted)]">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium text-[var(--rb-text-bright)]">
                    {user.stations}
                  </span>
                  <span className="hidden sm:inline">stations</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
