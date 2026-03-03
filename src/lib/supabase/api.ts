import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouteLog, Review, UserProfile } from "@/stores/app-store";

// ── Helpers ──

function toSnakeRouteLog(userId: string, log: RouteLog) {
  return {
    id: log.id,
    user_id: userId,
    route_id: log.routeId,
    start_station_id: log.startStationId,
    end_station_id: log.endStationId,
    ride_date: log.date,
    rating: log.rating ?? null,
    notes: log.notes ?? null,
    tags: log.tags ?? [],
    privacy: log.privacy ?? "public",
  };
}

function toCamelRouteLog(row: Record<string, unknown>): RouteLog {
  return {
    id: row.id as string,
    routeId: row.route_id as string,
    startStationId: row.start_station_id as string,
    endStationId: row.end_station_id as string,
    date: row.ride_date as string,
    rating: (row.rating as number) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    tags: (row.tags as string[]) ?? undefined,
    privacy: (row.privacy as RouteLog["privacy"]) ?? undefined,
  };
}

function toSnakeReview(userId: string, review: Review) {
  return {
    id: review.id,
    user_id: userId,
    route_id: review.routeId,
    rating: review.rating,
    text: review.text,
  };
}

function toCamelReview(row: Record<string, unknown>): Review {
  const createdAt = row.created_at as string;
  return {
    id: row.id as string,
    routeId: row.route_id as string,
    rating: row.rating as number,
    text: row.text as string,
    date: createdAt ? createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
    likes: (row.like_count as number) ?? 0,
  };
}

function toSnakeProfile(userId: string, profile: Partial<UserProfile>) {
  const row: Record<string, unknown> = { id: userId };
  if (profile.displayName !== undefined) row.display_name = profile.displayName;
  if (profile.username !== undefined) row.username = profile.username;
  if (profile.bio !== undefined) row.bio = profile.bio;
  if (profile.homeCity !== undefined) row.home_city = profile.homeCity;
  if (profile.avatarUrl !== undefined) row.avatar_url = profile.avatarUrl;
  if (profile.privacyDefault !== undefined) row.privacy_default = profile.privacyDefault;
  if (profile.ghostMode !== undefined) row.ghost_mode = profile.ghostMode;
  if (profile.hideHomeStation !== undefined) row.hide_home_station = profile.hideHomeStation;
  return row;
}

function toCamelProfile(row: Record<string, unknown>): Partial<UserProfile> {
  return {
    displayName: (row.display_name as string) || "Transit Explorer",
    username: (row.username as string) || "explorer",
    bio: (row.bio as string) || "",
    homeCity: (row.home_city as string) || "",
    avatarUrl: (row.avatar_url as string) || null,
    joinDate: row.created_at
      ? (row.created_at as string).split("T")[0]
      : new Date().toISOString().split("T")[0],
    privacyDefault: (row.privacy_default as UserProfile["privacyDefault"]) || "public",
    ghostMode: (row.ghost_mode as boolean) ?? false,
    hideHomeStation: (row.hide_home_station as boolean) ?? false,
  };
}

// ── Fetch all user data in one go ──

export interface UserData {
  routeLogs: RouteLog[];
  reviews: Review[];
  favorites: string[];
  bucketList: string[];
  likedReviews: string[];
  riddenRouteIds: string[];
  profile: Partial<UserProfile> | null;
}

export async function fetchAllUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<UserData> {
  const [
    logsRes,
    reviewsRes,
    favsRes,
    bucketRes,
    likesRes,
    riddenRes,
    profileRes,
  ] = await Promise.all([
    supabase
      .from("route_logs")
      .select("*")
      .eq("user_id", userId)
      .order("ride_date", { ascending: false }),
    supabase
      .from("reviews")
      .select("*, likes(count)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("favorites")
      .select("route_id")
      .eq("user_id", userId)
      .not("route_id", "is", null),
    supabase
      .from("bucket_list")
      .select("route_id")
      .eq("user_id", userId)
      .not("route_id", "is", null),
    supabase
      .from("likes")
      .select("review_id")
      .eq("user_id", userId),
    supabase
      .from("ridden_routes")
      .select("route_id")
      .eq("user_id", userId),
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single(),
  ]);

  const routeLogs = (logsRes.data ?? []).map(toCamelRouteLog);

  const reviews = (reviewsRes.data ?? []).map((row: Record<string, unknown>) => {
    const likesArr = row.likes as { count: number }[] | undefined;
    const likeCount = likesArr?.[0]?.count ?? 0;
    return toCamelReview({ ...row, like_count: likeCount });
  });

  const favorites = (favsRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);

  const bucketList = (bucketRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);

  const likedReviews = (likesRes.data ?? [])
    .map((r: Record<string, unknown>) => r.review_id as string)
    .filter(Boolean);

  const riddenRouteIds = (riddenRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);

  const profile = profileRes.data
    ? toCamelProfile(profileRes.data as Record<string, unknown>)
    : null;

  return { routeLogs, reviews, favorites, bucketList, likedReviews, riddenRouteIds, profile };
}

// ── Route Logs ──

export async function insertRouteLog(
  supabase: SupabaseClient,
  userId: string,
  log: RouteLog
) {
  const { error } = await supabase
    .from("route_logs")
    .upsert(toSnakeRouteLog(userId, log), { onConflict: "id" });
  if (error) throw error;
}

export async function deleteRouteLog(
  supabase: SupabaseClient,
  logId: string
) {
  const { error } = await supabase
    .from("route_logs")
    .delete()
    .eq("id", logId);
  if (error) throw error;
}

// ── Reviews ──

export async function insertReview(
  supabase: SupabaseClient,
  userId: string,
  review: Review
) {
  const { error } = await supabase
    .from("reviews")
    .upsert(toSnakeReview(userId, review), { onConflict: "id" });
  if (error) throw error;
}

export async function deleteReview(
  supabase: SupabaseClient,
  reviewId: string
) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);
  if (error) throw error;
}

// ── Favorites ──

export async function insertFavorite(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, route_id: routeId });
  if (error && error.code !== "23505") throw error; // ignore duplicate
}

export async function deleteFavorite(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("route_id", routeId);
  if (error) throw error;
}

// ── Bucket List ──

export async function insertBucketListItem(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("bucket_list")
    .insert({ user_id: userId, route_id: routeId });
  if (error && error.code !== "23505") throw error;
}

export async function deleteBucketListItem(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("bucket_list")
    .delete()
    .eq("user_id", userId)
    .eq("route_id", routeId);
  if (error) throw error;
}

// ── Likes ──

export async function insertLike(
  supabase: SupabaseClient,
  userId: string,
  reviewId: string
) {
  const { error } = await supabase
    .from("likes")
    .insert({ user_id: userId, review_id: reviewId });
  if (error && error.code !== "23505") throw error;
}

export async function deleteLike(
  supabase: SupabaseClient,
  userId: string,
  reviewId: string
) {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("review_id", reviewId);
  if (error) throw error;
}

// ── Ridden Routes ──

export async function insertRiddenRoute(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("ridden_routes")
    .insert({ user_id: userId, route_id: routeId });
  if (error && error.code !== "23505") throw error;
}

export async function deleteRiddenRoute(
  supabase: SupabaseClient,
  userId: string,
  routeId: string
) {
  const { error } = await supabase
    .from("ridden_routes")
    .delete()
    .eq("user_id", userId)
    .eq("route_id", routeId);
  if (error) throw error;
}

// ── Profile ──

export async function upsertProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<UserProfile>
) {
  const row = toSnakeProfile(userId, updates);
  const { error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "id" });
  if (error) throw error;
}

// ── User Lookup ──

export async function fetchUserByUsername(
  supabase: SupabaseClient,
  username: string
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id as string,
    ...(toCamelProfile(data as Record<string, unknown>) as Partial<UserProfile>),
  };
}

export async function fetchUserPublicData(
  supabase: SupabaseClient,
  userId: string
) {
  const [logsRes, reviewsRes, riddenRes, favsRes, bucketRes, followersRes, followingRes] =
    await Promise.all([
      supabase
        .from("route_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("privacy", "public")
        .order("ride_date", { ascending: false }),
      supabase
        .from("reviews")
        .select("*, likes(count)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("ridden_routes")
        .select("route_id")
        .eq("user_id", userId),
      supabase
        .from("favorites")
        .select("route_id")
        .eq("user_id", userId)
        .not("route_id", "is", null),
      supabase
        .from("bucket_list")
        .select("route_id")
        .eq("user_id", userId)
        .not("route_id", "is", null),
      supabase
        .from("follows")
        .select("follower_id", { count: "exact", head: true })
        .eq("following_id", userId),
      supabase
        .from("follows")
        .select("following_id", { count: "exact", head: true })
        .eq("follower_id", userId),
    ]);

  const routeLogs = (logsRes.data ?? []).map(toCamelRouteLog);
  const reviews = (reviewsRes.data ?? []).map((row: Record<string, unknown>) => {
    const likesArr = row.likes as { count: number }[] | undefined;
    const likeCount = likesArr?.[0]?.count ?? 0;
    return toCamelReview({ ...row, like_count: likeCount });
  });
  const riddenRouteIds = (riddenRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);
  const favorites = (favsRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);
  const bucketList = (bucketRes.data ?? [])
    .map((r: Record<string, unknown>) => r.route_id as string)
    .filter(Boolean);

  return {
    routeLogs,
    reviews,
    riddenRouteIds,
    favorites,
    bucketList,
    followerCount: followersRes.count ?? 0,
    followingCount: followingRes.count ?? 0,
  };
}

// ── Search & Discovery ──

export async function searchUsers(
  supabase: SupabaseClient,
  query: string,
  limit = 20
) {
  const pattern = `%${query}%`;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
    .limit(limit);
  if (error) throw error;
  return data as {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
  }[];
}

// ── Public Activity Feed ──

export async function fetchPublicActivity(
  supabase: SupabaseClient,
  limit = 15
) {
  const { data, error } = await supabase
    .from("route_logs")
    .select(
      "id, route_id, rating, notes, ride_date, profiles(id, username, display_name, avatar_url)"
    )
    .eq("privacy", "public")
    .order("ride_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, unknown> | null;
    return {
      id: row.id as string,
      routeId: row.route_id as string,
      rating: row.rating as number | null,
      reviewText: row.notes as string | null,
      loggedAt: row.ride_date as string,
      user: profile
        ? {
            id: profile.id as string,
            username: profile.username as string,
            displayName: profile.display_name as string,
            avatarUrl: profile.avatar_url as string | null,
          }
        : null,
    };
  });
}

// ── Public Reviews ──

export async function fetchPublicReviews(
  supabase: SupabaseClient,
  limit = 10
) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, route_id, rating, text, created_at, likes(count), profiles(id, username, display_name, avatar_url)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => {
    const likesArr = row.likes as { count: number }[] | undefined;
    const likeCount = likesArr?.[0]?.count ?? 0;
    const profile = row.profiles as Record<string, unknown> | null;
    return {
      id: row.id as string,
      routeId: row.route_id as string,
      rating: row.rating as number,
      text: row.text as string,
      likeCount,
      createdAt: row.created_at as string,
      user: profile
        ? {
            id: profile.id as string,
            username: profile.username as string,
            displayName: profile.display_name as string,
            avatarUrl: profile.avatar_url as string | null,
          }
        : null,
    };
  });
}

// ── Route Reviews ──

export async function fetchRouteReviews(
  supabase: SupabaseClient,
  routeId: string,
  limit = 20
) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, route_id, rating, text, created_at, likes(count), profiles(id, username, display_name, avatar_url)"
    )
    .eq("route_id", routeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => {
    const likesArr = row.likes as { count: number }[] | undefined;
    const likeCount = likesArr?.[0]?.count ?? 0;
    const profile = row.profiles as Record<string, unknown> | null;
    return {
      id: row.id as string,
      routeId: row.route_id as string,
      rating: row.rating as number,
      text: row.text as string,
      likeCount,
      createdAt: row.created_at as string,
      user: profile
        ? {
            id: profile.id as string,
            username: profile.username as string,
            displayName: profile.display_name as string,
            avatarUrl: profile.avatar_url as string | null,
          }
        : null,
    };
  });
}

// ── Route Stats ──

export async function fetchRouteStats(
  supabase: SupabaseClient,
  routeId: string
) {
  const [riddenRes, logsRes, favsRes, bucketRes] = await Promise.all([
    supabase
      .from("ridden_routes")
      .select("user_id", { count: "exact", head: true })
      .eq("route_id", routeId),
    supabase
      .from("route_logs")
      .select("user_id")
      .eq("route_id", routeId),
    supabase
      .from("favorites")
      .select("user_id", { count: "exact", head: true })
      .eq("route_id", routeId),
    supabase
      .from("bucket_list")
      .select("user_id", { count: "exact", head: true })
      .eq("route_id", routeId),
  ]);

  if (riddenRes.error) throw riddenRes.error;
  if (logsRes.error) throw logsRes.error;
  if (favsRes.error) throw favsRes.error;
  if (bucketRes.error) throw bucketRes.error;

  // Distinct riders: take the larger of the two counts as a lower bound
  // (exact dedup would require a server-side union query)
  const logUserCount = new Set(
    (logsRes.data ?? []).map((r: Record<string, unknown>) => r.user_id as string)
  ).size;
  const totalRiders = Math.max(riddenRes.count ?? 0, logUserCount);

  return {
    totalRiders,
    totalFavorites: favsRes.count ?? 0,
    totalBucketList: bucketRes.count ?? 0,
  };
}

// ── Follows ──

export async function fetchFollowers(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("follows")
    .select(
      "follower_id, created_at, profiles!follows_follower_id_fkey(id, username, display_name, avatar_url)"
    )
    .eq("following_id", userId);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, unknown> | null;
    return {
      followerId: row.follower_id as string,
      createdAt: row.created_at as string,
      user: profile
        ? {
            id: profile.id as string,
            username: profile.username as string,
            displayName: profile.display_name as string,
            avatarUrl: profile.avatar_url as string | null,
          }
        : null,
    };
  });
}

export async function fetchFollowing(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("follows")
    .select(
      "following_id, created_at, profiles!follows_following_id_fkey(id, username, display_name, avatar_url)"
    )
    .eq("follower_id", userId);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profiles as Record<string, unknown> | null;
    return {
      followingId: row.following_id as string,
      createdAt: row.created_at as string,
      user: profile
        ? {
            id: profile.id as string,
            username: profile.username as string,
            displayName: profile.display_name as string,
            avatarUrl: profile.avatar_url as string | null,
          }
        : null,
    };
  });
}

export async function followUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  if (error && error.code !== "23505") throw error; // ignore duplicate
}

export async function unfollowUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}

export async function isFollowing(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
