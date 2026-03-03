"use client";

import { useEffect } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { LogModal } from "@/components/log/log-modal";
import { AuthPromptModal } from "@/components/auth/auth-prompt-modal";
import { useAppStore } from "@/stores/app-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setUserId = useAppStore((s) => s.setUserId);
  const hydrateFromSupabase = useAppStore((s) => s.hydrateFromSupabase);
  const clearUserData = useAppStore((s) => s.clearUserData);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    async function initAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setAuthenticated(true);
          setUserId(user.id);
          // Hydrate store from Supabase (replaces localStorage data)
          hydrateFromSupabase(user.id);
        } else {
          setAuthenticated(false);
          setUserId(null);
        }

        // Listen for explicit auth changes only (INITIAL_SESSION is handled above)
        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              setAuthenticated(true);
              setUserId(session.user.id);
              hydrateFromSupabase(session.user.id);
            } else if (event === "SIGNED_OUT") {
              setAuthenticated(false);
              clearUserData();
            }
          }
        );
        subscription = sub;
      } catch {
        // Supabase not configured — stay as guest
        setAuthenticated(false);
        setUserId(null);
      }
    }

    initAuth();
    return () => subscription?.unsubscribe();
  }, [setAuthenticated, setUserId, hydrateFromSupabase, clearUserData]);

  return (
    <div className="min-h-screen bg-[var(--rb-bg)]">
      <Sidebar />
      <main className="md:ml-60 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <LogModal />
      <AuthPromptModal />
    </div>
  );
}
