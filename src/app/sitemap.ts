import type { MetadataRoute } from "next";
import { demoRoutes, demoStations } from "@/lib/demo-data";
import { getAllLandmarks } from "@/lib/urbanist-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://railboxd.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/explore`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Route pages
  const routePages: MetadataRoute.Sitemap = demoRoutes.map((route) => ({
    url: `${siteUrl}/route/${route.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Station pages
  const stationPages: MetadataRoute.Sitemap = demoStations.map((station) => ({
    url: `${siteUrl}/station/${station.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Landmark pages
  const landmarkPages: MetadataRoute.Sitemap = getAllLandmarks().map((landmark) => ({
    url: `${siteUrl}/landmark/${landmark.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...routePages, ...stationPages, ...landmarkPages];
}
