"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  bgColor: string;
}

export const BLOGS: Blog[] = [
  // Page 1
  {
    slug: "dengue-malaria-prevention-agra",
    category: "Seasonal Health",
    date: "March 15, 2026",
    title: "Dengue & Malaria Prevention in Agra — What Every Family Must Know",
    excerpt: "Agra sees a spike in vector-borne diseases every monsoon. Learn how to protect your family with simple precautions and the right medicines.",
    author: "Dr. Himanshu Jindal",
    readTime: "5 min read",
    bgColor: "#FEF3C7",
  },
  {
    slug: "managing-blood-sugar-summer",
    category: "Diabetes Care",
    date: "March 10, 2026",
    title: "Managing Blood Sugar in Summer Heat — A Complete Guide",
    excerpt: "High temperatures can cause blood sugar levels to fluctuate unpredictably. Tips for staying safe and in control during Agra's harsh summers.",
    author: "Dr. Durgesh Sharma",
    readTime: "4 min read",
    bgColor: "#DBEAFE",
  },
  {
    slug: "vaccination-schedule-babies",
    category: "Child Health",
    date: "March 5, 2026",
    title: "Vaccination Schedule for Babies in India — Parent's Checklist",
    excerpt: "Keeping up with your baby's vaccination schedule can be confusing. Our guide breaks down the national immunisation program simply.",
    author: "Dr. Arun Jain",
    readTime: "6 min read",
    bgColor: "#FCE7F3",
  },
  // Page 2
  {
    slug: "superfoods-boost-immunity",
    category: "Nutrition",
    date: "February 28, 2026",
    title: "10 Superfoods to Boost Your Immunity This Season",
    excerpt: "Discover the power of natural antioxidants and how they can help you stay healthy during seasonal changes in North India.",
    author: "Wellcare Health Team",
    readTime: "4 min read",
    bgColor: "#DCFCE7",
  },
  {
    slug: "understanding-blood-pressure",
    category: "Heart Health",
    date: "February 22, 2026",
    title: "Understanding Blood Pressure — Numbers That Could Save Your Life",
    excerpt: "High blood pressure is called the 'silent killer' for a reason. Learn what your readings mean and when to act.",
    author: "Wellcare Health Team",
    readTime: "5 min read",
    bgColor: "#FFE4E6",
  },
  {
    slug: "managing-stress-anxiety",
    category: "Mental Health",
    date: "February 15, 2026",
    title: "Managing Stress and Anxiety With Simple Daily Practices",
    excerpt: "Simple mindfulness and breathing practices that fit into even the busiest routines for better mental wellbeing.",
    author: "Wellcare Health Team",
    readTime: "4 min read",
    bgColor: "#EDE9FE",
  },
  // Page 3
  {
    slug: "pcos-awareness",
    category: "Women's Health",
    date: "February 8, 2026",
    title: "PCOS Awareness: Signs, Symptoms and What You Can Do",
    excerpt: "Polycystic ovary syndrome affects 1 in 10 women. Early diagnosis and lifestyle changes can make a significant difference.",
    author: "Wellcare Health Team",
    readTime: "6 min read",
    bgColor: "#FDF2F8",
  },
  {
    slug: "medicine-management-elderly",
    category: "Senior Care",
    date: "February 1, 2026",
    title: "Medicine Management for Elderly Patients — A Caregiver's Guide",
    excerpt: "Managing multiple medications for elderly parents is challenging. This guide helps prevent common medication errors at home.",
    author: "Wellcare Health Team",
    readTime: "5 min read",
    bgColor: "#F0FDF4",
  },
  {
    slug: "waterborne-diseases-agra",
    category: "Monsoon Health",
    date: "January 25, 2026",
    title: "Waterborne Diseases in Agra — Prevention and First Line Treatment",
    excerpt: "Typhoid, hepatitis A, and cholera spike during monsoons. Know the symptoms and when to visit a doctor vs manage at home.",
    author: "Wellcare Health Team",
    readTime: "5 min read",
    bgColor: "#EFF6FF",
  },
];

function BlogIllustration({ category, bgColor }: { category: string; bgColor: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      <span className="text-on-surface/5 font-headline font-extrabold text-[80px] leading-none select-none absolute bottom-4 left-4 max-w-full break-words">
        {category}
      </span>
    </div>
  );
}

export default function HealthBlog() {
  const [activePage, setActivePage] = useState(0);
  const totalPages = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleBlogs = BLOGS.slice(activePage * 3, activePage * 3 + 3);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">
              Health Tips & Articles
            </h2>
            <p className="text-on-surface-variant mt-2">
              Stay informed with expert wellness insights for Agra families.
            </p>
          </div>
          <a href="/blog" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
            View all
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        {/* Blog Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleBlogs.map((blog) => (
              <a href={`/blog/${blog.slug}`} key={blog.slug} className="group cursor-pointer block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-surface-container-low relative">
                  <span className="absolute top-4 left-4 px-3 py-1 bg-surface/80 backdrop-blur-sm text-on-surface text-xs font-bold rounded-full z-10">
                    {blog.category}
                  </span>
                  <BlogIllustration category={blog.category} bgColor={blog.bgColor} />
                </div>
                <p className="text-on-surface-variant text-xs mb-2">{blog.date}</p>
                <h3 className="font-headline font-bold text-on-surface text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                  {blog.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="font-medium text-on-surface">{blog.author}</span>
                  <span>·</span>
                  <span>{blog.readTime}</span>
                </div>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePage(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activePage ? "w-8 bg-primary" : "w-2.5 bg-outline-variant"
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
