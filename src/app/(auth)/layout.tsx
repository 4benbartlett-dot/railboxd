import { Train } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--rb-bg)]">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--rb-accent)] flex items-center justify-center">
          <Train className="w-6 h-6 text-[var(--rb-bg)]" />
        </div>
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
