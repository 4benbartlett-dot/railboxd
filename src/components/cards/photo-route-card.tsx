"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { RiddenToggle } from "@/components/log/ridden-toggle";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";
import type { DemoRoute } from "@/lib/demo-data";
import { getAgencyById, getStationsForRoute } from "@/lib/demo-data";
import { getTransitInfo } from "@/lib/transit-history-data";
import { useAppStore } from "@/stores/app-store";

interface PhotoRouteCardProps {
  route: DemoRoute;
  size?: "sm" | "md" | "lg";
  isNew?: boolean;
  showActions?: boolean;
  className?: string;
  priority?: boolean;
}

const sizeStyles = {
  sm: "w-[130px] aspect-[2/3]",
  md: "w-[180px] aspect-[3/4]",
  lg: "w-full aspect-[16/9]",
};

export function PhotoRouteCard({
  route,
  size = "sm",
  isNew = false,
  showActions = true,
  className = "",
  priority = false,
}: PhotoRouteCardProps) {
  const stations = getStationsForRoute(route.id);
  const firstStation = stations[0];
  const agency = getAgencyById(route.agency_id);
  const transitInfo = getTransitInfo(route.id);
  const autoNew = isNew || (transitInfo?.isNew ?? false);
  const { ref, heroUrl, loading } = useLazyPlacePhoto(
    firstStation?.name,
    firstStation?.lat,
    firstStation?.lng
  );
  const isRidden = useAppStore((s) => s.isRidden(route.id));
  const isFavorited = useAppStore((s) => s.isFavorited(route.id));

  const isDarkText =
    route.route_color === "#FFD800" || route.route_color === "#FFFF33";
  const textColor = isDarkText ? "var(--rb-text-dim)" : "var(--rb-text-bright)";

  return (
    <Link href={`/route/${route.id}`} className={`block ${className}`} aria-label={`View route ${route.short_name}: ${route.long_name}`}>
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-lg overflow-hidden ${sizeStyles[size]} group cursor-pointer`}
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Photo or fallback gradient */}
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={`Photo of ${route.long_name} route`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            unoptimized
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: loading
                ? `linear-gradient(135deg, ${route.route_color}30 0%, var(--rb-bg-card) 100%)`
                : `linear-gradient(135deg, ${route.route_color}50 0%, ${route.route_color}20 50%, var(--rb-bg-card) 100%)`,
            }}
          />
        )}

        {/* Shimmer loading animation */}
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 photo-card-gradient" />

        {/* NEW badge */}
        {autoNew && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
            style={{ background: "var(--rb-new-badge)", color: "var(--rb-text-dim)" }}>
            <Sparkles className="w-2.5 h-2.5" />
            New
          </div>
        )}

        {/* Top left: route badge + agency */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          <div
            className="px-1.5 py-0.5 rounded text-[10px] font-black leading-none"
            style={{ background: route.route_color, color: textColor }}
          >
            {route.short_name}
          </div>
          {size !== "sm" && agency && (
            <span className="text-[9px] text-white/70 font-medium">
              {agency.name}
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
          <p
            className={`font-semibold text-white leading-tight ${
              size === "sm" ? "text-[11px]" : size === "md" ? "text-xs" : "text-sm"
            }`}
          >
            {size === "sm"
              ? route.long_name.length > 24
                ? route.long_name.slice(0, 22) + "..."
                : route.long_name
              : route.long_name}
          </p>
          <p className="text-[9px] text-white/60 mt-0.5">
            {stations.length} stations
          </p>

          {/* Action indicators */}
          {showActions && size !== "sm" && (
            <div className="flex items-center gap-2 mt-1.5">
              <RiddenToggle routeId={route.id} size="sm" />
              {isFavorited && (
                <div className="flex items-center gap-0.5 text-red-400">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1.5px ${route.route_color}60, 0 0 20px ${route.route_color}20`,
          }}
        />
      </motion.div>
    </Link>
  );
}
