"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Compass, User, Settings, LogIn } from "lucide-react";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";
import { useAppStore } from "@/stores/app-store";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home, authRequired: false },
  { href: "/search", label: "Search", icon: Search, authRequired: false },
  { href: "/explore", label: "Explore", icon: Compass, authRequired: false },
  { href: "/profile", label: "Profile", icon: User, authRequired: true },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-[var(--rb-border)] bg-[var(--rb-bg)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--rb-border)]">
        <RailboxdLogo size={32} />
        <span className="text-lg font-bold text-[var(--rb-text-bright)] tracking-tight">
          Railboxd
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          if (item.authRequired && !isAuthenticated) return null;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--rb-accent)]/10 text-[var(--rb-accent)]"
                  : "text-[var(--rb-text)] hover:bg-[var(--rb-bg-hover)] hover:text-[var(--rb-text-bright)]"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-2">
        {isAuthenticated ? (
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/settings" || pathname.startsWith("/settings/")
                ? "bg-[var(--rb-accent)]/10 text-[var(--rb-accent)]"
                : "text-[var(--rb-text)] hover:bg-[var(--rb-bg-hover)] hover:text-[var(--rb-text-bright)]"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        ) : (
          <div className="flex flex-col gap-1">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--rb-text)] hover:bg-[var(--rb-bg-hover)] hover:text-[var(--rb-text-bright)]"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 mx-1 py-2 rounded-lg text-sm font-bold transition-all hover:brightness-110"
              style={{ background: "#00e054", color: "#000" }}
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--rb-border)]">
        <p className="text-xs text-[var(--rb-text-muted)]">
          Your transit life, uncovered.
        </p>
      </div>
    </aside>
  );
}
