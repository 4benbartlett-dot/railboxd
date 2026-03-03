"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Train, MapPin, ChevronDown, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app-store";
import {
  getRouteById,
  getStationsForRoute,
  getAgencyById,
} from "@/lib/demo-data";

const PRIVACY_OPTIONS = [
  { value: "public" as const, label: "Public", desc: "Everyone can see" },
  { value: "friends" as const, label: "Friends", desc: "Only friends" },
  { value: "private" as const, label: "Private", desc: "Only you" },
];

export function LogModal() {
  const logModalOpen = useAppStore((s) => s.logModalOpen);
  const logModalRouteId = useAppStore((s) => s.logModalRouteId);
  const closeLogModal = useAppStore((s) => s.closeLogModal);
  const addRouteLog = useAppStore((s) => s.addRouteLog);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startStationId, setStartStationId] = useState("");
  const [endStationId, setEndStationId] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">("public");
  const [submitting, setSubmitting] = useState(false);

  const route = logModalRouteId ? getRouteById(logModalRouteId) : null;
  const agency = route ? getAgencyById(route.agency_id) : null;
  const stations = useMemo(
    () => (logModalRouteId ? getStationsForRoute(logModalRouteId) : []),
    [logModalRouteId]
  );

  // Auto-set first/last stations when modal opens
  const effectiveStart = startStationId || stations[0]?.id || "";
  const effectiveEnd = endStationId || stations[stations.length - 1]?.id || "";

  function resetForm() {
    setRating(0);
    setHoverRating(0);
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
    setStartStationId("");
    setEndStationId("");
    setPrivacy("public");
    setSubmitting(false);
  }

  function handleClose() {
    resetForm();
    closeLogModal();
  }

  function handleSubmit() {
    if (!route) return;
    setSubmitting(true);

    addRouteLog({
      id: crypto.randomUUID(),
      routeId: route.id,
      startStationId: effectiveStart,
      endStationId: effectiveEnd,
      date,
      rating: rating > 0 ? rating : undefined,
      notes: notes.trim() || undefined,
      privacy,
    });

    toast.success(`Ride logged on ${route.short_name} Line!`, {
      description: rating > 0 ? `Rated ${rating}/5 stars` : undefined,
    });

    handleClose();
  }

  const displayRating = hoverRating || rating;
  const rc = route?.route_color ?? "#00e054";

  return (
    <AnimatePresence>
      {logModalOpen && route && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-[10%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-auto sm:w-[480px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{
              background: "var(--rb-bg-card)",
              border: "1px solid var(--rb-border)",
            }}
          >
            {/* Header with route color accent */}
            <div
              className="relative px-5 pt-5 pb-4 rounded-t-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${rc}15 0%, transparent 60%)`,
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-[#9ab]" />
              </button>

              {/* Route info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: rc }}
                >
                  <span
                    className="text-sm font-black"
                    style={{
                      color:
                        rc === "#FFD800" || rc === "#FFFF33" ? "#000" : "#fff",
                    }}
                  >
                    {route.short_name}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Log a Ride</h2>
                  <p className="text-xs text-[#9ab]">
                    {route.long_name} &middot; {agency?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="px-5 pb-5 space-y-5">
              {/* Date */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-[var(--rb-border)] bg-[var(--rb-bg)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e054] transition-colors"
                />
              </div>

              {/* Station selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    From
                  </label>
                  <select
                    value={effectiveStart}
                    onChange={(e) => setStartStationId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rb-border)] bg-[var(--rb-bg)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e054] transition-colors appearance-none cursor-pointer"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    To
                  </label>
                  <select
                    value={effectiveEnd}
                    onChange={(e) => setEndStationId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rb-border)] bg-[var(--rb-bg)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e054] transition-colors appearance-none cursor-pointer"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s === rating ? 0 : s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-7 h-7 cursor-pointer transition-colors"
                        fill={s <= displayRating ? "#00e054" : "transparent"}
                        stroke={s <= displayRating ? "#00e054" : "#456"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  {displayRating > 0 && (
                    <span className="text-xs text-[#678] ml-2">
                      {displayRating}/5
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was the ride? What did you see?"
                  rows={3}
                  className="w-full rounded-lg border border-[var(--rb-border)] bg-[var(--rb-bg)] px-3 py-2.5 text-sm text-white placeholder-[#456] focus:outline-none focus:border-[#00e054] transition-colors resize-none"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#678] block mb-1.5">
                  Privacy
                </label>
                <div className="flex gap-2">
                  {PRIVACY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPrivacy(opt.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background:
                          privacy === opt.value
                            ? "#00e05415"
                            : "var(--rb-bg)",
                        border: `1px solid ${
                          privacy === opt.value ? "#00e054" : "var(--rb-border)"
                        }`,
                        color: privacy === opt.value ? "#00e054" : "#678",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: rc,
                  color: rc === "#FFD800" || rc === "#FFFF33" ? "#000" : "#fff",
                }}
              >
                <Train className="w-4 h-4" />
                {submitting ? "Logging..." : "Log This Ride"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
