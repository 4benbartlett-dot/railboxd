"use client";

import { motion } from "framer-motion";

interface RevealAnimationProps {
  x: number;
  y: number;
}

export function RevealAnimation({ x, y }: RevealAnimationProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Ripple rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-[var(--rb-accent)]"
          style={{
            left: x,
            top: y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 150 + i * 60,
            height: 150 + i * 60,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.15,
            ease: "easeOut" as const,
          }}
        />
      ))}

      {/* Center flash */}
      <motion.div
        className="absolute rounded-full bg-[var(--rb-accent)]"
        style={{
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ width: 8, height: 8, opacity: 1 }}
        animate={{ width: 40, height: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
      />
    </div>
  );
}
