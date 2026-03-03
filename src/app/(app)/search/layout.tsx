import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Routes",
  description:
    "Search for transit routes, stations, and lines across San Diego on Railboxd.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
