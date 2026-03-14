"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, FileText, Package, CheckCircle, Loader } from "lucide-react";

export default function HeroGraphic() {
  const [step, setStep] = useState(0);

  // Cycle through states 0, 1, 2 every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden rounded-[2rem]">
      {/* Animated Gradient Blob Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-blue-50 shadow-inner">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-10 w-64 h-64 bg-[var(--color-brand-green)] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div 
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-64 h-64 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="capture"
              className="relative flex flex-col items-center justify-center w-full h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {/* Smartphone */}
              <Smartphone size={100} strokeWidth={1.5} className="text-[var(--color-brand-navy)] z-10 relative bg-white pb-2" />
              
              {/* Prescription sliding up */}
              <motion.div
                className="absolute text-[var(--color-brand-green)] z-0"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              >
                <FileText size={60} strokeWidth={1.5} />
              </motion.div>

              {/* Camera Flash Effect */}
              <motion.div
                className="absolute inset-0 bg-white z-20 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3, delay: 1 }}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="processing"
              className="flex flex-col items-center justify-center w-full h-full"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 0.9 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <Smartphone size={80} strokeWidth={1.5} className="text-gray-400 mb-4" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={32} className="text-[var(--color-brand-green)]" />
              </motion.div>
              <span className="mt-2 text-sm font-medium text-gray-500">Processing...</span>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="delivery"
              className="relative flex flex-col items-center justify-center w-full h-full"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            >
              <Package size={120} strokeWidth={1.5} className="text-[var(--color-brand-navy)]" />
              
              <motion.div
                className="absolute bottom-6 right-6 bg-white rounded-full bg-opacity-90 backdrop-blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
              >
                <CheckCircle size={48} className="text-[var(--color-brand-green)] fill-green-50" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative floating pills */}
      <motion.div 
        className="absolute top-1/4 right-8 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center space-x-2 z-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-xs font-bold text-gray-700">Fast Delivery</span>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 left-8 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center space-x-2 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <CheckCircle size={16} className="text-[var(--color-brand-green)]" />
        <span className="text-xs font-bold text-gray-700">Genuine Medicines</span>
      </motion.div>
    </div>
  );
}
