"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Monsoon Diseases to Watch Out for in Agra",
    excerpt:
      "Dengue, malaria, and typhoid spike during monsoons. Learn how to protect your family with these prevention tips from local doctors.",
    category: "Seasonal Health",
    date: "March 15, 2026",
    gradient: "from-blue-500 to-cyan-500",
    emoji: "🌧️",
  },
  {
    id: 2,
    title: "Managing Diabetes in Summer Heat",
    excerpt:
      "Summer can affect blood sugar levels. Stay hydrated, monitor glucose regularly, and follow these diet tips from Agra's diabetologists.",
    category: "Diabetes Care",
    date: "March 10, 2026",
    gradient: "from-amber-500 to-orange-500",
    emoji: "☀️",
  },
  {
    id: 3,
    title: "Best Vitamins for Kids: A Parent's Guide",
    excerpt:
      "Growing children need the right nutrients. Here's what pediatricians in Agra recommend for your child's immunity and growth.",
    category: "Child Health",
    date: "March 5, 2026",
    gradient: "from-emerald-500 to-teal-500",
    emoji: "👶",
  },
];

export default function HealthBlog() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-soft-blue)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-white text-[var(--color-brand-green)] px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-sm">
            <BookOpen size={16} />
            <span>Health Blog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-3">
            Health Tips & Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Stay informed with health advice curated for Agra families.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Gradient Header */}
              <div
                className={`h-36 bg-gradient-to-br ${article.gradient} flex items-center justify-center relative`}
              >
                <span className="text-5xl">{article.emoji}</span>
                <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-1.5">
                  <Calendar size={12} />
                  <span>{article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[var(--color-brand-green)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-4">
                  {article.excerpt}
                </p>
                <button className="inline-flex items-center space-x-1.5 text-sm font-bold text-[var(--color-brand-green)] hover:text-emerald-700 transition-colors self-start group/btn">
                  <span>Read More</span>
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
