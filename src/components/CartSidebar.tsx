"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PincodeValidator from "./PincodeValidator";
import ProductIllustration from "./ProductIllustration";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cartItems, updateQuantity, totalAmount, totalItems } = useCart();
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  useEffect(() => {
    if (pendingCheckout && user?.isLoggedIn) {
      setPendingCheckout(false);
      onClose();
      router.push("/checkout");
    }
  }, [user, pendingCheckout, router, onClose]);

  const handleProceedToCheckout = () => {
    if (!isPincodeValid) return;
    if (!user?.isLoggedIn) {
      setPendingCheckout(true);
      openLogin();
    } else {
      onClose();
      router.push("/checkout");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-2 text-[var(--color-brand-navy)]">
                  <ShoppingBag size={24} />
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <span className="bg-green-100 text-[var(--color-brand-green)] text-xs font-bold px-2 py-1 rounded-full">
                    {totalItems} Items
                  </span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <ShoppingBag size={64} className="text-gray-200" />
                    <p className="text-lg">Your cart is empty</p>
                    <button 
                      onClick={onClose}
                      className="text-[var(--color-brand-green)] font-medium hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 shrink-0 mr-3 rounded-md overflow-hidden bg-white border border-gray-200">
                        <ProductIllustration category={item.category || "default"} name={item.name} />
                      </div>
                      <div className="flex-1 pr-4">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-[var(--color-brand-green)] font-bold mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Total */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-white shrink-0 space-y-4">
                  <PincodeValidator onValidationChange={setIsPincodeValid} />
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="text-2xl font-extrabold text-[var(--color-brand-navy)]">₹{totalAmount}</span>
                  </div>
                  <button 
                    onClick={handleProceedToCheckout}
                    disabled={!isPincodeValid}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md flex justify-center items-center ${
                      isPincodeValid 
                        ? "bg-[var(--color-brand-green)] text-white hover:bg-opacity-90 hover:shadow-lg" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
