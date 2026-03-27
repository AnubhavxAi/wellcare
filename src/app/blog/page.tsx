"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        <div className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold text-teal-900 tracking-tight mb-4">
            Health & Wellness Insights
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Stay informed with the latest medical breakthroughs, seasonal wellness tips, and nutrition guides from our global health experts.
          </p>
          <div className="h-1.5 w-24 bg-teal-500 mt-6 rounded-full shadow-sm"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_NEWS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 group"
            >
              {/* Thumbnail Image */}
              <div className="relative h-64 overflow-hidden">
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
                
                <h2 className="font-headline font-bold text-2xl text-gray-900 mb-4 leading-snug line-clamp-2 h-16">
                  {item.title}
                </h2>
                
                <p className="text-gray-500 text-[15px] leading-relaxed mb-8 line-clamp-3">
                  {item.excerpt}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-4 bg-teal-50 text-teal-700 font-bold rounded-xl hover:bg-teal-700 hover:text-white transition-all duration-300 group"
                >
                  Read Full Story
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
