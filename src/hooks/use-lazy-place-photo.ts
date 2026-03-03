"use client";

import { useRef, useState, useEffect } from "react";
import { useHeroPhoto } from "./use-place-photos";

/**
 * Lazy-loading wrapper around useHeroPhoto.
 * Only fetches the photo when the element is near the viewport.
 */
export function useLazyPlacePhoto(
  stationName: string | undefined,
  lat?: number,
  lng?: number
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { heroUrl, allPhotos, place, loading } = useHeroPhoto(
    isVisible ? stationName : undefined,
    lat,
    lng
  );

  return { ref, heroUrl, allPhotos, place, loading, isVisible };
}
