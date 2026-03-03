"use client";

import { useState, useEffect } from "react";

interface PlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
  attributions: string[];
}

interface PlaceData {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number | null;
  user_ratings_total: number | null;
  photos: PlacePhoto[];
}

interface CachedEntry {
  data: PlaceData | null;
  ts: number;
}

const CACHE_KEY_PREFIX = "rb_place_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCached(key: string): PlaceData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const entry: CachedEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(key: string, data: PlaceData | null) {
  try {
    localStorage.setItem(
      CACHE_KEY_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // localStorage full — no-op
  }
}

/**
 * Fetch Google Places data for a transit station.
 * Returns photo URLs proxied through our API route (keeps key server-side).
 */
export function usePlacePhotos(
  stationName: string | undefined,
  lat?: number,
  lng?: number
) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [place, setPlace] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationName) return;

    const cacheKey = stationName.toLowerCase().replace(/\s+/g, "-");
    const cached = getCached(cacheKey);

    if (cached) {
      setPlace(cached);
      setPhotos(
        cached.photos.map(
          (p) => `/api/places/photo?ref=${encodeURIComponent(p.photo_reference)}&maxwidth=800`
        )
      );
      return;
    }

    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ query: stationName });
    if (lat !== undefined) params.set("lat", String(lat));
    if (lng !== undefined) params.set("lng", String(lng));

    fetch(`/api/places/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setCache(cacheKey, data.photos?.length ? data : null);

        if (data.photos?.length) {
          setPlace(data);
          setPhotos(
            data.photos.map(
              (p: PlacePhoto) =>
                `/api/places/photo?ref=${encodeURIComponent(p.photo_reference)}&maxwidth=800`
            )
          );
        }
      })
      .catch(() => {
        // Silently fail — CSS gradient backdrop remains
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stationName, lat, lng]);

  return { photos, place, loading };
}

/**
 * Get a single hero photo URL for a station (convenience wrapper).
 */
export function useHeroPhoto(
  stationName: string | undefined,
  lat?: number,
  lng?: number
) {
  const { photos, place, loading } = usePlacePhotos(stationName, lat, lng);
  return {
    heroUrl: photos[0] ?? null,
    allPhotos: photos,
    place,
    loading,
  };
}
