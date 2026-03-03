// SoCal + Central CA transit route and station data
// Uses DemoRoute / DemoStation shapes from demo-data.ts (not redefined here)
//
// Shared stations already defined in demo-data.ts (referenced by ID only):
//   la-7th-metro, la-wilshire-vermont, la-macarthur-park,
//   la-pershing, la-civic-center-la, la-union-station

// ===================== ROUTES =====================

export const socalRoutes = [
  // ── LA Metro C Line (Green) — Norwalk to Redondo Beach ──
  {
    id: "lametro-c",
    short_name: "C",
    long_name: "C Line (Green) – Norwalk to Redondo Beach",
    route_type: 0,
    route_color: "#58A738",
    agency_id: "lametro",
    station_ids: [
      "la-redondo-beach",
      "la-douglas",
      "la-el-segundo",
      "la-mariposa",
      "la-aviation-lax",   // shared with K line
      "la-hawthorne-lennox",
      "la-crenshaw-c",
      "la-vermont-athens",
      "la-harbor-fwy",
      "la-avalon",
      "la-willowbrook",
      "la-long-beach-blvd",
      "la-lakewood-blvd",
      "la-norwalk",
    ],
    coordinates: [
      [-118.3688, 33.8683],
      [-118.3802, 33.8967],
      [-118.3864, 33.9155],
      [-118.3864, 33.9323],
      [-118.3864, 33.9449],
      [-118.3521, 33.9295],
      [-118.3280, 33.9295],
      [-118.2920, 33.9295],
      [-118.2811, 33.9295],
      [-118.2634, 33.9295],
      [-118.2377, 33.9284],
      [-118.2117, 33.9158],
      [-118.1362, 33.9158],
      [-118.0720, 33.9162],
    ],
  },

  // ── LA Metro D Line (Purple) — Wilshire/La Cienega to Union Station ──
  {
    id: "lametro-d",
    short_name: "D",
    long_name: "D Line (Purple) – Wilshire/La Cienega to Union Station",
    route_type: 1,
    route_color: "#A05DA5",
    agency_id: "lametro",
    station_ids: [
      "la-wilshire-la-cienega",
      "la-wilshire-fairfax",
      "la-wilshire-la-brea",
      "la-wilshire-western-d",
      "la-wilshire-normandie",
      "la-wilshire-vermont",   // existing (shared with B line)
      "la-macarthur-park",     // existing (shared with B line)
      "la-7th-metro",          // existing (shared with B, A, E lines)
      "la-pershing",           // existing (shared with B line)
      "la-civic-center-la",    // existing (shared with B line)
      "la-union-station",      // existing (shared with B line + Metrolink)
    ],
    coordinates: [
      [-118.3763, 34.0621],
      [-118.3611, 34.0623],
      [-118.3442, 34.0624],
      [-118.3090, 34.0627],
      [-118.3007, 34.0622],
      [-118.2921, 34.0632],
      [-118.2764, 34.0585],
      [-118.2588, 34.0487],
      [-118.2517, 34.0488],
      [-118.2433, 34.0557],
      [-118.2342, 34.0560],
    ],
  },

  // ── LA Metro E Line (Expo) — Downtown LA to Santa Monica ──
  {
    id: "lametro-e",
    short_name: "E",
    long_name: "E Line (Expo) – Downtown LA to Santa Monica",
    route_type: 0,
    route_color: "#F6A01B",
    agency_id: "lametro",
    station_ids: [
      "la-7th-metro",          // existing (shared)
      "la-pico",
      "la-lattc-ortho",
      "la-jefferson-usc",
      "la-expo-park-usc",
      "la-expo-vermont",
      "la-expo-western",
      "la-expo-crenshaw",      // shared with K line
      "la-farmdale",
      "la-expo-la-brea",
      "la-la-cienega-jefferson",
      "la-culver-city",
      "la-palms",
      "la-westwood-rancho-park",
      "la-expo-sepulveda",
      "la-26th-bergamot",
      "la-17th-smc",
      "la-downtown-santa-monica",
    ],
    coordinates: [
      [-118.2588, 34.0487],
      [-118.2661, 34.0406],
      [-118.2680, 34.0296],
      [-118.2783, 34.0222],
      [-118.2858, 34.0182],
      [-118.2920, 34.0182],
      [-118.3090, 34.0182],
      [-118.3280, 34.0231],
      [-118.3395, 34.0230],
      [-118.3440, 34.0224],
      [-118.3719, 34.0272],
      [-118.3867, 34.0292],
      [-118.4043, 34.0296],
      [-118.4227, 34.0364],
      [-118.4432, 34.0323],
      [-118.4696, 34.0283],
      [-118.4826, 34.0152],
      [-118.4920, 34.0144],
    ],
  },

  // ── LA Metro K Line (Crenshaw) — Expo/Crenshaw to Aviation/Century ──
  {
    id: "lametro-k",
    short_name: "K",
    long_name: "K Line (Crenshaw) – Expo/Crenshaw to Aviation/Century",
    route_type: 0,
    route_color: "#D29AD6",
    agency_id: "lametro",
    station_ids: [
      "la-expo-crenshaw",      // shared with E line
      "la-mlk",
      "la-leimert-park",
      "la-hyde-park",
      "la-fairview-heights",
      "la-downtown-inglewood",
      "la-westchester-veterans",
      "la-aviation-century",   // shared with C line (Aviation/LAX area)
    ],
    coordinates: [
      [-118.3280, 34.0231],
      [-118.3280, 33.9946],
      [-118.3280, 33.9862],
      [-118.3336, 33.9770],
      [-118.3502, 33.9622],
      [-118.3530, 33.9576],
      [-118.3730, 33.9585],
      [-118.3864, 33.9449],
    ],
  },

  // ── Metrolink San Bernardino Line ──
  {
    id: "metrolink-sbline",
    short_name: "SB",
    long_name: "San Bernardino Line",
    route_type: 2,
    route_color: "#F58220",
    agency_id: "metrolink",
    station_ids: [
      "la-union-station",      // existing (shared)
      "metrolink-cal-state-la",
      "metrolink-el-monte",
      "metrolink-baldwin-park",
      "metrolink-covina",
      "metrolink-pomona",
      "metrolink-claremont",
      "metrolink-upland",
      "metrolink-rancho-cucamonga",
      "metrolink-fontana",
      "metrolink-san-bernardino",
    ],
    coordinates: [
      [-118.2342, 34.0560],
      [-118.1678, 34.0670],
      [-118.0287, 34.0735],
      [-117.9713, 34.0780],
      [-117.8824, 34.0900],
      [-117.7570, 34.0555],
      [-117.7111, 34.0969],
      [-117.6536, 34.1065],
      [-117.5612, 34.1049],
      [-117.4500, 34.0904],
      [-117.2970, 34.1087],
    ],
  },

  // ── Metrolink Antelope Valley Line ──
  {
    id: "metrolink-avline",
    short_name: "AV",
    long_name: "Antelope Valley Line",
    route_type: 2,
    route_color: "#0076A9",
    agency_id: "metrolink",
    station_ids: [
      "la-union-station",      // existing (shared)
      "metrolink-glendale",    // shared with VC line
      "metrolink-burbank",     // shared with VC line
      "metrolink-sun-valley",
      "metrolink-sylmar",
      "metrolink-via-princessa",
      "metrolink-santa-clarita",
      "metrolink-vincent-grade",
      "metrolink-palmdale",
      "metrolink-lancaster",
    ],
    coordinates: [
      [-118.2342, 34.0560],
      [-118.2462, 34.1592],
      [-118.3168, 34.1821],
      [-118.3930, 34.2222],
      [-118.4621, 34.3107],
      [-118.4942, 34.3867],
      [-118.5423, 34.3865],
      [-118.2030, 34.4837],
      [-118.1153, 34.5750],
      [-118.1364, 34.6958],
    ],
  },

  // ── Metrolink Orange County Line ──
  {
    id: "metrolink-ocline",
    short_name: "OC",
    long_name: "Orange County Line",
    route_type: 2,
    route_color: "#E31837",
    agency_id: "metrolink",
    station_ids: [
      "la-union-station",      // existing (shared)
      "metrolink-fullerton",
      "metrolink-anaheim",
      "metrolink-orange",
      "metrolink-santa-ana",
      "metrolink-tustin",
      "metrolink-irvine",
      "metrolink-laguna-niguel",
      "metrolink-san-juan-capistrano",
      "metrolink-san-clemente",
      "metrolink-oceanside",   // shared with NCTD Coaster
    ],
    coordinates: [
      [-118.2342, 34.0560],
      [-117.9259, 33.8716],
      [-117.9090, 33.8437],
      [-117.8629, 33.7899],
      [-117.8530, 33.7452],
      [-117.8261, 33.7381],
      [-117.7621, 33.6861],
      [-117.6989, 33.5466],
      [-117.6620, 33.4958],
      [-117.6020, 33.4085],
      [-117.3798, 33.1970],
    ],
  },

  // ── Metrolink Ventura County Line ──
  {
    id: "metrolink-vcline",
    short_name: "VC",
    long_name: "Ventura County Line",
    route_type: 2,
    route_color: "#008544",
    agency_id: "metrolink",
    station_ids: [
      "la-union-station",      // existing (shared)
      "metrolink-glendale",    // shared with AV line
      "metrolink-burbank",     // shared with AV line
      "metrolink-van-nuys",
      "metrolink-chatsworth",
      "metrolink-simi-valley",
      "metrolink-moorpark",
      "metrolink-camarillo",
      "metrolink-oxnard",
      "metrolink-east-ventura",
    ],
    coordinates: [
      [-118.2342, 34.0560],
      [-118.2462, 34.1592],
      [-118.3168, 34.1821],
      [-118.4492, 34.1874],
      [-118.6040, 34.2570],
      [-118.7222, 34.2762],
      [-118.8785, 34.2877],
      [-119.0436, 34.2162],
      [-119.1802, 34.1886],
      [-119.2231, 34.2759],
    ],
  },

  // ── Sacramento RT Blue Line ──
  {
    id: "sacrt-blue",
    short_name: "Blue",
    long_name: "Blue Line – Watt/I-80 to Cosumnes River College",
    route_type: 0,
    route_color: "#0054A6",
    agency_id: "sacrt",
    station_ids: [
      "sacrt-watt-i80",
      "sacrt-roseville-road",
      "sacrt-marconi-arcade",
      "sacrt-swanston",
      "sacrt-royal-oaks",
      "sacrt-power-inn",       // shared with Gold line
      "sacrt-7th-capitol",     // shared with Gold line
      "sacrt-8th-capitol",     // shared with Gold line
      "sacrt-47th-avenue",
      "sacrt-city-college",
      "sacrt-fruitridge",
      "sacrt-florin",
      "sacrt-meadowview",
      "sacrt-center-parkway",
      "sacrt-cosumnes",
    ],
    coordinates: [
      [-121.4132, 38.6118],
      [-121.4247, 38.6101],
      [-121.4356, 38.6172],
      [-121.4413, 38.6084],
      [-121.4433, 38.5979],
      [-121.4508, 38.5801],
      [-121.4931, 38.5764],
      [-121.4918, 38.5769],
      [-121.4559, 38.5529],
      [-121.4684, 38.5364],
      [-121.4823, 38.5273],
      [-121.4960, 38.4954],
      [-121.4985, 38.4795],
      [-121.4944, 38.4585],
      [-121.4420, 38.4353],
    ],
  },

  // ── Sacramento RT Gold Line ──
  {
    id: "sacrt-gold",
    short_name: "Gold",
    long_name: "Gold Line – Sacramento Valley Station to Historic Folsom",
    route_type: 0,
    route_color: "#FFC72C",
    agency_id: "sacrt",
    station_ids: [
      "sacrt-valley-station",
      "sacrt-7th-capitol",     // shared with Blue line
      "sacrt-8th-k",
      "sacrt-13th-street",
      "sacrt-23rd-street",
      "sacrt-29th-street",
      "sacrt-59th-street",
      "sacrt-power-inn",       // shared with Blue line
      "sacrt-sunrise",
      "sacrt-hazel",
      "sacrt-iron-point",
      "sacrt-glenn",
      "sacrt-historic-folsom",
    ],
    coordinates: [
      [-121.5003, 38.5861],
      [-121.4931, 38.5764],
      [-121.4902, 38.5756],
      [-121.4804, 38.5783],
      [-121.4665, 38.5740],
      [-121.4587, 38.5748],
      [-121.4223, 38.5618],
      [-121.4508, 38.5801],
      [-121.3680, 38.6140],
      [-121.3169, 38.6411],
      [-121.2737, 38.6642],
      [-121.2399, 38.6722],
      [-121.1728, 38.6789],
    ],
  },

  // ── San Diego MTS Blue Line ──
  {
    id: "sdmts-blue",
    short_name: "Blue",
    long_name: "Blue Line – UTC to San Ysidro",
    route_type: 0,
    route_color: "#0074B7",
    agency_id: "sdmts",
    station_ids: [
      "sdmts-utc",
      "sdmts-va-medical",
      "sdmts-balboa-ave",
      "sdmts-clairemont-mesa",
      "sdmts-tecolote",
      "sdmts-old-town",        // shared with Coaster
      "sdmts-washington-st",
      "sdmts-middletown",
      "sdmts-america-plaza",
      "sdmts-santa-fe-depot",  // shared with Orange, Coaster
      "sdmts-seaport-village", // shared with Orange
      "sdmts-convention-ctr",  // shared with Orange
      "sdmts-gaslamp",         // shared with Orange
      "sdmts-12th-imperial",   // shared with Orange, Green
      "sdmts-barrio-logan",
      "sdmts-harborside",
      "sdmts-national-city",
      "sdmts-8th-street",
      "sdmts-palomar-st",
      "sdmts-palm-ave",
      "sdmts-iris-ave",
      "sdmts-beyer",
      "sdmts-san-ysidro",
    ],
    coordinates: [
      [-117.2135, 32.8712],
      [-117.2302, 32.8734],
      [-117.1753, 32.8199],
      [-117.1644, 32.8000],
      [-117.1567, 32.7738],
      [-117.1973, 32.7536],
      [-117.1816, 32.7468],
      [-117.1712, 32.7391],
      [-117.1643, 32.7166],
      [-117.1706, 32.7190],
      [-117.1664, 32.7107],
      [-117.1612, 32.7068],
      [-117.1606, 32.7108],
      [-117.1526, 32.7139],
      [-117.1468, 32.6991],
      [-117.1287, 32.6844],
      [-117.1107, 32.6740],
      [-117.0914, 32.6190],
      [-117.0708, 32.5922],
      [-117.0546, 32.5588],
      [-117.0373, 32.5527],
      [-117.0315, 32.5444],
      [-117.0279, 32.5397],
    ],
  },

  // ── San Diego MTS Orange Line ──
  {
    id: "sdmts-orange",
    short_name: "Orange",
    long_name: "Orange Line – Courthouse to El Cajon",
    route_type: 0,
    route_color: "#F7931E",
    agency_id: "sdmts",
    station_ids: [
      "sdmts-courthouse",
      "sdmts-santa-fe-depot",  // shared with Blue, Coaster
      "sdmts-seaport-village", // shared with Blue
      "sdmts-convention-ctr",  // shared with Blue
      "sdmts-gaslamp",         // shared with Blue
      "sdmts-12th-imperial",   // shared with Blue, Green
      "sdmts-city-college",    // shared with Green
      "sdmts-25th-commercial", // shared with Green
      "sdmts-32nd-commercial", // shared with Green
      "sdmts-47th-street",     // shared with Green
      "sdmts-encanto-62nd",    // shared with Green
      "sdmts-lemon-grove",     // shared with Green
      "sdmts-massachusetts",
      "sdmts-la-mesa",         // shared with Green
      "sdmts-amaya-drive",
      "sdmts-grossmont",       // shared with Green
      "sdmts-el-cajon",
    ],
    coordinates: [
      [-117.1628, 32.7188],
      [-117.1706, 32.7190],
      [-117.1664, 32.7107],
      [-117.1612, 32.7068],
      [-117.1606, 32.7108],
      [-117.1526, 32.7139],
      [-117.1490, 32.7191],
      [-117.1350, 32.7189],
      [-117.1225, 32.7198],
      [-117.0946, 32.7205],
      [-117.0714, 32.7175],
      [-117.0387, 32.7392],
      [-117.0135, 32.7593],
      [-117.0022, 32.7706],
      [-116.9854, 32.7806],
      [-116.9476, 32.7714],
      [-116.9675, 32.7897],
    ],
  },

  // ── San Diego MTS Green Line ──
  {
    id: "sdmts-green",
    short_name: "Green",
    long_name: "Green Line – 12th & Imperial to Santee",
    route_type: 0,
    route_color: "#00A550",
    agency_id: "sdmts",
    station_ids: [
      "sdmts-12th-imperial",   // shared with Blue, Orange
      "sdmts-park-market",
      "sdmts-city-college",    // shared with Orange
      "sdmts-25th-commercial", // shared with Orange
      "sdmts-32nd-commercial", // shared with Orange
      "sdmts-47th-street",     // shared with Orange
      "sdmts-encanto-62nd",    // shared with Orange
      "sdmts-lemon-grove",     // shared with Orange
      "sdmts-la-mesa",         // shared with Orange
      "sdmts-grossmont",       // shared with Orange
      "sdmts-santee",
    ],
    coordinates: [
      [-117.1526, 32.7139],
      [-117.1580, 32.7139],
      [-117.1490, 32.7191],
      [-117.1350, 32.7189],
      [-117.1225, 32.7198],
      [-117.0946, 32.7205],
      [-117.0714, 32.7175],
      [-117.0387, 32.7392],
      [-117.0022, 32.7706],
      [-116.9476, 32.7714],
      [-116.9802, 32.8477],
    ],
  },

  // ── NCTD Sprinter ──
  {
    id: "nctd-sprinter",
    short_name: "SPR",
    long_name: "Sprinter – Oceanside to Escondido",
    route_type: 0,
    route_color: "#95C93D",
    agency_id: "nctd",
    station_ids: [
      "nctd-oceanside",        // shared with Coaster
      "nctd-coast-highway",
      "nctd-vista",
      "nctd-buena-creek",
      "nctd-palomar",
      "nctd-san-marcos-civic",
      "nctd-cal-state-sm",
      "nctd-escondido",
    ],
    coordinates: [
      [-117.3798, 33.1970],
      [-117.3731, 33.1937],
      [-117.2428, 33.2000],
      [-117.2025, 33.1682],
      [-117.1710, 33.1608],
      [-117.1629, 33.1430],
      [-117.1555, 33.1275],
      [-117.0840, 33.1210],
    ],
  },

  // ── NCTD Coaster ──
  {
    id: "nctd-coaster",
    short_name: "CST",
    long_name: "Coaster – Oceanside to San Diego",
    route_type: 2,
    route_color: "#0076A9",
    agency_id: "nctd",
    station_ids: [
      "nctd-oceanside",        // shared with Sprinter
      "nctd-carlsbad-village",
      "nctd-carlsbad-poinsettia",
      "nctd-encinitas",
      "nctd-solana-beach",
      "nctd-sorrento-valley",
      "sdmts-old-town",        // shared with SD Blue Line
      "sdmts-santa-fe-depot",  // shared with SD Blue/Orange
    ],
    coordinates: [
      [-117.3798, 33.1970],
      [-117.3456, 33.1580],
      [-117.3147, 33.1267],
      [-117.2674, 33.0415],
      [-117.2582, 32.9913],
      [-117.2310, 32.9084],
      [-117.1973, 32.7536],
      [-117.1706, 32.7190],
    ],
  },
];

// ===================== STATIONS =====================
// Note: The following station IDs are defined in demo-data.ts and NOT redefined here:
//   la-7th-metro, la-wilshire-vermont, la-macarthur-park,
//   la-pershing, la-civic-center-la, la-union-station
// Those stations' route_ids in demo-data.ts should be extended to include routes from this file.

export const socalStations = [
  // ── LA Metro C Line (Green) ──
  { id: "la-redondo-beach",    name: "Redondo Beach",            lat: 33.8683, lng: -118.3688, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-douglas",          name: "Douglas",                  lat: 33.8967, lng: -118.3802, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-el-segundo",       name: "El Segundo",               lat: 33.9155, lng: -118.3864, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-mariposa",         name: "Mariposa",                 lat: 33.9323, lng: -118.3864, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-aviation-lax",     name: "Aviation/LAX",             lat: 33.9449, lng: -118.3864, route_ids: ["lametro-c", "lametro-k"],          agency_id: "lametro" },
  { id: "la-hawthorne-lennox", name: "Hawthorne/Lennox",         lat: 33.9295, lng: -118.3521, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-crenshaw-c",       name: "Crenshaw",                 lat: 33.9295, lng: -118.3280, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-vermont-athens",   name: "Vermont/Athens",           lat: 33.9295, lng: -118.2920, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-harbor-fwy",       name: "Harbor Freeway",           lat: 33.9295, lng: -118.2811, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-avalon",           name: "Avalon",                   lat: 33.9295, lng: -118.2634, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-willowbrook",      name: "Willowbrook/Rosa Parks",   lat: 33.9284, lng: -118.2377, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-long-beach-blvd",  name: "Long Beach Blvd",          lat: 33.9158, lng: -118.2117, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-lakewood-blvd",    name: "Lakewood Blvd",            lat: 33.9158, lng: -118.1362, route_ids: ["lametro-c"],                       agency_id: "lametro" },
  { id: "la-norwalk",          name: "Norwalk",                  lat: 33.9162, lng: -118.0720, route_ids: ["lametro-c"],                       agency_id: "lametro" },

  // ── LA Metro D Line (Purple) — new stations only ──
  { id: "la-wilshire-la-cienega", name: "Wilshire/La Cienega",   lat: 34.0621, lng: -118.3763, route_ids: ["lametro-d"],                       agency_id: "lametro" },
  { id: "la-wilshire-fairfax",    name: "Wilshire/Fairfax",      lat: 34.0623, lng: -118.3611, route_ids: ["lametro-d"],                       agency_id: "lametro" },
  { id: "la-wilshire-la-brea",    name: "Wilshire/La Brea",      lat: 34.0624, lng: -118.3442, route_ids: ["lametro-d"],                       agency_id: "lametro" },
  { id: "la-wilshire-western-d",  name: "Wilshire/Western",      lat: 34.0627, lng: -118.3090, route_ids: ["lametro-d"],                       agency_id: "lametro" },
  { id: "la-wilshire-normandie",  name: "Wilshire/Normandie",    lat: 34.0622, lng: -118.3007, route_ids: ["lametro-d"],                       agency_id: "lametro" },

  // ── LA Metro E Line (Expo) — new stations only ──
  { id: "la-pico",                  name: "Pico",                        lat: 34.0406, lng: -118.2661, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-lattc-ortho",           name: "LATTC/Ortho Institute",       lat: 34.0296, lng: -118.2680, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-jefferson-usc",         name: "Jefferson/USC",               lat: 34.0222, lng: -118.2783, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-park-usc",         name: "Expo Park/USC",               lat: 34.0182, lng: -118.2858, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-vermont",          name: "Expo/Vermont",                lat: 34.0182, lng: -118.2920, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-western",          name: "Expo/Western",                lat: 34.0182, lng: -118.3090, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-crenshaw",         name: "Expo/Crenshaw",               lat: 34.0231, lng: -118.3280, route_ids: ["lametro-e", "lametro-k"],    agency_id: "lametro" },
  { id: "la-farmdale",              name: "Farmdale",                    lat: 34.0230, lng: -118.3395, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-la-brea",          name: "Expo/La Brea",                lat: 34.0224, lng: -118.3440, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-la-cienega-jefferson",  name: "La Cienega/Jefferson",        lat: 34.0272, lng: -118.3719, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-culver-city",           name: "Culver City",                 lat: 34.0292, lng: -118.3867, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-palms",                 name: "Palms",                       lat: 34.0296, lng: -118.4043, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-westwood-rancho-park",  name: "Westwood/Rancho Park",        lat: 34.0364, lng: -118.4227, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-expo-sepulveda",        name: "Expo/Sepulveda",              lat: 34.0323, lng: -118.4432, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-26th-bergamot",         name: "26th St/Bergamot",            lat: 34.0283, lng: -118.4696, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-17th-smc",              name: "17th St/SMC",                 lat: 34.0152, lng: -118.4826, route_ids: ["lametro-e"],                 agency_id: "lametro" },
  { id: "la-downtown-santa-monica", name: "Downtown Santa Monica",       lat: 34.0144, lng: -118.4920, route_ids: ["lametro-e"],                 agency_id: "lametro" },

  // ── LA Metro K Line (Crenshaw) — new stations only ──
  // la-expo-crenshaw is already defined above (shared with E line)
  // la-aviation-lax is already defined above (shared with C line); K line uses la-aviation-century below
  { id: "la-mlk",                name: "Martin Luther King Jr",    lat: 33.9946, lng: -118.3280, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-leimert-park",      name: "Leimert Park",             lat: 33.9862, lng: -118.3280, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-hyde-park",          name: "Hyde Park",                lat: 33.9770, lng: -118.3336, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-fairview-heights",   name: "Fairview Heights",         lat: 33.9622, lng: -118.3502, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-downtown-inglewood", name: "Downtown Inglewood",       lat: 33.9576, lng: -118.3530, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-westchester-veterans", name: "Westchester/Veterans",   lat: 33.9585, lng: -118.3730, route_ids: ["lametro-k"],                       agency_id: "lametro" },
  { id: "la-aviation-century",  name: "Aviation/Century",          lat: 33.9449, lng: -118.3864, route_ids: ["lametro-k", "lametro-c"],          agency_id: "lametro" },

  // ── Metrolink — San Bernardino Line (new stations only; la-union-station is existing) ──
  { id: "metrolink-cal-state-la",     name: "Cal State LA",              lat: 34.0670, lng: -118.1678, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-el-monte",         name: "El Monte",                  lat: 34.0735, lng: -118.0287, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-baldwin-park",     name: "Baldwin Park",              lat: 34.0780, lng: -117.9713, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-covina",           name: "Covina",                    lat: 34.0900, lng: -117.8824, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-pomona",           name: "Pomona",                    lat: 34.0555, lng: -117.7570, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-claremont",        name: "Claremont",                 lat: 34.0969, lng: -117.7111, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-upland",           name: "Upland",                    lat: 34.1065, lng: -117.6536, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-rancho-cucamonga", name: "Rancho Cucamonga",          lat: 34.1049, lng: -117.5612, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-fontana",          name: "Fontana",                   lat: 34.0904, lng: -117.4500, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },
  { id: "metrolink-san-bernardino",   name: "San Bernardino",            lat: 34.1087, lng: -117.2970, route_ids: ["metrolink-sbline"],           agency_id: "metrolink" },

  // ── Metrolink — Antelope Valley Line (new stations only) ──
  { id: "metrolink-glendale",         name: "Glendale",                  lat: 34.1592, lng: -118.2462, route_ids: ["metrolink-avline", "metrolink-vcline"], agency_id: "metrolink" },
  { id: "metrolink-burbank",          name: "Burbank",                   lat: 34.1821, lng: -118.3168, route_ids: ["metrolink-avline", "metrolink-vcline"], agency_id: "metrolink" },
  { id: "metrolink-sun-valley",       name: "Sun Valley",                lat: 34.2222, lng: -118.3930, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-sylmar",           name: "Sylmar/San Fernando",       lat: 34.3107, lng: -118.4621, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-via-princessa",    name: "Via Princessa",             lat: 34.3867, lng: -118.4942, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-santa-clarita",    name: "Santa Clarita",             lat: 34.3865, lng: -118.5423, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-vincent-grade",    name: "Vincent Grade/Acton",       lat: 34.4837, lng: -118.2030, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-palmdale",         name: "Palmdale",                  lat: 34.5750, lng: -118.1153, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },
  { id: "metrolink-lancaster",        name: "Lancaster",                 lat: 34.6958, lng: -118.1364, route_ids: ["metrolink-avline"],           agency_id: "metrolink" },

  // ── Metrolink — Orange County Line (new stations only) ──
  { id: "metrolink-fullerton",            name: "Fullerton",                    lat: 33.8716, lng: -117.9259, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-anaheim",              name: "Anaheim",                      lat: 33.8437, lng: -117.9090, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-orange",               name: "Orange",                       lat: 33.7899, lng: -117.8629, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-santa-ana",            name: "Santa Ana",                    lat: 33.7452, lng: -117.8530, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-tustin",               name: "Tustin",                       lat: 33.7381, lng: -117.8261, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-irvine",               name: "Irvine",                       lat: 33.6861, lng: -117.7621, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-laguna-niguel",        name: "Laguna Niguel/Mission Viejo",  lat: 33.5466, lng: -117.6989, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-san-juan-capistrano",  name: "San Juan Capistrano",          lat: 33.4958, lng: -117.6620, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-san-clemente",         name: "San Clemente",                 lat: 33.4085, lng: -117.6020, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },
  { id: "metrolink-oceanside",            name: "Oceanside Transit Center",     lat: 33.1970, lng: -117.3798, route_ids: ["metrolink-ocline"],    agency_id: "metrolink" },

  // ── Metrolink — Ventura County Line (new stations only; Glendale + Burbank shared above) ──
  { id: "metrolink-van-nuys",       name: "Van Nuys",              lat: 34.1874, lng: -118.4492, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-chatsworth",     name: "Chatsworth",            lat: 34.2570, lng: -118.6040, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-simi-valley",    name: "Simi Valley",           lat: 34.2762, lng: -118.7222, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-moorpark",       name: "Moorpark",              lat: 34.2877, lng: -118.8785, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-camarillo",      name: "Camarillo",             lat: 34.2162, lng: -119.0436, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-oxnard",         name: "Oxnard",                lat: 34.1886, lng: -119.1802, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },
  { id: "metrolink-east-ventura",   name: "East Ventura",          lat: 34.2759, lng: -119.2231, route_ids: ["metrolink-vcline"],                agency_id: "metrolink" },

  // ── Sacramento RT Blue Line ──
  { id: "sacrt-watt-i80",        name: "Watt/I-80",              lat: 38.6118, lng: -121.4132, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-roseville-road",  name: "Roseville Road",         lat: 38.6101, lng: -121.4247, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-marconi-arcade",  name: "Marconi/Arcade",         lat: 38.6172, lng: -121.4356, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-swanston",        name: "Swanston",               lat: 38.6084, lng: -121.4413, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-royal-oaks",      name: "Royal Oaks",             lat: 38.5979, lng: -121.4433, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-power-inn",       name: "Power Inn",              lat: 38.5801, lng: -121.4508, route_ids: ["sacrt-blue", "sacrt-gold"],         agency_id: "sacrt" },
  { id: "sacrt-7th-capitol",     name: "7th & I/Capitol",        lat: 38.5764, lng: -121.4931, route_ids: ["sacrt-blue", "sacrt-gold"],         agency_id: "sacrt" },
  { id: "sacrt-8th-capitol",     name: "8th & Capitol",          lat: 38.5769, lng: -121.4918, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-47th-avenue",     name: "47th Avenue",            lat: 38.5529, lng: -121.4559, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-city-college",    name: "City College",           lat: 38.5364, lng: -121.4684, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-fruitridge",      name: "Fruitridge",             lat: 38.5273, lng: -121.4823, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-florin",          name: "Florin",                 lat: 38.4954, lng: -121.4960, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-meadowview",      name: "Meadowview",             lat: 38.4795, lng: -121.4985, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-center-parkway",  name: "Center Parkway",         lat: 38.4585, lng: -121.4944, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },
  { id: "sacrt-cosumnes",        name: "Cosumnes River College", lat: 38.4353, lng: -121.4420, route_ids: ["sacrt-blue"],                       agency_id: "sacrt" },

  // ── Sacramento RT Gold Line ──
  { id: "sacrt-valley-station",  name: "Sacramento Valley Station", lat: 38.5861, lng: -121.5003, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  // sacrt-7th-capitol already defined above (shared)
  { id: "sacrt-8th-k",           name: "8th & K",                   lat: 38.5756, lng: -121.4902, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-13th-street",     name: "13th Street",               lat: 38.5783, lng: -121.4804, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-23rd-street",     name: "23rd Street",               lat: 38.5740, lng: -121.4665, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-29th-street",     name: "29th Street",               lat: 38.5748, lng: -121.4587, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-59th-street",     name: "59th Street",               lat: 38.5618, lng: -121.4223, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  // sacrt-power-inn already defined above (shared)
  { id: "sacrt-sunrise",         name: "Sunrise",                   lat: 38.6140, lng: -121.3680, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-hazel",           name: "Hazel",                     lat: 38.6411, lng: -121.3169, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-iron-point",      name: "Iron Point",                lat: 38.6642, lng: -121.2737, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-glenn",           name: "Glenn",                     lat: 38.6722, lng: -121.2399, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },
  { id: "sacrt-historic-folsom", name: "Historic Folsom",           lat: 38.6789, lng: -121.1728, route_ids: ["sacrt-gold"],                    agency_id: "sacrt" },

  // ── San Diego MTS Blue Line ──
  { id: "sdmts-utc",             name: "UTC",                       lat: 32.8712, lng: -117.2135, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-va-medical",      name: "VA Medical Center",         lat: 32.8734, lng: -117.2302, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-balboa-ave",      name: "Balboa Avenue",             lat: 32.8199, lng: -117.1753, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-clairemont-mesa", name: "Clairemont Mesa",           lat: 32.8000, lng: -117.1644, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-tecolote",        name: "Tecolote",                  lat: 32.7738, lng: -117.1567, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-old-town",        name: "Old Town",                  lat: 32.7536, lng: -117.1973, route_ids: ["sdmts-blue", "nctd-coaster"],    agency_id: "sdmts" },
  { id: "sdmts-washington-st",    name: "Washington Street",         lat: 32.7468, lng: -117.1816, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-middletown",      name: "Middletown",                lat: 32.7391, lng: -117.1712, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-america-plaza",   name: "America Plaza",             lat: 32.7166, lng: -117.1643, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-santa-fe-depot",  name: "Santa Fe Depot",            lat: 32.7190, lng: -117.1706, route_ids: ["sdmts-blue", "sdmts-orange", "nctd-coaster"], agency_id: "sdmts" },
  { id: "sdmts-seaport-village", name: "Seaport Village",           lat: 32.7107, lng: -117.1664, route_ids: ["sdmts-blue", "sdmts-orange"],    agency_id: "sdmts" },
  { id: "sdmts-convention-ctr",  name: "Convention Center",         lat: 32.7068, lng: -117.1612, route_ids: ["sdmts-blue", "sdmts-orange"],    agency_id: "sdmts" },
  { id: "sdmts-gaslamp",         name: "Gaslamp Quarter",           lat: 32.7108, lng: -117.1606, route_ids: ["sdmts-blue", "sdmts-orange"],    agency_id: "sdmts" },
  { id: "sdmts-12th-imperial",   name: "12th & Imperial",           lat: 32.7139, lng: -117.1526, route_ids: ["sdmts-blue", "sdmts-orange", "sdmts-green"], agency_id: "sdmts" },
  { id: "sdmts-barrio-logan",    name: "Barrio Logan",              lat: 32.6991, lng: -117.1468, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-harborside",      name: "Harborside",                lat: 32.6844, lng: -117.1287, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-national-city",   name: "National City",             lat: 32.6740, lng: -117.1107, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-8th-street",      name: "8th Street",                lat: 32.6190, lng: -117.0914, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-palomar-st",      name: "Palomar Street",            lat: 32.5922, lng: -117.0708, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-palm-ave",        name: "Palm Avenue",               lat: 32.5588, lng: -117.0546, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-iris-ave",        name: "Iris Avenue",               lat: 32.5527, lng: -117.0373, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-beyer",           name: "Beyer",                     lat: 32.5444, lng: -117.0315, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },
  { id: "sdmts-san-ysidro",      name: "San Ysidro",                lat: 32.5397, lng: -117.0279, route_ids: ["sdmts-blue"],                    agency_id: "sdmts" },

  // ── San Diego MTS Orange Line — new stations only ──
  { id: "sdmts-courthouse",      name: "Courthouse",                lat: 32.7188, lng: -117.1628, route_ids: ["sdmts-orange"],                  agency_id: "sdmts" },
  { id: "sdmts-city-college",    name: "City College",              lat: 32.7191, lng: -117.1490, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-25th-commercial", name: "25th & Commercial",         lat: 32.7189, lng: -117.1350, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-32nd-commercial", name: "32nd & Commercial",         lat: 32.7198, lng: -117.1225, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-47th-street",     name: "47th Street",               lat: 32.7205, lng: -117.0946, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-encanto-62nd",    name: "Encanto/62nd",              lat: 32.7175, lng: -117.0714, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-lemon-grove",     name: "Lemon Grove",               lat: 32.7392, lng: -117.0387, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-massachusetts",   name: "Massachusetts Avenue",      lat: 32.7593, lng: -117.0135, route_ids: ["sdmts-orange"],                  agency_id: "sdmts" },
  { id: "sdmts-la-mesa",         name: "La Mesa",                   lat: 32.7706, lng: -117.0022, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-amaya-drive",     name: "Amaya Drive",               lat: 32.7806, lng: -116.9854, route_ids: ["sdmts-orange"],                  agency_id: "sdmts" },
  { id: "sdmts-grossmont",       name: "Grossmont",                 lat: 32.7714, lng: -116.9476, route_ids: ["sdmts-orange", "sdmts-green"],   agency_id: "sdmts" },
  { id: "sdmts-el-cajon",        name: "El Cajon",                  lat: 32.7897, lng: -116.9675, route_ids: ["sdmts-orange"],                  agency_id: "sdmts" },

  // ── San Diego MTS Green Line — new stations only ──
  // Most Green Line stations are shared with Orange and/or Blue (defined above)
  { id: "sdmts-park-market",     name: "Park & Market",             lat: 32.7139, lng: -117.1580, route_ids: ["sdmts-green"],                   agency_id: "sdmts" },
  { id: "sdmts-santee",          name: "Santee Town Center",        lat: 32.8477, lng: -116.9802, route_ids: ["sdmts-green"],                   agency_id: "sdmts" },

  // ── NCTD Sprinter ──
  { id: "nctd-oceanside",        name: "Oceanside Transit Center",  lat: 33.1970, lng: -117.3798, route_ids: ["nctd-sprinter", "nctd-coaster"], agency_id: "nctd" },
  { id: "nctd-coast-highway",    name: "Coast Highway",             lat: 33.1937, lng: -117.3731, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-vista",            name: "Vista",                     lat: 33.2000, lng: -117.2428, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-buena-creek",      name: "Buena Creek",               lat: 33.1682, lng: -117.2025, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-palomar",          name: "Palomar",                   lat: 33.1608, lng: -117.1710, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-san-marcos-civic", name: "San Marcos Civic Center",   lat: 33.1430, lng: -117.1629, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-cal-state-sm",     name: "Cal State San Marcos",      lat: 33.1275, lng: -117.1555, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },
  { id: "nctd-escondido",        name: "Escondido",                 lat: 33.1210, lng: -117.0840, route_ids: ["nctd-sprinter"],                 agency_id: "nctd" },

  // ── NCTD Coaster — new stations only (Oceanside shared above; Old Town + Santa Fe shared with SD MTS) ──
  { id: "nctd-carlsbad-village",     name: "Carlsbad Village",       lat: 33.1580, lng: -117.3456, route_ids: ["nctd-coaster"],                 agency_id: "nctd" },
  { id: "nctd-carlsbad-poinsettia",  name: "Carlsbad Poinsettia",    lat: 33.1267, lng: -117.3147, route_ids: ["nctd-coaster"],                 agency_id: "nctd" },
  { id: "nctd-encinitas",            name: "Encinitas",               lat: 33.0415, lng: -117.2674, route_ids: ["nctd-coaster"],                 agency_id: "nctd" },
  { id: "nctd-solana-beach",         name: "Solana Beach",            lat: 32.9913, lng: -117.2582, route_ids: ["nctd-coaster"],                 agency_id: "nctd" },
  { id: "nctd-sorrento-valley",      name: "Sorrento Valley",         lat: 32.9084, lng: -117.2310, route_ids: ["nctd-coaster"],                 agency_id: "nctd" },
];
