// Demo transit data — San Diego focused
// MTS Trolley, NCTD Coaster/Sprinter, Pacific Surfliner, MTS Bus Rapid Transit

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
  route_type: number; // 0=light rail/tram, 1=heavy rail/subway, 2=commuter rail, 3=bus
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
  { id: "sdmts", name: "San Diego MTS Trolley", city: "San Diego", state: "CA" },
  { id: "nctd", name: "North County Transit District", city: "Oceanside", state: "CA" },
  { id: "amtrak", name: "Amtrak Pacific Surfliner", city: "San Diego", state: "CA" },
  { id: "mts-bus", name: "MTS Rapid Bus", city: "San Diego", state: "CA" },
];

// ===================== ROUTES =====================

export const demoRoutes: DemoRoute[] = [
  // ── MTS Trolley Blue Line (America Plaza → San Ysidro) ──
  {
    id: "sdmts-blue",
    short_name: "Blue",
    long_name: "America Plaza – San Ysidro",
    route_type: 0,
    route_color: "#0072BC",
    agency_id: "sdmts",
    station_ids: [
      "sd-america-plaza","sd-county-center","sd-civic-center","sd-5th-ave",
      "sd-city-college","sd-12th-imperial","sd-barrio-logan","sd-harborside",
      "sd-pacific-fleet","sd-24th-st","sd-bayfront-e-st","sd-h-st",
      "sd-palomar-st","sd-palm-ave","sd-iris-ave","sd-beyer-blvd","sd-san-ysidro",
    ],
    coordinates: [
      [-117.1690,32.7193],[-117.1668,32.7173],[-117.1640,32.7150],
      [-117.1610,32.7138],[-117.1595,32.7199],[-117.1544,32.7061],
      [-117.1434,32.6996],[-117.1360,32.6905],[-117.1252,32.6831],
      [-117.1130,32.6758],[-117.1049,32.6600],[-117.0990,32.6477],
      [-117.0915,32.6303],[-117.0865,32.6164],[-117.0832,32.6065],
      [-117.0617,32.5772],[-117.0416,32.5484],
    ],
  },
  // ── MTS Trolley Orange Line (Courthouse → El Cajon) ──
  {
    id: "sdmts-orange",
    short_name: "Orange",
    long_name: "Courthouse – El Cajon Transit Center",
    route_type: 0,
    route_color: "#F7931E",
    agency_id: "sdmts",
    station_ids: [
      "sd-courthouse","sd-santa-fe","sd-seaport-village","sd-convention-center",
      "sd-gaslamp","sd-12th-imperial","sd-park-blvd","sd-city-heights",
      "sd-fairmount","sd-47th-st","sd-euclid","sd-encanto","sd-lemon-grove",
      "sd-massachusetts","sd-grossmont","sd-la-mesa","sd-amaya","sd-el-cajon",
    ],
    coordinates: [
      [-117.1710,32.7188],[-117.1705,32.7236],[-117.1685,32.7098],
      [-117.1645,32.7078],[-117.1601,32.7119],[-117.1544,32.7061],
      [-117.1467,32.7073],[-117.1103,32.7197],[-117.0917,32.7244],
      [-117.0850,32.7274],[-117.0678,32.7300],[-117.0481,32.7181],
      [-117.0325,32.7219],[-117.0252,32.7233],[-117.0091,32.7503],
      [-117.0222,32.7658],[-116.9960,32.7840],[-116.9621,32.7945],
    ],
  },
  // ── MTS Trolley Green Line (12th & Imperial → Santee) ──
  {
    id: "sdmts-green",
    short_name: "Green",
    long_name: "12th & Imperial – Santee Town Center",
    route_type: 0,
    route_color: "#00A84F",
    agency_id: "sdmts",
    station_ids: [
      "sd-12th-imperial","sd-park-blvd","sd-city-heights","sd-sdsu",
      "sd-grantville","sd-mission-san-diego","sd-qualcomm","sd-navajo",
      "sd-rio-vista","sd-mission-gorge","sd-gillespie","sd-arnele","sd-santee",
    ],
    coordinates: [
      [-117.1544,32.7061],[-117.1467,32.7073],[-117.1103,32.7197],
      [-117.0770,32.7743],[-117.0970,32.7631],[-117.1045,32.7832],
      [-117.1200,32.7843],[-117.0670,32.7893],[-117.0470,32.8038],
      [-117.0307,32.8115],[-116.9929,32.8189],[-116.9790,32.8302],
      [-116.9735,32.8383],
    ],
  },
  // ── MTS Trolley Copper Line (UTC → SDSU) ──
  {
    id: "sdmts-copper",
    short_name: "Copper",
    long_name: "UTC – SDSU via Mid-Coast",
    route_type: 0,
    route_color: "#C15A2E",
    agency_id: "sdmts",
    station_ids: [
      "sd-utc","sd-executive-dr","sd-nobel-dr","sd-va-medical",
      "sd-ucsd-central","sd-ucsd-health","sd-tecolote","sd-clairemont-mesa",
      "sd-balboa-ave","sd-old-town","sd-washington-st","sd-fashion-valley",
      "sd-hazard-center","sd-mission-valley","sd-sdsu",
    ],
    coordinates: [
      [-117.2214,32.8720],[-117.2192,32.8680],[-117.2163,32.8614],
      [-117.2108,32.8543],[-117.2340,32.8801],[-117.2350,32.8750],
      [-117.2070,32.8410],[-117.2000,32.8337],[-117.1880,32.8232],
      [-117.1970,32.7546],[-117.1930,32.7480],[-117.1680,32.7669],
      [-117.1590,32.7710],[-117.1440,32.7755],[-117.0770,32.7743],
    ],
    },
  // ── MTS Trolley Silver Line (placeholder — future BRT) ──
  {
    id: "sdmts-silver",
    short_name: "Silver",
    long_name: "South Bay to Downtown Rapid",
    route_type: 3,
    route_color: "#A7A9AC",
    agency_id: "mts-bus",
    station_ids: [
      "sd-otay-ranch","sd-otay-mesa","sd-palomar-st","sd-24th-st",
      "sd-12th-imperial","sd-city-college","sd-civic-center",
    ],
    coordinates: [
      [-116.9382,32.6092],[-117.0350,32.5550],[-117.0915,32.6303],
      [-117.1130,32.6758],[-117.1544,32.7061],[-117.1595,32.7199],
      [-117.1640,32.7150],
    ],
  },
  // ── NCTD Sprinter (Oceanside – Escondido) ──
  {
    id: "nctd-sprinter",
    short_name: "Sprinter",
    long_name: "Oceanside – Escondido",
    route_type: 0,
    route_color: "#E31837",
    agency_id: "nctd",
    station_ids: [
      "nctd-oceanside-transit","nctd-coast-hwy","nctd-crouch-st",
      "nctd-el-camino-real","nctd-melrose","nctd-vista","nctd-civic-center-vista",
      "nctd-rancho-buena-vista","nctd-palomar-college","nctd-san-marcos-civic",
      "nctd-csusm","nctd-nordahl","nctd-westfield-north","nctd-escondido-transit",
    ],
    coordinates: [
      [-117.3792,33.1950],[-117.3614,33.1943],[-117.3349,33.1901],
      [-117.3107,33.1817],[-117.2961,33.1749],[-117.2460,33.2024],
      [-117.2365,33.1968],[-117.2157,33.1860],[-117.1718,33.1517],
      [-117.1503,33.1356],[-117.1361,33.1300],[-117.1134,33.1264],
      [-117.0817,33.1245],[-117.0836,33.1204],
    ],
  },
  // ── NCTD Coaster (Oceanside – San Diego Old Town) ──
  {
    id: "nctd-coaster",
    short_name: "Coaster",
    long_name: "Oceanside – San Diego Old Town",
    route_type: 2,
    route_color: "#004B87",
    agency_id: "nctd",
    station_ids: [
      "nctd-oceanside-transit","nctd-carlsbad-village","nctd-carlsbad-poinsettia",
      "nctd-encinitas","nctd-solana-beach","nctd-sorrento-valley",
      "sd-old-town","sd-santa-fe",
    ],
    coordinates: [
      [-117.3792,33.1950],[-117.3498,33.1616],[-117.3423,33.1311],
      [-117.2919,33.0447],[-117.2721,32.9878],[-117.2341,32.8985],
      [-117.1970,32.7546],[-117.1705,32.7236],
    ],
  },
  // ── Amtrak Pacific Surfliner (San Diego → LA) ──
  {
    id: "amtrak-surfliner",
    short_name: "Surfliner",
    long_name: "San Diego – Los Angeles Pacific Surfliner",
    route_type: 2,
    route_color: "#1C5BA2",
    agency_id: "amtrak",
    station_ids: [
      "sd-santa-fe","sd-old-town","nctd-solana-beach","nctd-oceanside-transit",
      "amtrak-san-clemente","amtrak-san-juan","amtrak-irvine",
      "amtrak-fullerton","amtrak-la-union",
    ],
    coordinates: [
      [-117.1705,32.7236],[-117.1970,32.7546],[-117.2721,32.9878],
      [-117.3792,33.1950],[-117.6188,33.4271],[-117.6620,33.4965],
      [-117.7676,33.6862],[-117.9254,33.8703],[-118.2342,34.0560],
    ],
  },
  // ── MTS Rapid Bus 215 (Mid-City) ──
  {
    id: "mts-rapid-215",
    short_name: "215",
    long_name: "Rapid 215 – Mid-City to Downtown",
    route_type: 3,
    route_color: "#9B2335",
    agency_id: "mts-bus",
    station_ids: [
      "sd-sdsu","sd-el-cajon-bl-70th","sd-el-cajon-bl-park","sd-university-heights",
      "sd-hillcrest","sd-downtown-bus",
    ],
    coordinates: [
      [-117.0770,32.7743],[-117.0880,32.7588],[-117.1218,32.7550],
      [-117.1342,32.7514],[-117.1624,32.7488],[-117.1650,32.7170],
    ],
  },
  // ── MTS Rapid Bus 235 (El Cajon Blvd) ──
  {
    id: "mts-rapid-235",
    short_name: "235",
    long_name: "Rapid 235 – SDSU to UTC",
    route_type: 3,
    route_color: "#00838F",
    agency_id: "mts-bus",
    station_ids: [
      "sd-sdsu","sd-college-area","sd-kensington","sd-normal-heights",
      "sd-north-park","sd-university-heights","sd-hillcrest","sd-old-town",
      "sd-clairemont","sd-utc",
    ],
    coordinates: [
      [-117.0770,32.7743],[-117.0750,32.7650],[-117.1018,32.7600],
      [-117.1170,32.7655],[-117.1300,32.7460],[-117.1342,32.7514],
      [-117.1624,32.7488],[-117.1970,32.7546],[-117.2050,32.8100],
      [-117.2214,32.8720],
    ],
  },
  // ── MTS Rapid Bus 225 (South Bay) ──
  {
    id: "mts-rapid-225",
    short_name: "225",
    long_name: "Rapid 225 – Otay Mesa to Downtown",
    route_type: 3,
    route_color: "#5C2D91",
    agency_id: "mts-bus",
    station_ids: [
      "sd-otay-mesa","sd-palm-ave","sd-iris-ave","sd-national-city",
      "sd-barrio-logan","sd-12th-imperial","sd-downtown-bus",
    ],
    coordinates: [
      [-117.0350,32.5550],[-117.0865,32.6164],[-117.0832,32.6065],
      [-117.1000,32.6700],[-117.1434,32.6996],[-117.1544,32.7061],
      [-117.1650,32.7170],
    ],
  },
];

// ===================== STATIONS =====================

export const demoStations: DemoStation[] = [
  // ── MTS Blue Line Stations ──
  { id: "sd-america-plaza", name: "America Plaza", lat: 32.7193, lng: -117.1690, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-county-center", name: "County Center/Little Italy", lat: 32.7173, lng: -117.1668, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-civic-center", name: "Civic Center", lat: 32.7150, lng: -117.1640, route_ids: ["sdmts-blue", "sdmts-silver"], agency_id: "sdmts" },
  { id: "sd-5th-ave", name: "5th Avenue", lat: 32.7138, lng: -117.1610, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-city-college", name: "City College", lat: 32.7199, lng: -117.1595, route_ids: ["sdmts-blue", "sdmts-silver"], agency_id: "sdmts" },
  { id: "sd-12th-imperial", name: "12th & Imperial Transit Center", lat: 32.7061, lng: -117.1544, route_ids: ["sdmts-blue", "sdmts-orange", "sdmts-green", "sdmts-silver", "mts-rapid-225"], agency_id: "sdmts" },
  { id: "sd-barrio-logan", name: "Barrio Logan", lat: 32.6996, lng: -117.1434, route_ids: ["sdmts-blue", "mts-rapid-225"], agency_id: "sdmts" },
  { id: "sd-harborside", name: "Harborside", lat: 32.6905, lng: -117.1360, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-pacific-fleet", name: "Pacific Fleet", lat: 32.6831, lng: -117.1252, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-24th-st", name: "24th Street", lat: 32.6758, lng: -117.1130, route_ids: ["sdmts-blue", "sdmts-silver"], agency_id: "sdmts" },
  { id: "sd-bayfront-e-st", name: "Bayfront/E Street", lat: 32.6600, lng: -117.1049, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-h-st", name: "H Street", lat: 32.6477, lng: -117.0990, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-palomar-st", name: "Palomar Street", lat: 32.6303, lng: -117.0915, route_ids: ["sdmts-blue", "sdmts-silver"], agency_id: "sdmts" },
  { id: "sd-palm-ave", name: "Palm Avenue", lat: 32.6164, lng: -117.0865, route_ids: ["sdmts-blue", "mts-rapid-225"], agency_id: "sdmts" },
  { id: "sd-iris-ave", name: "Iris Avenue", lat: 32.6065, lng: -117.0832, route_ids: ["sdmts-blue", "mts-rapid-225"], agency_id: "sdmts" },
  { id: "sd-beyer-blvd", name: "Beyer Blvd", lat: 32.5772, lng: -117.0617, route_ids: ["sdmts-blue"], agency_id: "sdmts" },
  { id: "sd-san-ysidro", name: "San Ysidro Transit Center", lat: 32.5484, lng: -117.0416, route_ids: ["sdmts-blue"], agency_id: "sdmts" },

  // ── MTS Orange Line Stations ──
  { id: "sd-courthouse", name: "Courthouse", lat: 32.7188, lng: -117.1710, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-santa-fe", name: "Santa Fe Depot", lat: 32.7236, lng: -117.1705, route_ids: ["sdmts-orange", "nctd-coaster", "amtrak-surfliner"], agency_id: "sdmts" },
  { id: "sd-seaport-village", name: "Seaport Village", lat: 32.7098, lng: -117.1685, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-convention-center", name: "Convention Center", lat: 32.7078, lng: -117.1645, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-gaslamp", name: "Gaslamp Quarter", lat: 32.7119, lng: -117.1601, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-park-blvd", name: "Park & Market", lat: 32.7073, lng: -117.1467, route_ids: ["sdmts-orange", "sdmts-green"], agency_id: "sdmts" },
  { id: "sd-city-heights", name: "City Heights", lat: 32.7197, lng: -117.1103, route_ids: ["sdmts-orange", "sdmts-green"], agency_id: "sdmts" },
  { id: "sd-fairmount", name: "Fairmount Avenue", lat: 32.7244, lng: -117.0917, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-47th-st", name: "47th Street", lat: 32.7274, lng: -117.0850, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-euclid", name: "Euclid Avenue", lat: 32.7300, lng: -117.0678, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-encanto", name: "Encanto/62nd Street", lat: 32.7181, lng: -117.0481, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-lemon-grove", name: "Lemon Grove Depot", lat: 32.7219, lng: -117.0325, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-massachusetts", name: "Massachusetts Avenue", lat: 32.7233, lng: -117.0252, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-grossmont", name: "Grossmont Transit Center", lat: 32.7503, lng: -117.0091, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-la-mesa", name: "La Mesa Blvd", lat: 32.7658, lng: -117.0222, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-amaya", name: "Amaya Drive", lat: 32.7840, lng: -116.9960, route_ids: ["sdmts-orange"], agency_id: "sdmts" },
  { id: "sd-el-cajon", name: "El Cajon Transit Center", lat: 32.7945, lng: -116.9621, route_ids: ["sdmts-orange"], agency_id: "sdmts" },

  // ── MTS Green Line Stations (not shared) ──
  { id: "sd-sdsu", name: "SDSU Transit Center", lat: 32.7743, lng: -117.0770, route_ids: ["sdmts-green", "sdmts-copper", "mts-rapid-215", "mts-rapid-235"], agency_id: "sdmts" },
  { id: "sd-grantville", name: "Grantville", lat: 32.7631, lng: -117.0970, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-mission-san-diego", name: "Mission San Diego", lat: 32.7832, lng: -117.1045, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-qualcomm", name: "Snapdragon Stadium", lat: 32.7843, lng: -117.1200, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-navajo", name: "Navajo", lat: 32.7893, lng: -117.0670, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-rio-vista", name: "Rio Vista", lat: 32.8038, lng: -117.0470, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-mission-gorge", name: "Mission Gorge", lat: 32.8115, lng: -117.0307, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-gillespie", name: "Gillespie Field", lat: 32.8189, lng: -116.9929, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-arnele", name: "Arnele Avenue", lat: 32.8302, lng: -116.9790, route_ids: ["sdmts-green"], agency_id: "sdmts" },
  { id: "sd-santee", name: "Santee Town Center", lat: 32.8383, lng: -116.9735, route_ids: ["sdmts-green"], agency_id: "sdmts" },

  // ── MTS Copper Line Stations ──
  { id: "sd-utc", name: "UTC Transit Center", lat: 32.8720, lng: -117.2214, route_ids: ["sdmts-copper", "mts-rapid-235"], agency_id: "sdmts" },
  { id: "sd-executive-dr", name: "Executive Drive", lat: 32.8680, lng: -117.2192, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-nobel-dr", name: "Nobel Drive", lat: 32.8614, lng: -117.2163, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-va-medical", name: "VA Medical Center", lat: 32.8543, lng: -117.2108, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-ucsd-central", name: "UC San Diego Central", lat: 32.8801, lng: -117.2340, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-ucsd-health", name: "UC San Diego Health", lat: 32.8750, lng: -117.2350, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-tecolote", name: "Tecolote Road", lat: 32.8410, lng: -117.2070, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-clairemont-mesa", name: "Clairemont Mesa", lat: 32.8337, lng: -117.2000, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-balboa-ave", name: "Balboa Avenue", lat: 32.8232, lng: -117.1880, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-old-town", name: "Old Town Transit Center", lat: 32.7546, lng: -117.1970, route_ids: ["sdmts-copper", "nctd-coaster", "amtrak-surfliner", "mts-rapid-235"], agency_id: "sdmts" },
  { id: "sd-washington-st", name: "Washington Street", lat: 32.7480, lng: -117.1930, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-fashion-valley", name: "Fashion Valley Transit Center", lat: 32.7669, lng: -117.1680, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-hazard-center", name: "Hazard Center", lat: 32.7710, lng: -117.1590, route_ids: ["sdmts-copper"], agency_id: "sdmts" },
  { id: "sd-mission-valley", name: "Mission Valley Center", lat: 32.7755, lng: -117.1440, route_ids: ["sdmts-copper"], agency_id: "sdmts" },

  // ── MTS Silver / BRT Stations ──
  { id: "sd-otay-ranch", name: "Otay Ranch Town Center", lat: 32.6092, lng: -116.9382, route_ids: ["sdmts-silver"], agency_id: "mts-bus" },
  { id: "sd-otay-mesa", name: "Otay Mesa Transit Center", lat: 32.5550, lng: -117.0350, route_ids: ["sdmts-silver", "mts-rapid-225"], agency_id: "mts-bus" },
  { id: "sd-national-city", name: "National City", lat: 32.6700, lng: -117.1000, route_ids: ["mts-rapid-225"], agency_id: "mts-bus" },
  { id: "sd-downtown-bus", name: "Downtown San Diego Bus Hub", lat: 32.7170, lng: -117.1650, route_ids: ["mts-rapid-215", "mts-rapid-225"], agency_id: "mts-bus" },

  // ── MTS Rapid 215 / 235 Bus Stops ──
  { id: "sd-el-cajon-bl-70th", name: "El Cajon Blvd & 70th", lat: 32.7588, lng: -117.0880, route_ids: ["mts-rapid-215"], agency_id: "mts-bus" },
  { id: "sd-el-cajon-bl-park", name: "El Cajon Blvd & Park", lat: 32.7550, lng: -117.1218, route_ids: ["mts-rapid-215"], agency_id: "mts-bus" },
  { id: "sd-university-heights", name: "University Heights", lat: 32.7514, lng: -117.1342, route_ids: ["mts-rapid-215", "mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-hillcrest", name: "Hillcrest", lat: 32.7488, lng: -117.1624, route_ids: ["mts-rapid-215", "mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-college-area", name: "College Area", lat: 32.7650, lng: -117.0750, route_ids: ["mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-kensington", name: "Kensington", lat: 32.7600, lng: -117.1018, route_ids: ["mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-normal-heights", name: "Normal Heights", lat: 32.7655, lng: -117.1170, route_ids: ["mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-north-park", name: "North Park", lat: 32.7460, lng: -117.1300, route_ids: ["mts-rapid-235"], agency_id: "mts-bus" },
  { id: "sd-clairemont", name: "Clairemont", lat: 32.8100, lng: -117.2050, route_ids: ["mts-rapid-235"], agency_id: "mts-bus" },

  // ── NCTD Sprinter Stations ──
  { id: "nctd-oceanside-transit", name: "Oceanside Transit Center", lat: 33.1950, lng: -117.3792, route_ids: ["nctd-sprinter", "nctd-coaster", "amtrak-surfliner"], agency_id: "nctd" },
  { id: "nctd-coast-hwy", name: "Coast Highway", lat: 33.1943, lng: -117.3614, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-crouch-st", name: "Crouch Street", lat: 33.1901, lng: -117.3349, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-el-camino-real", name: "El Camino Real", lat: 33.1817, lng: -117.3107, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-melrose", name: "Melrose Drive", lat: 33.1749, lng: -117.2961, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-vista", name: "Vista Transit Center", lat: 33.2024, lng: -117.2460, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-civic-center-vista", name: "Civic Center Vista", lat: 33.1968, lng: -117.2365, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-rancho-buena-vista", name: "Rancho Buena Vista", lat: 33.1860, lng: -117.2157, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-palomar-college", name: "Palomar College", lat: 33.1517, lng: -117.1718, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-san-marcos-civic", name: "San Marcos Civic Center", lat: 33.1356, lng: -117.1503, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-csusm", name: "Cal State San Marcos", lat: 33.1300, lng: -117.1361, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-nordahl", name: "Nordahl Road", lat: 33.1264, lng: -117.1134, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-westfield-north", name: "Westfield North County", lat: 33.1245, lng: -117.0817, route_ids: ["nctd-sprinter"], agency_id: "nctd" },
  { id: "nctd-escondido-transit", name: "Escondido Transit Center", lat: 33.1204, lng: -117.0836, route_ids: ["nctd-sprinter"], agency_id: "nctd" },

  // ── NCTD Coaster Stations ──
  { id: "nctd-carlsbad-village", name: "Carlsbad Village", lat: 33.1616, lng: -117.3498, route_ids: ["nctd-coaster"], agency_id: "nctd" },
  { id: "nctd-carlsbad-poinsettia", name: "Carlsbad Poinsettia", lat: 33.1311, lng: -117.3423, route_ids: ["nctd-coaster"], agency_id: "nctd" },
  { id: "nctd-encinitas", name: "Encinitas", lat: 33.0447, lng: -117.2919, route_ids: ["nctd-coaster"], agency_id: "nctd" },
  { id: "nctd-solana-beach", name: "Solana Beach", lat: 32.9878, lng: -117.2721, route_ids: ["nctd-coaster", "amtrak-surfliner"], agency_id: "nctd" },
  { id: "nctd-sorrento-valley", name: "Sorrento Valley", lat: 32.8985, lng: -117.2341, route_ids: ["nctd-coaster"], agency_id: "nctd" },

  // ── Amtrak Pacific Surfliner stops (not shared above) ──
  { id: "amtrak-san-clemente", name: "San Clemente Pier", lat: 33.4271, lng: -117.6188, route_ids: ["amtrak-surfliner"], agency_id: "amtrak" },
  { id: "amtrak-san-juan", name: "San Juan Capistrano", lat: 33.4965, lng: -117.6620, route_ids: ["amtrak-surfliner"], agency_id: "amtrak" },
  { id: "amtrak-irvine", name: "Irvine", lat: 33.6862, lng: -117.7676, route_ids: ["amtrak-surfliner"], agency_id: "amtrak" },
  { id: "amtrak-fullerton", name: "Fullerton", lat: 33.8703, lng: -117.9254, route_ids: ["amtrak-surfliner"], agency_id: "amtrak" },
  { id: "amtrak-la-union", name: "LA Union Station", lat: 34.0560, lng: -118.2342, route_ids: ["amtrak-surfliner"], agency_id: "amtrak" },
];

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
