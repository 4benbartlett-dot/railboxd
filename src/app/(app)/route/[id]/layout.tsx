import type { Metadata } from "next";
import { getRouteById, getAgencyById } from "@/lib/demo-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const route = getRouteById(id);
  if (!route) return { title: "Route Not Found" };

  const agency = getAgencyById(route.agency_id);
  const title = `${route.long_name} (${route.short_name} Line)`;
  const description = `${route.long_name} — ${agency?.name ?? "Transit"}. ${route.station_ids.length} stations. Log your ride, read reviews, and explore this route on Railboxd.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Railboxd`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Railboxd`,
      description,
    },
  };
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
