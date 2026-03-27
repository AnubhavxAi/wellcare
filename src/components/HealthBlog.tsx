"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  url: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    category: "Medical News",
    title: "New Breakthrough in Rapid Diabetes Screening Technology",
    excerpt: "Researchers have developed a non-invasive laser-based system that can detect blood glucose levels through the skin with 98% accuracy.",
    date: "March 24, 2026",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800",
    url: "https://www.medicalnewstoday.com/articles/diabetes"
  },
  {
    id: 2,
    category: "Health Tips",
    title: "The Science of Sleep: 5 Habits for Better Restorative Rest",
    excerpt: "Understanding your circadian rhythm is the first step toward overcoming insomnia. Discover how temperature and light affect your deep sleep cycles.",
    date: "March 22, 2026",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800",
    url: "https://www.healthline.com/health/sleep-hygiene"
  },
  {
    id: 3,
    category: "Wellness",
    title: "Seasonal Allergies in Agra: How to Protect Your Family",
    excerpt: "As the weather shifts, pollen counts are reaching record highs. Learn which antihistamines and lifestyle changes provide the best defense.",
    date: "March 20, 2026",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    url: "https://www.webmd.com/allergies/default.htm"
  },
  {
    id: 4,
    category: "Medical News",
    title: "Advancements in Heart Health: Redefining Cardiovascular Care",
    excerpt: "Cardiologists are adopting AI-driven diagnostics to predict heart events months before they happen, revolutionizing preventative medicine.",
    date: "March 18, 2026",
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=800",
    url: "https://www.mayoclinic.org/diseases-conditions/heart-disease"
  },
  {
    id: 5,
    category: "Nutrition",
    title: "Gut Health and Its Impact on Mental Clarity and Focus",
    excerpt: "Recent studies confirm the strong link between your microbiome and brain function. Here are 3 fermented foods to include in your diet.",
    date: "March 15, 2026",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    url: "https://www.healthline.com/nutrition/gut-brain-connection"
  },
  {
    id: 6,
    category: "Child Health",
    title: "Essential Immunization Guide for Families in 2026",
    excerpt: "Stay updated with the latest pediatric vaccination schedule. Understanding the benefits of early-stage preventative care for your children.",
    date: "March 10, 2026",
    image: "https://images.unsplash.com/photo-1581594634720-3023f03a6bc0?auto=format&fit=crop&q=80&w=800",
    url: "https://www.who.int/news-room/questions-and-answers/item/vaccines-and-immunization-what-is-vaccination"
  }
];

export default function HealthBlog() {
  const [page, setPage] = useState(0); // 0 or 1

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev === 0 ? 1 : 0));
    }, 10000); // 10 seconds rotation
    return () => clearInterval(timer);
  }, []);

  const visibleItems = MOCK_NEWS.slice(page * 3, page * 3 + 3);

  return (
    <section className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="font-headline text-4xl font-extrabold text-teal-900 tracking-tight">
            Health & Wellness Insights
          </h2>
          <div className="h-1 w-20 bg-teal-500 mt-4 rounded-full"></div>
        </div>

        {/* Cards Layout */}
        <div className="relative min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 group"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-teal-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-8">
                    <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5 mb-3">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {item.date}
                    </span>
                    
                    <h3 className="font-headline font-bold text-xl text-gray-900 mb-4 leading-snug line-clamp-2 h-14">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-500 text-[15px] leading-relaxed mb-6 line-clamp-2">
                      {item.excerpt}
                    </p>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-teal-700 font-bold text-sm hover:text-teal-900 transition-colors py-2"
                    >
                      Read Full Story
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_right_alt
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rotation Indicators */}
        <div className="flex justify-center gap-3 mt-16">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === page ? "w-10 bg-teal-600 shadow-lg" : "w-2.5 bg-gray-300 hover:bg-teal-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
