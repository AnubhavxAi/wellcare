"use client";

import { motion } from "framer-motion";
import { Gift, Star, ArrowRight } from "lucide-react";

export default function LoyaltyBanner() {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[var(--color-brand-navy)] via-indigo-900 to-[var(--color-brand-navy)] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Animated Coin Icon */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2,
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <Gift size={32} className="text-white" />
              </motion.div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Star
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                    Loyalty Program
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-1 leading-snug">
                  Earn Wellcare Points on Every Purchase
                </h3>
                <p className="text-white/70 text-sm sm:text-base">
                  Redeem your points on your next order. The more you shop, the
                  more you save!
                </p>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-6 py-3 bg-white text-[var(--color-brand-navy)] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-md whitespace-nowrap flex-shrink-0">
              <span>Join Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
