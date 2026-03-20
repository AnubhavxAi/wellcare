"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/lib/orders";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    area: "",
    pincode: "",
    city: "Agra",
    paymentMethod: "COD" as "COD" | "UPI",
  });

  useEffect(() => {
    // If cart is empty, redirect to shop
    if (cartItems.length === 0) {
      router.push("/");
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address1 || !formData.area || !formData.pincode) {
      setError("Please fill in all required fields.");
      return;
    }
    
    // Validate Pincode
    const pin = parseInt(formData.pincode);
    if (isNaN(pin) || pin < 282001 || pin > 282010) {
      setError("We currently only deliver to Agra pincodes (282001 - 282010).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await placeOrder(cartItems, formData, user);
      clearCart();
      router.push(`/order-success?id=${result.orderId}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  const deliveryCharge = totalAmount >= 499 ? 0 : 49;
  const finalTotal = totalAmount + deliveryCharge;

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B2A46]">Secure Checkout</h1>
          <p className="text-gray-500 mt-2">Almost there! Please fill in your details.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Customer Details Form */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Customer Details</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={!!user?.phone}
                    required
                    className={`w-full px-4 py-3 rounded-xl border outline-none ${user?.phone ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4 mt-10">Delivery Address</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                  placeholder="Flat / House No. / Building"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                  placeholder="Street / Society"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                    placeholder="e.g. Tajganj, Kamla Nagar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none"
                    placeholder="282001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 outline-none cursor-not-allowed font-medium"
                />
              </div>

              <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4 mt-10">Payment Method</h2>
              
              <div className="space-y-4">
                <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-[#16A34A] bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'COD' }))}
                      className="w-5 h-5 text-[#16A34A] bg-white border-gray-300 focus:ring-[#16A34A]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-bold text-gray-900 block text-base">Cash on Delivery (COD)</span>
                    <span className="text-gray-500">Pay at your doorstep when your order arrives.</span>
                  </div>
                </label>

                <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'UPI' ? 'border-[#16A34A] bg-green-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'UPI' }))}
                      className="w-5 h-5 text-[#16A34A] bg-white border-gray-300 focus:ring-[#16A34A]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-bold text-gray-900 block text-base flex items-center"><CreditCard size={18} className="mr-2"/> Pay via UPI / Online</span>
                    <span className="text-gray-500">Scan QR or pay via UPI apps at delivery or online.</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-8 bg-[#16A34A] hover:bg-emerald-700 disabled:bg-gray-400 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <span>Place Order</span>}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 shrink-0 order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto space-y-4 mb-6 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-gray-400">Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#16A34A] mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-gray-900">{deliveryCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryCharge}`}</span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-green-600">Add ₹{499 - totalAmount} more to get FREE delivery.</p>
                )}
                
                <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total final</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <ShieldCheck size={16} className="text-[#16A34A]" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
