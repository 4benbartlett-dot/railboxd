import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MapViewport } from "@/types";

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

interface AppState {
  // Route logs — the core data model
  routeLogs: RouteLog[];
  addRouteLog: (log: RouteLog) => void;
  removeRouteLog: (id: string) => void;

  // Derived sets for map styling
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

  // Map — centered on California
  mapViewport: MapViewport;
  setMapViewport: (viewport: MapViewport) => void;

  // Map selection
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;

  // Log modal (triggered when user taps "Log this route")
  logModalOpen: boolean;
  logModalRouteId: string | null;
  openLogModal: (routeId: string) => void;
  closeLogModal: () => void;

  // UI
  activeTab: "map" | "dashboard" | "search" | "profile";
  setActiveTab: (tab: "map" | "dashboard" | "search" | "profile") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      routeLogs: [],
      loggedRouteIds: new Set<string>(),
      loggedStationIds: new Set<string>(),

      addRouteLog: (log) =>
        set((state) => {
          const routeLogs = [...state.routeLogs, log];
          return {
            routeLogs,
            loggedRouteIds: deriveLoggedRouteIds(routeLogs),
            loggedStationIds: deriveLoggedStationIds(routeLogs),
          };
        }),

      removeRouteLog: (id) =>
        set((state) => {
          const routeLogs = state.routeLogs.filter((l) => l.id !== id);
          return {
            routeLogs,
            loggedRouteIds: deriveLoggedRouteIds(routeLogs),
            loggedStationIds: deriveLoggedStationIds(routeLogs),
          };
        }),

      // Profile
      profile: { ...defaultProfile },
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      // Bucket list
      bucketList: [],
      toggleBucketList: (routeId) =>
        set((state) => ({
          bucketList: state.bucketList.includes(routeId)
            ? state.bucketList.filter((id) => id !== routeId)
            : [...state.bucketList, routeId],
        })),
      isBucketListed: (routeId) => get().bucketList.includes(routeId),

      // Favorites
      favorites: [],
      toggleFavorite: (routeId) =>
        set((state) => ({
          favorites: state.favorites.includes(routeId)
            ? state.favorites.filter((id) => id !== routeId)
            : [...state.favorites, routeId],
        })),
      isFavorited: (routeId) => get().favorites.includes(routeId),

      // Reviews
      reviews: [],
      addReview: (review) =>
        set((state) => ({ reviews: [...state.reviews, review] })),
      removeReview: (id) =>
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      // Likes
      likedReviews: [],
      toggleLike: (reviewId) =>
        set((state) => ({
          likedReviews: state.likedReviews.includes(reviewId)
            ? state.likedReviews.filter((id) => id !== reviewId)
            : [...state.likedReviews, reviewId],
        })),
      isLiked: (reviewId) => get().likedReviews.includes(reviewId),

      mapViewport: { latitude: 36.7, longitude: -119.8, zoom: 6 },
      setMapViewport: (viewport) => set({ mapViewport: viewport }),

      selectedRouteId: null,
      setSelectedRouteId: (id) => set({ selectedRouteId: id, selectedStationId: null }),
      selectedStationId: null,
      setSelectedStationId: (id) => set({ selectedStationId: id, selectedRouteId: null }),

      logModalOpen: false,
      logModalRouteId: null,
      openLogModal: (routeId) => set({ logModalOpen: true, logModalRouteId: routeId }),
      closeLogModal: () => set({ logModalOpen: false, logModalRouteId: null }),

      activeTab: "map",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "railboxd-store",
      // Persist all user data
      partialize: (state) => ({
        routeLogs: state.routeLogs,
        profile: state.profile,
        bucketList: state.bucketList,
        favorites: state.favorites,
        reviews: state.reviews,
        likedReviews: state.likedReviews,
      }),
      // Rehydrate: rebuild derived sets from persisted logs
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loggedRouteIds = deriveLoggedRouteIds(state.routeLogs);
          state.loggedStationIds = deriveLoggedStationIds(state.routeLogs);
        }
      },
    }
  )
);
