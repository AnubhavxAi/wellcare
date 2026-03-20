"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  locality: string;
  rating: number;
  text: string;
  initials: string;
  color: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    locality: "Arjun Nagar, Agra",
    rating: 5,
    text: "Excellent pharmacy! Got my medicines delivered within an hour. The prescription upload feature is so convenient. Highly recommended for Agra families.",
    initials: "PS",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "Rajesh Gupta",
    locality: "Kamla Nagar, Agra",
    rating: 5,
    text: "I order my father's diabetes medicines monthly from Wellcare. Always genuine products and great prices. The WhatsApp ordering is very easy to use.",
    initials: "RG",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Aarti Singh",
    locality: "Sikandra, Agra",
    rating: 4,
    text: "Very reliable pharmacy. I trust them for all my baby care products. Delivery is always on time and products are always genuine. Great service!",
    initials: "AS",
    color: "bg-violet-500",
  },
  {
    id: 4,
    name: "Mohit Agarwal",
    locality: "Tajganj, Agra",
    rating: 5,
    text: "Best pharmacy in Agra! The doctor directory helped me find a great dermatologist nearby. Medicines arrived the same day. 10/10 experience.",
    initials: "MA",
    color: "bg-amber-500",
  },
  {
    id: 5,
    name: "Sunita Verma",
    locality: "Khandari, Agra",
    rating: 4,
    text: "I've been ordering from Wellcare for 6 months now. Great discounts and the customer service on WhatsApp is very responsive. Makes healthcare easy.",
    initials: "SV",
    color: "bg-rose-500",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const review = reviews[current];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-3">
            What Agra Customers Say
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Trusted by thousands of families across Agra.
          </p>
        </div>

        {/* Review Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm"
            >
              <Quote
                size={40}
                className="text-[var(--color-brand-green)] opacity-20 mb-4"
              />

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.locality}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={prev}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <div className="flex space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-[var(--color-brand-green)]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
