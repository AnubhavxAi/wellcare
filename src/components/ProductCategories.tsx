"use client";

import { useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProductIllustration from "@/components/ProductIllustration";
import {
  allProducts as localProducts,
  categories,
  categoryIcons,
  type CategoryKey,
} from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Loader2, AlertCircle } from "lucide-react";

function ProductCategoriesContent() {
  const router = useRouter();
  // Default to "Medicines" as requested
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("Medicines");
  const { products, loading, error } = useProducts({ 
    category: activeCategory 
  });
  
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : localProducts;
    return sourceProducts.filter((p) => p.category === activeCategory).slice(0, 8);
  }, [activeCategory, products]);

  const displayCategories = categories.filter(c => c !== "All");

  return (
    <section id="categories" className="py-12 sm:py-16 px-4 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Find exactly what you need from our curated selection of categories.
          </p>
        </div>

        {/* Part A: Category Pills Row (horizontal scroll on mobile) */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-3 scrollbar-hide snap-x" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {displayCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-center shrink-0 flex items-center space-x-2 px-5 py-3 rounded-full transition-all duration-200 font-semibold text-sm sm:text-base border-2 ${
                  isActive
                    ? "bg-[#DCFCE7] border-[#16A34A] text-[#15803D] shadow-sm"
                    : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] hover:bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{categoryIcons[category]}</span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Part B: Animated Product Grid */}
        <div className="relative min-h-[400px]">
          {loading && products.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-2xl">
              <Loader2 className="w-10 h-10 text-[var(--color-brand-green)] animate-spin mb-4" />
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, staggerChildren: 0.04 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group cursor-pointer"
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    {/* Product Image */}
                    <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden p-4">
                      <ProductIllustration
                        category={product.category}
                        name={product.name}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.originalPrice && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm border border-red-600">
                          {Math.round(
                            ((product.originalPrice - product.price) / product.originalPrice) * 100
                          )}
                          % OFF
                        </span>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                          <span className="text-xs sm:text-sm font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-grow flex flex-col pt-5">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                          {product.brand}
                        </span>
                        {product.rxRequired && (
                          <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">Rx</span>
                        )}
                      </div>
                      <h3
                        className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-[var(--color-brand-green)] transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <div className="flex-grow"></div>

                      {/* Price */}
                      <div className="flex items-end space-x-2 mb-4 pt-2 border-t border-gray-50">
                        <span className="text-xl sm:text-2xl font-black text-[var(--color-brand-navy)] tracking-tight">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through font-medium pb-0.5">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                          className="w-full bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Part C: "View All [Category]" button */}
        <div className="mt-10 sm:mt-12 text-center">
          <button
            onClick={() => router.push(`/shop/${activeCategory.toLowerCase().replace(/\s+/g, '-')}`)}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <span>View All {activeCategory} →</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProductCategories() {
  return (
    <Suspense
      fallback={
        <section className="py-16 px-4 bg-white flex justify-center">
          <div className="animate-pulse w-full max-w-7xl h-96 bg-gray-100 rounded-3xl"></div>
        </section>
      }
    >
      <ProductCategoriesContent />
    </Suspense>
  );
}
