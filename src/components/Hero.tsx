"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Upload, Truck, Tag } from "lucide-react";

const slideContent = {
  headline: "Your Health, Delivered Fast.",
  subtext: "Order medicines, lab tests, and wellness essentials with free doorstep delivery across Agra.",
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % 3);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + 3) % 3);
  }, []);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const el = document.getElementById("categories");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      // dispatch search via URL
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

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Carousel Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-teal-700 to-emerald-400 min-h-[400px] lg:min-h-[480px]">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 50 0 C 70 20, 80 40, 50 80 C 20 40, 30 20, 50 0 Z" fill="currentColor" transform="scale(0.5) translate(25, 25) rotate(45)"/>
                <path d="M 50 0 C 70 20, 80 40, 50 80 C 20 40, 30 20, 50 0 Z" fill="currentColor" transform="scale(0.8) translate(75, 50) rotate(-30)"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern)"/>
          </svg>
        </div>

        <div className="absolute inset-0 max-w-7xl mx-auto w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            
            {/* Left Text & Search */}
            <div className="flex flex-col justify-center px-8 sm:px-16 py-12 lg:py-0 relative z-10 w-full lg:w-[120%]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-sm max-w-xl">
                    {slideContent.headline}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-md font-medium leading-relaxed">
                    {slideContent.subtext}
                  </p>

                  {/* Search Bar inside Hero */}
                  <div className="mt-8 bg-white p-2 rounded-2xl flex items-center shadow-lg w-full max-w-xl">
                    <div className="pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for medicines, health products, lab tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 pl-3 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-[15px] bg-transparent w-full"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 py-3 bg-teal-800 text-white font-bold rounded-xl hover:bg-teal-900 transition-colors shadow-sm text-sm whitespace-nowrap"
                    >
                      Search
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex items-end justify-center relative overflow-hidden">
              <motion.img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800" 
                alt="Smiling Doctor"
                className="object-cover object-top w-[90%] h-[90%] rounded-t-3xl shadow-2xl absolute bottom-0 right-8 border-4 border-white/20"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-white transition-colors z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-white transition-colors z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
