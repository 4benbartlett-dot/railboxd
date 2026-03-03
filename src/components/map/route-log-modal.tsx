"use client";

import { useState, useRef, useMemo } from "react";
import { X, Star, Train, Clock, Armchair, Shield, Mountain, Globe, Users, Lock, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app-store";
import { getRouteById, getStationsForRoute, getAgencyById } from "@/lib/demo-data";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const RATING_AXES = [
  { key: "reliability", label: "Reliability", icon: Clock },
  { key: "comfort", label: "Comfort", icon: Armchair },
  { key: "safety", label: "Safety", icon: Shield },
  { key: "scenery", label: "Scenery", icon: Mountain },
] as const;

const PRESET_TAGS = [
  "commute",
  "weekend",
  "scenic",
  "rush hour",
  "first time",
  "late night",
  "crowded",
  "smooth ride",
  "delays",
];

type PrivacyLevel = "public" | "friends" | "private";

const PRIVACY_OPTIONS: { value: PrivacyLevel; label: string; icon: typeof Globe }[] = [
  { value: "public", label: "Public", icon: Globe },
  { value: "friends", label: "Friends", icon: Users },
  { value: "private", label: "Private", icon: Lock },
];

type AxisRatings = Record<string, number>;

export function RouteLogModal() {
  const { logModalOpen, logModalRouteId, closeLogModal, addRouteLog } = useAppStore();

  const route = logModalRouteId ? getRouteById(logModalRouteId) : null;
  const stations = route ? getStationsForRoute(route.id) : [];
  const agency = route ? getAgencyById(route.agency_id) : null;

  const today = new Date().toISOString().split("T")[0];

  const [startStationId, setStartStationId] = useState("");
  const [endStationId, setEndStationId] = useState("");
  const [date, setDate] = useState(today);
  const [axisRatings, setAxisRatings] = useState<AxisRatings>({});
  const [axisHover, setAxisHover] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyLevel>("private");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stationOptions: ComboboxOption[] = useMemo(
    () => stations.map((s) => ({ value: s.id, label: s.name })),
    [stations]
  );
  const endStationOptions: ComboboxOption[] = useMemo(
    () => stationOptions.filter((o) => o.value !== startStationId),
    [stationOptions, startStationId]
  );

  const canSubmit = startStationId && endStationId && date && startStationId !== endStationId;

  const computeAverageRating = (): number | undefined => {
    const ratedAxes = Object.values(axisRatings).filter((v) => v > 0);
    if (ratedAxes.length === 0) return undefined;
    const avg = ratedAxes.reduce((sum, v) => sum + v, 0) / ratedAxes.length;
    return Math.round(avg * 10) / 10;
  };

  const handleSubmit = () => {
    if (!route || !canSubmit) return;
    addRouteLog({
      id: crypto.randomUUID(),
      routeId: route.id,
      startStationId,
      endStationId,
      date,
      rating: computeAverageRating(),
      notes: notes.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      privacy,
    });
    toast.success(`Ride logged! 🚂`, {
      description: route.long_name,
    });
    resetForm();
    closeLogModal();
  };

  const resetForm = () => {
    setStartStationId("");
    setEndStationId("");
    setDate(today);
    setAxisRatings({});
    setAxisHover({});
    setSelectedTags([]);
    setNotes("");
    setPhotos([]);
    setPrivacy("private");
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 4 - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) setPhotos((prev) => (prev.length < 4 ? [...prev, result] : prev));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    resetForm();
    closeLogModal();
  };

  const setAxisRating = (axis: string, value: number) => {
    setAxisRatings((prev) => ({
      ...prev,
      [axis]: prev[axis] === value ? 0 : value,
    }));
  };

  const setAxisHoverValue = (axis: string, value: number) => {
    setAxisHover((prev) => ({ ...prev, [axis]: value }));
  };

  const clearAxisHover = (axis: string) => {
    setAxisHover((prev) => ({ ...prev, [axis]: 0 }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const routeColor = route?.route_color ?? "#00e054";

  return (
    <AnimatePresence>
      {logModalOpen && route && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed z-50 inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[440px] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="bg-[var(--rb-bg-card)] border border-[var(--rb-border)] flex flex-col max-h-[90vh]">
              {/* Color bar */}
              <div className="h-1 flex-shrink-0" style={{ backgroundColor: routeColor }} />

              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[var(--rb-border)] flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    backgroundColor: routeColor + "20",
                    border: `2px solid ${routeColor}`,
                    color: routeColor,
                  }}
                >
                  {route.short_name}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-[var(--rb-text-bright)] truncate">
                    Log a Ride
                  </h2>
                  <p className="text-xs text-[var(--rb-text-muted)] truncate">
                    {route.long_name}
                    {agency && ` · ${agency.name}`}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form (scrollable) */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
                {/* Start / End stations (autocomplete) */}
                <div className="grid grid-cols-2 gap-3">
                  <Combobox
                    label="Boarded at"
                    options={stationOptions}
                    value={startStationId}
                    onChange={setStartStationId}
                    placeholder="Search stations..."
                  />
                  <Combobox
                    label="Got off at"
                    options={endStationOptions}
                    value={endStationId}
                    onChange={setEndStationId}
                    placeholder="Search stations..."
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-1.5">
                    Date ridden
                  </label>
                  <input
                    type="date"
                    value={date}
                    max={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--rb-bg-card)] border border-[var(--rb-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--rb-text-bright)] focus:outline-none focus:border-[var(--rb-accent)] transition-colors"
                  />
                </div>

                {/* Multi-axis Ratings */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-2">
                    Ratings <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <div className="space-y-2">
                    {RATING_AXES.map(({ key, label, icon: Icon }) => {
                      const currentRating = axisRatings[key] ?? 0;
                      const currentHover = axisHover[key] ?? 0;
                      const display = currentHover || currentRating;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-xl bg-[var(--rb-bg-card)] border border-[var(--rb-border)] px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{ color: currentRating > 0 ? routeColor : "var(--rb-text-muted)" }}
                            />
                            <span className="text-xs font-medium text-[var(--rb-text)]">
                              {label}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                onClick={() => setAxisRating(key, s)}
                                onMouseEnter={() => setAxisHoverValue(key, s)}
                                onMouseLeave={() => clearAxisHover(key)}
                                className="transition-transform hover:scale-110 active:scale-95"
                              >
                                <Star
                                  className="w-5 h-5"
                                  fill={s <= display ? routeColor : "transparent"}
                                  stroke={s <= display ? routeColor : "var(--rb-text-muted)"}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-2">
                    Tags <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                          style={
                            isSelected
                              ? {
                                  backgroundColor: routeColor,
                                  color: "var(--rb-map-bg)",
                                }
                              : {
                                  backgroundColor: "var(--rb-bg-card)",
                                  border: "1px solid var(--rb-border)",
                                  color: "var(--rb-text)",
                                }
                          }
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-2">
                    Photos <span className="normal-case font-normal">(optional, max 4)</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--rb-border)]">
                        <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 flex items-center justify-center"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-[var(--rb-border)] flex flex-col items-center justify-center gap-1 text-[var(--rb-text-muted)] hover:border-[var(--rb-accent)] hover:text-[var(--rb-accent)] transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        <span className="text-[9px]">Add</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-1.5">
                    Notes <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How was the ride? Anything memorable?"
                    rows={3}
                    className="w-full bg-[var(--rb-bg-card)] border border-[var(--rb-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--rb-text-bright)] placeholder-[var(--rb-text-muted)] focus:outline-none focus:border-[var(--rb-accent)] transition-colors resize-none"
                  />
                </div>

                {/* Privacy */}
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-2">
                    Visibility
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[var(--rb-border)] bg-[var(--rb-bg-card)]">
                    {PRIVACY_OPTIONS.map(({ value, label, icon: Icon }) => {
                      const isActive = privacy === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setPrivacy(value)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all"
                          style={{
                            backgroundColor: isActive ? "var(--rb-accent)" : "transparent",
                            color: isActive ? "var(--rb-map-bg)" : "var(--rb-text-muted)",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="px-4 pb-4 pt-2 flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: canSubmit ? routeColor : undefined,
                    color: canSubmit ? "var(--rb-map-bg)" : undefined,
                    border: !canSubmit ? "1.5px solid var(--rb-border)" : "none",
                  }}
                >
                  <Train className="w-4 h-4" />
                  Save Ride
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
