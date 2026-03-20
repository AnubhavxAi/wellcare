"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import OrderSuccessModal from "./OrderSuccessModal";
import { useCart, CartItem } from "@/context/CartContext";
import { placeOrder } from "@/lib/orders";

// Simple custom WhatsApp Icon
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  cartItems: CartItem[];
  totalAmount: number;
}

// WhatsApp message formatter
const generateWhatsAppMessage = (cart: CartItem[], userDetails: { fullName: string; phone: string; address: string; pincode: string }, paymentMethod: string, total: number, orderId: string) => {
  const itemsText = cart.map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price}`).join('\n');
  const paymentText = paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI on Delivery' : 'Card';

  return `*New Order — Wellcare Pharmacy*
------------------------
*Order ID:* ${orderId}
*Customer:* ${userDetails.fullName}
*Phone:* ${userDetails.phone}
*Address:* ${userDetails.address}, Agra, ${userDetails.pincode}
------------------------
*Items:*
${itemsText}
------------------------
*Total Amount:* ₹${total}
*Payment Method:* ${paymentText}`;
};

export default function CheckoutModal({ isOpen, onClose, onComplete, cartItems, totalAmount }: CheckoutModalProps) {
  const { clearCart } = useCart();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [pincodeError, setPincodeError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      const pin = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, pincode: pin }));

      if (pin.length === 6) {
        const pinNum = parseInt(pin, 10);
        if (pinNum < 282001 || pinNum > 282010) {
          setPincodeError("Sorry, we currently only deliver within Agra.");
        } else {
          setPincodeError("");
        }
      } else if (pin.length > 0) {
        setPincodeError("Please enter a valid 6-digit pincode.");
      } else {
        setPincodeError("");
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = formData.fullName && formData.phone && formData.address && formData.pincode.length === 6 && !pincodeError;

  const handleConfirmOrder = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save order to Firestore
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        imageUrl: "",
      }));

      const newOrderId = await placeOrder(orderItems, {
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod.toUpperCase() as "COD" | "UPI" | "Card",
      });

      setOrderId(newOrderId);

      // Also send WhatsApp message
      const message = generateWhatsAppMessage(cartItems, formData, formData.paymentMethod, totalAmount, newOrderId);
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/919897397532?text=${encodedMessage}`, '_blank');

      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Order placement failed:", err);
      setSubmitError("Failed to place order. Please try again or contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueShopping = () => {
    setIsSuccessOpen(false);
    setOrderId("");
    clearCart();
    onComplete();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !isSuccessOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl shadow-black/20 pointer-events-auto flex flex-col max-h-full overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Error banner */}
              {submitError && (
                <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">

                {/* Order Summary */}
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Order Summary</h3>
                   <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                     <ul className="space-y-1.5 text-sm text-gray-600 mb-4 h-24 overflow-y-auto pr-2">
                       {cartItems.map((item, idx) => (
                         <li key={idx} className="flex justify-between">
                           <span className="truncate pr-4">{item.quantity} x {item.name}</span>
                           <span className="font-medium whitespace-nowrap">₹{item.price * item.quantity}</span>
                         </li>
                       ))}
                     </ul>
                     <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                       <span className="font-bold text-gray-800">Final Total Amount</span>
                       <span className="text-xl font-extrabold text-[var(--color-brand-green)]">₹{totalAmount}</span>
                     </div>
                   </div>
                </div>

                {/* Delivery Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Delivery Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 99999 99999"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House No., Street Name, Area"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent outline-none transition-shadow"
                        />
                      </div>
                      <div className="sm:col-span-2 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          maxLength={6}
                          placeholder="282001"
                          className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-shadow ${pincodeError ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-[var(--color-brand-green)]'}`}
                        />
                        {pincodeError && (
                           <p className="text-red-500 text-xs font-semibold mt-1.5">{pincodeError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)] h-4 w-4"
                      />
                      <span className="text-gray-800 font-medium">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleInputChange}
                        className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)] h-4 w-4"
                      />
                      <span className="text-gray-800 font-medium">UPI on Delivery</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col flex-shrink-0 rounded-b-2xl">
                <button
                  onClick={handleConfirmOrder}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md flex justify-center items-center space-x-2 ${
                    isFormValid && !isSubmitting
                      ? 'bg-[#1a9c51] hover:bg-[#148343] text-white hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon size={22} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
                {!isFormValid && (
                  <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                    Please fill all fields and ensure a valid Agra pincode.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
      </AnimatePresence>
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onContinueShopping={handleContinueShopping}
        orderId={orderId}
      />
    </>
  );
}
