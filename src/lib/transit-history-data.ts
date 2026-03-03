/**
 * Transit history, funding, and "new line" data for San Diego transit routes.
 * Used by the Explore page, route detail pages, and NEW badge system.
 */

export interface TransitLineInfo {
  routeId: string;
  openedDate: string;       // ISO date or year, e.g. "2024-09-21" or "1972"
  isNew: boolean;           // Opened within ~3 years (show NEW badge)
  fundingSource?: string;   // e.g. "TransNet", "FTA Capital Investment"
  fundingAmount?: string;   // e.g. "$2.1B"
  history: string;          // 1-2 sentence history
  notableFeatures: string[];
}

const transitHistory: TransitLineInfo[] = [
  // ── MTS Trolley ──
  {
    routeId: "sdmts-blue",
    openedDate: "1981-07-26",
    isNew: false,
    history: "San Diego's first trolley line and the first modern light rail system in California. Connects downtown to the US-Mexico border at San Ysidro, the busiest land border crossing in the Western Hemisphere.",
    notableFeatures: ["First modern light rail in California", "US-Mexico border connection", "17 stations"],
  },
  {
    routeId: "sdmts-orange",
    openedDate: "1986-03-23",
    isNew: false,
    history: "The Orange Line extended trolley service east from the Convention Center and Gaslamp Quarter through downtown to El Cajon in the eastern suburbs, serving communities along the I-8 corridor.",
    notableFeatures: ["Convention Center access", "Gaslamp Quarter", "El Cajon Valley service"],
  },
  {
    routeId: "sdmts-green",
    openedDate: "2005-07-10",
    isNew: false,
    history: "The Green Line expanded San Diego trolley service to Mission Valley and the SDSU campus, with the Mission Valley extension connecting Qualcomm Stadium (now Snapdragon) and eastern communities to Santee.",
    notableFeatures: ["SDSU campus station", "Snapdragon Stadium", "Mission Valley corridor", "Santee extension"],
  },
  {
    routeId: "sdmts-copper",
    openedDate: "2024-09-14",
    isNew: true,
    fundingSource: "TransNet sales tax + FTA Capital Investment Grant",
    fundingAmount: "$2.17B",
    history: "San Diego's newest trolley line opened in September 2024, connecting UC San Diego and the VA Medical Center to the existing trolley network via a mid-coast corridor through UTC and Old Town.",
    notableFeatures: ["UC San Diego campus access", "VA Medical Center", "Mid-Coast corridor", "Newest trolley line in California"],
  },
  {
    routeId: "sdmts-silver",
    openedDate: "2025-01-15",
    isNew: true,
    fundingSource: "TransNet + South Bay Community Benefits",
    fundingAmount: "$180M",
    history: "The Silver Line is San Diego's first bus rapid transit corridor, providing high-frequency express service from the growing South Bay communities of Otay Ranch and Otay Mesa to downtown San Diego.",
    notableFeatures: ["First BRT in San Diego", "South Bay express", "Otay Ranch connection", "Signal priority technology"],
  },
  // ── NCTD ──
  {
    routeId: "nctd-sprinter",
    openedDate: "2008-03-09",
    isNew: false,
    history: "The Sprinter is a hybrid rail line connecting Oceanside to Escondido through inland North County San Diego communities, providing east-west service complementing the coastal Coaster line.",
    notableFeatures: ["East-west corridor", "Hybrid rail vehicles", "Cal State San Marcos access", "Palomar College connection"],
  },
  {
    routeId: "nctd-coaster",
    openedDate: "1995-02-27",
    isNew: false,
    history: "The Coaster commuter rail runs along the scenic Pacific coast from Oceanside to San Diego's Santa Fe Depot, offering stunning ocean views and serving North County beach communities.",
    notableFeatures: ["Pacific Ocean coastal views", "Historic Santa Fe Depot", "Beach community access", "Amtrak connections"],
  },
  // ── Amtrak ──
  {
    routeId: "amtrak-surfliner",
    openedDate: "2000-03-27",
    isNew: false,
    fundingSource: "Caltrans / LOSSAN Joint Powers Authority",
    fundingAmount: "$260M (fleet renewal)",
    history: "The Pacific Surfliner is the second-busiest Amtrak route in the US, carrying over 3 million riders annually along 351 miles of Southern California coast from San Diego to San Luis Obispo via Los Angeles.",
    notableFeatures: ["Second-busiest Amtrak route", "351-mile coastal corridor", "Ocean-view seating", "San Diego to LA in 2h45m"],
  },
  // ── MTS Rapid Bus ──
  {
    routeId: "mts-rapid-215",
    openedDate: "2014-06-08",
    isNew: false,
    history: "Rapid 215 provides high-frequency service along the Mid-City corridor from SDSU to downtown San Diego, connecting the college area through University Heights and Hillcrest to the city center.",
    notableFeatures: ["10-minute frequency", "Mid-City corridor", "SDSU to Downtown", "Hillcrest service"],
  },
  {
    routeId: "mts-rapid-235",
    openedDate: "2017-09-10",
    isNew: false,
    history: "Rapid 235 connects SDSU to UTC via a diagonal route through San Diego's most walkable urban neighborhoods — Kensington, Normal Heights, North Park, Hillcrest, and Old Town.",
    notableFeatures: ["Urban neighborhood connector", "North Park service", "Old Town to SDSU", "Frequent service"],
  },
  {
    routeId: "mts-rapid-225",
    openedDate: "2019-11-03",
    isNew: false,
    history: "Rapid 225 provides express service from the Otay Mesa border region through National City and Barrio Logan to downtown San Diego, serving the rapidly growing South Bay communities.",
    notableFeatures: ["South Bay express", "Otay Mesa border connection", "Barrio Logan service", "National City access"],
  },
];

// ── Lookup helpers ──

const transitInfoMap = new Map(transitHistory.map((t) => [t.routeId, t]));

export function getTransitInfo(routeId: string): TransitLineInfo | null {
  return transitInfoMap.get(routeId) ?? null;
}

export function getNewLines(): TransitLineInfo[] {
  return transitHistory.filter((t) => t.isNew);
}

export function getAllTransitHistory(): TransitLineInfo[] {
  return transitHistory;
}
