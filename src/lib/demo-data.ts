// Demo transit data — All major California rail systems
// Allows map and UI to work without Supabase/Transitland

import { norcalRoutes, norcalStations } from "./_norcal-data";
import { socalRoutes, socalStations } from "./_socal-data";

export interface DemoStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route_ids: string[];
  agency_id: string;
}

export interface DemoRoute {
  id: string;
  short_name: string;
  long_name: string;
  route_type: number; // 0=light rail/tram, 1=heavy rail/subway, 2=commuter rail
  route_color: string;
  agency_id: string;
  station_ids: string[];
  coordinates: [number, number][]; // [lng, lat][]
}

export interface DemoAgency {
  id: string;
  name: string;
  city: string;
  state: string;
}

export const demoAgencies: DemoAgency[] = [
  { id: "bart",      name: "Bay Area Rapid Transit",          city: "Oakland",       state: "CA" },
  { id: "lametro",   name: "LA Metro Rail",                   city: "Los Angeles",   state: "CA" },
  { id: "caltrain",  name: "Caltrain",                        city: "San Francisco", state: "CA" },
  { id: "muni",      name: "Muni Metro",                      city: "San Francisco", state: "CA" },
  { id: "vta",       name: "VTA Light Rail",                   city: "San Jose",      state: "CA" },
  { id: "smart",     name: "SMART",                            city: "San Rafael",    state: "CA" },
  { id: "ace",       name: "ACE (Altamont Corridor Express)",  city: "Stockton",      state: "CA" },
  { id: "sacrt",     name: "Sacramento RT",                    city: "Sacramento",    state: "CA" },
  { id: "sdmts",     name: "San Diego MTS Trolley",            city: "San Diego",     state: "CA" },
  { id: "metrolink", name: "Metrolink",                        city: "Los Angeles",   state: "CA" },
  { id: "nctd",      name: "North County Transit District",    city: "Oceanside",     state: "CA" },
];

// ===================== ROUTES =====================

const baseRoutes: DemoRoute[] = [
  // ── BART Yellow Line (Antioch → SFO/Millbrae) ──
  {
    id: "bart-yellow",
    short_name: "Yellow",
    long_name: "Antioch – SFO/Millbrae",
    route_type: 1,
    route_color: "#FFD800",
    agency_id: "bart",
    station_ids: [
      "bart-antioch","bart-pittsburg","bart-concord","bart-pleasant-hill",
      "bart-walnut-creek","bart-lafayette","bart-orinda","bart-rockridge",
      "bart-macarthur","bart-19th-oak","bart-12th-oak","bart-west-oak",
      "bart-embarcadero","bart-montgomery","bart-powell","bart-civic-center",
      "bart-16th-mission","bart-24th-mission","bart-glen-park","bart-balboa",
      "bart-daly-city","bart-colma","bart-south-sf","bart-san-bruno",
      "bart-sfo","bart-millbrae",
    ],
    coordinates: [
      [-121.7797,37.9953],[-121.9449,37.9974],[-122.0292,37.9738],
      [-122.0568,37.9285],[-122.0676,37.9057],[-122.1235,37.8932],
      [-122.1834,37.8784],[-122.2514,37.8440],[-122.2672,37.8287],
      [-122.2681,37.8082],[-122.2716,37.8036],[-122.2947,37.8046],
      [-122.3966,37.7928],[-122.4012,37.7886],[-122.4079,37.7844],
      [-122.4140,37.7796],[-122.4193,37.7651],[-122.4183,37.7522],
      [-122.4337,37.7329],[-122.4477,37.7218],[-122.4688,37.7062],
      [-122.4660,37.6847],[-122.4442,37.6647],[-122.4116,37.6309],
      [-122.3928,37.6161],[-122.3866,37.5996],
    ],
  },

  // ── BART Red Line (Richmond → Daly City) ──
  {
    id: "bart-red",
    short_name: "Red",
    long_name: "Richmond – Daly City/Millbrae",
    route_type: 1,
    route_color: "#ED1C24",
    agency_id: "bart",
    station_ids: [
      "bart-richmond","bart-el-cerrito-norte","bart-el-cerrito-plaza",
      "bart-north-berkeley","bart-downtown-berkeley","bart-ashby",
      "bart-macarthur","bart-19th-oak","bart-12th-oak","bart-west-oak",
      "bart-embarcadero","bart-montgomery","bart-powell","bart-civic-center",
      "bart-16th-mission","bart-24th-mission","bart-glen-park","bart-balboa",
      "bart-daly-city",
    ],
    coordinates: [
      [-122.3532,37.9372],[-122.3173,37.9254],[-122.2990,37.9017],
      [-122.2832,37.8744],[-122.2679,37.8697],[-122.2699,37.8529],
      [-122.2672,37.8287],[-122.2681,37.8082],[-122.2716,37.8036],
      [-122.2947,37.8046],[-122.3966,37.7928],[-122.4012,37.7886],
      [-122.4079,37.7844],[-122.4140,37.7796],[-122.4193,37.7651],
      [-122.4183,37.7522],[-122.4337,37.7329],[-122.4477,37.7218],
      [-122.4688,37.7062],
    ],
  },

  // ── BART Blue Line (Dublin/Pleasanton → Daly City) ──
  {
    id: "bart-blue",
    short_name: "Blue",
    long_name: "Dublin/Pleasanton – Daly City",
    route_type: 1,
    route_color: "#0099CC",
    agency_id: "bart",
    station_ids: [
      "bart-dublin","bart-west-dublin","bart-castro-valley","bart-bay-fair",
      "bart-san-leandro","bart-fruitvale","bart-coliseum","bart-lake-merritt",
      "bart-12th-oak","bart-19th-oak","bart-macarthur","bart-embarcadero",
      "bart-montgomery","bart-powell","bart-civic-center","bart-16th-mission",
      "bart-24th-mission","bart-glen-park","bart-balboa","bart-daly-city",
    ],
    coordinates: [
      [-121.8990,37.7016],[-121.9282,37.6994],[-122.0768,37.6939],
      [-122.1270,37.6993],[-122.1604,37.7027],[-122.2242,37.7748],
      [-122.1982,37.7540],[-122.2651,37.7978],[-122.2716,37.8036],
      [-122.2681,37.8082],[-122.2672,37.8287],[-122.3966,37.7928],
      [-122.4012,37.7886],[-122.4079,37.7844],[-122.4140,37.7796],
      [-122.4193,37.7651],[-122.4183,37.7522],[-122.4337,37.7329],
      [-122.4477,37.7218],[-122.4688,37.7062],
    ],
  },

  // ── LA Metro B Line / Red (North Hollywood → Union Station) ──
  {
    id: "lametro-b",
    short_name: "B",
    long_name: "B Line (Red) – North Hollywood to Union Station",
    route_type: 1,
    route_color: "#EE1C23",
    agency_id: "lametro",
    station_ids: [
      "la-north-hollywood","la-universal","la-highland","la-vine",
      "la-western","la-vermont-sunset","la-vermont-beverly","la-wilshire-vermont",
      "la-macarthur-park","la-7th-metro","la-pershing","la-civic-center-la",
      "la-union-station",
    ],
    coordinates: [
      [-118.3768,34.1688],[-118.3510,34.1413],[-118.3386,34.1019],
      [-118.3255,34.1011],[-118.3147,34.1008],[-118.2920,34.0999],
      [-118.2920,34.0750],[-118.2921,34.0632],[-118.2764,34.0585],
      [-118.2588,34.0487],[-118.2517,34.0488],[-118.2433,34.0557],
      [-118.2342,34.0560],
    ],
  },

  // ── LA Metro A Line / Blue (Long Beach → 7th St) ──
  {
    id: "lametro-a",
    short_name: "A",
    long_name: "A Line (Blue) – Long Beach to 7th St/Metro Center",
    route_type: 1,
    route_color: "#009BDE",
    agency_id: "lametro",
    station_ids: [
      "la-downtown-lb","la-transit-mall","la-5th-st","la-1st-st",
      "la-anaheim","la-pacific","la-del-amo","la-compton","la-artesia",
      "la-redondo","la-slauson","la-florence","la-grand-ave",
      "la-san-pedro","la-7th-metro",
    ],
    coordinates: [
      [-118.1896,33.7701],[-118.1894,33.7759],[-118.1894,33.7806],
      [-118.1894,33.7873],[-118.1894,33.7960],[-118.1895,33.8050],
      [-118.2029,33.8440],[-118.2175,33.8966],[-118.2221,33.9148],
      [-118.2454,33.9360],[-118.2528,34.0028],[-118.2583,33.9729],
      [-118.2582,34.0362],[-118.2410,34.0406],[-118.2588,34.0487],
    ],
  },
];

export const demoRoutes: DemoRoute[] = [
  ...baseRoutes,
  ...(norcalRoutes as DemoRoute[]),
  ...(socalRoutes as DemoRoute[]),
];

// ===================== STATIONS =====================

// Map of existing station IDs → additional route IDs from new lines
const routeIdAugments: Record<string, string[]> = {
  // BART core (Yellow+Red+Blue) → add Green and/or Orange
  "bart-macarthur":          ["bart-orange"],
  "bart-19th-oak":           ["bart-orange"],
  "bart-12th-oak":           ["bart-green", "bart-orange"],
  "bart-west-oak":           ["bart-green"],
  "bart-embarcadero":        ["bart-green"],
  "bart-montgomery":         ["bart-green"],
  "bart-powell":             ["bart-green"],
  "bart-civic-center":       ["bart-green"],
  "bart-16th-mission":       ["bart-green"],
  "bart-24th-mission":       ["bart-green"],
  "bart-glen-park":          ["bart-green"],
  "bart-balboa":             ["bart-green"],
  "bart-daly-city":          ["bart-green"],
  // BART Red branch → add Orange
  "bart-richmond":           ["bart-orange"],
  "bart-el-cerrito-norte":   ["bart-orange"],
  "bart-el-cerrito-plaza":   ["bart-orange"],
  "bart-north-berkeley":     ["bart-orange"],
  "bart-downtown-berkeley":  ["bart-orange"],
  "bart-ashby":              ["bart-orange"],
  // BART Blue branch → add Green and/or Orange
  "bart-bay-fair":           ["bart-green", "bart-orange"],
  "bart-san-leandro":        ["bart-green", "bart-orange"],
  "bart-fruitvale":          ["bart-orange"],
  "bart-coliseum":           ["bart-green", "bart-orange"],
  "bart-lake-merritt":       ["bart-green", "bart-orange"],
  // LA Metro shared stations → add D, E, Metrolink lines
  "la-wilshire-vermont":     ["lametro-d"],
  "la-macarthur-park":       ["lametro-d"],
  "la-7th-metro":            ["lametro-d", "lametro-e"],
  "la-pershing":             ["lametro-d"],
  "la-civic-center-la":      ["lametro-d"],
  "la-union-station":        ["lametro-d", "metrolink-sbline", "metrolink-avline", "metrolink-ocline", "metrolink-vcline"],
};

const baseStations: DemoStation[] = [
  // ── BART Yellow Line branch stations ──
  { id:"bart-antioch",       name:"Antioch",                     lat:37.9953, lng:-121.7797, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-pittsburg",     name:"Pittsburg/Bay Point",         lat:37.9974, lng:-121.9449, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-concord",       name:"Concord",                     lat:37.9738, lng:-122.0292, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-pleasant-hill", name:"Pleasant Hill",               lat:37.9285, lng:-122.0568, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-walnut-creek",  name:"Walnut Creek",                lat:37.9057, lng:-122.0676, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-lafayette",     name:"Lafayette",                   lat:37.8932, lng:-122.1235, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-orinda",        name:"Orinda",                      lat:37.8784, lng:-122.1834, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-rockridge",     name:"Rockridge",                   lat:37.8440, lng:-122.2514, route_ids:["bart-yellow"],                           agency_id:"bart" },
  // Shared Oakland/SF core (Yellow + Red + Blue)
  { id:"bart-macarthur",     name:"MacArthur",                   lat:37.8287, lng:-122.2672, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-19th-oak",      name:"19th St Oakland",             lat:37.8082, lng:-122.2681, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-12th-oak",      name:"12th St Oakland City Center", lat:37.8036, lng:-122.2716, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-west-oak",      name:"West Oakland",                lat:37.8046, lng:-122.2947, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-embarcadero",   name:"Embarcadero",                 lat:37.7928, lng:-122.3966, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-montgomery",    name:"Montgomery St",               lat:37.7886, lng:-122.4012, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-powell",        name:"Powell St",                   lat:37.7844, lng:-122.4079, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-civic-center",  name:"Civic Center/UN Plaza",       lat:37.7796, lng:-122.4140, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-16th-mission",  name:"16th St Mission",             lat:37.7651, lng:-122.4193, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-24th-mission",  name:"24th St Mission",             lat:37.7522, lng:-122.4183, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-glen-park",     name:"Glen Park",                   lat:37.7329, lng:-122.4337, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-balboa",        name:"Balboa Park",                 lat:37.7218, lng:-122.4477, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  { id:"bart-daly-city",     name:"Daly City",                   lat:37.7062, lng:-122.4688, route_ids:["bart-yellow","bart-red","bart-blue"],     agency_id:"bart" },
  // Yellow Line south peninsula
  { id:"bart-colma",         name:"Colma",                       lat:37.6847, lng:-122.4660, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-south-sf",      name:"South San Francisco",         lat:37.6647, lng:-122.4442, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-san-bruno",     name:"San Bruno",                   lat:37.6309, lng:-122.4116, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-sfo",           name:"San Francisco Int'l Airport", lat:37.6161, lng:-122.3928, route_ids:["bart-yellow"],                           agency_id:"bart" },
  { id:"bart-millbrae",      name:"Millbrae",                    lat:37.5996, lng:-122.3866, route_ids:["bart-yellow"],                           agency_id:"bart" },
  // Red Line branch (Berkeley/Richmond)
  { id:"bart-richmond",           name:"Richmond",               lat:37.9372, lng:-122.3532, route_ids:["bart-red"],  agency_id:"bart" },
  { id:"bart-el-cerrito-norte",   name:"El Cerrito del Norte",   lat:37.9254, lng:-122.3173, route_ids:["bart-red"],  agency_id:"bart" },
  { id:"bart-el-cerrito-plaza",   name:"El Cerrito Plaza",       lat:37.9017, lng:-122.2990, route_ids:["bart-red"],  agency_id:"bart" },
  { id:"bart-north-berkeley",     name:"North Berkeley",         lat:37.8744, lng:-122.2832, route_ids:["bart-red"],  agency_id:"bart" },
  { id:"bart-downtown-berkeley",  name:"Downtown Berkeley",      lat:37.8697, lng:-122.2679, route_ids:["bart-red"],  agency_id:"bart" },
  { id:"bart-ashby",              name:"Ashby",                  lat:37.8529, lng:-122.2699, route_ids:["bart-red"],  agency_id:"bart" },
  // Blue Line branch (East Bay)
  { id:"bart-dublin",        name:"Dublin/Pleasanton",           lat:37.7016, lng:-121.8990, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-west-dublin",   name:"West Dublin/Pleasanton",      lat:37.6994, lng:-121.9282, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-castro-valley", name:"Castro Valley",               lat:37.6939, lng:-122.0768, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-bay-fair",      name:"Bay Fair",                    lat:37.6993, lng:-122.1270, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-san-leandro",   name:"San Leandro",                 lat:37.7027, lng:-122.1604, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-fruitvale",     name:"Fruitvale",                   lat:37.7748, lng:-122.2242, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-coliseum",      name:"Coliseum",                    lat:37.7540, lng:-122.1982, route_ids:["bart-blue"], agency_id:"bart" },
  { id:"bart-lake-merritt",  name:"Lake Merritt",                lat:37.7978, lng:-122.2651, route_ids:["bart-blue"], agency_id:"bart" },

  // ── LA Metro B Line (Red) ──
  { id:"la-north-hollywood",  name:"North Hollywood",          lat:34.1688, lng:-118.3768, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-universal",        name:"Universal/Studio City",    lat:34.1413, lng:-118.3510, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-highland",         name:"Hollywood/Highland",       lat:34.1019, lng:-118.3386, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-vine",             name:"Hollywood/Vine",           lat:34.1011, lng:-118.3255, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-western",          name:"Hollywood/Western",        lat:34.1008, lng:-118.3147, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-vermont-sunset",   name:"Vermont/Sunset",           lat:34.0999, lng:-118.2920, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-vermont-beverly",  name:"Vermont/Beverly",          lat:34.0750, lng:-118.2920, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-wilshire-vermont", name:"Wilshire/Vermont",         lat:34.0632, lng:-118.2921, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-macarthur-park",   name:"Westlake/MacArthur Park",  lat:34.0585, lng:-118.2764, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-7th-metro",        name:"7th St/Metro Center",      lat:34.0487, lng:-118.2588, route_ids:["lametro-b","lametro-a"], agency_id:"lametro" },
  { id:"la-pershing",         name:"Pershing Square",          lat:34.0488, lng:-118.2517, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-civic-center-la",  name:"Civic Center/Grand Park",  lat:34.0557, lng:-118.2433, route_ids:["lametro-b"],              agency_id:"lametro" },
  { id:"la-union-station",    name:"Union Station",            lat:34.0560, lng:-118.2342, route_ids:["lametro-b"],              agency_id:"lametro" },

  // ── LA Metro A Line (Blue) ──
  { id:"la-downtown-lb",  name:"Downtown Long Beach",  lat:33.7701, lng:-118.1896, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-transit-mall", name:"Transit Mall",         lat:33.7759, lng:-118.1894, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-5th-st",       name:"5th St",               lat:33.7806, lng:-118.1894, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-1st-st",       name:"1st St",               lat:33.7873, lng:-118.1894, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-anaheim",      name:"Anaheim St",           lat:33.7960, lng:-118.1894, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-pacific",      name:"Pacific",              lat:33.8050, lng:-118.1895, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-del-amo",      name:"Del Amo",              lat:33.8440, lng:-118.2029, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-compton",      name:"Compton",              lat:33.8966, lng:-118.2175, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-artesia",      name:"Artesia",              lat:33.9148, lng:-118.2221, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-redondo",      name:"Redondo/Marine",       lat:33.9360, lng:-118.2454, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-slauson",      name:"Slauson",              lat:34.0028, lng:-118.2528, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-florence",     name:"Florence",             lat:33.9729, lng:-118.2583, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-grand-ave",    name:"Grand/LATTC",          lat:34.0362, lng:-118.2582, route_ids:["lametro-a"], agency_id:"lametro" },
  { id:"la-san-pedro",    name:"San Pedro St",         lat:34.0406, lng:-118.2410, route_ids:["lametro-a"], agency_id:"lametro" },
];

// Apply route_id augmentations for new lines sharing existing stations
baseStations.forEach((s) => {
  const extra = routeIdAugments[s.id];
  if (extra) s.route_ids = [...s.route_ids, ...extra];
});

export const demoStations: DemoStation[] = [
  ...baseStations,
  ...(norcalStations as DemoStation[]),
  ...(socalStations as DemoStation[]),
];

// ===================== GeoJSON helpers =====================

export function stationsToGeoJSON(stations: DemoStation[]) {
  return {
    type: "FeatureCollection" as const,
    features: stations.map((s) => ({
      type: "Feature" as const,
      properties: {
        id: s.id,
        name: s.name,
        route_ids: JSON.stringify(s.route_ids),
        agency_id: s.agency_id,
      },
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] },
    })),
  };
}

export function routesToGeoJSON(routes: DemoRoute[]) {
  return {
    type: "FeatureCollection" as const,
    features: routes.map((r) => ({
      type: "Feature" as const,
      properties: {
        id: r.id,
        short_name: r.short_name,
        long_name: r.long_name,
        route_type: r.route_type,
        route_color: r.route_color,
        agency_id: r.agency_id,
      },
      geometry: { type: "LineString" as const, coordinates: r.coordinates },
    })),
  };
}

// Lookup helpers
export function getRouteById(id: string) {
  return demoRoutes.find((r) => r.id === id) ?? null;
}
export function getStationById(id: string) {
  return demoStations.find((s) => s.id === id) ?? null;
}
export function getStationsForRoute(routeId: string) {
  const route = getRouteById(routeId);
  if (!route) return [];
  return route.station_ids.map((id) => getStationById(id)).filter(Boolean) as DemoStation[];
}
export function getAgencyById(id: string) {
  return demoAgencies.find((a) => a.id === id) ?? null;
}
