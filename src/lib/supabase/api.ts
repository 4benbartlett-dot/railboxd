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
