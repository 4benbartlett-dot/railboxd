"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Train, MapPin, X } from "lucide-react";
import { demoRoutes, demoStations, demoAgencies, getAgencyById, getStationsForRoute } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";

type CategoryTab = "all" | "routes" | "stations";

const ROUTE_TYPE_LABELS: Record<number, string> = {
  0: "Light Rail",
  1: "Subway / Heavy Rail",
  2: "Commuter Rail",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");

  const loggedRouteIds = useAppStore((s) => s.loggedRouteIds);
  const loggedStationIds = useAppStore((s) => s.loggedStationIds);

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

  const hasSearch = q.length > 0;
  const showRoutes = activeTab === "all" || activeTab === "routes";
  const showStations = activeTab === "all" || activeTab === "stations";
  const noResults =
    hasSearch &&
    (showRoutes ? filteredRoutes.length === 0 : true) &&
    (showStations ? filteredStations.length === 0 : true);

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
          {(["all", "routes", "stations"] as CategoryTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors"
              style={{
                background: activeTab === tab ? "var(--rb-accent)" : "var(--rb-bg-card)",
                color: activeTab === tab ? "var(--rb-text-bright)" : "var(--rb-text-muted)",
              }}
            >
              {tab === "all" ? "All" : tab === "routes" ? "Routes" : "Stations"}
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

            {noResults && (
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
