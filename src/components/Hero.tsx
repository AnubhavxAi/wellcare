"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, CheckCircle, Truck, FileText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <section className="bg-surface overflow-hidden pt-6 lg:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Container */}
        <div className="relative bg-gradient-to-br from-teal-800 to-emerald-600 rounded-[24px] overflow-hidden shadow-2xl">
          
          {/* Subtle Botanical Pattern SVG Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="leaf-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M40 0 C48 16 64 24 80 40 C64 56 48 64 40 80 C32 64 16 56 0 40 C16 24 32 16 40 0 Z" fill="currentColor" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern)" className="text-white" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
            
            {/* Left Column */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                  Your Health,<br />Delivered Fast.
                </h1>
                <p className="text-lg md:text-xl text-teal-50 max-w-lg font-medium drop-shadow-sm">
                  Order medicines, lab tests, and wellness essentials with free doorstep delivery across Agra.
                </p>
              </div>

              {/* Glassmorphic Search Bar */}
              <div 
                className={`relative flex items-center bg-white/20 backdrop-blur-xl border border-white/40 p-2 rounded-[20px] shadow-xl transition-transform duration-300 ease-out ${isFocused ? 'scale-[1.02]' : ''}`}
              >
                <div className="pl-4 pr-2 flex items-center pointer-events-none text-white/80">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search Medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white placeholder-white/80 focus:outline-none text-lg py-3"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                
                {/* Vertical Chevrons container */}
                <div className="hidden sm:flex flex-col space-y-1 mx-2">
                   <button className="p-1 text-white/60 hover:text-white hover:bg-white/20 rounded-md transition-colors rotate-90" aria-label="Previous">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="p-1 text-white/60 hover:text-white hover:bg-white/20 rounded-md transition-colors rotate-90" aria-label="Next">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="ml-auto">
                  <button 
                    onClick={handleSearch}
                    className="px-6 py-3 bg-teal-900 text-white font-bold rounded-2xl hover:bg-teal-950 transition-colors shadow-lg whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (Media) */}
            <div className="relative hidden lg:block h-full min-h-[480px]">
               {/* Doctor Image Cutout anchored to bottom right */}
               <div className="absolute bottom-0 right-0 w-full h-[120%] flex items-end justify-end pointer-events-none">
                  {/* Since image might not exist, provide an external transparent doctor layer or rely on local asset */}
                  <img
                    src="/images/doctor-hero.png"
                    alt="Doctor holding tablet"
                    className="object-contain object-bottom max-h-[105%] w-auto z-20"
                    onError={(e) => {
                      // Fallback transparent doctor png if local not found
                      e.currentTarget.src = "https://cdn.pixabay.com/photo/2024/02/10/14/46/doctor-8564858_1280.png"
                    }}
                  />
               </div>
            </div>
            
          </div>
        </div>

        {/* Feature Cards Grid (Exactly Below Banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 transform transition-transform hover:-translate-y-1 hover:shadow-md cursor-default group">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Genuine Medicines</h3>
            <p className="text-gray-500 text-sm">100% Authentic Products</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 transform transition-transform hover:-translate-y-1 hover:shadow-md cursor-default group">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2 group-hover:bg-indigo-100 transition-colors">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Fast Delivery</h3>
            <p className="text-gray-500 text-sm">Quick Doorstep Service</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 transform transition-transform hover:-translate-y-1 hover:shadow-md cursor-default group">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2 group-hover:bg-amber-100 transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Lab Reports</h3>
            <p className="text-gray-500 text-sm">Accurate & Reliable</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 transform transition-transform hover:-translate-y-1 hover:shadow-md cursor-default group">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-2 group-hover:bg-rose-100 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Secure Payments</h3>
            <p className="text-gray-500 text-sm">Safe Transactions</p>
          </div>

        </div>

      </div>
    </section>
  );
}
