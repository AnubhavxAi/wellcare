"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Upload, Truck, Tag } from "lucide-react";

const slides = [
  {
    id: 1,
    headline: "10% Off Your First Order",
    subtext: "Use code WELLCARE10 at checkout and save on genuine medicines.",
    cta: "Shop Now",
    ctaHref: "#categories",
    icon: <Tag size={48} />,
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    accent: "bg-emerald-400/20",
  },
  {
    id: 2,
    headline: "Free Delivery Above ₹499",
    subtext: "Order healthcare essentials & get free doorstep delivery across Agra.",
    cta: "Browse Medicines",
    ctaHref: "#categories",
    icon: <Truck size={48} />,
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    accent: "bg-blue-400/20",
  },
  {
    id: 3,
    headline: "Prescription Delivery in 2 Hours",
    subtext: "Upload your prescription & get medicines delivered to your doorstep — fast.",
    cta: "Upload Prescription",
    ctaHref: "#prescription-upload",
    icon: <Upload size={48} />,
    gradient: "from-violet-600 via-purple-500 to-indigo-500",
    accent: "bg-purple-400/20",
  },
];

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
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
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

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden">
      {/* Carousel */}
      <div className={`relative bg-gradient-to-r ${slide.gradient} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[320px] lg:min-h-[380px]">
            {/* Text Content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col space-y-6 text-white"
              >
                <div className="space-y-4">
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {slide.headline}
                  </motion.h1>
                  <motion.p
                    className="text-lg md:text-xl text-white/90 max-w-lg font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slide.subtext}
                  </motion.p>
                </div>

                <motion.a
                  href={slide.ctaHref}
                  className="inline-flex items-center self-start px-8 py-3.5 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.cta}
                </motion.a>
              </motion.div>
            </AnimatePresence>

            {/* Graphic - Icon */}
            <div className="hidden lg:flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.7, opacity: 0, rotate: 10 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                  className={`w-56 h-56 ${slide.accent} backdrop-blur-sm rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/10`}
                >
                  <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    {slide.icon}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar - overlapping bottom */}
      <div className="max-w-2xl mx-auto px-4 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex items-center">
          <div className="pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search medicines, health products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 pl-3 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-base bg-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[var(--color-brand-green)] text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
