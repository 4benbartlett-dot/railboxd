/**
 * Stylized SVG transit illustrations for decorative use.
 * Keep these lightweight — used as section accents and empty state graphics.
 */

interface IconProps {
  className?: string;
  color?: string;
}

export function TrainSilhouette({ className = "", color = "var(--rb-accent)" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="90" height="35" rx="8" fill={color} fillOpacity="0.08" />
      <rect x="20" y="15" width="25" height="15" rx="3" fill={color} fillOpacity="0.15" />
      <rect x="50" y="15" width="25" height="15" rx="3" fill={color} fillOpacity="0.15" />
      <rect x="80" y="15" width="20" height="15" rx="3" fill={color} fillOpacity="0.15" />
      <line x1="10" y1="48" x2="110" y2="48" stroke={color} strokeOpacity="0.2" strokeWidth="2" />
      <circle cx="35" cy="48" r="5" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="85" cy="48" r="5" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" />
    </svg>
  );
}

export function CitylineSkyline({ className = "", color = "var(--rb-accent)" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="25" width="12" height="35" fill={color} fillOpacity="0.06" />
      <rect x="25" y="15" width="10" height="45" fill={color} fillOpacity="0.08" />
      <rect x="38" y="30" width="15" height="30" fill={color} fillOpacity="0.05" />
      <rect x="56" y="8" width="8" height="52" fill={color} fillOpacity="0.10" />
      <rect x="67" y="20" width="14" height="40" fill={color} fillOpacity="0.07" />
      <rect x="84" y="12" width="10" height="48" fill={color} fillOpacity="0.09" />
      <rect x="97" y="28" width="16" height="32" fill={color} fillOpacity="0.06" />
      <rect x="116" y="18" width="9" height="42" fill={color} fillOpacity="0.08" />
      <rect x="128" y="32" width="12" height="28" fill={color} fillOpacity="0.05" />
      <rect x="143" y="22" width="11" height="38" fill={color} fillOpacity="0.07" />
      <rect x="157" y="10" width="8" height="50" fill={color} fillOpacity="0.09" />
      <rect x="168" y="35" width="14" height="25" fill={color} fillOpacity="0.06" />
      <rect x="185" y="25" width="10" height="35" fill={color} fillOpacity="0.07" />
    </svg>
  );
}

export function TrackPattern({ className = "", color = "var(--rb-accent)" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="200" y2="10" stroke={color} strokeOpacity="0.15" strokeWidth="2" />
      {/* Crossties */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1={10 + i * 10} y1="4" x2={10 + i * 10} y2="16" stroke={color} strokeOpacity="0.1" strokeWidth="1.5" />
      ))}
    </svg>
  );
}
