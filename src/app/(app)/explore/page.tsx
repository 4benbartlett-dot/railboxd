"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <Compass className="w-12 h-12 mx-auto mb-4 text-[var(--rb-accent)]" />
        <h1 className="text-2xl font-bold text-[var(--rb-text-bright)] mb-2">
          Explore
        </h1>
        <p className="text-sm text-[var(--rb-text-muted)]">
          Coming soon — discover urbanist landmarks, new transit lines, and more.
        </p>
      </motion.div>
    </div>
  );
}
