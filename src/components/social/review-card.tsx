"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Review {
  id: string;
  username: string;
  routeName: string;
  routeColor: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  liked: boolean;
}

interface ReviewCardProps {
  review: Review;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function avatarColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ReviewCard({ review }: ReviewCardProps) {
  const [liked, setLiked] = useState(review.liked);
  const [likeCount, setLikeCount] = useState(review.likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const avatarColor = avatarColorFromName(review.username);

  return (
    <div className="rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] p-4 transition-colors hover:border-[var(--rb-accent)]/30">
      {/* Header: avatar, username, date, route badge */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{
            backgroundColor: avatarColor + "25",
            color: avatarColor,
          }}
        >
          {getInitials(review.username)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--rb-text-bright)] truncate">
              {review.username}
            </span>
            <span className="text-xs text-[var(--rb-text-muted)]">
              {review.date}
            </span>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                fill={i < review.rating ? review.routeColor : "none"}
                stroke={i < review.rating ? review.routeColor : "var(--rb-text-muted)"}
                strokeWidth={2}
              />
            ))}
          </div>
        </div>

        {/* Route badge */}
        <span
          className="px-2.5 py-1 rounded-md text-xs font-bold flex-shrink-0"
          style={{
            backgroundColor: review.routeColor + "20",
            color: review.routeColor,
          }}
        >
          {review.routeName}
        </span>
      </div>

      {/* Review text */}
      <p className="text-sm text-[var(--rb-text-muted)] leading-relaxed mb-3">
        {review.text}
      </p>

      {/* Footer: like button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleLike}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
            liked
              ? "bg-red-500/15 text-red-400"
              : "bg-[var(--rb-bg-card)] text-[var(--rb-text-muted)] hover:text-red-400 hover:bg-red-500/10",
          )}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={liked ? "currentColor" : "none"}
          />
          {likeCount}
        </button>
      </div>
    </div>
  );
}
