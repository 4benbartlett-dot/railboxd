"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app-store";
import {
  User,
  Shield,
  Bell,
  LogOut,
  Trash2,
  Settings,
  MapPin,
  Eye,
  EyeOff,
  Clock,
  Users,
  Activity,
  MessageSquare,
  Mail,
} from "lucide-react";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

/* ─── animation variants ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

/* ─── Toggle Switch ─── */
function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="relative flex-shrink-0 w-[50px] h-[30px] rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rb-accent)]"
      style={{
        backgroundColor: enabled ? "var(--rb-accent)" : "var(--rb-bg-elevated)",
        border: `1px solid ${enabled ? "var(--rb-accent)" : "var(--rb-border)"}`,
      }}
    >
      <motion.div
        className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 24 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ─── Section Card wrapper ─── */
function SectionCard({
  index,
  icon: Icon,
  title,
  children,
}: {
  index: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      custom={index}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--rb-bg-card)",
        borderColor: "var(--rb-border)",
      }}
    >
      {/* Section header */}
      <div
        className="flex items-center gap-2.5 px-5 py-4 border-b"
        style={{ borderColor: "var(--rb-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--rb-accent)15" }}
        >
          <Icon className="w-4 h-4 text-[var(--rb-accent)]" />
        </div>
        <h2 className="text-sm font-semibold text-[var(--rb-text-bright)] uppercase tracking-wider">
          {title}
        </h2>
      </div>

      {/* Section body */}
      <div className="p-5 space-y-5">{children}</div>
    </motion.section>
  );
}

/* ─── Reusable form rows ─── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--rb-text)] mb-1.5 uppercase tracking-wide">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--rb-text-muted)] pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors focus:ring-1 focus:ring-[var(--rb-accent)]"
        style={{
          background: "var(--rb-bg-elevated)",
          border: "1px solid var(--rb-border)",
          color: "var(--rb-text-bright)",
          paddingLeft: prefix ? "1.75rem" : undefined,
        }}
      />
    </div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors focus:ring-1 focus:ring-[var(--rb-accent)]"
      style={{
        background: "var(--rb-bg-elevated)",
        border: "1px solid var(--rb-border)",
        color: "var(--rb-text-bright)",
      }}
    />
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <Icon
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: "var(--rb-text-muted)" }}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--rb-text-bright)]">
            {label}
          </p>
          <p className="text-xs text-[var(--rb-text-muted)] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

/* ─── Radio Group ─── */
function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: isSelected ? "var(--rb-accent)" : "var(--rb-bg-elevated)",
              color: isSelected ? "#000" : "var(--rb-text)",
              border: `1px solid ${isSelected ? "var(--rb-accent)" : "var(--rb-border)"}`,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Select Dropdown ─── */
function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors appearance-none focus:ring-1 focus:ring-[var(--rb-accent)] cursor-pointer"
      style={{
        background: "var(--rb-bg-elevated)",
        border: "1px solid var(--rb-border)",
        color: "var(--rb-text-bright)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239ab' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "2.5rem",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/* ═══════════════════════════════════════
   Settings Page
   ═══════════════════════════════════════ */
export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Zustand store ── */
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  /* ── Local state for profile text fields (saved on button click) ── */
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [homeCity, setHomeCity] = useState(profile.homeCity);

  /* Sync local form state when Zustand rehydrates from localStorage.
     Without this, useState captures the default values before
     persist middleware has finished loading saved data. */
  useEffect(() => {
    setDisplayName(profile.displayName);
    setUsername(profile.username);
    setBio(profile.bio);
    setHomeCity(profile.homeCity);
  }, [profile.displayName, profile.username, profile.bio, profile.homeCity]);

  /* ── Avatar file handling ── */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateProfile({ avatarUrl: base64 });
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5">
          <RailboxdLogo size={28} animate={false} />
          <h1 className="text-2xl font-bold text-[var(--rb-text-bright)] tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-sm text-[var(--rb-text-muted)] mt-1 ml-[30px]">
          Manage your profile, privacy, and preferences.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* ════════════════════════════════════
            1. Profile
           ════════════════════════════════════ */}
        <SectionCard index={0} icon={User} title="Profile">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                background: "var(--rb-bg-elevated)",
                border: "2px solid var(--rb-border)",
              }}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-9 h-9 text-[var(--rb-text-muted)]" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--rb-text-bright)]">
                Profile Photo
              </p>
              <p className="text-xs text-[var(--rb-text-muted)] mt-0.5">
                JPG, PNG or GIF. Max 2 MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: "var(--rb-bg-elevated)",
                  border: "1px solid var(--rb-border)",
                  color: "var(--rb-text)",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <FieldLabel>Display Name</FieldLabel>
            <TextInput
              value={displayName}
              onChange={setDisplayName}
              placeholder="Your display name"
            />
          </div>

          {/* Username */}
          <div>
            <FieldLabel>Username</FieldLabel>
            <TextInput
              value={username}
              onChange={setUsername}
              placeholder="username"
              prefix="@"
            />
          </div>

          {/* Bio */}
          <div>
            <FieldLabel>Bio</FieldLabel>
            <TextArea
              value={bio}
              onChange={setBio}
              placeholder="Tell us about your transit adventures..."
              rows={3}
            />
          </div>

          {/* Home City */}
          <div>
            <FieldLabel>Home City</FieldLabel>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--rb-text-muted)" }}
              />
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none transition-colors focus:ring-1 focus:ring-[var(--rb-accent)]"
                style={{
                  background: "var(--rb-bg-elevated)",
                  border: "1px solid var(--rb-border)",
                  color: "var(--rb-text-bright)",
                }}
              />
            </div>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={() => {
              updateProfile({ displayName, username, bio, homeCity });
              toast.success("Profile updated");
            }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "var(--rb-accent)",
              color: "#000",
            }}
          >
            Save Profile
          </button>
        </SectionCard>

        {/* ════════════════════════════════════
            2. Privacy & Safety
           ════════════════════════════════════ */}
        <SectionCard index={1} icon={Shield} title="Privacy & Safety">
          {/* Default Post Visibility */}
          <div>
            <FieldLabel>Default Post Visibility</FieldLabel>
            <RadioGroup
              value={profile.privacyDefault}
              onChange={(v) =>
                updateProfile({
                  privacyDefault: v as "public" | "friends" | "private",
                })
              }
              options={[
                { label: "Public", value: "public" },
                { label: "Friends Only", value: "friends" },
                { label: "Private", value: "private" },
              ]}
            />
          </div>

          {/* Divider */}
          <div
            className="border-t"
            style={{ borderColor: "var(--rb-border)" }}
          />

          {/* Ghost Mode */}
          <ToggleRow
            icon={EyeOff}
            label="Ghost Mode"
            description="When enabled, your activity won't appear in any feeds"
            enabled={profile.ghostMode}
            onToggle={() => updateProfile({ ghostMode: !profile.ghostMode })}
          />

          {/* Hide Home Station */}
          <ToggleRow
            icon={Eye}
            label="Hide Home Station"
            description="Your home station won't show on your public profile"
            enabled={profile.hideHomeStation}
            onToggle={() =>
              updateProfile({ hideHomeStation: !profile.hideHomeStation })
            }
          />

          {/* Activity Delay */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <Clock
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "var(--rb-text-muted)" }}
              />
              <div>
                <p className="text-sm font-medium text-[var(--rb-text-bright)]">
                  Activity Delay
                </p>
                <p className="text-xs text-[var(--rb-text-muted)] mt-0.5 leading-relaxed">
                  Delay before your activity appears in feeds
                </p>
              </div>
            </div>
            <div className="ml-7">
              <SelectInput
                value={profile.activityDelay}
                onChange={(v) => updateProfile({ activityDelay: v })}
                options={[
                  { label: "None", value: "none" },
                  { label: "1 hour", value: "1h" },
                  { label: "6 hours", value: "6h" },
                  { label: "24 hours", value: "24h" },
                  { label: "48 hours", value: "48h" },
                ]}
              />
            </div>
          </div>
        </SectionCard>

        {/* ════════════════════════════════════
            3. Notifications
           ════════════════════════════════════ */}
        <SectionCard index={2} icon={Bell} title="Notifications">
          <ToggleRow
            icon={Users}
            label="New Followers"
            description="Get notified when someone follows you"
            enabled={profile.notifyFollowers}
            onToggle={() =>
              updateProfile({ notifyFollowers: !profile.notifyFollowers })
            }
          />

          <ToggleRow
            icon={Activity}
            label="Friend Activity"
            description="Updates when friends log new rides"
            enabled={profile.notifyFriendActivity}
            onToggle={() =>
              updateProfile({
                notifyFriendActivity: !profile.notifyFriendActivity,
              })
            }
          />

          <ToggleRow
            icon={MessageSquare}
            label="Route Reviews"
            description="Notifications for likes and replies on your reviews"
            enabled={profile.notifyRouteReviews}
            onToggle={() =>
              updateProfile({
                notifyRouteReviews: !profile.notifyRouteReviews,
              })
            }
          />

          <ToggleRow
            icon={Mail}
            label="Weekly Digest"
            description="A weekly summary of your transit activity and community highlights"
            enabled={profile.notifyWeeklyDigest}
            onToggle={() =>
              updateProfile({
                notifyWeeklyDigest: !profile.notifyWeeklyDigest,
              })
            }
          />
        </SectionCard>

        {/* ════════════════════════════════════
            4. Account
           ════════════════════════════════════ */}
        <SectionCard index={3} icon={Settings} title="Account">
          <div className="space-y-3">
            {/* Sign Out */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();
                  await supabase.auth.signOut();
                } catch {
                  // Supabase not configured — ignore
                }
                router.push("/login");
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "var(--rb-danger)",
                color: "#fff",
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            {/* Delete Account */}
            <button
              type="button"
              onClick={() =>
                toast.warning(
                  "Account deletion is permanent. Please contact support to proceed.",
                  { duration: 5000 }
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "transparent",
                color: "var(--rb-danger)",
                border: "1px solid var(--rb-danger)",
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
