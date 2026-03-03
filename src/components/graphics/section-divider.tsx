/**
 * Transit-route-map-style horizontal dividers with station dots.
 */

interface SectionDividerProps {
  className?: string;
  color?: string;
  dotCount?: number;
}

export function SectionDivider({
  className = "",
  color = "var(--rb-accent)",
  dotCount = 3,
}: SectionDividerProps) {
  return (
    <div className={`flex items-center gap-0 w-full my-6 ${className}`}>
      {/* Left line */}
      <div className="flex-1 h-px" style={{ background: `${color}20` }} />

      {/* Station dots */}
      <div className="flex items-center gap-3 mx-4">
        {Array.from({ length: dotCount }).map((_, i) => (
          <div key={i} className="relative">
            <div
              className="w-2.5 h-2.5 rounded-full border-[1.5px]"
              style={{
                borderColor: `${color}40`,
                background: i === Math.floor(dotCount / 2) ? `${color}30` : "transparent",
              }}
            />
            {/* Connecting mini-lines between dots */}
            {i < dotCount - 1 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 left-full w-3 h-px"
                style={{ background: `${color}20` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Right line */}
      <div className="flex-1 h-px" style={{ background: `${color}20` }} />
    </div>
  );
}

export function SectionDividerSimple({
  className = "",
  color = "var(--rb-border)",
}: { className?: string; color?: string }) {
  return (
    <div className={`w-full my-8 ${className}`}>
      <div className="h-px" style={{ background: color }} />
    </div>
  );
}
