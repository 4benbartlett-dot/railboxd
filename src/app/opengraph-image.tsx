import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Railboxd — Your transit life, uncovered";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1a0f 0%, #142118 50%, #1c2e22 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative rail lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            opacity: 0.06,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 78px, #00e054 78px, #00e054 80px)",
          }}
        />
        {/* Logo square */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(145deg, #00e054, #00a83c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 8px 40px rgba(0,224,84,0.3)",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <rect x="22" y="12" width="56" height="62" rx="14" fill="rgba(0,0,0,0.82)" />
            <rect x="28" y="8" width="44" height="10" rx="5" fill="rgba(0,0,0,0.65)" />
            <rect x="30" y="22" width="40" height="22" rx="6" fill="rgba(255,255,255,0.92)" />
            <line x1="50" y1="22" x2="50" y2="44" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
            <rect x="22" y="50" width="56" height="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="34" cy="62" r="5" fill="#FFE066" />
            <circle cx="66" cy="62" r="5" fill="#FFE066" />
            <rect x="38" y="70" width="24" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
            <rect x="15" y="82" width="70" height="2.5" rx="1.25" fill="rgba(0,0,0,0.5)" />
            <rect x="15" y="90" width="70" height="2.5" rx="1.25" fill="rgba(0,0,0,0.5)" />
          </svg>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Railboxd
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#00e054",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          Your transit life, uncovered.
        </div>
        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #00e054, #00c847, #00a83c, #00e054)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
