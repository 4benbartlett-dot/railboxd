// NorCal transit data — BART Green/Orange, Caltrain, Muni Metro, VTA, SMART, ACE
// Supplements demo-data.ts which already defines BART Yellow/Red/Blue lines + stations
//
// Existing BART station IDs (defined in demo-data.ts, NOT redefined here):
//   bart-macarthur, bart-19th-oak, bart-12th-oak, bart-west-oak,
//   bart-embarcadero, bart-montgomery, bart-powell, bart-civic-center,
//   bart-16th-mission, bart-24th-mission, bart-glen-park, bart-balboa,
//   bart-daly-city, bart-richmond, bart-el-cerrito-norte, bart-el-cerrito-plaza,
//   bart-north-berkeley, bart-downtown-berkeley, bart-ashby,
//   bart-bay-fair, bart-san-leandro, bart-coliseum, bart-lake-merritt,
//   bart-fruitvale, bart-millbrae

// ===================== ROUTES =====================

export const norcalRoutes = [
  // ── BART Green Line (Berryessa – Daly City) ──
  {
    id: "bart-green",
    short_name: "Green",
    long_name: "Berryessa – Daly City",
    route_type: 1,
    route_color: "#4DB848",
    agency_id: "bart",
    station_ids: [
      "bart-berryessa",
      "bart-milpitas",
      "bart-warm-springs",
      "bart-fremont",
      "bart-union-city",
      "bart-south-hayward",
      "bart-hayward",
      "bart-bay-fair",       // existing
      "bart-san-leandro",   // existing
      "bart-coliseum",      // existing
      "bart-lake-merritt",  // existing
      "bart-12th-oak",      // existing
      "bart-west-oak",      // existing
      "bart-embarcadero",   // existing
      "bart-montgomery",    // existing
      "bart-powell",        // existing
      "bart-civic-center",  // existing
      "bart-16th-mission",  // existing
      "bart-24th-mission",  // existing
      "bart-glen-park",     // existing
      "bart-balboa",        // existing
      "bart-daly-city",     // existing
    ],
    coordinates: [
      [-121.8747, 37.3690], // Berryessa
      [-121.8910, 37.4104], // Milpitas
      [-121.9395, 37.5028], // Warm Springs
      [-121.9764, 37.5574], // Fremont
      [-122.0175, 37.5910], // Union City
      [-122.0575, 37.6348], // South Hayward
      [-122.0870, 37.6707], // Hayward
      [-122.1270, 37.6993], // Bay Fair
      [-122.1604, 37.7027], // San Leandro
      [-122.1982, 37.7540], // Coliseum
      [-122.2651, 37.7978], // Lake Merritt
      [-122.2716, 37.8036], // 12th St Oakland
      [-122.2947, 37.8046], // West Oakland
      [-122.3966, 37.7928], // Embarcadero
      [-122.4012, 37.7886], // Montgomery
      [-122.4079, 37.7844], // Powell
      [-122.4140, 37.7796], // Civic Center
      [-122.4193, 37.7651], // 16th Mission
      [-122.4183, 37.7522], // 24th Mission
      [-122.4337, 37.7329], // Glen Park
      [-122.4477, 37.7218], // Balboa Park
      [-122.4688, 37.7062], // Daly City
    ] as [number, number][],
  },

  // ── BART Orange Line (Richmond – Berryessa) ──
  {
    id: "bart-orange",
    short_name: "Orange",
    long_name: "Richmond – Berryessa",
    route_type: 1,
    route_color: "#F58220",
    agency_id: "bart",
    station_ids: [
      "bart-richmond",           // existing
      "bart-el-cerrito-norte",   // existing
      "bart-el-cerrito-plaza",   // existing
      "bart-north-berkeley",     // existing
      "bart-downtown-berkeley",  // existing
      "bart-ashby",              // existing
      "bart-macarthur",          // existing
      "bart-19th-oak",           // existing
      "bart-12th-oak",           // existing
      "bart-lake-merritt",       // existing
      "bart-fruitvale",          // existing
      "bart-coliseum",           // existing
      "bart-san-leandro",        // existing
      "bart-bay-fair",           // existing
      "bart-hayward",
      "bart-south-hayward",
      "bart-union-city",
      "bart-fremont",
      "bart-warm-springs",
      "bart-milpitas",
      "bart-berryessa",
    ],
    coordinates: [
      [-122.3532, 37.9372], // Richmond
      [-122.3173, 37.9254], // El Cerrito del Norte
      [-122.2990, 37.9017], // El Cerrito Plaza
      [-122.2832, 37.8744], // North Berkeley
      [-122.2679, 37.8697], // Downtown Berkeley
      [-122.2699, 37.8529], // Ashby
      [-122.2672, 37.8287], // MacArthur
      [-122.2681, 37.8082], // 19th St Oakland
      [-122.2716, 37.8036], // 12th St Oakland
      [-122.2651, 37.7978], // Lake Merritt
      [-122.2242, 37.7748], // Fruitvale
      [-122.1982, 37.7540], // Coliseum
      [-122.1604, 37.7027], // San Leandro
      [-122.1270, 37.6993], // Bay Fair
      [-122.0870, 37.6707], // Hayward
      [-122.0575, 37.6348], // South Hayward
      [-122.0175, 37.5910], // Union City
      [-121.9764, 37.5574], // Fremont
      [-121.9395, 37.5028], // Warm Springs
      [-121.8910, 37.4104], // Milpitas
      [-121.8747, 37.3690], // Berryessa
    ] as [number, number][],
  },

  // ── Caltrain Local (San Francisco – San Jose) ──
  {
    id: "caltrain-local",
    short_name: "CT",
    long_name: "San Francisco – San Jose",
    route_type: 2,
    route_color: "#E31837",
    agency_id: "caltrain",
    station_ids: [
      "ct-sf-4th-king",
      "ct-22nd-street",
      "ct-bayshore",
      "ct-south-sf",
      "ct-san-bruno",
      "ct-millbrae",
      "ct-burlingame",
      "ct-san-mateo",
      "ct-belmont",
      "ct-san-carlos",
      "ct-redwood-city",
      "ct-menlo-park",
      "ct-palo-alto",
      "ct-mountain-view",
      "ct-sunnyvale",
      "ct-santa-clara",
      "ct-san-jose-diridon",
    ],
    coordinates: [
      [-122.3942, 37.7764], // SF 4th & King
      [-122.3925, 37.7577], // 22nd Street
      [-122.4014, 37.7094], // Bayshore
      [-122.4050, 37.6559], // South SF
      [-122.4119, 37.6316], // San Bruno
      [-122.3866, 37.5996], // Millbrae
      [-122.3450, 37.5795], // Burlingame
      [-122.3234, 37.5677], // San Mateo
      [-122.2767, 37.5210], // Belmont
      [-122.2618, 37.5076], // San Carlos
      [-122.2320, 37.4857], // Redwood City
      [-122.1822, 37.4548], // Menlo Park
      [-122.1650, 37.4437], // Palo Alto
      [-122.0766, 37.3944], // Mountain View
      [-122.0311, 37.3785], // Sunnyvale
      [-121.9368, 37.3532], // Santa Clara
      [-121.9030, 37.3297], // San Jose Diridon
    ] as [number, number][],
  },

  // ── Muni Metro N Judah ──
  {
    id: "muni-n",
    short_name: "N",
    long_name: "N Judah",
    route_type: 0,
    route_color: "#003DA5",
    agency_id: "muni",
    station_ids: [
      "muni-caltrain-4th-king",
      "muni-embarcadero",
      "muni-montgomery",
      "muni-powell",
      "muni-civic-center",
      "muni-van-ness",
      "muni-church",
      "muni-duboce-church",
      "muni-carl-cole",
      "muni-irving-9th",
      "muni-judah-19th",
      "muni-ocean-beach",
    ],
    coordinates: [
      [-122.3942, 37.7764], // Caltrain/4th & King
      [-122.3961, 37.7932], // Embarcadero
      [-122.4014, 37.7890], // Montgomery
      [-122.4078, 37.7850], // Powell
      [-122.4142, 37.7804], // Civic Center
      [-122.4190, 37.7752], // Van Ness
      [-122.4294, 37.7676], // Church
      [-122.4369, 37.7693], // Duboce & Church
      [-122.4498, 37.7655], // Carl & Cole
      [-122.4663, 37.7638], // Irving & 9th
      [-122.4790, 37.7608], // Judah & 19th
      [-122.5088, 37.7607], // Ocean Beach
    ] as [number, number][],
  },

  // ── Muni Metro T Third Street ──
  {
    id: "muni-t",
    short_name: "T",
    long_name: "T Third Street",
    route_type: 0,
    route_color: "#CC0033",
    agency_id: "muni",
    station_ids: [
      "muni-sunnydale",
      "muni-bayshore-arleta",
      "muni-williams",
      "muni-mariposa",
      "muni-ucsf-chase",
      "muni-embarcadero",   // shared with N
      "muni-montgomery",    // shared with N
      "muni-powell",        // shared with N
      "muni-chinatown",
    ],
    coordinates: [
      [-122.4038, 37.7121], // Sunnydale
      [-122.4007, 37.7110], // Bayshore/Arleta
      [-122.3937, 37.7290], // Williams
      [-122.3905, 37.7634], // Mariposa
      [-122.3875, 37.7701], // UCSF/Chase Center
      [-122.3961, 37.7932], // Embarcadero
      [-122.4014, 37.7890], // Montgomery
      [-122.4078, 37.7850], // Powell
      [-122.4069, 37.7942], // Chinatown-Rose Pak
    ] as [number, number][],
  },

  // ── Muni Metro K Ingleside ──
  {
    id: "muni-k",
    short_name: "K",
    long_name: "K Ingleside",
    route_type: 0,
    route_color: "#569BBE",
    agency_id: "muni",
    station_ids: [
      "muni-balboa-park",
      "muni-ocean-san-jose",
      "muni-city-college",
      "muni-west-portal",
      "muni-forest-hill",
      "muni-castro",
      "muni-church",        // shared with N
      "muni-van-ness",      // shared with N
      "muni-civic-center",  // shared with N
      "muni-powell",        // shared with N
      "muni-montgomery",    // shared with N
      "muni-embarcadero",   // shared with N
    ],
    coordinates: [
      [-122.4477, 37.7218], // Balboa Park
      [-122.4442, 37.7233], // Ocean & San Jose
      [-122.4410, 37.7253], // City College
      [-122.4655, 37.7409], // West Portal
      [-122.4589, 37.7481], // Forest Hill
      [-122.4353, 37.7628], // Castro
      [-122.4294, 37.7676], // Church
      [-122.4190, 37.7752], // Van Ness
      [-122.4142, 37.7804], // Civic Center
      [-122.4078, 37.7850], // Powell
      [-122.4014, 37.7890], // Montgomery
      [-122.3961, 37.7932], // Embarcadero
    ] as [number, number][],
  },

  // ── Muni Metro M Ocean View ──
  {
    id: "muni-m",
    short_name: "M",
    long_name: "M Ocean View",
    route_type: 0,
    route_color: "#008752",
    agency_id: "muni",
    station_ids: [
      "muni-balboa-park",     // shared with K
      "muni-san-jose-geneva",
      "muni-ocean-phelan",
      "muni-sf-state",
      "muni-stonestown",
      "muni-west-portal",     // shared with K
      "muni-forest-hill",     // shared with K
      "muni-castro",          // shared with K
      "muni-church",          // shared with N/K
      "muni-van-ness",        // shared with N/K
      "muni-civic-center",    // shared with N/K
      "muni-powell",          // shared with N/K
      "muni-montgomery",      // shared with N/K
      "muni-embarcadero",     // shared with N/K
    ],
    coordinates: [
      [-122.4477, 37.7218], // Balboa Park
      [-122.4466, 37.7183], // San Jose & Geneva
      [-122.4529, 37.7233], // Ocean & Phelan
      [-122.4823, 37.7226], // SF State
      [-122.4753, 37.7282], // Stonestown
      [-122.4655, 37.7409], // West Portal
      [-122.4589, 37.7481], // Forest Hill
      [-122.4353, 37.7628], // Castro
      [-122.4294, 37.7676], // Church
      [-122.4190, 37.7752], // Van Ness
      [-122.4142, 37.7804], // Civic Center
      [-122.4078, 37.7850], // Powell
      [-122.4014, 37.7890], // Montgomery
      [-122.3961, 37.7932], // Embarcadero
    ] as [number, number][],
  },

  // ── VTA Blue Line (Santa Teresa – Baypointe) ──
  {
    id: "vta-blue",
    short_name: "Blue",
    long_name: "Baypointe – Santa Teresa",
    route_type: 0,
    route_color: "#0072BC",
    agency_id: "vta",
    station_ids: [
      "vta-santa-teresa",
      "vta-cottle",
      "vta-snell",
      "vta-capitol",
      "vta-curtner",
      "vta-tamien",
      "vta-convention-center",
      "vta-st-james",
      "vta-japantown",
      "vta-baypointe",
    ],
    coordinates: [
      [-121.8010, 37.2533], // Santa Teresa
      [-121.8082, 37.2829], // Cottle
      [-121.8132, 37.3020], // Snell
      [-121.8420, 37.3134], // Capitol
      [-121.8882, 37.3177], // Curtner
      [-121.8854, 37.3128], // Tamien
      [-121.8894, 37.3309], // Convention Center
      [-121.8912, 37.3394], // St. James
      [-121.8947, 37.3483], // Japantown/Ayer
      [-121.9461, 37.3858], // Baypointe
    ] as [number, number][],
  },

  // ── VTA Green Line (Winchester – Old Ironsides) ──
  {
    id: "vta-green",
    short_name: "Green",
    long_name: "Winchester – Old Ironsides",
    route_type: 0,
    route_color: "#00A551",
    agency_id: "vta",
    station_ids: [
      "vta-winchester",
      "vta-campbell",
      "vta-hamilton",
      "vta-fruitdale",
      "vta-san-jose-diridon",
      "vta-convention-center",  // shared with Blue
      "vta-st-james",           // shared with Blue
      "vta-old-ironsides",
    ],
    coordinates: [
      [-121.9450, 37.3266], // Winchester
      [-121.9427, 37.2872], // Campbell
      [-121.9358, 37.3292], // Hamilton
      [-121.9180, 37.3224], // Fruitdale
      [-121.9030, 37.3297], // San Jose Diridon
      [-121.8894, 37.3309], // Convention Center
      [-121.8912, 37.3394], // St. James
      [-121.9671, 37.3878], // Old Ironsides
    ] as [number, number][],
  },

  // ── SMART (Larkspur – Sonoma County Airport) ──
  {
    id: "smart-main",
    short_name: "SMART",
    long_name: "Larkspur – Sonoma County Airport",
    route_type: 2,
    route_color: "#00AEEF",
    agency_id: "smart",
    station_ids: [
      "smart-larkspur",
      "smart-san-rafael",
      "smart-marin-civic",
      "smart-novato-downtown",
      "smart-novato-san-marin",
      "smart-petaluma-downtown",
      "smart-petaluma-north",
      "smart-cotati",
      "smart-rohnert-park",
      "smart-sonoma-airport",
    ],
    coordinates: [
      [-122.5108, 37.9463], // Larkspur
      [-122.5200, 37.9754], // San Rafael
      [-122.5290, 38.0191], // Marin Civic Center
      [-122.5700, 38.1066], // Novato Downtown
      [-122.5564, 38.1247], // Novato San Marin
      [-122.6367, 38.2322], // Petaluma Downtown
      [-122.6398, 38.2644], // Petaluma North
      [-122.7069, 38.3283], // Cotati
      [-122.7169, 38.3467], // Rohnert Park
      [-122.7581, 38.4092], // Sonoma County Airport
    ] as [number, number][],
  },

  // ── ACE (Stockton – San Jose) ──
  {
    id: "ace-main",
    short_name: "ACE",
    long_name: "Stockton – San Jose",
    route_type: 2,
    route_color: "#8B2332",
    agency_id: "ace",
    station_ids: [
      "ace-stockton",
      "ace-lathrop-manteca",
      "ace-tracy",
      "ace-vasco-road",
      "ace-livermore",
      "ace-pleasanton",
      "ace-fremont-centerville",
      "ace-great-america",
      "ace-san-jose-diridon",
    ],
    coordinates: [
      [-121.2752, 37.9550], // Stockton
      [-121.2718, 37.8097], // Lathrop/Manteca
      [-121.4269, 37.7393], // Tracy
      [-121.7826, 37.7395], // Vasco Road
      [-121.7709, 37.6815], // Livermore
      [-121.8994, 37.6584], // Pleasanton
      [-121.9710, 37.5404], // Fremont/Centerville
      [-121.9773, 37.4080], // Great America
      [-121.9030, 37.3297], // San Jose Diridon
    ] as [number, number][],
  },
];

// ===================== STATIONS =====================

export const norcalStations = [
  // ── New BART stations (Green + Orange lines) ──
  // Shared stations from demo-data.ts are NOT redefined here.
  // Existing station IDs referenced in route station_ids above:
  //   bart-macarthur, bart-19th-oak, bart-12th-oak, bart-west-oak,
  //   bart-embarcadero, bart-montgomery, bart-powell, bart-civic-center,
  //   bart-16th-mission, bart-24th-mission, bart-glen-park, bart-balboa,
  //   bart-daly-city, bart-richmond, bart-el-cerrito-norte, bart-el-cerrito-plaza,
  //   bart-north-berkeley, bart-downtown-berkeley, bart-ashby,
  //   bart-bay-fair, bart-san-leandro, bart-coliseum, bart-lake-merritt,
  //   bart-fruitvale

  { id: "bart-berryessa",     name: "Berryessa/North San José", lat: 37.3690, lng: -121.8747, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-milpitas",      name: "Milpitas",                 lat: 37.4104, lng: -121.8910, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-warm-springs",  name: "Warm Springs/South Fremont", lat: 37.5028, lng: -121.9395, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-fremont",       name: "Fremont",                  lat: 37.5574, lng: -121.9764, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-union-city",    name: "Union City",               lat: 37.5910, lng: -122.0175, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-south-hayward", name: "South Hayward",            lat: 37.6348, lng: -122.0575, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },
  { id: "bart-hayward",       name: "Hayward",                  lat: 37.6707, lng: -122.0870, route_ids: ["bart-green", "bart-orange"], agency_id: "bart" },

  // ── Caltrain stations ──
  { id: "ct-sf-4th-king",      name: "San Francisco 4th & King", lat: 37.7764, lng: -122.3942, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-22nd-street",      name: "22nd Street",              lat: 37.7577, lng: -122.3925, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-bayshore",         name: "Bayshore",                 lat: 37.7094, lng: -122.4014, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-south-sf",         name: "South San Francisco",      lat: 37.6559, lng: -122.4050, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-san-bruno",        name: "San Bruno",                lat: 37.6316, lng: -122.4119, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-millbrae",         name: "Millbrae",                 lat: 37.5996, lng: -122.3866, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-burlingame",       name: "Burlingame",               lat: 37.5795, lng: -122.3450, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-san-mateo",        name: "San Mateo",                lat: 37.5677, lng: -122.3234, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-belmont",          name: "Belmont",                  lat: 37.5210, lng: -122.2767, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-san-carlos",       name: "San Carlos",               lat: 37.5076, lng: -122.2618, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-redwood-city",     name: "Redwood City",             lat: 37.4857, lng: -122.2320, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-menlo-park",       name: "Menlo Park",               lat: 37.4548, lng: -122.1822, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-palo-alto",        name: "Palo Alto",                lat: 37.4437, lng: -122.1650, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-mountain-view",    name: "Mountain View",            lat: 37.3944, lng: -122.0766, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-sunnyvale",        name: "Sunnyvale",                lat: 37.3785, lng: -122.0311, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-santa-clara",      name: "Santa Clara",              lat: 37.3532, lng: -121.9368, route_ids: ["caltrain-local"], agency_id: "caltrain" },
  { id: "ct-san-jose-diridon", name: "San José Diridon",         lat: 37.3297, lng: -121.9030, route_ids: ["caltrain-local"], agency_id: "caltrain" },

  // ── Muni Metro stations ──
  { id: "muni-caltrain-4th-king", name: "4th & King/Caltrain",     lat: 37.7764, lng: -122.3942, route_ids: ["muni-n"],                                       agency_id: "muni" },
  { id: "muni-embarcadero",       name: "Embarcadero",             lat: 37.7932, lng: -122.3961, route_ids: ["muni-n", "muni-t", "muni-k", "muni-m"],           agency_id: "muni" },
  { id: "muni-montgomery",        name: "Montgomery",              lat: 37.7890, lng: -122.4014, route_ids: ["muni-n", "muni-t", "muni-k", "muni-m"],           agency_id: "muni" },
  { id: "muni-powell",            name: "Powell",                  lat: 37.7850, lng: -122.4078, route_ids: ["muni-n", "muni-t", "muni-k", "muni-m"],           agency_id: "muni" },
  { id: "muni-civic-center",      name: "Civic Center/Van Ness",   lat: 37.7804, lng: -122.4142, route_ids: ["muni-n", "muni-k", "muni-m"],                     agency_id: "muni" },
  { id: "muni-van-ness",          name: "Van Ness",                lat: 37.7752, lng: -122.4190, route_ids: ["muni-n", "muni-k", "muni-m"],                     agency_id: "muni" },
  { id: "muni-church",            name: "Church",                  lat: 37.7676, lng: -122.4294, route_ids: ["muni-n", "muni-k", "muni-m"],                     agency_id: "muni" },
  { id: "muni-duboce-church",     name: "Duboce & Church",         lat: 37.7693, lng: -122.4369, route_ids: ["muni-n"],                                         agency_id: "muni" },
  { id: "muni-carl-cole",         name: "Carl & Cole",             lat: 37.7655, lng: -122.4498, route_ids: ["muni-n"],                                         agency_id: "muni" },
  { id: "muni-irving-9th",        name: "Irving & 9th Ave",        lat: 37.7638, lng: -122.4663, route_ids: ["muni-n"],                                         agency_id: "muni" },
  { id: "muni-judah-19th",        name: "Judah & 19th Ave",        lat: 37.7608, lng: -122.4790, route_ids: ["muni-n"],                                         agency_id: "muni" },
  { id: "muni-ocean-beach",       name: "Ocean Beach",             lat: 37.7607, lng: -122.5088, route_ids: ["muni-n"],                                         agency_id: "muni" },
  { id: "muni-sunnydale",         name: "Sunnydale",               lat: 37.7121, lng: -122.4038, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-bayshore-arleta",   name: "Bayshore & Arleta",       lat: 37.7110, lng: -122.4007, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-williams",          name: "Williams",                lat: 37.7290, lng: -122.3937, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-mariposa",          name: "Mariposa",                lat: 37.7634, lng: -122.3905, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-ucsf-chase",        name: "UCSF/Chase Center",       lat: 37.7701, lng: -122.3875, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-chinatown",         name: "Chinatown–Rose Pak",       lat: 37.7942, lng: -122.4069, route_ids: ["muni-t"],                                         agency_id: "muni" },
  { id: "muni-balboa-park",       name: "Balboa Park",             lat: 37.7218, lng: -122.4477, route_ids: ["muni-k", "muni-m"],                               agency_id: "muni" },
  { id: "muni-ocean-san-jose",    name: "Ocean & San José",        lat: 37.7233, lng: -122.4442, route_ids: ["muni-k"],                                         agency_id: "muni" },
  { id: "muni-city-college",      name: "City College",            lat: 37.7253, lng: -122.4410, route_ids: ["muni-k"],                                         agency_id: "muni" },
  { id: "muni-west-portal",       name: "West Portal",             lat: 37.7409, lng: -122.4655, route_ids: ["muni-k", "muni-m"],                               agency_id: "muni" },
  { id: "muni-forest-hill",       name: "Forest Hill",             lat: 37.7481, lng: -122.4589, route_ids: ["muni-k", "muni-m"],                               agency_id: "muni" },
  { id: "muni-castro",            name: "Castro",                  lat: 37.7628, lng: -122.4353, route_ids: ["muni-k", "muni-m"],                               agency_id: "muni" },
  { id: "muni-san-jose-geneva",   name: "San José & Geneva",       lat: 37.7183, lng: -122.4466, route_ids: ["muni-m"],                                         agency_id: "muni" },
  { id: "muni-ocean-phelan",      name: "Ocean & Phelan",          lat: 37.7233, lng: -122.4529, route_ids: ["muni-m"],                                         agency_id: "muni" },
  { id: "muni-sf-state",          name: "SF State",                lat: 37.7226, lng: -122.4823, route_ids: ["muni-m"],                                         agency_id: "muni" },
  { id: "muni-stonestown",        name: "Stonestown",              lat: 37.7282, lng: -122.4753, route_ids: ["muni-m"],                                         agency_id: "muni" },

  // ── VTA Light Rail stations ──
  { id: "vta-santa-teresa",       name: "Santa Teresa",            lat: 37.2533, lng: -121.8010, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-cottle",             name: "Cottle",                  lat: 37.2829, lng: -121.8082, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-snell",              name: "Snell",                   lat: 37.3020, lng: -121.8132, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-capitol",            name: "Capitol",                 lat: 37.3134, lng: -121.8420, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-curtner",            name: "Curtner",                 lat: 37.3177, lng: -121.8882, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-tamien",             name: "Tamien",                  lat: 37.3128, lng: -121.8854, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-convention-center",  name: "Convention Center",       lat: 37.3309, lng: -121.8894, route_ids: ["vta-blue", "vta-green"],   agency_id: "vta" },
  { id: "vta-st-james",           name: "St. James",               lat: 37.3394, lng: -121.8912, route_ids: ["vta-blue", "vta-green"],   agency_id: "vta" },
  { id: "vta-japantown",          name: "Japantown/Ayer",          lat: 37.3483, lng: -121.8947, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-baypointe",          name: "Baypointe",               lat: 37.3858, lng: -121.9461, route_ids: ["vta-blue"],                agency_id: "vta" },
  { id: "vta-winchester",         name: "Winchester",              lat: 37.3266, lng: -121.9450, route_ids: ["vta-green"],               agency_id: "vta" },
  { id: "vta-campbell",           name: "Campbell",                lat: 37.2872, lng: -121.9427, route_ids: ["vta-green"],               agency_id: "vta" },
  { id: "vta-hamilton",           name: "Hamilton",                lat: 37.3292, lng: -121.9358, route_ids: ["vta-green"],               agency_id: "vta" },
  { id: "vta-fruitdale",          name: "Fruitdale",               lat: 37.3224, lng: -121.9180, route_ids: ["vta-green"],               agency_id: "vta" },
  { id: "vta-san-jose-diridon",   name: "San José Diridon",        lat: 37.3297, lng: -121.9030, route_ids: ["vta-green"],               agency_id: "vta" },
  { id: "vta-old-ironsides",      name: "Old Ironsides",           lat: 37.3878, lng: -121.9671, route_ids: ["vta-green"],               agency_id: "vta" },

  // ── SMART stations ──
  { id: "smart-larkspur",          name: "Larkspur",                lat: 37.9463, lng: -122.5108, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-san-rafael",        name: "San Rafael",              lat: 37.9754, lng: -122.5200, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-marin-civic",       name: "Marin Civic Center",      lat: 38.0191, lng: -122.5290, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-novato-downtown",   name: "Novato Downtown",         lat: 38.1066, lng: -122.5700, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-novato-san-marin",  name: "Novato San Marin",        lat: 38.1247, lng: -122.5564, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-petaluma-downtown", name: "Petaluma Downtown",       lat: 38.2322, lng: -122.6367, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-petaluma-north",    name: "Petaluma North",          lat: 38.2644, lng: -122.6398, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-cotati",            name: "Cotati",                  lat: 38.3283, lng: -122.7069, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-rohnert-park",      name: "Rohnert Park",            lat: 38.3467, lng: -122.7169, route_ids: ["smart-main"], agency_id: "smart" },
  { id: "smart-sonoma-airport",    name: "Sonoma County Airport",   lat: 38.4092, lng: -122.7581, route_ids: ["smart-main"], agency_id: "smart" },

  // ── ACE stations ──
  { id: "ace-stockton",            name: "Stockton ACE",            lat: 37.9550, lng: -121.2752, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-lathrop-manteca",     name: "Lathrop/Manteca",         lat: 37.8097, lng: -121.2718, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-tracy",               name: "Tracy",                   lat: 37.7393, lng: -121.4269, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-vasco-road",          name: "Vasco Road",              lat: 37.7395, lng: -121.7826, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-livermore",           name: "Livermore",               lat: 37.6815, lng: -121.7709, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-pleasanton",          name: "Pleasanton",              lat: 37.6584, lng: -121.8994, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-fremont-centerville", name: "Fremont/Centerville",     lat: 37.5404, lng: -121.9710, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-great-america",      name: "Great America",           lat: 37.4080, lng: -121.9773, route_ids: ["ace-main"], agency_id: "ace" },
  { id: "ace-san-jose-diridon",   name: "San José Diridon",        lat: 37.3297, lng: -121.9030, route_ids: ["ace-main"], agency_id: "ace" },
];
