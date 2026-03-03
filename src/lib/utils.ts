import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTransitModeLabel(routeType: number): string {
  const modes: Record<number, string> = {
    0: "Tram",
    1: "Subway",
    2: "Rail",
    3: "Bus",
    4: "Ferry",
    5: "Cable Tram",
    6: "Gondola",
    7: "Funicular",
    11: "Trolleybus",
    12: "Monorail",
  };
  return modes[routeType] ?? "Transit";
}

export function getTransitModeIcon(routeType: number): string {
  const icons: Record<number, string> = {
    0: "tram",
    1: "subway",
    2: "train",
    3: "bus",
    4: "ferry",
    5: "cable-car",
    6: "gondola",
    7: "funicular",
    11: "trolleybus",
    12: "monorail",
  };
  return icons[routeType] ?? "train";
}

export function computeAverageRating(ratings: {
  reliability?: number | null;
  comfort?: number | null;
  safety?: number | null;
  scenery?: number | null;
}): number | null {
  const values = [
    ratings.reliability,
    ratings.comfort,
    ratings.safety,
    ratings.scenery,
  ].filter((v): v is number => v != null);
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
