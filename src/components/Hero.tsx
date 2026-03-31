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

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[480px] p-8 sm:p-12 lg:p-16">
            
            {/* Left Column */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="flex flex-col">
                <span className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Agra's Most Trusted Pharmacy
                </span>
                <span className="text-[#9df898] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1">
                  — At Your Door in Under 2 Hours
                </span>
                <span className="text-white/90 text-xl sm:text-2xl font-medium mt-6">
                  Delivering medicines and health across Agra.
                </span>
              </h1>

              <p style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "1.1rem",
                lineHeight: 1.75,
                maxWidth: "480px",
                marginTop: "20px",
                marginBottom: "36px",
              }}>
                Genuine medicines, lab tests at home, and health essentials
                — delivered to every corner of Agra. No queues. No waiting.
                Order now and track your delivery in real time.
              </p>

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

              {/* CTA Buttons */}
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"16px" }}>
                <a href="/shop" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "linear-gradient(135deg, #9df898 0%, #2e8534 100%)",
                  color: "#002d06",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 8px 28px rgba(157,248,152,0.30)",
                  transition: "all 0.25s ease",
                }}>
                  <span className="material-symbols-outlined" style={{fontSize:"18px"}}>
                    medication
                  </span>
                  Order Medicines
                </a>
                <a href="/lab-tests" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(12px)",
                  color: "white",
                  border: "1.5px solid rgba(255,255,255,0.32)",
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}>
                  <span className="material-symbols-outlined" style={{fontSize:"18px"}}>
                    science
                  </span>
                  Book Lab Test
                </a>
              </div>

              {/* Trust Line */}
              <p style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.78rem",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}>
                <span>✓ 500+ medicines in stock</span>
                <span>✓ Delivers across all Agra localities</span>
                <span>✓ COD available</span>
              </p>

            </div>

            {/* Right Column (Media) */}
            <div className="hidden md:block w-full h-full relative min-h-[400px]">
              <div style={{ position:"relative", borderRadius:"24px", overflow:"hidden", width:"100%", height:"100%" }}>
                {/* Gradient overlay — left edge fades to background */}
                <div style={{
                  position:"absolute", inset:0,
                  background:"linear-gradient(90deg, #0b6b1d 0%, transparent 40%)",
                  zIndex:1,
                }}/>
                <img 
                  src="/hero-image.png"
                  alt="Wellcare Pharmacy Agra — Medicine Delivery"
                  onError={e => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "24px",
                    display: "block",
                  }}
                />
                {/* Floating pill badge on image */}
                <div style={{
                  position:"absolute", bottom:"20px", left:"20px",
                  zIndex:2,
                  background:"rgba(255,255,255,0.18)",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(255,255,255,0.35)",
                  borderRadius:"50px",
                  padding:"10px 18px",
                  display:"flex", alignItems:"center", gap:"10px",
                }}>
                  <div style={{
                    width:"10px", height:"10px",
                    borderRadius:"50%", background:"#9df898",
                    boxShadow:"0 0 0 4px rgba(157,248,152,0.25)",
                    animation:"pulse 2s ease-in-out infinite",
                  }}/>
                  <span style={{
                    color:"white", fontSize:"0.82rem", fontWeight:600,
                  }}>
                    Delivering now across Agra
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>



      </div>
    </section>
  );
}
