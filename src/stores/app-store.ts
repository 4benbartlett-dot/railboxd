import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface AppState {
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

      // Landmark visits
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

      // Landmark reviews
      landmarkReviews: [],
      addLandmarkReview: (review) =>
        set((state) => ({ landmarkReviews: [...state.landmarkReviews, review] })),
      removeLandmarkReview: (id) =>
        set((state) => ({ landmarkReviews: state.landmarkReviews.filter((r) => r.id !== id) })),

      // Landmark favorites
      landmarkFavorites: [],
      toggleLandmarkFavorite: (landmarkId) =>
        set((state) => ({
          landmarkFavorites: state.landmarkFavorites.includes(landmarkId)
            ? state.landmarkFavorites.filter((id) => id !== landmarkId)
            : [...state.landmarkFavorites, landmarkId],
        })),
      isLandmarkFavorited: (landmarkId) => get().landmarkFavorites.includes(landmarkId),

      logModalOpen: false,
      logModalRouteId: null,
      openLogModal: (routeId) => set({ logModalOpen: true, logModalRouteId: routeId }),
      closeLogModal: () => set({ logModalOpen: false, logModalRouteId: null }),

      // Landmark modal
      landmarkModalOpen: false,
      landmarkModalId: null,
      openLandmarkModal: (landmarkId) => set({ landmarkModalOpen: true, landmarkModalId: landmarkId }),
      closeLandmarkModal: () => set({ landmarkModalOpen: false, landmarkModalId: null }),

      activeTab: "dashboard",
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
