import React from 'react';

type CategoryType = 
  | 'medicines' 
  | 'vitamins' 
  | 'devices' 
  | 'personalCare' 
  | 'babyCare' 
  | 'nutrition' 
  | 'painRelief' 
  | 'firstAid' 
  | 'oralCare' 
  | 'skincare';

interface ProductIllustrationProps {
  category: CategoryType | string;
  name: string;
  className?: string; // Optional for sizing containers
}

const CATEGORY_CONFIG: Record<string, { bg: string; accent: string }> = {
  medicines: { bg: '#E8F5F0', accent: '#1D9E75' },
  vitamins: { bg: '#FFF8E7', accent: '#F59E0B' },
  devices: { bg: '#EFF6FF', accent: '#3B82F6' },
  personalCare: { bg: '#FFF0F6', accent: '#EC4899' },
  babyCare: { bg: '#F0FDF4', accent: '#22C55E' },
  nutrition: { bg: '#FFFBEB', accent: '#D97706' },
  painRelief: { bg: '#FFF1F2', accent: '#F43F5E' },
  firstAid: { bg: '#FFF5F5', accent: '#EF4444' },
  oralCare: { bg: '#F0FDFA', accent: '#14B8A6' },
  skincare: { bg: '#FAF5FF', accent: '#A855F7' },
  default: { bg: '#F3F4F6', accent: '#9CA3AF' },
};

export default function ProductIllustration({ category, name, className = "w-full h-full object-contain" }: ProductIllustrationProps) {
  // Normalize category key safely
  let configKey = "default";
  if (category && typeof category === "string") {
    // Camel case matching: 'Pain Relief' -> 'painRelief'
    const normalized = category.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    // Attempt to map back to original keys
    const keys = Object.keys(CATEGORY_CONFIG);
    const match = keys.find(k => k.toLowerCase() === normalized);
    if (match) {
      configKey = match;
    } else {
        // hardcode mappings if needed just in case
        if (category.toLowerCase().includes('medicine')) configKey = 'medicines';
        if (category.toLowerCase().includes('vitamin')) configKey = 'vitamins';
    }
  }

  const config = CATEGORY_CONFIG[configKey] || CATEGORY_CONFIG.default;

  const renderIcon = (cat: string, color: string) => {
    switch (cat) {
      case 'medicines':
        // Two joined ovals (pill)
        return (
          <g transform="translate(70, 70) rotate(-45)">
            <rect x="0" y="20" width="60" height="20" rx="10" fill={color} />
            <path d="M 30 20 L 30 40" stroke="#fff" strokeWidth="2" />
          </g>
        );
      case 'vitamins':
        // Hexagonal capsule
        return (
          <polygon points="100,60 125,75 125,105 100,120 75,105 75,75" fill={color} strokeWidth="4" strokeLinejoin="round" />
        );
      case 'devices':
        // digital screen with line
        return (
          <g transform="translate(65, 65)">
            <rect x="0" y="0" width="70" height="50" rx="6" fill="white" stroke={color} strokeWidth="6" />
            <path d="M 15 25 L 25 25 L 35 10 L 45 40 L 55 25 L 60 25" stroke={color} strokeWidth="3" fill="none" strokeLinejoin="round" />
          </g>
        );
      case 'personalCare':
        // droplet/bottle
        return (
          <path d="M 100 60 C 100 60 70 100 70 120 C 70 140 130 140 130 120 C 130 100 100 60 100 60 Z" fill={color} />
        );
      case 'babyCare':
        // baby rattle
        return (
          <g transform="translate(80, 60)">
            <circle cx="20" cy="20" r="20" fill={color} />
            <rect x="16" y="40" width="8" height="30" rx="4" fill={color} />
            <circle cx="20" cy="74" r="6" fill={color} />
          </g>
        );
      case 'nutrition':
        // scoop/powder tin
        return (
          <g transform="translate(70, 60)">
            <rect x="0" y="20" width="60" height="50" rx="4" fill={color} />
            <ellipse cx="30" cy="20" rx="30" ry="8" fill={color} opacity="0.8" />
            <path d="M 20 5 L 40 5 L 35 20 L 25 20 Z" fill="white" opacity="0.9" />
          </g>
        );
      case 'painRelief':
        // lightning bolt
        return (
          <path d="M 110 50 L 70 100 L 95 100 L 85 140 L 130 85 L 100 85 Z" fill={color} />
        );
      case 'firstAid':
        // medical cross
        return (
          <g transform="translate(75, 75)">
            <rect x="15" y="0" width="20" height="50" rx="4" fill={color} />
            <rect x="0" y="15" width="50" height="20" rx="4" fill={color} />
          </g>
        );
      case 'oralCare':
        // toothbrush silhouette
        return (
          <g transform="translate(90, 50) rotate(15)">
            <rect x="0" y="0" width="10" height="80" rx="5" fill={color} />
            <rect x="-5" y="5" width="5" height="20" fill={color} opacity="0.7" />
          </g>
        );
      case 'skincare':
        // cream tube/bottle
        return (
          <g transform="translate(80, 60)">
            <path d="M 10 10 C 10 10 30 10 30 10 L 35 60 C 35 70 5 70 5 60 Z" fill={color} />
            <rect x="12" y="0" width="16" height="10" rx="2" fill={color} opacity="0.8" />
          </g>
        );
      default:
        // simple generic box
        return (
          <rect x="75" y="75" width="50" height="50" rx="10" fill={color} opacity="0.5" />
        );
    }
  };

  const truncate = (str: string, max: number) => 
    str.length > max ? str.substring(0, max) + '...' : str;

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="200" height="200" fill={config.bg} rx="12"/>
      
      {/* Draw category icon in center */}
      {renderIcon(configKey, config.accent)}
      
      {/* Product name - max 2 lines (we use 1 for simplicity and truncation), 12px, centered, bottom area */}
      <text x="100" y="168" textAnchor="middle" fontSize="11" fill="#374151" fontFamily="sans-serif" fontWeight="500">
        {truncate(name, 26)}
      </text>
      
      {/* Color accent bar at bottom */}
      <rect x="0" y="188" width="200" height="12" fill={config.accent} rx="0"/>
    </svg>
  );
}
