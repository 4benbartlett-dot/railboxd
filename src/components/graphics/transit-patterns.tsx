/**
 * Very subtle CSS/SVG background patterns for atmosphere.
 * Applied at 0.02-0.05 opacity — should be nearly invisible.
 */

interface PatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export function TopoPattern({
  className = "",
  opacity = 0.03,
  color = "var(--rb-accent)",
}: PatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${color} 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, ${color} 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, ${color} 0.5px, transparent 0.5px)
        `,
        backgroundSize: "60px 60px, 80px 80px, 30px 30px",
      }}
    />
  );
}

export function StationDotGrid({
  className = "",
  opacity = 0.04,
  color = "var(--rb-accent)",
}: PatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

export function RouteLines({
  className = "",
  opacity = 0.02,
  color = "var(--rb-accent)",
}: PatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(30deg, transparent 48%, ${color} 48%, ${color} 52%, transparent 52%),
          linear-gradient(-30deg, transparent 48%, ${color} 48%, ${color} 52%, transparent 52%)
        `,
        backgroundSize: "80px 140px, 80px 140px",
      }}
    />
  );
}
