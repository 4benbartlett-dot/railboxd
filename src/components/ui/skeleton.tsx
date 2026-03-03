import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--rb-bg-elevated)] rounded-lg",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function SkeletonAvatar() {
  return <Skeleton className="w-10 h-10 rounded-full" />;
}

export function SkeletonStat() {
  return (
    <div className="rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] p-4 space-y-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
