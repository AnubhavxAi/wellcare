"use client";
import Image from "next/image";
import { useState } from "react";
import ProductImage from "./ProductImage";

interface Props {
  src?: string;
  category: string;
  name: string;
  size?: number;
  className?: string;
}

export default function SmartProductImage({ 
  src, category, name, size = 200, className 
}: Props) {
  const [failed, setFailed] = useState(false);

  // No src or image failed → show SVG illustration
  if (!src || failed) {
    return (
      <div className={className}>
        <ProductImage 
          category={category} 
          name={name} 
          size={size} 
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={name}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain", borderRadius: "8px" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
