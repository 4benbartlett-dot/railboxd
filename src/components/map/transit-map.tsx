"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, type MapRef } from "react-map-gl/mapbox";
import { useAppStore } from "@/stores/app-store";
import {
  getAllRoutesGeoJSON,
  getAllStationsGeoJSON,
  getLoggedRoutesGeoJSON,
  getLoggedStationsGeoJSON,
  getSelectedRouteGeoJSON,
} from "@/lib/mapbox/sources";
import {
  allRoutesLayer,
  loggedRoutesGlowLayer,
  loggedRoutesLayer,
  selectedRouteGlowLayer,
  selectedRouteLayer,
  allStationsLayer,
  loggedStationsLayer,
  stationLabelsLayer,
} from "@/lib/mapbox/layers";
import { MapControls } from "./map-controls";
import { CompletionPanel } from "./completion-panel";
import { RoutePanel } from "./route-panel";
import { RouteLogModal } from "./route-log-modal";
import { StationPopup } from "./station-popup";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface SelectedStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routeIds: string[];
}

export function TransitMap() {
  const mapRef = useRef<MapRef>(null);
  const {
    loggedRouteIds,
    loggedStationIds,
    mapViewport,
    setMapViewport,
    selectedRouteId,
    setSelectedRouteId,
  } = useAppStore();

  const [selectedStation, setSelectedStation] = useState<SelectedStation | null>(null);

  const allRoutes      = useMemo(() => getAllRoutesGeoJSON(), []);
  const allStations    = useMemo(() => getAllStationsGeoJSON(), []);
  const loggedRoutes   = useMemo(() => getLoggedRoutesGeoJSON(loggedRouteIds),   [loggedRouteIds]);
  const loggedStations = useMemo(() => getLoggedStationsGeoJSON(loggedStationIds), [loggedStationIds]);
  const selectedRoute  = useMemo(() => getSelectedRouteGeoJSON(selectedRouteId),  [selectedRouteId]);

  const handleClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const features = event.features as any[] | undefined;
      if (!features || features.length === 0) {
        setSelectedRouteId(null);
        setSelectedStation(null);
        return;
      }

      // Check for station click first (stations are on top)
      const stationFeature = features.find(
        (f) => f.layer.id === "stations-all" || f.layer.id === "stations-logged"
      );
      if (stationFeature) {
        const props = stationFeature.properties;
        const routeIds = props?.route_ids ? JSON.parse(props.route_ids) : [];
        setSelectedStation({
          id: props?.id,
          name: props?.name,
          lat: stationFeature.geometry.coordinates[1],
          lng: stationFeature.geometry.coordinates[0],
          routeIds,
        });
        return;
      }

      // Then check for route click
      const routeFeature = features.find(
        (f) => f.layer.id === "routes-all" || f.layer.id === "routes-logged"
      );
      if (routeFeature) {
        const id = routeFeature.properties?.id as string;
        setSelectedStation(null);
        setSelectedRouteId(selectedRouteId === id ? null : id);
      }
    },
    [selectedRouteId, setSelectedRouteId]
  );

  const handleMove = useCallback(
    (evt: { viewState: { latitude: number; longitude: number; zoom: number } }) => {
      setMapViewport({
        latitude: evt.viewState.latitude,
        longitude: evt.viewState.longitude,
        zoom: evt.viewState.zoom,
      });
    },
    [setMapViewport]
  );

  const interactiveLayerIds = useMemo(
    () => ["routes-all", "routes-logged", "stations-all", "stations-logged"],
    []
  );

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your-mapbox-token") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--rb-map-bg)] text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-[var(--rb-accent)]/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[var(--rb-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[var(--rb-text-bright)] mb-2">
          Map needs a Mapbox token
        </h2>
        <p className="text-sm text-[var(--rb-text-muted)] max-w-sm mb-4">
          Add your token to{" "}
          <code className="text-[var(--rb-accent)] bg-[var(--rb-bg-card)] px-1.5 py-0.5 rounded">.env.local</code>{" "}
          as{" "}
          <code className="text-[var(--rb-accent)] bg-[var(--rb-bg-card)] px-1.5 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code>
        </p>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--rb-accent)] hover:underline"
        >
          Get a free token from Mapbox →
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <Map
        ref={mapRef}
        {...mapViewport}
        onMove={handleMove}
        onClick={handleClick}
        interactiveLayerIds={interactiveLayerIds}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
        cursor="pointer"
        attributionControl={false}
      >
        {/* All routes — always visible, real color at reduced opacity */}
        <Source id="all-routes" type="geojson" data={allRoutes}>
          <Layer {...allRoutesLayer} />
        </Source>

        {/* Logged routes — bright + glow, rendered above */}
        <Source id="logged-routes" type="geojson" data={loggedRoutes}>
          <Layer {...loggedRoutesGlowLayer} />
          <Layer {...loggedRoutesLayer} />
        </Source>

        {/* Selected route — white halo highlight on top */}
        <Source id="selected-route" type="geojson" data={selectedRoute}>
          <Layer {...selectedRouteGlowLayer} />
          <Layer {...selectedRouteLayer} />
        </Source>

        {/* All stations — small neutral dots + labels at zoom 12+ */}
        <Source id="all-stations" type="geojson" data={allStations}>
          <Layer {...allStationsLayer} />
          <Layer {...stationLabelsLayer} />
        </Source>

        {/* Logged stations — ride endpoints, green */}
        <Source id="logged-stations" type="geojson" data={loggedStations}>
          <Layer {...loggedStationsLayer} />
        </Source>
      </Map>

      <MapControls mapRef={mapRef} />
      <CompletionPanel />

      {/* Station popup */}
      {selectedStation && (
        <StationPopup
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}

      {/* Route panel */}
      {selectedRouteId && !selectedStation && (
        <RoutePanel
          routeId={selectedRouteId}
          onClose={() => setSelectedRouteId(null)}
        />
      )}

      <RouteLogModal />
    </div>
  );
}
