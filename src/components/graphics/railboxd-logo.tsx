"use client";

import { motion } from "framer-motion";

interface RailboxdLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function RailboxdLogo({ size = 32, className = "", animate = true }: RailboxdLogoProps) {
  const s = size;

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        whileHover: { scale: 1.06, rotate: -1.5 },
        transition: { type: "spring" as const, stiffness: 400, damping: 15 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: s,
        height: s,
        borderRadius: s * 0.22,
        background: "linear-gradient(145deg, #00e054 0%, #00c847 50%, #00a83c 100%)",
        boxShadow: `0 ${s * 0.04}px ${s * 0.2}px rgba(0,224,84,0.25), inset 0 ${s * 0.02}px 0 rgba(255,255,255,0.25)`,
      }}
    >
      <svg
        width={s * 0.7}
        height={s * 0.7}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Train body - bold modern front view */}
        <rect
          x="22" y="12" width="56" height="62"
          rx="14"
          fill="rgba(0,0,0,0.82)"
        />
        {/* Roof cap */}
        <rect
          x="28" y="8" width="44" height="10"
          rx="5"
          fill="rgba(0,0,0,0.65)"
        />
        {/* Main windshield */}
        <rect
          x="30" y="22" width="40" height="22"
          rx="6"
          fill="rgba(255,255,255,0.92)"
        />
        {/* Windshield divider */}
        <line
          x1="50" y1="22" x2="50" y2="44"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1.5"
        />
        {/* Lower body accent stripe */}
        <rect
          x="22" y="50" width="56" height="3"
          fill="rgba(255,255,255,0.2)"
        />
        {/* Left headlight */}
        <circle cx="34" cy="62" r="5" fill="#FFE066" />
        <circle cx="34" cy="62" r="7.5" fill="rgba(255,224,102,0.15)" />
        {/* Right headlight */}
        <circle cx="66" cy="62" r="5" fill="#FFE066" />
        <circle cx="66" cy="62" r="7.5" fill="rgba(255,224,102,0.15)" />
        {/* Bumper / coupler area */}
        <rect
          x="38" y="70" width="24" height="4"
          rx="2"
          fill="rgba(255,255,255,0.12)"
        />
        {/* Rails */}
        <rect x="15" y="82" width="70" height="2.5" rx="1.25" fill="rgba(0,0,0,0.5)" />
        <rect x="15" y="90" width="70" height="2.5" rx="1.25" fill="rgba(0,0,0,0.5)" />
        {/* Railroad ties */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x={20 + i * 9.5}
            y="80"
            width="4"
            height="14"
            rx="1"
            fill="rgba(0,0,0,0.25)"
          />
        ))}
        {/* Subtle highlight on body */}
        <rect
          x="24" y="14" width="52" height="2"
          rx="1"
          fill="rgba(255,255,255,0.1)"
        />
      </svg>
    </Wrapper>
  );
}
