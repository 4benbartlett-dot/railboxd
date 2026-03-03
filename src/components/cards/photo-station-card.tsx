"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";
import type { DemoStation } from "@/lib/demo-data";
import { getRouteById } from "@/lib/demo-data";
import { useAppStore } from "@/stores/app-store";

interface PhotoStationCardProps {
  station: DemoStation;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles = {
  sm: "w-[130px] aspect-[3/4]",
  md: "w-[180px] aspect-[3/4]",
};

export function PhotoStationCard({
  station,
  size = "sm",
  className = "",
}: PhotoStationCardProps) {
  const { ref, heroUrl, loading } = useLazyPlacePhoto(
    station.name,
    station.lat,
    station.lng
  );
  const loggedStationIds = useAppStore((s) => s.loggedStationIds);
  const isVisited = loggedStationIds.has(station.id);

  const routes = station.route_ids
    .map((rid) => getRouteById(rid))
    .filter(Boolean);

  return (
    <Link href={`/station/${station.id}`} className={`block ${className}`}>
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-lg overflow-hidden ${sizeStyles[size]} group cursor-pointer`}
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      >
        {/* Photo or fallback */}
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={station.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: loading
                ? "var(--rb-bg-card)"
                : "linear-gradient(135deg, var(--rb-bg-elevated) 0%, var(--rb-bg-card) 100%)",
            }}
          />
        )}

        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 photo-card-gradient" />

        {/* Visited badge */}
        {isVisited && (
          <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[var(--rb-accent)] flex items-center justify-center">
            <Check className="w-3 h-3 text-[var(--rb-bg)]" />
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-white/60 shrink-0" />
            <p className="font-semibold text-white text-[11px] leading-tight truncate">
              {station.name}
            </p>
          </div>

          {/* Route badges */}
          <div className="flex flex-wrap gap-1">
            {routes.slice(0, 3).map((r) => (
              <div
                key={r!.id}
                className="px-1 py-0.5 rounded text-[8px] font-bold leading-none"
                style={{
                  background: r!.route_color,
                  color:
                    r!.route_color === "#FFD800" || r!.route_color === "#FFFF33"
                      ? "#000"
                      : "#fff",
                }}
              >
                {r!.short_name}
              </div>
            ))}
            {routes.length > 3 && (
              <span className="text-[8px] text-white/50">+{routes.length - 3}</span>
            )}
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(0,224,84,0.4), 0 0 20px rgba(0,224,84,0.1)" }}
        />
      </motion.div>
    </Link>
  );
}
