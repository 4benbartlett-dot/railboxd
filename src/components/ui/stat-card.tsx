"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  index?: number;
}

export function StatCard({ label, value, icon: Icon, color, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut" as const,
        delay: index * 0.1,
      }}
      className="rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] p-4 flex items-center gap-4"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--rb-text-primary)]">
          {value}
        </p>
        <p className="text-xs text-[var(--rb-text-muted)]">{label}</p>
      </div>
    </motion.div>
  );
}
