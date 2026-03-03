"use client";

import Image from "next/image";
import { useHeroPhoto } from "@/hooks/use-place-photos";
import type { DemoRoute } from "@/lib/demo-data";
import { getStationsForRoute } from "@/lib/demo-data";

interface MiniPhotoCardProps {
  route: DemoRoute;
  className?: string;
}

/**
 * Tiny photo thumbnail (40-50px) for activity feeds and review lists.
 * Falls back to the route color if no photo available.
 */
export function MiniPhotoCard({ route, className = "" }: MiniPhotoCardProps) {
  const stations = getStationsForRoute(route.id);
  const firstStation = stations[0];
  const { heroUrl } = useHeroPhoto(
    firstStation?.name,
    firstStation?.lat,
    firstStation?.lng
  );

  const isDarkText =
    route.route_color === "#FFD800" || route.route_color === "#FFFF33";
  const textColor = isDarkText ? "var(--rb-text-dim)" : "var(--rb-text-bright)";

  return (
    <div
      className={`w-[42px] aspect-[2/3] rounded-sm overflow-hidden shrink-0 ${className}`}
      aria-label={`${route.short_name}: ${route.long_name}`}
    >
      {heroUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={heroUrl.replace("maxwidth=800", "maxwidth=200")}
            alt={`Thumbnail of ${route.short_name} ${route.long_name} route`}
            fill
            className="object-cover"
            loading="lazy"
            unoptimized
          />
          <div className="absolute inset-0 photo-card-gradient" />
          <div className="absolute bottom-0.5 left-0 right-0 text-center">
            <span className="text-[7px] font-black text-white/90">
              {route.short_name}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          style={{ background: route.route_color, color: textColor }}
        >
          <span className="text-[10px] font-black leading-none">
            {route.short_name}
          </span>
          <span className="text-[6px] font-medium opacity-70 mt-0.5 text-center px-0.5 leading-tight">
            {route.long_name.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
      )}
    </div>
  );
}
