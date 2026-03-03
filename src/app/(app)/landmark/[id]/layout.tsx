import type { Metadata } from "next";
import {
  getLandmarkById,
  LANDMARK_TYPE_LABELS,
} from "@/lib/urbanist-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const landmark = getLandmarkById(id);
  if (!landmark) return { title: "Landmark Not Found" };

  const typeLabel = LANDMARK_TYPE_LABELS[landmark.type];
  const title = landmark.name;
  const description = `${landmark.name} — ${typeLabel} in San Diego. ${landmark.description.slice(0, 140)}${landmark.description.length > 140 ? "..." : ""}`;

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

export default function LandmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
