"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--rb-accent)]/10 mb-4">
        <Icon className="w-8 h-8 text-[var(--rb-accent)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--rb-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[var(--rb-text-muted)] max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--rb-accent)] text-white text-sm font-medium hover:bg-[var(--rb-accent)]/90 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
