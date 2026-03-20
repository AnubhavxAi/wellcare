"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[var(--color-brand-navy)] to-indigo-900 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mr-2"
      >
        <Zap size={14} className="text-[#facc15] fill-[#facc15]" />
      </motion.div>
      <span className="font-medium">
        🎉 Use <span className="font-bold text-yellow-300">WELLCARE10</span> for 10% off your first order &nbsp;•&nbsp; Free delivery above ₹499 in Agra
      </span>
    </div>
  );
}
