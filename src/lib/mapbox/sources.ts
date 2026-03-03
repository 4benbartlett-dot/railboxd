import {
  demoStations,
  demoRoutes,
  stationsToGeoJSON,
  routesToGeoJSON,
} from "@/lib/demo-data";

export function getAllRoutesGeoJSON() {
  return routesToGeoJSON(demoRoutes);
}

export function getAllStationsGeoJSON() {
  return stationsToGeoJSON(demoStations);
}

export function getLoggedRoutesGeoJSON(loggedIds: Set<string>) {
  return routesToGeoJSON(demoRoutes.filter((r) => loggedIds.has(r.id)));
}

export function getLoggedStationsGeoJSON(loggedStationIds: Set<string>) {
  return stationsToGeoJSON(demoStations.filter((s) => loggedStationIds.has(s.id)));
}

export function getSelectedRouteGeoJSON(routeId: string | null) {
  if (!routeId) return routesToGeoJSON([]);
  return routesToGeoJSON(demoRoutes.filter((r) => r.id === routeId));
}
