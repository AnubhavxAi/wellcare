"use client";

import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  categoryIcon?: string;
}

export default function ProductImage({ src, alt, className = "", categoryIcon = "💊" }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setErrorCount(0);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (errorCount === 0) {
      // First fallback: Try Apollo's WebP/Optimized transform
      const optimizedUrl = src.includes("apollo247.in") 
        ? `${src}?tr=q-80,f-webp,w-400` 
        : src;
      
      if (optimizedUrl !== currentSrc) {
        setCurrentSrc(optimizedUrl);
        setErrorCount(1);
      } else {
        setErrorCount(2); // Skip directly to SVG if optimized is same
      }
    } else {
      // Final fallback: Show SVG Placeholder
      setErrorCount(2);
    }
  };

  if (errorCount >= 2 || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200 ${className}`}>
        <div className="text-4xl mb-2 opacity-50">{categoryIcon}</div>
        <span className="text-xs text-center text-gray-400 font-medium px-2 leading-tight">
          {alt}
        </span>
        <div className="absolute top-2 right-2 opacity-20">
          <ImageOff size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-2xl opacity-20">{categoryIcon}</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
