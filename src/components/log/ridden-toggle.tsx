"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app-store";

interface RiddenToggleProps {
  routeId: string;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

function TrainIcon({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Train body */}
      <rect
        x="5"
        y="2"
        width="14"
        height="15"
        rx="3.5"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Windshield */}
      <rect
        x="7.5"
        y="4.5"
        width="9"
        height="5"
        rx="1.5"
        fill={filled ? "var(--rb-bg, #0a0c0f)" : "currentColor"}
        opacity={filled ? 0.85 : 0.25}
      />
      {/* Windshield divider */}
      <line
        x1="12"
        y1="4.5"
        x2="12"
        y2="9.5"
        stroke={filled ? "var(--rb-bg, #0a0c0f)" : "currentColor"}
        strokeWidth="0.75"
        opacity={filled ? 0.4 : 0.15}
      />
      {/* Left headlight */}
      <circle
        cx="9"
        cy="14"
        r="1.25"
        fill={filled ? "#FFE066" : "currentColor"}
        opacity={filled ? 1 : 0.3}
      />
      {/* Right headlight */}
      <circle
        cx="15"
        cy="14"
        r="1.25"
        fill={filled ? "#FFE066" : "currentColor"}
        opacity={filled ? 1 : 0.3}
      />
      {/* Rails */}
      <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={filled ? 0.6 : 0.3} />
      <line x1="4" y1="22.5" x2="20" y2="22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={filled ? 0.4 : 0.2} />
      {/* Wheels */}
      <circle cx="8.5" cy="18.5" r="1.25" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" opacity={filled ? 0.7 : 0.35} />
      <circle cx="15.5" cy="18.5" r="1.25" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" opacity={filled ? 0.7 : 0.35} />
    </svg>
  );
}

/** Particle burst that fires on toggle-on */
function Particles({ size }: { size: number }) {
  const particles = [
    { angle: -30, distance: size * 0.9 },
    { angle: -70, distance: size * 1.1 },
    { angle: -110, distance: size * 0.85 },
    { angle: -150, distance: size * 1.0 },
  ];

  return (
    <>
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.3, x, y }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.03 }}
            className="absolute"
            style={{
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: "50%",
              background: "var(--rb-accent, #00e054)",
              top: "50%",
              left: "50%",
              marginTop: -(size * 0.075),
              marginLeft: -(size * 0.075),
            }}
          />
        );
      })}
    </>
  );
}

export function RiddenToggle({
  routeId,
  size = "md",
  showLabel = false,
  className = "",
}: RiddenToggleProps) {
  const isRidden = useAppStore((s) => s.isRidden(routeId));
  const toggleRidden = useAppStore((s) => s.toggleRidden);
  const [showParticles, setShowParticles] = useState(false);

  const iconSize = size === "sm" ? 16 : 22;
  const buttonSize = size === "sm" ? 28 : 40;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasRidden = isRidden;
    toggleRidden(routeId);
    // Check if toggle actually happened (auth may have blocked it)
    const nowRidden = useAppStore.getState().isRidden(routeId);
    if (!wasRidden && nowRidden) {
      setShowParticles(true);
      toast("Ride marked! All aboard!", { icon: "🚂" });
      setTimeout(() => setShowParticles(false), 600);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center gap-1.5 transition-all ${className}`}
      title={isRidden ? "Unmark ride" : "Mark as ridden"}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full transition-colors"
        style={{
          width: buttonSize,
          height: buttonSize,
          backgroundColor: isRidden
            ? "color-mix(in srgb, var(--rb-accent) 15%, transparent)"
            : "transparent",
          border: `1.5px solid ${isRidden ? "var(--rb-accent)" : "var(--rb-text-dim)"}`,
          color: isRidden ? "var(--rb-accent)" : "var(--rb-text)",
        }}
        whileTap={{ scale: 0.9 }}
        animate={isRidden ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <AnimatePresence>
          {isRidden && (
            <motion.div
              initial={{ x: -6, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <TrainIcon size={iconSize} filled />
            </motion.div>
          )}
        </AnimatePresence>
        {!isRidden && <TrainIcon size={iconSize} filled={false} />}

        {/* Particles */}
        <AnimatePresence>
          {showParticles && <Particles size={buttonSize} />}
        </AnimatePresence>
      </motion.div>

      {showLabel && (
        <span
          className="text-xs font-medium"
          style={{ color: isRidden ? "var(--rb-accent)" : "var(--rb-text-muted)" }}
        >
          {isRidden ? "Ridden" : "Mark Ridden"}
        </span>
      )}
    </button>
  );
}
