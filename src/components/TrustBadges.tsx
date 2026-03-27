"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Microscope, Lock } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Genuine Medicines",
    subtext: "100% Authentic Products",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: <Truck size={28} />,
    title: "Fast Delivery",
    subtext: "Quick Doorstep Service",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: <Microscope size={28} />,
    title: "Lab Reports",
    subtext: "Accurate & Reliable",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: <Lock size={28} />,
    title: "Secure Payments",
    subtext: "Safe Transactions",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function TrustBadges() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-28 mb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-xl shadow-teal-900/5 border border-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 group"
          >
            <div
              className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {feature.icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {feature.subtext}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
