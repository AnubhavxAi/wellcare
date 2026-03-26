"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ShoppingCart, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star,
  Plus,
  Minus,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, allProducts, categoryIcons } from "@/data/products";
import { useCart } from "@/context/CartContext";
import SmartProductImage from "@/components/SmartProductImage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "benefits" | "usage" | "ingredients">("description");

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <button onClick={() => router.push("/")} className="hover:text-[var(--color-brand-green)] transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="capitalize">{product.category}</span>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">
            
            {/* Left Column: Image Section */}
            <div className="space-y-6">
              <div className="aspect-square rounded-3xl bg-gray-50 border border-gray-100 p-8 relative flex items-center justify-center group">
                <SmartProductImage 
                  category={product.category}
                  name={product.name}
                  src={product.imageSrc}
                  size={320}
                  className="w-full h-full"
                />
                {discount > 0 && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg z-10">
                    {discount}% OFF
                  </div>
                )}
                {product.rxRequired && (
                  <div className="absolute top-6 right-6 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-bold text-xs border border-orange-200 flex items-center space-x-1 z-10">
                    <Info size={14} />
                    <span>Rx Required</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[var(--color-brand-green)] mb-2 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">100% Genuine</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2 shadow-sm">
                    <Truck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2 shadow-sm">
                    <RotateCcw size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">7-Day Return</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-bold text-[var(--color-brand-green)] uppercase tracking-widest px-2 py-1 bg-green-50 rounded-md">
                  {product.brand}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} strokeWidth={2} />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-600">4.5 (120 Ratings)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-medium text-gray-500">{product.packSize}</span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="flex items-baseline space-x-3 mb-1">
                  <span className="text-3xl font-black text-[var(--color-brand-navy)]">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium mb-4">Inclusive of all taxes</p>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      for(let i=0; i<quantity; i++) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          brand: product.brand,
                          price: product.price,
                          mrp: product.originalPrice || product.price,
                          category: product.category,
                          unit: product.packSize || "1 unit",
                          slug: product.slug,
                        });
                      }
                    }}
                    disabled={!product.inStock}
                    className="flex-grow bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-200 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                  >
                    <ShoppingCart size={20} />
                    <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <a
                  href={`https://wa.me/919897397532?text=Hi%20Wellcare%20Pharmacy,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20(Quantity:%20${quantity})%20from%20your%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95"
                >
                  <MessageCircle size={22} />
                  <span>Order Directly via WhatsApp</span>
                </a>
                <p className="text-center text-[10px] text-gray-400 font-medium italic">Fast Home Delivery in Arjun Nagar, Agra</p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Dosage Form</h4>
                  <p className="text-sm font-semibold text-gray-700">{product.form}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Pack Size</h4>
                  <p className="text-sm font-semibold text-gray-700">{product.packSize}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Info Section */}
          <div className="border-t border-gray-100 bg-white">
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {(["description", "benefits", "usage", "ingredients"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 text-sm font-bold capitalize transition-all relative shrink-0 ${
                    activeTab === tab ? "text-[var(--color-brand-green)]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-brand-green)] rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-10 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="prose prose-emerald max-w-none text-gray-600"
                >
                  {activeTab === "description" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
                      <p className="leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
                    </div>
                  )}

                  {activeTab === "benefits" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Key Health Benefits</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-3 bg-green-50/50 p-4 rounded-xl border border-green-100/50 shadow-sm">
                            <ShieldCheck className="text-[var(--color-brand-green)] mt-0.5 shrink-0" size={18} />
                            <span className="text-sm font-medium text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "usage" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Directions for Use</h3>
                      <div className="space-y-4">
                        {product.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-4 bg-gray-50/50 p-4 rounded-xl">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-brand-green)] text-white text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-sm font-medium text-gray-700">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "ingredients" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Key Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing, idx) => (
                          <span key={idx} className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
                            {ing}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-6 italic font-medium p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                        Disclaimer: While we strive to ensure accuracy, the product composition may change. Always read the physical product label before use.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <section className="mt-16 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-[var(--color-brand-navy)]">Similar Products</h2>
            <button onClick={() => router.push("/")} className="text-sm font-bold text-[var(--color-brand-green)] hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            {allProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/product/${p.slug}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 flex items-center justify-center">
                    <SmartProductImage 
                      category={p.category} 
                      name={p.name} 
                      src={p.imageSrc} 
                      size={120} 
                      className="w-full h-full group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-[var(--color-brand-green)] transition-colors">{p.name}</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-black text-[var(--color-brand-navy)]">₹{p.price}</span>
                    {p.originalPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</span>}
                  </div>
                </button>
              ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
