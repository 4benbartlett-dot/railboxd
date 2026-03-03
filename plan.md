# San Diego County Transit Expansion Plan

## Current State
- **5 SD routes**: Blue (23 stations), Orange (16), Green (11), Sprinter (8), Coaster (8)
- **Total**: ~55 unique SD stations (some shared between lines)

## What's Missing

### 1. Blue Line — Missing ~9 Mid-Coast stations
Current skips: Executive Drive, UC San Diego Health La Jolla, UC San Diego Central, Nobel Drive, Clairemont Drive (mislabeled), County Center/Little Italy. Also missing E Street, H Street, Chula Vista Center, Bayfront/E Street in the south.

### 2. Green Line — Needs correction + missing stations
Currently goes to Santee but as of Sept 2024, Green Line terminates at El Cajon. Missing: Spring Street, SDSU Transit Center, Alvarado, 70th Street, Fletcher Parkway, El Cajon Transit Center. Remove Santee from Green.

### 3. Copper Line — BRAND NEW (Sept 2024)
El Cajon Transit Center → Arnele Avenue → Gillespie Field → Santee Town Center. 4 stations.

### 4. Orange Line — Missing stations
Missing: Spring Street (if shared), Fletcher Parkway

### 5. Sprinter — Missing 7 of 15 stations
Missing: Crouch Street, El Camino Real, Rancho Del Oro, College Boulevard, Melrose Drive, Escondido Avenue (aka Escondido Transit Ctr S), Nordahl Road

### 6. Coaster — Complete (8 stations) ✓

## Implementation
1. Edit `_socal-data.ts` — update all SD route definitions with complete station lists and accurate coordinates
2. Add all missing station entries with precise lat/lng
3. Add Copper Line route
4. Fix Green Line terminus
5. Update shared route_ids on stations that serve multiple lines
