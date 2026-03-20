"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Award, FileText } from "lucide-react";

const badges = [
  {
    icon: <ShieldCheck size={28} />,
    title: "100% Genuine Medicines",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: <Truck size={28} />,
    title: "Fast Delivery Across Agra",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <Award size={28} />,
    title: "Certified Pharmacy",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: <FileText size={28} />,
    title: "Upload Prescription & Order",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-14 h-14 ${badge.bg} ${badge.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                {badge.icon}
              </div>
              <span className="text-sm font-bold text-gray-800 leading-snug">
                {badge.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
