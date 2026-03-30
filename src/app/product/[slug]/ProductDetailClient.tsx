"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, allProducts } from "@/data/products";
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

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <button onClick={() => router.push("/")} className="hover:text-primary transition-colors">Home</button>
          <span className="text-outline-variant">›</span>
          <button onClick={() => router.push("/shop")} className="hover:text-primary transition-colors">Shop</button>
          <span className="text-outline-variant">›</span>
          <span className="capitalize">{product.category}</span>
          <span className="text-outline-variant">›</span>
          <span className="text-on-surface font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low rounded-xl p-8 shadow-[0_12px_40px_rgba(25,28,28,0.04)] relative">
              <span className="absolute top-3 left-3 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                <span className="material-symbols-outlined text-sm">verified</span> Genuine
              </span>
              <SmartProductImage
                category={product.category}
                name={product.name}
                src={product.imageSrc}
                size={320}
                className="w-full h-full"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-16 h-16 rounded-lg bg-surface-container cursor-pointer ring-2 transition-all flex items-center justify-center overflow-hidden ${i === 0 ? "ring-primary/30" : "ring-transparent hover:ring-primary/30"}`}>
                  <SmartProductImage category={product.category} name={product.name} src={product.imageSrc} size={48} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7">
            {/* Category */}
            <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary-fixed px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mt-3 mb-2">
              {product.name}
            </h1>

            {/* Brand */}
            <p className="text-on-surface-variant font-medium mb-4">{product.brand}</p>

            {/* Price */}
            <div className="flex items-end gap-3 mb-2">
              <span className="font-headline text-4xl font-extrabold text-on-surface">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-on-surface-variant line-through text-lg mb-1">₹{product.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-tertiary-fixed text-tertiary text-sm font-bold rounded-full mb-1">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-sm mb-6">Inclusive of all taxes</p>

            {/* Pack size */}
            <p className="text-on-surface font-medium mb-2">{product.packSize}</p>

            {/* In Stock */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-primary" : "bg-error"}`}></span>
              <span className="text-on-surface-variant">
                {product.inStock ? "In Stock · Usually delivered within 2 hours in Agra" : "Out of Stock"}
              </span>
            </div>

            {/* Prescription badge */}
            {product.rxRequired && (
              <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-xl mb-6">
                <span className="material-symbols-outlined text-error text-sm">clinical_notes</span>
                <span className="text-on-error-container text-sm font-semibold">
                  Prescription Required — Upload before checkout
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-on-surface font-medium">Quantity</span>
              <div className="flex items-center gap-3 bg-surface-container-lowest rounded-full px-2 py-1 shadow-[0_4px_20px_rgba(25,28,28,0.06)]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-all text-on-surface font-bold text-lg">
                  −
                </button>
                <span className="w-8 text-center font-bold text-on-surface">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-primary-container text-white transition-all font-bold text-lg">
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id, name: product.name, brand: product.brand,
                      price: product.price, mrp: product.originalPrice || product.price,
                      category: product.category, unit: product.packSize || "1 unit", slug: product.slug,
                    });
                  }
                }}
                disabled={!product.inStock}
                className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>

              <a
                href={`https://wa.me/919897397532?text=Hi%20Wellcare,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20(Qty:%20${quantity})%20from%20your%20website.`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-4 bg-surface-container-lowest text-primary font-bold rounded-full text-base shadow-[0_4px_20px_rgba(25,28,28,0.06)] hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                Order via WhatsApp
              </a>
            </div>

            {/* Delivery strip */}
            <div className="p-4 bg-surface-container-low rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">local_shipping</span>
                Delivering to Agra · Usually within 2 hours
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">verified</span>
                Free delivery on orders above ₹499
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-surface-container-low rounded-xl p-8 mt-12">
          <div className="flex gap-1 bg-surface-container rounded-full p-1 w-fit mb-8">
            {(["description", "benefits", "usage", "ingredients"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  activeTab === tab
                    ? "bg-surface-container-lowest text-on-surface shadow-[0_4px_20px_rgba(25,28,28,0.06)]"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}>
                {tab === "usage" ? "How to Use" : tab === "benefits" ? "Key Benefits" : tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              {activeTab === "description" && (
                <p className="font-body text-on-surface leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
              )}
              {activeTab === "benefits" && (
                <div className="flex flex-col gap-4">
                  {product.benefits.map((b: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm text-primary">check</span>
                      </div>
                      <p className="text-on-surface leading-relaxed">{b}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "usage" && (
                <div className="flex flex-col gap-4">
                  {product.howToUse.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-on-surface leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "ingredients" && (
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Product Specifications */}
        <div className="mt-12">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[
              ["Manufacturer", product.brand],
              ["Category", product.category],
              ["Form", product.form],
              ["Pack Size", product.packSize],
              ["Requires Rx", product.rxRequired ? "Yes" : "No"],
              ["Storage", "Cool dry place below 25°C"],
              ["Return Policy", "No returns on medicines"],
            ].map(([label, value], i) => (
              <div key={label} className={`flex justify-between py-3 px-4 rounded-lg ${i % 2 === 0 ? "bg-surface-container-low" : ""}`}>
                <span className="text-on-surface-variant text-sm">{label}</span>
                <span className="text-on-surface font-medium text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Information */}
        <div className="p-5 bg-tertiary-fixed rounded-xl flex gap-3 mt-8">
          <span className="material-symbols-outlined text-tertiary flex-shrink-0">warning</span>
          <div>
            <p className="font-semibold text-tertiary mb-1">Safety Information</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Read all instructions before use. Do not exceed recommended dose.
              Keep out of reach of children. Consult a doctor if symptoms persist.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">You may also need</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <button key={p.id}
                  onClick={() => router.push(`/product/${p.slug}`)}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,28,0.04)] hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(25,28,28,0.08)] transition-all duration-300 text-left group"
                >
                  <div className="aspect-square bg-surface-container-low flex items-center justify-center p-6 overflow-hidden">
                    <SmartProductImage category={p.category} name={p.name} src={p.imageSrc} size={120}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">{p.category}</span>
                    <h4 className="font-headline font-bold text-on-surface text-sm mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-headline font-extrabold text-on-surface">₹{p.price}</span>
                      {p.originalPrice && <span className="text-xs text-on-surface-variant line-through">₹{p.originalPrice}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
