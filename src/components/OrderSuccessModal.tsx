"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onContinueShopping: () => void;
}

export default function OrderSuccessModal({ isOpen, onContinueShopping }: OrderSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[80]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl pointer-events-auto flex flex-col items-center p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.1, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10 
                }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle className="text-[var(--color-brand-green)] w-12 h-12" />
              </motion.div>

              <h2 className="text-2xl font-extrabold text-[var(--color-brand-navy)] mb-3">
                Order Initiated Successfully!
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your order details have been forwarded to our team via WhatsApp. We will confirm your delivery to Agra shortly.
              </p>

              <button 
                onClick={onContinueShopping}
                className="w-full bg-[var(--color-brand-green)] text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex justify-center items-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Continue Shopping</span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
