"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Compass, User, Settings } from "lucide-react";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
] as const;

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

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

      {/* Settings link */}
      <div className="px-3 pb-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
