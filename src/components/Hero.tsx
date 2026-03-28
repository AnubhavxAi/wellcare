"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Upload, Truck, Tag } from "lucide-react";

const slideContent = {
  headline: "Your Health, Delivered Fast.",
  subtext: "Order medicines, lab tests, and wellness essentials with free doorstep delivery across Agra.",
};

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const el = document.getElementById("categories");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      const url = new URL(window.location.href);
      url.searchParams.set("search", searchTerm);
      url.hash = "categories";
      window.history.replaceState({}, "", url.toString());
      window.dispatchEvent(new Event("popstate"));
    } else {
      const el = document.getElementById("categories");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      style={{
        background: "linear-gradient(135deg, #0b4d14 0%, #0b6b1d 25%, #1a8a2e 50%, #0d7a23 75%, #053d0d 100%)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        paddingTop: "100px", // Accommodate fixed navbar + extra space
        paddingBottom: "48px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* FLOATING BACKGROUND ORBS */}
      <div style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", overflow: "hidden",
      }}>
        {/* Large orb top right */}
        <div style={{
          position: "absolute",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,133,52,0.4) 0%, transparent 70%)",
          top: "-200px", right: "-100px",
          filter: "blur(60px)",
          animation: "floatOrb1 8s ease-in-out infinite",
        }}/>
        {/* Medium orb bottom left */}
        <div style={{
          position: "absolute",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(157,248,152,0.25) 0%, transparent 70%)",
          bottom: "-100px", left: "5%",
          filter: "blur(50px)",
          animation: "floatOrb2 10s ease-in-out infinite",
        }}/>
        {/* Small orb center */}
        <div style={{
          position: "absolute",
          width: "250px", height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          top: "40%", left: "40%",
          filter: "blur(40px)",
          animation: "floatOrb3 12s ease-in-out infinite",
        }}/>
      </div>

      {/* FLOATING GRID LINES */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }}/>

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* LEFT COLUMN */}
        <motion.div 
          className="glass-card flex-1" 
          style={{
            padding: "48px",
            maxWidth: "640px",
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
            textShadow: "0 2px 20px rgba(0,0,0,0.2)",
          }}>
            Your Health,<br/>
            <span style={{ color: "#9df898" }}>Delivered Fast.</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.80)",
            fontSize: "1.125rem",
            lineHeight: 1.7,
            marginBottom: "36px",
          }}>
            Order medicines, lab tests, and wellness essentials 
            with free doorstep delivery across Agra.
          </p>

          {/* GLASSMORPHISM SEARCH BAR */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.40)",
            borderRadius: "50px",
            padding: "6px 6px 6px 24px",
            gap: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
            marginBottom: "28px",
          }}>
            <input
              placeholder="Search medicines, lab tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "1rem",
              }}
              className="placeholder-white/60"
            />
            <button 
              onClick={handleSearch}
              style={{
                background: "linear-gradient(135deg, #9df898, #2e8534)",
                color: "#003008",
                border: "none",
                borderRadius: "50px",
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
              Search
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
            maxWidth: "400px",
            width: "100%",
          }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: "verified", title: "Genuine Medicines", sub: "100% Authentic" },
            { icon: "local_shipping", title: "Fast Delivery", sub: "2-Hour Delivery" },
            { icon: "labs", title: "Lab Reports", sub: "Home Collection" },
            { icon: "lock", title: "Secure Payment", sub: "Safe Transactions" },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-5 text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined" style={{
                fontSize: "32px",
                color: "#9df898",
                display: "block",
                marginBottom: "10px",
              }}>
                {item.icon}
              </span>
              <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>
                {item.title}
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
