"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";

function getPasswordStrength(password: string) {
  const len = password.length;
  if (len === 0) return { level: 0, color: "transparent", label: "" };
  if (len < 6) return { level: 1, color: "#e54065", label: "Weak" };
  if (len < 10) return { level: 2, color: "#e5c040", label: "Fair" };
  return { level: 3, color: "#00e054", label: "Strong" };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }

  async function handleAppleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            home_city: homeCity,
          },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) {
        if (error.message.includes("fetch") || error.message.includes("URL")) {
          // Supabase not configured — demo mode
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.push("/dashboard");
          return;
        }
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      // Network error = Supabase not configured, fall back to demo mode
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/dashboard");
    }
  }

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--rb-bg-elevated)] border border-[var(--rb-border)] text-sm text-[var(--rb-text-bright)] placeholder:text-[var(--rb-text-muted)] focus:outline-none focus:border-[var(--rb-accent)] focus:shadow-[0_0_0_3px_rgba(0,224,84,0.15)] transition-all duration-200";

  return (
    <motion.div
      className="bg-[var(--rb-bg-card)] rounded-xl p-6 border border-[var(--rb-border)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--rb-text-bright)]">
          Join Railboxd
        </h2>
        <p className="text-sm text-[var(--rb-text-muted)] mt-1">
          Start tracking your transit journey
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-3">
        {/* Display name */}
        <motion.div variants={itemVariants} className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rb-text-muted)]" />
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
            required
            minLength={2}
            maxLength={30}
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants} className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rb-text-muted)]" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rb-text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} !pr-10`}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 px-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((segment) => (
                  <motion.div
                    key={segment}
                    className="h-1 flex-1 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: 1,
                      backgroundColor:
                        segment <= strength.level
                          ? strength.color
                          : "var(--rb-border)",
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" as const }}
                    style={{ originX: 0 }}
                  />
                ))}
              </div>
              <p
                className="text-[11px] mt-1"
                style={{ color: strength.color }}
              >
                {strength.label}
              </p>
            </div>
          )}
        </motion.div>

        {/* Home city */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rb-text-muted)]" />
            <input
              type="text"
              placeholder="Home city"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className={inputClass}
            />
          </div>
          <p className="text-[11px] text-[var(--rb-text-muted)] mt-1 px-1">
            Used for &ldquo;Near You&rdquo; recommendations
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[var(--rb-danger)] px-1"
          >
            {error}
          </motion.p>
        )}

        {/* Submit button */}
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--rb-accent)] text-sm font-semibold text-[var(--rb-bg)] hover:bg-[var(--rb-accent-hover)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 my-5"
      >
        <div className="flex-1 h-px bg-[var(--rb-border)]" />
        <span className="text-xs text-[var(--rb-text-muted)]">
          or sign up with
        </span>
        <div className="flex-1 h-px bg-[var(--rb-border)]" />
      </motion.div>

      {/* SSO buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-elevated)] text-sm font-medium text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg)] hover:border-[var(--rb-text-muted)] active:scale-[0.97] transition-all duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={handleAppleSignIn}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-elevated)] text-sm font-medium text-[var(--rb-text-bright)] hover:bg-[var(--rb-bg)] hover:border-[var(--rb-text-muted)] active:scale-[0.97] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </motion.div>

      {/* Sign in link */}
      <motion.p
        variants={itemVariants}
        className="mt-5 text-center text-sm text-[var(--rb-text-muted)]"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--rb-accent)] hover:underline font-medium"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
