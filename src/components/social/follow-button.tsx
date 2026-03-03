"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FollowButton({ userId, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [hovering, setHovering] = useState(false);

  const handleClick = () => {
    if (following) {
      setFollowing(false);
      toast(`Unfollowed @${userId}`);
    } else {
      setFollowing(true);
      toast(`Followed @${userId}`);
    }
  };

  const showUnfollow = following && hovering;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer min-w-[100px]",
        !following &&
          "border border-[var(--rb-accent)] text-[var(--rb-accent)] bg-transparent hover:bg-[var(--rb-accent)]/10",
        following &&
          !hovering &&
          "border border-[var(--rb-accent)] bg-[var(--rb-accent)] text-[var(--rb-bg)]",
        showUnfollow &&
          "border border-red-500 bg-red-500/10 text-red-500",
      )}
    >
      {showUnfollow ? "Unfollow" : following ? "Following" : "Follow"}
    </button>
  );
}
