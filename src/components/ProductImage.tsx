interface ProductImageProps {
  category: string;
  name: string;
  size?: number;
}

const CATEGORY_CONFIG: Record<string, {
  bg: string; accent: string; shape: string;
}> = {
  medicines:   { bg: "#DCFCE7", accent: "#16A34A", shape: "pill" },
  vitamins:    { bg: "#FEF9C3", accent: "#CA8A04", shape: "capsule" },
  devices:     { bg: "#DBEAFE", accent: "#2563EB", shape: "device" },
  personalCare:{ bg: "#FCE7F3", accent: "#DB2777", shape: "bottle" },
  babyCare:    { bg: "#D1FAE5", accent: "#059669", shape: "baby" },
  nutrition:   { bg: "#FEF3C7", accent: "#D97706", shape: "tin" },
  painRelief:  { bg: "#FFE4E6", accent: "#E11D48", shape: "bolt" },
  firstAid:    { bg: "#FEE2E2", accent: "#DC2626", shape: "cross" },
  oralCare:    { bg: "#CCFBF1", accent: "#0D9488", shape: "brush" },
  skincare:    { bg: "#F3E8FF", accent: "#9333EA", shape: "cream" },
};

export default function ProductImage({ 
  category, name, size = 200 
}: ProductImageProps) {
  // Normalize category key for lookup
  const normalizedCategory = category.toLowerCase().replace(/ & /g, '').replace(/ /g, '');
  const config = CATEGORY_CONFIG[normalizedCategory] 
    || { bg: "#F3F4F6", accent: "#6B7280", shape: "pill" };

  const truncatedName = name.length > 18 
    ? name.slice(0, 16) + "…" 
    : name;

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Background */}
      <rect width="200" height="200" fill={config.bg} rx="16"/>

      {/* Shape based on category */}
      {config.shape === "pill" && (
        <g transform="translate(100,90)">
          <rect x="-40" y="-16" width="80" height="32"
            rx="16" fill={config.accent} opacity="0.9"/>
          <line x1="0" y1="-16" x2="0" y2="16"
            stroke="white" strokeWidth="2" opacity="0.5"/>
        </g>
      )}
      {config.shape === "capsule" && (
        <g transform="translate(100,90)">
          <ellipse cx="-20" cy="0" rx="20" ry="32"
            fill={config.accent} opacity="0.9"/>
          <ellipse cx="20" cy="0" rx="20" ry="32"
            fill="white" stroke={config.accent} strokeWidth="2"/>
        </g>
      )}
      {config.shape === "device" && (
        <g transform="translate(100,90)">
          <rect x="-36" y="-28" width="72" height="56"
            rx="8" fill={config.accent} opacity="0.9"/>
          <rect x="-28" y="-20" width="56" height="32"
            rx="4" fill="white" opacity="0.8"/>
          <line x1="-16" y1="-4" x2="16" y2="-4"
            stroke={config.accent} strokeWidth="2.5"/>
          <line x1="-8" y1="4" x2="8" y2="4"
            stroke={config.accent} strokeWidth="2"/>
        </g>
      )}
      {config.shape === "bottle" && (
        <g transform="translate(100,90)">
          <rect x="-14" y="-36" width="28" height="8"
            rx="4" fill={config.accent} opacity="0.7"/>
          <path d="M-18,-28 Q-28,0 -24,36 L24,36 Q28,0 18,-28 Z"
            fill={config.accent} opacity="0.9"/>
          <rect x="-12" y="-8" width="24" height="3"
            rx="1.5" fill="white" opacity="0.6"/>
        </g>
      )}
      {config.shape === "cross" && (
        <g transform="translate(100,90)">
          <rect x="-36" y="-36" width="72" height="72"
            rx="12" fill={config.accent} opacity="0.15"/>
          <rect x="-10" y="-32" width="20" height="64"
            rx="6" fill={config.accent} opacity="0.9"/>
          <rect x="-32" y="-10" width="64" height="20"
            rx="6" fill={config.accent} opacity="0.9"/>
        </g>
      )}
      {config.shape === "bolt" && (
        <g transform="translate(100,90)">
          <polygon
            points="10,-40 -20,0 8,0 -10,40 24,-4 -4,-4"
            fill={config.accent} opacity="0.9"/>
        </g>
      )}
      {config.shape === "tin" && (
        <g transform="translate(100,90)">
          <ellipse cx="0" cy="-24" rx="28" ry="8"
            fill={config.accent} opacity="0.8"/>
          <rect x="-28" y="-24" width="56" height="52"
            fill={config.accent} opacity="0.9"/>
          <ellipse cx="0" cy="28" rx="28" ry="8"
            fill={config.accent} opacity="0.7"/>
          <rect x="-18" y="-8" width="36" height="3"
            rx="1.5" fill="white" opacity="0.5"/>
        </g>
      )}
      {config.shape === "brush" && (
        <g transform="translate(100,90)">
          <rect x="-8" y="-40" width="16" height="52"
            rx="6" fill={config.accent} opacity="0.9"/>
          <rect x="-14" y="12" width="28" height="20"
            rx="4" fill={config.accent} opacity="0.7"/>
          <rect x="-4" y="32" width="8" height="12"
            rx="2" fill="white" opacity="0.8"/>
        </g>
      )}
      {config.shape === "cream" && (
        <g transform="translate(100,90)">
          <rect x="-24" y="0" width="48" height="36"
            rx="6" fill={config.accent} opacity="0.9"/>
          <path d="M-24,0 Q-24,-20 0,-28 Q24,-20 24,0 Z"
            fill={config.accent} opacity="0.7"/>
          <rect x="-14" y="8" width="28" height="3"
            rx="1.5" fill="white" opacity="0.5"/>
        </g>
      )}
      {config.shape === "baby" && (
        <g transform="translate(100,86)">
          <circle cx="0" cy="-28" r="20"
            fill={config.accent} opacity="0.9"/>
          <path d="M-20,0 Q-24,24 0,32 Q24,24 20,0 Q8,-8 0,-8 Q-8,-8 -20,0Z"
            fill={config.accent} opacity="0.8"/>
        </g>
      )}

      {/* Bottom accent bar */}
      <rect x="0" y="172" width="200" height="28"
        rx="0" fill={config.accent} opacity="0.15"/>

      {/* Product name */}
      <text
        x="100" y="186"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={config.accent}
        fontFamily="system-ui, sans-serif"
      >
        {truncatedName}
      </text>
    </svg>
  );
}
