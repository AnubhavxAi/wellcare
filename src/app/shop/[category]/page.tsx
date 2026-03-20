import React from "react";
import ShopPageClient from "../ShopPageClient";

export function generateStaticParams() {
  const categories = [
    "medicines",
    "personal-care",
    "devices",
    "nutrition",
    "baby-care",
    "ayurveda",
    "homeopathy",
    "supplements",
    "healthcare",
    "all",
  ];
  return categories.map((cat) => ({
    category: cat,
  }));
} 

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // Convert URL slug to category name, e.g., "personal-care" -> "Personal Care"
  const { category } = await params;
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <ShopPageClient initialCategory={formattedCategory} />;
}
