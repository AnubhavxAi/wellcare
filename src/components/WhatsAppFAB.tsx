"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react"; // Note: Substitute for WhatsApp as standard Lucide lacks brand icons

export default function WhatsAppFAB() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center"
      initial={{ y: 100, scale: 0 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        bounce: 0.5,
        damping: 12,
        stiffness: 150,
        delay: 0.8 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] whitespace-nowrap pointer-events-none border border-gray-100"
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="text-sm font-semibold text-gray-800">Order on WhatsApp</div>
            {/* Tooltip triangle */}
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white transform -translate-y-1/2 rotate-45 border-r border-t border-gray-100"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/919897397532?text=Hi%20Wellcare%20Pharmacy,%20I%20want%20to%20order%20medicines."
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[var(--color-brand-green)] text-white p-4 rounded-full shadow-[0_10px_25px_-5px_rgba(26,156,81,0.4)] hover:shadow-[0_20px_25px_-5px_rgba(26,156,81,0.4)] focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-green)] focus:ring-opacity-50 transition-shadow block"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={32} className="text-white fill-current" />
      </motion.a>
    </motion.div>
  );
}
