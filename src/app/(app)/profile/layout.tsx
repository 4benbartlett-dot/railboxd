import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your Railboxd profile, ride history, and transit stats.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
