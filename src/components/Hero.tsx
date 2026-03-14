"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import HeroGraphic from "./HeroGraphic";

export default function Hero() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}#categories`);
    } else {
      router.push(`/#categories`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-[var(--color-background)] overflow-hidden relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-brand-navy)] leading-tight">
                Your Health,<br />
                <span className="text-[var(--color-brand-green)]">Delivered</span> to Your Doorstep.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg font-medium">
                Order genuine medicines and consult top doctors in Agra.
              </p>
            </div>

            {/* Interactive Element: Search Input */}
            <div 
              className={`relative max-w-md w-full transition-transform duration-300 ease-out ${isFocused ? '-translate-y-2' : ''}`}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-[var(--color-brand-green)]' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search Medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <div className="absolute inset-y-2 right-2 flex items-center">
                <button 
                  onClick={handleSearch}
                  className="px-6 py-2 bg-[var(--color-brand-navy)] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Graphic Content - Animated Loop */}
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
}
