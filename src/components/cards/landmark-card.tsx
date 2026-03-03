"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLazyPlacePhoto } from "@/hooks/use-lazy-place-photo";
import {
  type UrbanistLandmark,
  LANDMARK_TYPE_LABELS,
  LANDMARK_TYPE_COLORS,
} from "@/lib/urbanist-data";
import { getStationById } from "@/lib/demo-data";

interface LandmarkCardProps {
  landmark: UrbanistLandmark;
  className?: string;
}

export function LandmarkCard({ landmark, className = "" }: LandmarkCardProps) {
  const { ref, heroUrl, loading } = useLazyPlacePhoto(
    landmark.photoQuery,
    landmark.lat,
    landmark.lng
  );

  const typeColor = LANDMARK_TYPE_COLORS[landmark.type];
  const typeLabel = LANDMARK_TYPE_LABELS[landmark.type];

  const nearbyStation = landmark.nearbyStationIds[0]
    ? getStationById(landmark.nearbyStationIds[0])
    : null;

  return (
    <Link href={`/landmark/${landmark.id}`} aria-label={`View landmark: ${landmark.name}`}>
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-lg overflow-hidden aspect-[4/3] group cursor-pointer ${className}`}
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
    >
      {/* Photo or fallback */}
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={`Photo of ${landmark.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          unoptimized
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: loading
              ? "var(--rb-bg-card)"
              : `linear-gradient(135deg, ${typeColor}40 0%, var(--rb-bg-card) 100%)`,
          }}
        />
      )}

      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 photo-card-gradient-strong" />

      {/* Type badge top-right */}
      <div
        className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
        style={{ background: typeColor, color: "var(--rb-text-bright)" }}
      >
        {typeLabel}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="font-semibold text-white text-sm leading-tight">
          {landmark.name}
        </h3>
        <p className="text-[11px] text-white/60 mt-0.5 line-clamp-2">
          {landmark.description}
        </p>

        {/* Nearby station pills */}
        {nearbyStation && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="w-2.5 h-2.5 text-white/40" />
            <span className="text-[9px] text-white/50">
              Near {nearbyStation.name}
            </span>
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${typeColor}60, 0 0 20px ${typeColor}20`,
        }}
      />
    </motion.div>
    </Link>
  );
}
