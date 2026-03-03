"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Train, MapPin, X, Users, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { demoRoutes, demoStations, demoAgencies, getAgencyById, getStationsForRoute } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";
import { createClient } from "@/lib/supabase/client";
import { searchUsers, followUser, unfollowUser, isFollowing as checkIsFollowing } from "@/lib/supabase/api";

type CategoryTab = "all" | "routes" | "stations" | "people";

const ROUTE_TYPE_LABELS: Record<number, string> = {
  0: "Light Rail",
  1: "Subway / Heavy Rail",
  2: "Commuter Rail",
};

interface UserResult {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");

  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);
  const loggedStationIds = useAppStore((s) => s.loggedStationIds);
  const userId = useAppStore((s) => s.userId);
  const requireAuth = useAppStore((s) => s.requireAuth);

  // People search state
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();

  const filteredRoutes = useMemo(() => {
    if (!q) return [];
    return demoRoutes.filter((route) => {
      const agency = getAgencyById(route.agency_id);
      const haystack = `${route.short_name} ${route.long_name} ${agency?.name ?? ""}`.toLowerCase();
      return haystack.includes(q);
    }).slice(0, 30);
  }, [q]);

  const filteredStations = useMemo(() => {
    if (!q) return [];
    return demoStations.filter((station) =>
      station.name.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [q]);

  // Group routes by agency for browse mode
  const routesByAgency = useMemo(() => {
    const grouped: Record<string, typeof demoRoutes> = {};
    demoRoutes.forEach((r) => {
      if (!grouped[r.agency_id]) grouped[r.agency_id] = [];
      grouped[r.agency_id].push(r);
    });
    return demoAgencies.map((a) => ({
      agency: a,
      routes: grouped[a.id] ?? [],
    })).filter((g) => g.routes.length > 0);
  }, []);

  // Search users via Supabase when query changes
  useEffect(() => {
    if (!q || q.length < 2) {
      setUserResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const supabase = createClient();
        const results = await searchUsers(supabase, q, 20);
        // Filter out the current user
        const filtered = userId ? results.filter((u) => u.id !== userId) : results;
        setUserResults(filtered);
        // Check follow states
        if (userId && filtered.length > 0) {
          const states: Record<string, boolean> = {};
          await Promise.all(
            filtered.map(async (u) => {
              try {
                states[u.id] = await checkIsFollowing(supabase, userId, u.id);
              } catch {
                states[u.id] = false;
              }
            })
          );
          setFollowStates(states);
        }
      } catch {
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [q, userId]);

  const handleFollow = useCallback(async (targetId: string) => {
    if (!requireAuth("Create an account to follow other riders.")) return;
    if (!userId) return;
    setFollowLoading((s) => ({ ...s, [targetId]: true }));
    try {
      const supabase = createClient();
      const currentlyFollowing = followStates[targetId] ?? false;
      if (currentlyFollowing) {
        await unfollowUser(supabase, userId, targetId);
        setFollowStates((s) => ({ ...s, [targetId]: false }));
      } else {
        await followUser(supabase, userId, targetId);
        setFollowStates((s) => ({ ...s, [targetId]: true }));
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading((s) => ({ ...s, [targetId]: false }));
    }
  }, [userId, followStates, requireAuth]);

  const hasSearch = q.length > 0;
  const showRoutes = activeTab === "all" || activeTab === "routes";
  const showStations = activeTab === "all" || activeTab === "stations";
  const showPeople = activeTab === "all" || activeTab === "people";
  const noResults =
    hasSearch &&
    (showRoutes ? filteredRoutes.length === 0 : true) &&
    (showStations ? filteredStations.length === 0 : true) &&
    (showPeople ? userResults.length === 0 : true);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--rb-bg)" }}>
      {/* Search bar */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2" style={{ background: "var(--rb-bg)" }}>
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--rb-bg-card)" }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: "var(--rb-text-muted)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search routes, stations, agencies..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--rb-text-bright)" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0">
              <X className="w-4 h-4" style={{ color: "var(--rb-text-muted)" }} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "routes", "stations", "people"] as CategoryTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors"
              style={{
                background: activeTab === tab ? "var(--rb-accent)" : "var(--rb-bg-card)",
                color: activeTab === tab ? "var(--rb-text-bright)" : "var(--rb-text-muted)",
              }}
            >
              {tab === "all" ? "All" : tab === "routes" ? "Routes" : tab === "stations" ? "Stations" : "People"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-2">
        {/* Search results */}
        {hasSearch && (
          <>
            {showRoutes && filteredRoutes.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--rb-text-muted)" }}>
                  Routes ({filteredRoutes.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {filteredRoutes.map((route) => (
                    <RouteCard key={route.id} route={route} isLogged={loggedRouteIds.has(route.id)} />
                  ))}
                </div>
              </section>
            )}

            {showStations && filteredStations.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--rb-text-muted)" }}>
                  Stations ({filteredStations.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {filteredStations.map((station) => (
                    <StationCard key={station.id} station={station} isLogged={loggedStationIds.has(station.id)} />
                  ))}
                </div>
              </section>
            )}

            {showPeople && (searchingUsers || userResults.length > 0) && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--rb-text-muted)" }}>
                  People {!searchingUsers && `(${userResults.length})`}
                </h2>
                {searchingUsers ? (
                  <div className="flex items-center gap-2 py-4 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--rb-text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--rb-text-muted)" }}>Searching...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {userResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{ background: "var(--rb-bg-card)" }}
                      >
                        <div
                          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                          style={{
                            background: user.avatar_url ? undefined : "var(--rb-accent)",
                            color: user.avatar_url ? undefined : "#000",
                          }}
                        >
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (user.display_name?.[0] ?? user.username[0]).toUpperCase()
                          )}
                        </div>
                        <Link href={`/profile/${user.username}`} className="flex-1 min-w-0 group">
                          <p className="text-sm font-medium truncate group-hover:text-[var(--rb-accent)] transition-colors" style={{ color: "var(--rb-text-bright)" }}>
                            {user.display_name || user.username}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--rb-text-muted)" }}>
                            @{user.username}
                            {user.bio && <span> &middot; {user.bio}</span>}
                          </p>
                        </Link>
                        <button
                          onClick={() => handleFollow(user.id)}
                          disabled={followLoading[user.id]}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: followStates[user.id]
                              ? "var(--rb-bg)"
                              : "var(--rb-accent)",
                            color: followStates[user.id]
                              ? "var(--rb-text)"
                              : "#000",
                            border: followStates[user.id]
                              ? "1px solid var(--rb-border)"
                              : "1px solid transparent",
                          }}
                        >
                          {followLoading[user.id] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : followStates[user.id] ? (
                            <><UserCheck className="w-3 h-3" /> Following</>
                          ) : (
                            <><UserPlus className="w-3 h-3" /> Follow</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {noResults && !searchingUsers && (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <Search className="w-10 h-10 mb-3" style={{ color: "var(--rb-text-muted)" }} />
                <p className="text-sm font-medium mb-1" style={{ color: "var(--rb-text-bright)" }}>No results found</p>
                <p className="text-xs max-w-xs" style={{ color: "var(--rb-text-muted)" }}>
                  Try different search terms or browse the categories below.
                </p>
              </div>
            )}
          </>
        )}

        {/* Browse by agency (default state) */}
        {!hasSearch && showRoutes && (
          <>
            {routesByAgency.map(({ agency, routes }) => (
              <section key={agency.id} className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--rb-text-muted)" }}>
                  {agency.name}
                  <span className="ml-2 normal-case font-normal">
                    {ROUTE_TYPE_LABELS[routes[0]?.route_type] ?? "Rail"} &middot; {agency.city}
                  </span>
                </h2>
                <div className="flex flex-col gap-2">
                  {routes.map((route) => (
                    <RouteCard key={route.id} route={route} isLogged={loggedRouteIds.has(route.id)} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {!hasSearch && showStations && activeTab === "stations" && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--rb-text-muted)" }}>
              All Stations ({demoStations.length})
            </h2>
            <div className="flex flex-col gap-2">
              {demoStations.slice(0, 50).map((station) => (
                <StationCard key={station.id} station={station} isLogged={loggedStationIds.has(station.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function RouteCard({ route, isLogged }: { route: typeof demoRoutes[number]; isLogged: boolean }) {
  const agency = getAgencyById(route.agency_id);
  const stations = getStationsForRoute(route.id);
  const firstStation = stations[0];
  const { ref, heroUrl } = useLazyPlacePhoto(
    firstStation?.name,
    firstStation?.lat,
    firstStation?.lng
  );
  return (
    <Link
      href={`/route/${route.id}`}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:brightness-110"
      style={{ background: "var(--rb-bg-card)" }}
    >
      <div
        ref={ref}
        className="w-10 h-10 rounded-lg shrink-0 relative overflow-hidden"
        style={{ background: route.route_color + "22" }}
      >
        {heroUrl ? (
          <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Train className="w-5 h-5" style={{ color: route.route_color }} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: route.route_color, color: "var(--rb-text-bright)" }}
          >
            {route.short_name}
          </span>
          <span className="text-sm font-medium truncate" style={{ color: "var(--rb-text-bright)" }}>
            {route.long_name}
          </span>
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--rb-text-muted)" }}>
          {agency?.name} &middot; {route.station_ids.length} stations
        </p>
      </div>
      {isLogged && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: "var(--rb-accent)", color: "var(--rb-text-bright)" }}
        >
          logged
        </span>
      )}
    </Link>
  );
}

function StationCard({ station, isLogged }: { station: typeof demoStations[number]; isLogged: boolean }) {
  const agency = getAgencyById(station.agency_id);
  const { ref, heroUrl } = useLazyPlacePhoto(
    station.name,
    station.lat,
    station.lng
  );
  return (
    <Link
      href={`/station/${station.id}`}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:brightness-110"
      style={{ background: "var(--rb-bg-card)" }}
    >
      <div
        ref={ref}
        className="w-10 h-10 rounded-lg shrink-0 relative overflow-hidden"
        style={{ background: "var(--rb-accent)" + "22" }}
      >
        {heroUrl ? (
          <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-5 h-5" style={{ color: "var(--rb-accent)" }} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--rb-text-bright)" }}>
          {station.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--rb-text-muted)" }}>
          {agency?.name} &middot; {station.route_ids.length}{" "}
          {station.route_ids.length === 1 ? "route" : "routes"}
        </p>
      </div>
      {isLogged && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: "var(--rb-accent)", color: "var(--rb-text-bright)" }}
        >
          logged
        </span>
      )}
    </Link>
  );
}
