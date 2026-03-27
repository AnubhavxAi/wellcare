"use client";

import { useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import SmartProductImage from "@/components/SmartProductImage";
import {
  allProducts as localProducts,
  categories,
  type CategoryKey,
} from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

function ProductCategoriesContent() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("Medicines");
  const { products, loading } = useProducts({ category: activeCategory });
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : localProducts;
    return sourceProducts.filter((p) => p.category === activeCategory).slice(0, 8);
  }, [activeCategory, products]);

  const displayCategories = categories.filter(c => c !== "All");

  return (
    <section id="categories" className="py-20 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Essential <span className="text-primary">Medicines</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Curated pharmaceutical essentials delivered with clinical precision.
            Simple, transparent, and always focused on your recovery.
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-3 scrollbar-hide"
             style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {displayCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                data-active={isActive}
                className={`shrink-0 px-5 py-2 rounded-full font-label font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white scale-105 shadow-md"
                    : "bg-secondary-fixed text-on-secondary-fixed hover:scale-105"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="relative min-h-[400px]">
          {loading && products.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low/50 backdrop-blur-sm z-10 rounded-xl">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,28,0.04)] hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(25,28,28,0.08)] transition-all duration-300 flex flex-col cursor-pointer group"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  {/* Image */}
                  <div className="w-full aspect-square bg-surface-container-low flex items-center justify-center p-6 overflow-hidden">
                    <SmartProductImage
                      category={product.category}
                      name={product.name}
                      src={product.imageSrc}
                      size={200}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-grow flex flex-col">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-headline font-bold text-on-surface text-sm mb-1 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-on-surface-variant text-xs line-clamp-1 mb-3">
                      {product.description}
                    </p>
                    <div className="flex-grow"></div>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <span className="font-headline text-lg font-extrabold text-on-surface">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-on-surface-variant line-through ml-1.5">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                        }}
                        disabled={!product.inStock}
                        className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-center hover:shadow-lg active:scale-95 transition-all disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push(`/shop/${activeCategory.toLowerCase().replace(/\s+/g, '-')}`)}
            className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            View All {activeCategory}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
        <section className="py-20 bg-surface-container-low flex justify-center">
          <div className="animate-pulse w-full max-w-7xl h-96 bg-surface-container rounded-xl"></div>
        </section>
      }
    >
      <ProductCategoriesContent />
    </Suspense>
  );
}
