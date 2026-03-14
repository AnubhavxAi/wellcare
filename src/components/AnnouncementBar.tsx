"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-[var(--color-brand-navy)] text-white text-sm py-2 px-4 flex items-center justify-center sticky top-0 z-50">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mr-2"
      >
        <Zap size={16} className="text-[#facc15] fill-[#facc15]" />
      </motion.div>
      <span className="font-medium">Fastest Delivery across Agra City</span>
    </div>
  );
}
