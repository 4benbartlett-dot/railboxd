import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://railboxd.com";

export const metadata: Metadata = {
  title: {
    default: "Railboxd — Your transit life, uncovered",
    template: "%s | Railboxd",
  },
  description:
    "Track your transit rides, rate routes, discover stations, and explore urban landmarks. The Letterboxd for transit enthusiasts.",
  keywords: [
    "transit tracker",
    "train log",
    "rail journal",
    "public transit",
    "light rail",
    "subway tracker",
    "commuter rail",
    "transit diary",
    "route rating",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Railboxd",
    title: "Railboxd — Your transit life, uncovered",
    description:
      "Track your transit rides, rate routes, discover stations, and explore urban landmarks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Railboxd — Your transit life, uncovered",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Railboxd — Your transit life, uncovered",
    description:
      "Track your transit rides, rate routes, discover stations, and explore urban landmarks.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--rb-bg)] text-[var(--rb-text)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
