import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAllUserData,
  insertRouteLog,
  deleteRouteLog as apiDeleteRouteLog,
  insertReview,
  deleteReview as apiDeleteReview,
  insertFavorite,
  deleteFavorite,
  insertBucketListItem,
  deleteBucketListItem,
  insertLike,
  deleteLike,
  insertRiddenRoute,
  deleteRiddenRoute,
  upsertProfile,
} from "@/lib/supabase/api";

export interface RouteLog {
  id: string;
  routeId: string;
  startStationId: string;
  endStationId: string;
  date: string; // ISO date YYYY-MM-DD
  rating?: number; // 1–5
  notes?: string;
  photos?: string[]; // base64 data URLs for demo mode
  tags?: string[];
  privacy?: "public" | "friends" | "private";
}

export interface Review {
  id: string;
  routeId: string;
  rating: number;
  text: string;
  date: string; // ISO date YYYY-MM-DD
  likes: number; // community like count (mock)
}

export interface LandmarkVisit {
  id: string;
  landmarkId: string;
  date: string;
  rating?: number;
  notes?: string;
  privacy?: "public" | "friends" | "private";
}

export interface LandmarkReview {
  id: string;
  landmarkId: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}

export interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  homeCity: string;
  avatarUrl: string | null;
  joinDate: string; // ISO date
  privacyDefault: "public" | "friends" | "private";
  ghostMode: boolean;
  hideHomeStation: boolean;
  activityDelay: string;
  notifyFollowers: boolean;
  notifyFriendActivity: boolean;
  notifyRouteReviews: boolean;
  notifyWeeklyDigest: boolean;
}

function deriveLoggedRouteIds(logs: RouteLog[]) {
  return new Set(logs.map((l) => l.routeId));
}
function deriveLoggedStationIds(logs: RouteLog[]) {
  const ids = new Set<string>();
  logs.forEach((l) => { ids.add(l.startStationId); ids.add(l.endStationId); });
  return ids;
}

const defaultProfile: UserProfile = {
  displayName: "Transit Explorer",
  username: "explorer",
  bio: "Documenting every ride. One line at a time.",
  homeCity: "San Francisco, CA",
  avatarUrl: null,
  joinDate: new Date().toISOString().split("T")[0],
  privacyDefault: "public",
  ghostMode: false,
  hideHomeStation: false,
  activityDelay: "none",
  notifyFollowers: true,
  notifyFriendActivity: true,
  notifyRouteReviews: false,
  notifyWeeklyDigest: true,
};

// Fire-and-forget Supabase sync with error toast
function syncToSupabase(fn: () => Promise<void>) {
  fn().catch((err) => {
    console.error("Supabase sync error:", err);
    toast.error("Failed to sync — your data is saved locally.", {
      description: "It will sync next time you sign in.",
    });
  });
}

interface AppState {
  // Auth state — whether user is signed in
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;

  // Supabase user ID (null when guest)
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Hydrate store from Supabase on login
  hydrateFromSupabase: (userId: string) => Promise<void>;

  // Clear all user data on logout
  clearUserData: () => void;

  // Auth prompt modal (shown when guests try protected actions)
  authPromptOpen: boolean;
  authPromptMessage: string | null;
  openAuthPrompt: (message?: string) => void;
  closeAuthPrompt: () => void;

  // Gate helper: returns true if authenticated, shows prompt if not
  requireAuth: (message?: string) => boolean;

  // Route logs — the core data model
  routeLogs: RouteLog[];
  addRouteLog: (log: RouteLog) => void;
  removeRouteLog: (id: string) => void;

  // Derived sets for styling
  loggedRouteIds: Set<string>;
  loggedStationIds: Set<string>;

  // User profile (persisted)
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Bucket list / Watchlist (route IDs)
  bucketList: string[];
  toggleBucketList: (routeId: string) => void;
  isBucketListed: (routeId: string) => boolean;

  // Favorites (route IDs)
  favorites: string[];
  toggleFavorite: (routeId: string) => void;
  isFavorited: (routeId: string) => boolean;

  // User-written reviews
  reviews: Review[];
  addReview: (review: Review) => void;
  removeReview: (id: string) => void;

  // Liked review IDs
  likedReviews: string[];
  toggleLike: (reviewId: string) => void;
  isLiked: (reviewId: string) => boolean;

  // Landmark visits
  landmarkVisits: LandmarkVisit[];
  addLandmarkVisit: (visit: LandmarkVisit) => void;
  removeLandmarkVisit: (id: string) => void;
  visitedLandmarkIds: Set<string>;

  // Landmark reviews
  landmarkReviews: LandmarkReview[];
  addLandmarkReview: (review: LandmarkReview) => void;
  removeLandmarkReview: (id: string) => void;

  // Landmark favorites
  landmarkFavorites: string[];
  toggleLandmarkFavorite: (landmarkId: string) => void;
  isLandmarkFavorited: (landmarkId: string) => boolean;

  // Quick-mark ridden (separate from full log)
  riddenRouteIds: string[];
  toggleRidden: (routeId: string) => void;
  isRidden: (routeId: string) => boolean;

  // Log modal (triggered when user taps "Log this route")
  logModalOpen: boolean;
  logModalRouteId: string | null;
  openLogModal: (routeId: string) => void;
  closeLogModal: () => void;

  // Landmark log modal
  landmarkModalOpen: boolean;
  landmarkModalId: string | null;
  openLandmarkModal: (landmarkId: string) => void;
  closeLandmarkModal: () => void;

  // UI
  activeTab: "dashboard" | "search" | "explore" | "profile";
  setActiveTab: (tab: "dashboard" | "search" | "explore" | "profile") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      setAuthenticated: (v: boolean) => set({ isAuthenticated: v }),

      // User ID
      userId: null,
      setUserId: (id: string | null) => set({ userId: id }),

      // Hydrate from Supabase
      hydrateFromSupabase: async (userId: string) => {
        try {
          const supabase = createClient();
          const data = await fetchAllUserData(supabase, userId);

          const routeLogs = data.routeLogs;
          set({
            routeLogs,
            loggedRouteIds: deriveLoggedRouteIds(routeLogs),
            loggedStationIds: deriveLoggedStationIds(routeLogs),
            reviews: data.reviews,
            favorites: data.favorites,
            bucketList: data.bucketList,
            likedReviews: data.likedReviews,
            riddenRouteIds: data.riddenRouteIds,
            ...(data.profile ? { profile: { ...defaultProfile, ...data.profile } } : {}),
          });
        } catch (err) {
          console.error("Failed to hydrate from Supabase:", err);
          // Keep localStorage data as fallback
        }
      },

      // Clear user data on logout
      clearUserData: () =>
        set({
          userId: null,
          routeLogs: [],
          loggedRouteIds: new Set<string>(),
          loggedStationIds: new Set<string>(),
          reviews: [],
          favorites: [],
          bucketList: [],
          likedReviews: [],
          riddenRouteIds: [],
          landmarkVisits: [],
          landmarkReviews: [],
          landmarkFavorites: [],
          visitedLandmarkIds: new Set<string>(),
          profile: { ...defaultProfile },
        }),

      // Auth prompt modal
      authPromptOpen: false,
      authPromptMessage: null,
      openAuthPrompt: (message?: string) =>
        set({ authPromptOpen: true, authPromptMessage: message ?? null }),
      closeAuthPrompt: () =>
        set({ authPromptOpen: false, authPromptMessage: null }),

      requireAuth: (message?: string) => {
        if (get().isAuthenticated) return true;
        get().openAuthPrompt(message);
        return false;
      },

      routeLogs: [],
      loggedRouteIds: new Set<string>(),
      loggedStationIds: new Set<string>(),

      addRouteLog: (log) => {
        set((state) => {
          const routeLogs = [...state.routeLogs, log];
          return {
            routeLogs,
            loggedRouteIds: deriveLoggedRouteIds(routeLogs),
            loggedStationIds: deriveLoggedStationIds(routeLogs),
          };
        });
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() => insertRouteLog(supabase, userId, log));
        }
      },

      removeRouteLog: (id) => {
        set((state) => {
          const routeLogs = state.routeLogs.filter((l) => l.id !== id);
          return {
            routeLogs,
            loggedRouteIds: deriveLoggedRouteIds(routeLogs),
            loggedStationIds: deriveLoggedStationIds(routeLogs),
          };
        });
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() => apiDeleteRouteLog(supabase, id));
        }
      },

      // Profile
      profile: { ...defaultProfile },
      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() => upsertProfile(supabase, userId, updates));
        }
      },

      // Bucket list
      bucketList: [],
      toggleBucketList: (routeId) => {
        if (!get().requireAuth("Create an account to add routes to your watchlist.")) return;
        const removing = get().bucketList.includes(routeId);
        set((state) => ({
          bucketList: removing
            ? state.bucketList.filter((id) => id !== routeId)
            : [...state.bucketList, routeId],
        }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() =>
            removing
              ? deleteBucketListItem(supabase, userId, routeId)
              : insertBucketListItem(supabase, userId, routeId)
          );
        }
      },
      isBucketListed: (routeId) => get().bucketList.includes(routeId),

      // Favorites
      favorites: [],
      toggleFavorite: (routeId) => {
        if (!get().requireAuth("Create an account to favorite routes.")) return;
        const removing = get().favorites.includes(routeId);
        set((state) => ({
          favorites: removing
            ? state.favorites.filter((id) => id !== routeId)
            : [...state.favorites, routeId],
        }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() =>
            removing
              ? deleteFavorite(supabase, userId, routeId)
              : insertFavorite(supabase, userId, routeId)
          );
        }
      },
      isFavorited: (routeId) => get().favorites.includes(routeId),

      // Reviews
      reviews: [],
      addReview: (review) => {
        set((state) => ({ reviews: [...state.reviews, review] }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() => insertReview(supabase, userId, review));
        }
      },
      removeReview: (id) => {
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() => apiDeleteReview(supabase, id));
        }
      },

      // Likes
      likedReviews: [],
      toggleLike: (reviewId) => {
        if (!get().requireAuth("Create an account to like reviews.")) return;
        const removing = get().likedReviews.includes(reviewId);
        set((state) => ({
          likedReviews: removing
            ? state.likedReviews.filter((id) => id !== reviewId)
            : [...state.likedReviews, reviewId],
        }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() =>
            removing
              ? deleteLike(supabase, userId, reviewId)
              : insertLike(supabase, userId, reviewId)
          );
        }
      },
      isLiked: (reviewId) => get().likedReviews.includes(reviewId),

      // Landmark visits (localStorage only for V1)
      landmarkVisits: [],
      visitedLandmarkIds: new Set<string>(),
      addLandmarkVisit: (visit) =>
        set((state) => {
          const landmarkVisits = [...state.landmarkVisits, visit];
          return {
            landmarkVisits,
            visitedLandmarkIds: new Set(landmarkVisits.map((v) => v.landmarkId)),
          };
        }),
      removeLandmarkVisit: (id) =>
        set((state) => {
          const landmarkVisits = state.landmarkVisits.filter((v) => v.id !== id);
          return {
            landmarkVisits,
            visitedLandmarkIds: new Set(landmarkVisits.map((v) => v.landmarkId)),
          };
        }),

      // Landmark reviews (localStorage only for V1)
      landmarkReviews: [],
      addLandmarkReview: (review) =>
        set((state) => ({ landmarkReviews: [...state.landmarkReviews, review] })),
      removeLandmarkReview: (id) =>
        set((state) => ({ landmarkReviews: state.landmarkReviews.filter((r) => r.id !== id) })),

      // Landmark favorites (localStorage only for V1)
      landmarkFavorites: [],
      toggleLandmarkFavorite: (landmarkId) => {
        if (!get().requireAuth("Create an account to bookmark landmarks.")) return;
        set((state) => ({
          landmarkFavorites: state.landmarkFavorites.includes(landmarkId)
            ? state.landmarkFavorites.filter((id) => id !== landmarkId)
            : [...state.landmarkFavorites, landmarkId],
        }));
      },
      isLandmarkFavorited: (landmarkId) => get().landmarkFavorites.includes(landmarkId),

      // Quick-mark ridden
      riddenRouteIds: [],
      toggleRidden: (routeId) => {
        if (!get().requireAuth("Create an account to mark rides.")) return;
        const removing = get().riddenRouteIds.includes(routeId);
        set((state) => ({
          riddenRouteIds: removing
            ? state.riddenRouteIds.filter((id) => id !== routeId)
            : [...state.riddenRouteIds, routeId],
        }));
        const { userId } = get();
        if (userId) {
          const supabase = createClient();
          syncToSupabase(() =>
            removing
              ? deleteRiddenRoute(supabase, userId, routeId)
              : insertRiddenRoute(supabase, userId, routeId)
          );
        }
      },
      isRidden: (routeId) =>
        get().riddenRouteIds.includes(routeId) || get().loggedRouteIds.has(routeId),

      logModalOpen: false,
      logModalRouteId: null,
      openLogModal: (routeId) => {
        if (!get().requireAuth("Create an account to log your rides.")) return;
        set({ logModalOpen: true, logModalRouteId: routeId });
      },
      closeLogModal: () => set({ logModalOpen: false, logModalRouteId: null }),

      // Landmark modal
      landmarkModalOpen: false,
      landmarkModalId: null,
      openLandmarkModal: (landmarkId) => {
        if (!get().requireAuth("Create an account to log landmark visits.")) return;
        set({ landmarkModalOpen: true, landmarkModalId: landmarkId });
      },
      closeLandmarkModal: () => set({ landmarkModalOpen: false, landmarkModalId: null }),

      activeTab: "dashboard",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "railboxd-store",
      // Persist all user data + userId
      partialize: (state) => ({
        userId: state.userId,
        routeLogs: state.routeLogs,
        riddenRouteIds: state.riddenRouteIds,
        profile: state.profile,
        bucketList: state.bucketList,
        favorites: state.favorites,
        reviews: state.reviews,
        likedReviews: state.likedReviews,
        landmarkVisits: state.landmarkVisits,
        landmarkReviews: state.landmarkReviews,
        landmarkFavorites: state.landmarkFavorites,
      }),
      // Rehydrate: rebuild derived sets from persisted logs
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loggedRouteIds = deriveLoggedRouteIds(state.routeLogs);
          state.loggedStationIds = deriveLoggedStationIds(state.routeLogs);
          state.visitedLandmarkIds = new Set((state.landmarkVisits ?? []).map((v) => v.landmarkId));
        }
      },
    }
  )
);
