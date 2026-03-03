"use client";

import { useEffect } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { LogModal } from "@/components/log/log-modal";
import { AuthPromptModal } from "@/components/auth/auth-prompt-modal";
import { useAppStore } from "@/stores/app-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  // Check auth state on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setAuthenticated(!!user);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setAuthenticated(!!session?.user);
          }
        );
        return () => subscription.unsubscribe();
      } catch {
        // Supabase not configured — stay as guest
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, [setAuthenticated]);

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
