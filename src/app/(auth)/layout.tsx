"use client";

import { RailboxdLogo } from "@/components/graphics/railboxd-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--rb-bg)]">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <RailboxdLogo size={44} />
        <h1 className="text-2xl font-bold text-[var(--rb-text-bright)] tracking-tight">
          Railboxd
        </h1>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-sm">{children}</div>

      {/* Tagline */}
      <p className="mt-8 text-sm text-[var(--rb-text-muted)]">
        Your transit life, uncovered.
      </p>
    </div>
  );
}
