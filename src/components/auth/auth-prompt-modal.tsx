"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

export function AuthPromptModal() {
  const open = useAppStore((s) => s.authPromptOpen);
  const message = useAppStore((s) => s.authPromptMessage);
  const close = useAppStore((s) => s.closeAuthPrompt);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-[25%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-auto sm:w-[400px] rounded-2xl shadow-2xl"
            style={{
              background: "var(--rb-bg-card)",
              border: "1px solid var(--rb-border)",
            }}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-[#9ab]" />
            </button>

            {/* Content */}
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="mx-auto mb-4 w-fit">
                <RailboxdLogo size={48} animate={false} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Join Railboxd
              </h2>
              <p className="text-sm text-[#9ab] mb-1">
                {message || "Sign in to track your transit adventures."}
              </p>
              <p className="text-xs text-[#456] mb-6">
                Log rides, rate routes, and build your transit diary.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/signup"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110"
                  style={{ background: "#00e054", color: "#000" }}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Link>
                <Link
                  href="/login"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background: "transparent",
                    color: "#9ab",
                    border: "1px solid var(--rb-border)",
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
