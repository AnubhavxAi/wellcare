"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingCart, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  if (!orderId) return null;

  const handleWhatsAppTrack = () => {
    const message = `Halo Wellcare Pharmacy, I'd like to track my order ${orderId}.`;
    window.open(`https://wa.me/919897397532?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 size={48} className="text-[#16A34A]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-extrabold text-[#0B2A46] mb-4"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-8"
          >
            <span className="text-sm font-bold text-[#16A34A]">Order ID: {orderId}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg mb-10 max-w-lg mx-auto"
          >
            Thank you for choosing Wellcare Pharmacy! Your medicines will be delivered 
            to your address in Agra within 2–4 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleWhatsAppTrack}
              className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare size={20} />
              <span>Track on WhatsApp</span>
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="px-8 py-4 bg-[#0B2A46] hover:bg-[#1a3a5a] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Continue Shopping</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#16A34A]" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
