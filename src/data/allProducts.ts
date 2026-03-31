import { products as existingProducts } from "./products";
import { newProducts } from "./newProducts";
import { Product } from "@/types/product";

// Merge both arrays — newProducts adds to existing 52
export const ALL_PRODUCTS: Product[] = [
  ...existingProducts,
  ...newProducts,
];

// Helper: get products by category (case-insensitive match)
export function getProductsByCategory(category: string): Product[] {
  if (!category || category === "All") return ALL_PRODUCTS;
  return ALL_PRODUCTS.filter(p =>
    p.category.toLowerCase() === category.toLowerCase()
  );
}

// Helper: get single product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug);
}

// Helper: get all unique categories with counts
export function getCategoriesWithCounts(): { category: string; count: number }[] {
  const counts: Record<string, number> = {};
  ALL_PRODUCTS.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export const PRODUCT_CATEGORIES = [
  "All Products",
  "Medicines",
  "Vitamins & Supplements", 
  "Personal Care",
  "Baby Care",
  "Medical Devices",
  "Skincare",
  "Pain Relief",
  "First Aid",
  "Oral Care",
  "Nutrition",
];
