import type { LayerProps } from "react-map-gl/mapbox";

// ===================== ROUTE LAYERS =====================
// All routes always visible with their real line color.
// Logged routes get full brightness + glow effect.

// All routes — real color, reduced opacity (always visible, always clickable)
export const allRoutesLayer: LayerProps = {
  id: "routes-all",
  type: "line",
  paint: {
    "line-color": ["get", "route_color"],
    "line-opacity": 0.35,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 12, 2.5, 16, 4],
  },
  layout: { "line-cap": "round", "line-join": "round" },
};

// Logged routes — glow underlayer
export const loggedRoutesGlowLayer: LayerProps = {
  id: "routes-logged-glow",
  type: "line",
  paint: {
    "line-color": ["get", "route_color"],
    "line-opacity": 0.22,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 10, 12, 16, 16, 22],
    "line-blur": 8,
  },
  layout: { "line-cap": "round", "line-join": "round" },
};

// Logged routes — bright solid line
export const loggedRoutesLayer: LayerProps = {
  id: "routes-logged",
  type: "line",
  paint: {
    "line-color": ["get", "route_color"],
    "line-opacity": 1,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3, 12, 4.5, 16, 7],
  },
  layout: { "line-cap": "round", "line-join": "round" },
};

// Selected route — white halo + full color
export const selectedRouteGlowLayer: LayerProps = {
  id: "routes-selected-glow",
  type: "line",
  paint: {
    "line-color": "#ffffff",
    "line-opacity": 0.35,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 14, 12, 20, 16, 28],
    "line-blur": 10,
  },
  layout: { "line-cap": "round", "line-join": "round" },
};

export const selectedRouteLayer: LayerProps = {
  id: "routes-selected",
  type: "line",
  paint: {
    "line-color": ["get", "route_color"],
    "line-opacity": 1,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 4, 12, 6, 16, 9],
  },
  layout: { "line-cap": "round", "line-join": "round" },
};

// ===================== STATION LAYERS =====================

// All stations — small neutral dots (always visible)
export const allStationsLayer: LayerProps = {
  id: "stations-all",
  type: "circle",
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 2, 12, 3.5, 16, 6],
    "circle-color": "#8aaa98",
    "circle-opacity": 0.5,
    "circle-stroke-width": 0,
  },
};

// Logged stations (ride endpoints) — green dots with white stroke
export const loggedStationsLayer: LayerProps = {
  id: "stations-logged",
  type: "circle",
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 4, 12, 6, 16, 10],
    "circle-color": "#00e054",
    "circle-opacity": 1,
    "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 12, 2, 16, 3],
    "circle-stroke-color": "#ffffff",
    "circle-stroke-opacity": 0.9,
  },
};

// Station labels — all stations at zoom 12+
export const stationLabelsLayer: LayerProps = {
  id: "stations-labels",
  type: "symbol",
  minzoom: 12,
  layout: {
    "text-field": ["get", "name"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 12, 10, 16, 13],
    "text-offset": [0, 1.5],
    "text-anchor": "top",
    "text-max-width": 8,
    "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
  },
  paint: {
    "text-color": "#c0d5c8",
    "text-halo-color": "#060d08",
    "text-halo-width": 1.5,
    "text-opacity": 0.85,
  },
};
