"use client";

import { motion } from "framer-motion";

interface RailboxdLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function RailboxdLogo({ size = 32, className = "", animate = true }: RailboxdLogoProps) {
  const s = size;
  // Push everything up slightly so the train + tracks are visually centered
  const trackY = s * 0.76;
  const railGap = s * 0.07;
  const tieWidth = s * 0.055;
  const tieSpacing = s * 0.13;

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        whileHover: { scale: 1.08, rotate: -2 },
        transition: { type: "spring" as const, stiffness: 400, damping: 15 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`inline-flex items-center justify-center rounded-xl ${className}`}
      style={{
        width: s,
        height: s,
        background: "linear-gradient(135deg, #00e054 0%, #00b844 100%)",
        boxShadow: "0 2px 8px rgba(0,224,84,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <svg
        width={s * 0.88}
        height={s * 0.88}
        viewBox={`0 0 ${s} ${s}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Train body - sleek modern shape, bigger */}
        <rect
          x={s * 0.06}
          y={s * 0.2}
          width={s * 0.88}
          height={s * 0.44}
          rx={s * 0.13}
          fill="rgba(0,0,0,0.85)"
        />
        {/* Front nose taper */}
        <path
          d={`M${s * 0.82} ${s * 0.2} Q${s * 0.97} ${s * 0.2} ${s * 0.97} ${s * 0.35} L${s * 0.97} ${s * 0.49} Q${s * 0.97} ${s * 0.64} ${s * 0.82} ${s * 0.64} Z`}
          fill="rgba(0,0,0,0.85)"
        />
        {/* Train windshield - bigger */}
        <rect
          x={s * 0.62}
          y={s * 0.27}
          width={s * 0.24}
          height={s * 0.22}
          rx={s * 0.045}
          fill="rgba(255,255,255,0.92)"
        />
        {/* Train side windows */}
        <rect
          x={s * 0.14}
          y={s * 0.29}
          width={s * 0.14}
          height={s * 0.16}
          rx={s * 0.025}
          fill="rgba(255,255,255,0.5)"
        />
        <rect
          x={s * 0.33}
          y={s * 0.29}
          width={s * 0.14}
          height={s * 0.16}
          rx={s * 0.025}
          fill="rgba(255,255,255,0.5)"
        />
        {/* Accent stripe along body */}
        <rect
          x={s * 0.06}
          y={s * 0.54}
          width={s * 0.82}
          height={s * 0.035}
          rx={s * 0.01}
          fill="rgba(255,255,255,0.15)"
        />
        {/* Headlight */}
        <circle
          cx={s * 0.93}
          cy={s * 0.5}
          r={s * 0.04}
          fill="#FFE066"
        />
        {/* Headlight glow */}
        <circle
          cx={s * 0.93}
          cy={s * 0.5}
          r={s * 0.065}
          fill="rgba(255,224,102,0.2)"
        />
        {/* Rails */}
        <line
          x1={s * 0.03}
          y1={trackY - railGap}
          x2={s * 0.97}
          y2={trackY - railGap}
          stroke="rgba(0,0,0,0.65)"
          strokeWidth={s * 0.028}
          strokeLinecap="round"
        />
        <line
          x1={s * 0.03}
          y1={trackY + railGap}
          x2={s * 0.97}
          y2={trackY + railGap}
          stroke="rgba(0,0,0,0.65)"
          strokeWidth={s * 0.028}
          strokeLinecap="round"
        />
        {/* Railroad ties */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={i}
            x={s * 0.06 + i * tieSpacing}
            y={trackY - railGap - s * 0.025}
            width={tieWidth}
            height={railGap * 2 + s * 0.05}
            rx={s * 0.008}
            fill="rgba(0,0,0,0.35)"
          />
        ))}
      </svg>
    </Wrapper>
  );
}
