"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Compass, User, LogIn } from "lucide-react";
import { RailboxdLogo } from "@/components/graphics/railboxd-logo";
import { useAppStore } from "@/stores/app-store";

const leftTabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
] as const;

const rightTabsAuth = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
] as const;

const rightTabsGuest = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/login", label: "Log In", icon: LogIn },
] as const;

function NavTab({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "text-[var(--rb-accent)]"
          : "text-[var(--rb-text-muted)] hover:text-[var(--rb-text)]"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const rightTabs = isAuthenticated ? rightTabsAuth : rightTabsGuest;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--rb-border)] bg-[var(--rb-bg)]/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {leftTabs.map((tab) => (
          <NavTab key={tab.href} {...tab} isActive={isActive(tab.href)} />
        ))}

        {/* Center logo */}
        <Link href="/dashboard" className="flex flex-col items-center -mt-4">
          <RailboxdLogo size={36} animate={false} />
        </Link>

        {rightTabs.map((tab) => (
          <NavTab key={tab.href} {...tab} isActive={isActive(tab.href)} />
        ))}
      </div>
    </nav>
  );
}
