"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Loader2, AlertCircle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import ProductIllustration from "@/components/ProductIllustration";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories, type CategoryKey, allProducts as localProducts } from "@/data/products";

interface ShopPageClientProps {
  initialCategory?: string;
}

export default function ShopPageClient({ initialCategory = "All" }: ShopPageClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  // Validate if initialCategory is a valid category, else default to 'All'
  const validCategory: CategoryKey = categories.includes(initialCategory as CategoryKey) 
    ? (initialCategory as CategoryKey) 
    : "All";
    
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(validCategory);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");

  const { products, loading, error } = useProducts({
    category: activeCategory === "All" ? undefined : activeCategory
  });

  const displayCategories = categories.filter(c => c !== "All");

  const filteredAndSortedProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : localProducts;
    let result = sourceProducts.filter(p => activeCategory === "All" || p.category === activeCategory);
    
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [products, activeCategory, sortBy]);

  const handleCategoryClick = (cat: CategoryKey) => {
    setActiveCategory(cat);
    if (cat === "All") {
      router.push("/shop");
    } else {
      router.push(`/shop/${cat.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <button onClick={() => router.push("/")} className="hover:text-[var(--color-brand-green)] transition-colors">Home</button>
          <ChevronRight size={14} />
          <button onClick={() => handleCategoryClick("All")} className={`hover:text-[var(--color-brand-green)] transition-colors ${activeCategory === "All" ? "font-bold text-gray-900" : ""}`}>Shop</button>
          {activeCategory !== "All" && (
            <>
              <ChevronRight size={14} />
              <span className="font-bold text-gray-900">{activeCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-2">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h1>
            <p className="text-gray-500 font-medium">
              Showing {filteredAndSortedProducts.length} products
            </p>
          </div>
          
          {/* Top Filter Bar */}
          <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-600 pl-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border-none text-sm font-medium rounded-lg focus:ring-2 focus:ring-[var(--color-brand-green)] py-2 pl-3 pr-8 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Sidebar (Categories) */}
          <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 hidden lg:block">
            <h3 className="font-extrabold text-lg text-[var(--color-brand-navy)] mb-4 pb-4 border-b border-gray-100">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryClick("All")}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
                    activeCategory === "All" 
                      ? "bg-[#DCFCE7] text-[#15803D]" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  All Products
                </button>
              </li>
              {displayCategories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
                      activeCategory === cat 
                        ? "bg-[#DCFCE7] text-[#15803D]" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Mobile Category Select (Horizontal Scroll) */}
          <div className="w-full lg:hidden flex overflow-x-auto pb-4 space-x-2 scrollbar-hide snap-x">
             <button
               onClick={() => handleCategoryClick("All")}
               className={`snap-center shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
                 activeCategory === "All"
                   ? "bg-[#DCFCE7] border-[#16A34A] text-[#15803D]"
                   : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
               }`}
             >
               All Products
             </button>
             {displayCategories.map((cat) => (
               <button
                 key={cat}
                 onClick={() => handleCategoryClick(cat)}
                 className={`snap-center shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
                   activeCategory === cat
                     ? "bg-[#DCFCE7] border-[#16A34A] text-[#15803D]"
                     : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full relative min-h-[500px]">
            {loading && products.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-3xl">
                <Loader2 className="w-10 h-10 text-[var(--color-brand-green)] animate-spin mb-4" />
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {filteredAndSortedProducts.length === 0 && !loading ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 h-full flex flex-col items-center justify-center">
                 <Package className="w-16 h-16 text-gray-200 mb-4" />
                 <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                 <p className="text-gray-500">There are no products available in this category.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                 {filteredAndSortedProducts.map((product) => (
                   <div
                     key={product.id}
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
                           {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
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
                       <div onClick={(e) => e.stopPropagation()}>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             addToCart(product);
                           }}
                           disabled={!product.inStock}
                           className="w-full bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                         >
                           {product.inStock ? "Add to Cart" : "Out of Stock"}
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
