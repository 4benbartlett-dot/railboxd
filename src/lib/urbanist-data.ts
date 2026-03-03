/**
 * Curated urbanist landmarks in San Diego County.
 * Bridges, trails, dense housing, mixed-use developments, parks, plazas, and bike infrastructure.
 */

export type LandmarkType =
  | "bridge"
  | "walking-path"
  | "hike"
  | "mixed-use"
  | "dense-housing"
  | "bike-path"
  | "park"
  | "plaza";

export interface UrbanistLandmark {
  id: string;
  name: string;
  type: LandmarkType;
  description: string;
  nearbyStationIds: string[];
  photoQuery: string;        // Google Places search query for photos
  lat: number;
  lng: number;
  yearCompleted?: number;
  funFact?: string;
}

export const LANDMARK_TYPE_LABELS: Record<LandmarkType, string> = {
  "bridge": "Bridge",
  "walking-path": "Walking Path",
  "hike": "Hike",
  "mixed-use": "Mixed Use",
  "dense-housing": "Dense Housing",
  "bike-path": "Bike Path",
  "park": "Park",
  "plaza": "Plaza",
};

export const LANDMARK_TYPE_COLORS: Record<LandmarkType, string> = {
  "bridge": "#e54065",
  "walking-path": "#40bcf4",
  "hike": "#2d8659",
  "mixed-use": "#f4a940",
  "dense-housing": "#9b59b6",
  "bike-path": "#00e054",
  "park": "#27ae60",
  "plaza": "#e67e22",
};

const landmarks: UrbanistLandmark[] = [
  // ── Parks ──
  {
    id: "balboa-park",
    name: "Balboa Park",
    type: "park",
    description: "A 1,200-acre urban cultural park with 17 museums, gardens, trails, and the San Diego Zoo. One of the greatest urban parks in America.",
    nearbyStationIds: ["sd-city-college", "sd-park-blvd"],
    photoQuery: "Balboa Park San Diego botanical building",
    lat: 32.7341,
    lng: -117.1446,
    yearCompleted: 1915,
    funFact: "Balboa Park hosted two world's fairs (1915 and 1935) and most of its landmark buildings were originally built as temporary exhibition halls.",
  },
  {
    id: "chicano-park",
    name: "Chicano Park",
    type: "park",
    description: "Home to the world's largest collection of outdoor murals beneath the Coronado Bridge on-ramps. A vibrant cultural landmark and community gathering space.",
    nearbyStationIds: ["sd-barrio-logan"],
    photoQuery: "Chicano Park murals Barrio Logan San Diego",
    lat: 32.6996,
    lng: -117.1434,
    yearCompleted: 1970,
    funFact: "Chicano Park was created in 1970 when community members occupied the land under the freeway to prevent a highway patrol station from being built.",
  },
  {
    id: "waterfront-park",
    name: "County Waterfront Park",
    type: "park",
    description: "A 12-acre waterfront park in downtown San Diego with a spectacular interactive fountain, playground, and sweeping views of San Diego Bay and the Coronado Bridge.",
    nearbyStationIds: ["sd-county-center", "sd-santa-fe"],
    photoQuery: "Waterfront Park San Diego fountain",
    lat: 32.7210,
    lng: -117.1725,
    yearCompleted: 2014,
    funFact: "The park replaced a parking lot and county building, and its fountain contains 31 jets that shoot water up to 14 feet high.",
  },
  {
    id: "mission-bay-park",
    name: "Mission Bay Park",
    type: "park",
    description: "The largest man-made aquatic park in the US at 4,235 acres, with 27 miles of shoreline for kayaking, sailing, cycling, and walking.",
    nearbyStationIds: ["sd-old-town", "sd-fashion-valley"],
    photoQuery: "Mission Bay Park San Diego",
    lat: 32.7830,
    lng: -117.2310,
    funFact: "Mission Bay was once a tidal marsh called False Bay. The Army Corps of Engineers dredged it into the recreation paradise you see today.",
  },
  {
    id: "civita-park",
    name: "Civita Park",
    type: "park",
    description: "A stunning 14-acre park built on a former quarry in Mission Valley, featuring a 2-acre lake, amphitheater, and dramatic terraced landscaping surrounded by new housing.",
    nearbyStationIds: ["sd-fashion-valley", "sd-hazard-center"],
    photoQuery: "Civita Park Mission Valley San Diego",
    lat: 32.7720,
    lng: -117.1750,
    yearCompleted: 2015,
    funFact: "The 230-foot deep quarry pit was transformed into a park lake — turning an industrial scar into the neighborhood's centerpiece.",
  },
  // ── Plazas ──
  {
    id: "gaslamp-quarter",
    name: "Gaslamp Quarter",
    type: "plaza",
    description: "San Diego's vibrant 16-block historic district of Victorian-era commercial buildings, restaurants, and nightlife — steps from the trolley.",
    nearbyStationIds: ["sd-gaslamp", "sd-convention-center"],
    photoQuery: "Gaslamp Quarter San Diego",
    lat: 32.7119,
    lng: -117.1601,
    funFact: "The Gaslamp Quarter was once called 'Stingaree' and was San Diego's red-light district until urban renewal in the 1980s.",
  },
  {
    id: "old-town-state-park",
    name: "Old Town San Diego",
    type: "plaza",
    description: "The birthplace of California — a historic state park with adobe buildings, Mexican restaurants, and museums at the site of the first European settlement on the US West Coast.",
    nearbyStationIds: ["sd-old-town"],
    photoQuery: "Old Town San Diego State Historic Park",
    lat: 32.7548,
    lng: -117.1980,
    yearCompleted: 1769,
    funFact: "The first Spanish mission in Alta California, Mission San Diego de Alcala, was founded here in 1769 by Father Junipero Serra.",
  },
  {
    id: "santa-fe-depot",
    name: "Santa Fe Depot",
    type: "plaza",
    description: "San Diego's stunning 1915 Mission Revival-style train station, a transit hub connecting trolley, Coaster, Amtrak, and bus services. One of the most beautiful stations on the West Coast.",
    nearbyStationIds: ["sd-santa-fe"],
    photoQuery: "Santa Fe Depot San Diego train station",
    lat: 32.7236,
    lng: -117.1705,
    yearCompleted: 1915,
    funFact: "The depot was built for the 1915 Panama-California Exposition and features hand-painted ceiling beams and a tile-roofed tower.",
  },
  {
    id: "liberty-station",
    name: "Liberty Station",
    type: "plaza",
    description: "A 361-acre mixed-use development on the former Naval Training Center, with arts districts, restaurants, parks, and the largest collection of adaptive reuse buildings in San Diego.",
    nearbyStationIds: ["sd-old-town"],
    photoQuery: "Liberty Station San Diego arts district",
    lat: 32.7410,
    lng: -117.2120,
    yearCompleted: 2006,
    funFact: "Over 40,000 Navy recruits trained here during WWII. Today the barracks house artists' studios, craft breweries, and restaurants.",
  },
  // ── Dense Housing / YIMBY Wins ──
  {
    id: "north-park-density",
    name: "North Park Urban Village",
    type: "dense-housing",
    description: "One of San Diego's most walkable neighborhoods, with historic bungalows alongside new mid-rise housing, all centered on a thriving commercial strip on University Avenue and 30th Street.",
    nearbyStationIds: ["sd-north-park", "sd-normal-heights"],
    photoQuery: "North Park San Diego neighborhood",
    lat: 32.7467,
    lng: -117.1300,
    funFact: "North Park's University Avenue has been called 'the best Main Street in San Diego' for its mix of local shops, breweries, and restaurants.",
  },
  {
    id: "east-village-towers",
    name: "East Village Transformation",
    type: "dense-housing",
    description: "Downtown's East Village has exploded with over 5,000 new housing units since 2010, transforming warehouses into one of San Diego's densest and most vibrant neighborhoods.",
    nearbyStationIds: ["sd-gaslamp", "sd-park-blvd", "sd-12th-imperial"],
    photoQuery: "East Village San Diego downtown towers",
    lat: 32.7120,
    lng: -117.1520,
    yearCompleted: 2023,
    funFact: "The IDEA1 building at 15th & Island is one of SD's tallest residential buildings and was a major YIMBY victory for downtown housing advocates.",
  },
  {
    id: "little-italy-renaissance",
    name: "Little Italy",
    type: "dense-housing",
    description: "Once a declining neighborhood along the waterfront, Little Italy has become San Diego's most successful urban renewal story with new mid-rises, the Piazza della Famiglia, and a world-class mercato.",
    nearbyStationIds: ["sd-county-center", "sd-america-plaza"],
    photoQuery: "Little Italy San Diego Piazza della Famiglia",
    lat: 32.7230,
    lng: -117.1690,
    yearCompleted: 2017,
    funFact: "Little Italy's Saturday Mercato farmers market draws 10,000+ visitors weekly and has been named one of the best farmers markets in America.",
  },
  {
    id: "one-paseo",
    name: "One Paseo",
    type: "mixed-use",
    description: "A 23-acre mixed-use village in Carmel Valley near UTC with 608 apartments, shops, restaurants, and a public paseo connecting to the trolley. A YIMBY win after years of debate.",
    nearbyStationIds: ["sd-utc", "sd-executive-dr"],
    photoQuery: "One Paseo Del Mar Carmel Valley San Diego",
    lat: 32.9510,
    lng: -117.2370,
    yearCompleted: 2020,
    funFact: "One Paseo was approved after one of San Diego's most contentious land use fights — YIMBY advocates rallied to support dense, transit-adjacent development.",
  },
  {
    id: "millenia",
    name: "Millenia",
    type: "mixed-use",
    description: "A 210-acre master-planned community in Chula Vista with 3,000+ homes, shops, parks, and a town center — one of the largest new urbanist developments in South Bay.",
    nearbyStationIds: ["sd-otay-ranch", "sd-palomar-st"],
    photoQuery: "Millenia Chula Vista San Diego development",
    lat: 32.6240,
    lng: -116.9620,
    yearCompleted: 2021,
    funFact: "Millenia includes over 85 acres of parks and open space, with a 5-acre central park designed to be the community's living room.",
  },
  {
    id: "civita-village",
    name: "Civita Village",
    type: "dense-housing",
    description: "A 230-acre transit-oriented community built in a former sand quarry in Mission Valley, with 4,780 homes, a park, and direct access to the trolley and Fashion Valley Transit Center.",
    nearbyStationIds: ["sd-fashion-valley", "sd-hazard-center"],
    photoQuery: "Civita Mission Valley San Diego housing",
    lat: 32.7710,
    lng: -117.1730,
    yearCompleted: 2019,
    funFact: "Civita turned a 230-foot deep quarry into a walkable neighborhood. The development reclaimed over 9 million cubic yards of sand mine.",
  },
  // ── Bridges ──
  {
    id: "coronado-bridge",
    name: "San Diego-Coronado Bridge",
    type: "bridge",
    description: "An iconic 2.12-mile curved bridge arcing 200 feet over San Diego Bay, connecting downtown to the Coronado peninsula. One of the most photographed structures in California.",
    nearbyStationIds: ["sd-barrio-logan", "sd-12th-imperial"],
    photoQuery: "Coronado Bridge San Diego",
    lat: 32.6920,
    lng: -117.1530,
    yearCompleted: 1969,
    funFact: "The bridge's unique curved design was required so Navy aircraft carriers could pass underneath. It also prevents a steep grade on the Coronado side.",
  },
  {
    id: "harbor-drive-bridge",
    name: "Harbor Drive Pedestrian Bridge",
    type: "bridge",
    description: "A striking self-anchored suspension pedestrian bridge connecting the Convention Center to Petco Park and the East Village, with a dramatic curved design over Harbor Drive.",
    nearbyStationIds: ["sd-convention-center", "sd-gaslamp"],
    photoQuery: "Harbor Drive Pedestrian Bridge San Diego",
    lat: 32.7080,
    lng: -117.1585,
    yearCompleted: 2011,
    funFact: "The 500-foot bridge was the first self-anchored suspension pedestrian bridge in the US, designed to evoke the curves of a stingray.",
  },
  // ── Bike Paths ──
  {
    id: "bayshore-bikeway",
    name: "Bayshore Bikeway",
    type: "bike-path",
    description: "A 24-mile scenic bike loop around San Diego Bay, connecting Coronado, Imperial Beach, and downtown via dedicated cycling infrastructure with bay views the entire way.",
    nearbyStationIds: ["sd-12th-imperial", "sd-barrio-logan", "sd-24th-st"],
    photoQuery: "Bayshore Bikeway San Diego Bay",
    lat: 32.6814,
    lng: -117.1240,
    funFact: "The Bayshore Bikeway crosses the Coronado Bridge approach on a separated path with views across the entire San Diego Bay.",
  },
  {
    id: "san-diego-river-trail",
    name: "San Diego River Trail",
    type: "bike-path",
    description: "A growing multi-use trail along the San Diego River from Ocean Beach through Mission Valley to Santee, paralleling the Green Line trolley for much of its length.",
    nearbyStationIds: ["sd-fashion-valley", "sd-qualcomm", "sd-grantville", "sd-mission-gorge"],
    photoQuery: "San Diego River Trail bike path Mission Valley",
    lat: 32.7700,
    lng: -117.1400,
    funFact: "When complete, the trail will stretch 52 miles from the ocean to the mountains, making it one of the longest urban river trails in California.",
  },
  {
    id: "coastal-rail-trail",
    name: "Coastal Rail Trail",
    type: "bike-path",
    description: "A paved multi-use trail paralleling the Coaster rail corridor through North County beach communities from Oceanside to Solana Beach, with stunning ocean views.",
    nearbyStationIds: ["nctd-oceanside-transit", "nctd-carlsbad-village", "nctd-encinitas", "nctd-solana-beach"],
    photoQuery: "Coastal Rail Trail Encinitas San Diego",
    lat: 33.0400,
    lng: -117.2900,
    funFact: "The trail runs right along the bluffs above the Pacific in several sections, making it one of the most scenic bike paths in Southern California.",
  },
  // ── Walking Paths ──
  {
    id: "ucsd-campus-walk",
    name: "UC San Diego Campus",
    type: "walking-path",
    description: "The stunning UCSD campus with its collection of public art, eucalyptus groves, and ocean-view architecture — now directly served by the Copper Line trolley.",
    nearbyStationIds: ["sd-ucsd-central", "sd-ucsd-health"],
    photoQuery: "UC San Diego campus Geisel Library",
    lat: 32.8801,
    lng: -117.2340,
    funFact: "UCSD's Geisel Library looks like a spaceship and was named after Dr. Seuss, who lived in nearby La Jolla.",
  },
  {
    id: "embarcadero",
    name: "San Diego Embarcadero",
    type: "walking-path",
    description: "A 3-mile waterfront promenade from the Maritime Museum through Seaport Village to the Convention Center, with views of the bay, Coronado Bridge, and Navy ships.",
    nearbyStationIds: ["sd-santa-fe", "sd-seaport-village", "sd-convention-center"],
    photoQuery: "San Diego Embarcadero waterfront promenade",
    lat: 32.7190,
    lng: -117.1730,
    funFact: "The USS Midway aircraft carrier museum permanently moored at the Embarcadero is the most-visited naval ship museum in the world.",
  },
  {
    id: "pacific-beach-boardwalk",
    name: "Pacific Beach Boardwalk",
    type: "walking-path",
    description: "A classic 3.5-mile beachfront boardwalk from South Mission Beach to Crystal Pier in Pacific Beach, buzzing with runners, cyclists, and surfers.",
    nearbyStationIds: ["sd-old-town"],
    photoQuery: "Pacific Beach Boardwalk San Diego",
    lat: 32.7920,
    lng: -117.2560,
    funFact: "Crystal Pier is one of the few piers in the world with a hotel on it — you can sleep literally over the breaking waves.",
  },
  // ── Hikes ──
  {
    id: "torrey-pines",
    name: "Torrey Pines State Reserve",
    type: "hike",
    description: "An 1,750-acre coastal state reserve with dramatic sandstone cliffs, rare Torrey pine trees, and panoramic ocean views. One of the wildest stretches of coastline in San Diego County.",
    nearbyStationIds: ["sd-utc", "nctd-sorrento-valley"],
    photoQuery: "Torrey Pines State Reserve San Diego cliffs",
    lat: 32.9200,
    lng: -117.2530,
    funFact: "The Torrey pine is the rarest pine tree in the United States — it grows naturally only here and on Santa Rosa Island.",
  },
  {
    id: "cowles-mountain",
    name: "Cowles Mountain",
    type: "hike",
    description: "San Diego's highest point within city limits at 1,593 feet, offering 360-degree views of the city, bay, and mountains. The most-hiked peak in San Diego.",
    nearbyStationIds: ["sd-sdsu", "sd-grantville"],
    photoQuery: "Cowles Mountain trail San Diego",
    lat: 32.8108,
    lng: -117.0310,
    funFact: "Cowles Mountain is the most summited peak in San Diego, with an estimated 60,000 hikers per month during peak season.",
  },
  {
    id: "iron-mountain",
    name: "Iron Mountain Trail",
    type: "hike",
    description: "A popular 5.8-mile out-and-back trail near Poway with sweeping views of North County from the 2,696-foot summit. Accessible from the Sprinter corridor.",
    nearbyStationIds: ["nctd-escondido-transit"],
    photoQuery: "Iron Mountain Trail Poway San Diego",
    lat: 33.0065,
    lng: -116.9712,
    funFact: "Iron Mountain was named for the iron ore deposits found in its slopes during the late 1800s mining boom.",
  },
  // ── Mixed-Use ──
  {
    id: "quartyard",
    name: "Quartyard",
    type: "mixed-use",
    description: "An innovative shipping container village in East Village with restaurants, a beer garden, event space, and dog park — built as a temporary activation that became permanent.",
    nearbyStationIds: ["sd-park-blvd", "sd-12th-imperial"],
    photoQuery: "Quartyard East Village San Diego shipping containers",
    lat: 32.7130,
    lng: -117.1500,
    yearCompleted: 2015,
    funFact: "Quartyard started as a temporary pop-up on a vacant lot and proved so popular it became a permanent fixture of East Village.",
  },
  {
    id: "piazza-della-famiglia",
    name: "Piazza della Famiglia",
    type: "mixed-use",
    description: "Little Italy's European-style public piazza, anchored by a 96-foot Italian cypress and surrounded by new mixed-use buildings with ground-floor restaurants and upper-floor housing.",
    nearbyStationIds: ["sd-county-center"],
    photoQuery: "Piazza della Famiglia Little Italy San Diego",
    lat: 32.7225,
    lng: -117.1685,
    yearCompleted: 2017,
    funFact: "The piazza's centerpiece Italian stone pine tree was trucked in from a nursery in Arizona and is lit with 2,000 LED lights every holiday season.",
  },
];

// ── Lookup helpers ──

const landmarkMap = new Map(landmarks.map((l) => [l.id, l]));

export function getLandmarkById(id: string): UrbanistLandmark | null {
  return landmarkMap.get(id) ?? null;
}

export function getLandmarksNearStation(stationId: string): UrbanistLandmark[] {
  return landmarks.filter((l) => l.nearbyStationIds.includes(stationId));
}

export function getLandmarksByType(type: LandmarkType): UrbanistLandmark[] {
  return landmarks.filter((l) => l.type === type);
}

export function getAllLandmarks(): UrbanistLandmark[] {
  return landmarks;
}

export function getLandmarkTypes(): LandmarkType[] {
  return [...new Set(landmarks.map((l) => l.type))];
}
