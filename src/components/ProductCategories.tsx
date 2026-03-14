"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

// Types
type Category = "All" | "OTC Medicines" | "Wellness & Nutrition" | "Prescription Medicines" | "Diabetes Care" | "Personal Care";

import { mankindProducts, Product as MankindProduct } from "@/data/mankindProducts";

// Use mankind dataset
const products: MankindProduct[] = mankindProducts;

const categories: Category[] = ["All", "OTC Medicines", "Wellness & Nutrition", "Prescription Medicines", "Diabetes Care", "Personal Care"];

function ProductCategoriesContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || "";
  const { addToCart } = useCart();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = 
      searchQuery === "" || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Browse our wide range of genuine medicines and healthcare products.</p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                activeCategory === category
                  ? "bg-[var(--color-brand-green)] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-[var(--color-brand-green)] border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col items-center hover:shadow-xl transition-shadow border border-gray-100 h-full group"
              >
                {/* Product Image */}
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300 overflow-hidden relative">
                  {product.imageSrc ? (
                    <img 
                      src={product.imageSrc} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                </div>

                {/* Details */}
                <div className="text-center flex-grow flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-snug truncate w-full" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-[var(--color-brand-green)] font-extrabold text-lg sm:text-xl mb-4">
                    {product.price}
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full p-4 sm:p-6 border-t border-gray-100 flex flex-col space-y-3 mt-auto">
                  <button 
                    onClick={() => addToCart({ id: String(product.id), name: product.name, price: parseInt(product.price.replace(/[^\d]/g, ''), 10) })}
                    className="w-full bg-[var(--color-brand-green)] hover:bg-opacity-90 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-center"
                  >
                    Add to Cart
                  </button>
                  <a 
                    href={`https://wa.me/919897397532?text=Hi%20Wellcare%20Pharmacy,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-green-50 font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm font-bold">Order via WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductCategories() {
  return (
    <Suspense fallback={
      <section className="py-16 px-4 bg-gray-50 flex justify-center">
        <div className="animate-pulse w-full max-w-7xl h-96 bg-gray-200 rounded-xl"></div>
      </section>
    }>
      <ProductCategoriesContent />
    </Suspense>
  );
}
