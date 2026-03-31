"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import SmartProductImage from "@/components/SmartProductImage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/products";
import { type CategoryKey } from "@/types/product";
import { ALL_PRODUCTS as localProducts } from "@/data/allProducts";

const categoryIcons: Record<string, string> = {
  "All": "apps",
  "Medicines": "medication",
  "Vitamins & Supplements": "nutrition",
  "Personal Care": "spa",
  "Baby Care": "child_care",
  "Medical Devices": "monitor_heart",
  "Skincare": "dermatology",
  "Pain Relief": "healing",
  "First Aid": "emergency",
  "Oral Care": "dentistry",
  "Nutrition": "restaurant",
};

interface ShopPageClientProps {
  initialCategory?: string;
}

export default function ShopPageClient({ initialCategory = "All" }: ShopPageClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const validCategory: CategoryKey = categories.includes(initialCategory as CategoryKey)
    ? (initialCategory as CategoryKey)
    : "All";

  const [activeCategory, setActiveCategory] = useState<CategoryKey>(validCategory);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured");

  const { products, loading, error } = useProducts({
    category: activeCategory === "All" ? undefined : activeCategory
  });

  const displayCategories = categories.filter(c => c !== "All");

  const filteredAndSortedProducts = useMemo(() => {
    // Merge remote products with local defaults to ensure all 152 exist
    // Remote products take precedence for real-time pricing/stock
    const mergedProducts = [...localProducts].map(lp => {
      const remote = products.find(rp => rp.slug === lp.slug);
      return remote ? { ...lp, ...remote } : lp;
    });

    let result = mergedProducts.filter(p => activeCategory === "All" || p.category === activeCategory);
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, localProducts, activeCategory, sortBy]);

  const handleCategoryClick = (cat: CategoryKey) => {
    setActiveCategory(cat);
    if (cat === "All") router.push("/shop");
    else router.push(`/shop/${cat.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <button onClick={() => router.push("/")} className="hover:text-primary transition-colors">Home</button>
          <span className="text-outline-variant">›</span>
          <button onClick={() => handleCategoryClick("All")} className={`hover:text-primary transition-colors ${activeCategory === "All" ? "font-medium text-on-surface" : ""}`}>Shop</button>
          {activeCategory !== "All" && (
            <>
              <span className="text-outline-variant">›</span>
              <span className="font-medium text-on-surface">{activeCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-2">
              Essential <span className="text-primary">Medicines</span>
            </h1>
            <p className="text-on-surface-variant text-lg">
              Showing {filteredAndSortedProducts.length} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-on-surface-variant">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface-container-highest text-sm font-medium rounded-xl focus:ring-2 focus:ring-primary/15 py-2.5 pl-4 pr-8 outline-none text-on-surface cursor-pointer">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-surface-container-low rounded-xl p-6 sticky top-24 hidden lg:block">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-4 pb-4 border-b border-outline-variant/20">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => handleCategoryClick("All")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-3 ${
                    activeCategory === "All" ? "text-primary font-bold bg-primary-fixed" : "text-on-surface-variant hover:text-primary"
                  }`}>
                  <span className="material-symbols-outlined text-sm">apps</span>
                  All Products
                </button>
              </li>
              {displayCategories.map((cat) => (
                <li key={cat}>
                  <button onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-3 ${
                      activeCategory === cat ? "text-primary font-bold bg-primary-fixed" : "text-on-surface-variant hover:text-primary"
                    }`}>
                    <span className="material-symbols-outlined text-sm">{categoryIcons[cat] || "category"}</span>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Mobile Category Chips */}
          <div className="w-full lg:hidden flex overflow-x-auto pb-4 gap-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <button onClick={() => handleCategoryClick("All")}
              className={`shrink-0 px-5 py-2 rounded-full font-label font-semibold text-sm transition-all ${
                activeCategory === "All" ? "bg-primary text-white" : "bg-secondary-fixed text-on-secondary-fixed"
              }`}>All Products</button>
            {displayCategories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 px-5 py-2 rounded-full font-label font-semibold text-sm transition-all ${
                  activeCategory === cat ? "bg-primary text-white" : "bg-secondary-fixed text-on-secondary-fixed"
                }`}>{cat}</button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9 w-full relative min-h-[500px]">
            {loading && products.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm z-10 rounded-xl">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-error-container rounded-xl flex items-center gap-3 text-on-error-container">
                <span className="material-symbols-outlined text-error text-sm">error</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {filteredAndSortedProducts.length === 0 && !loading ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-xl flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">inventory_2</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">No products found</h3>
                <p className="text-on-surface-variant">There are no products available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <div key={product.id}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,28,0.04)] hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(25,28,28,0.08)] transition-all duration-300 flex flex-col group cursor-pointer"
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    <div className="w-full aspect-square bg-surface-container-low flex items-center justify-center p-6 overflow-hidden relative">
                      <SmartProductImage category={product.category} name={product.name} src={product.imageSrc} size={200}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 backdrop-blur-sm">
                          <span className="text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-2 rounded-full">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">{product.category}</span>
                      <h3 className="font-headline font-bold text-on-surface text-sm mb-1 leading-snug line-clamp-2">{product.name}</h3>
                      <p className="text-on-surface-variant text-xs line-clamp-1 mb-3">{product.description}</p>
                      <div className="flex-grow"></div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="font-headline text-lg font-extrabold text-on-surface">₹{product.price}</span>
                          {product.originalPrice && <span className="text-xs text-on-surface-variant line-through ml-1.5">₹{product.originalPrice}</span>}
                        </div>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ id: product.id, name: product.name, brand: product.brand, price: product.price,
                            mrp: product.originalPrice || product.price, category: product.category, unit: product.packSize || "1 unit", slug: product.slug });
                        }} disabled={!product.inStock}
                          className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-center hover:shadow-lg active:scale-95 transition-all disabled:opacity-40">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
