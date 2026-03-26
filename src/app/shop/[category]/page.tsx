import React from "react";
import { Metadata } from "next";
import ShopPageClient from "../ShopPageClient";

export async function generateStaticParams() {
  return []; // Vercel renders dynamically — no pre-generation needed
}

const categoryNames: Record<string, string> = {
  medicines: "Medicines",
  "personal-care": "Personal Care",
  devices: "Medical Devices",
  nutrition: "Nutrition",
  "baby-care": "Baby Care",
  ayurveda: "Ayurveda",
  homeopathy: "Homeopathy",
  supplements: "Vitamins & Supplements",
  healthcare: "Healthcare",
  skincare: "Skincare",
  "pain-relief": "Pain Relief",
  "first-aid": "First Aid",
  "oral-care": "Oral Care",
  all: "All Products",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = categoryNames[category] || category;

  return {
    title: `${name} - Buy Online | Wellcare Pharmacy Agra`,
    description: `Buy genuine ${name} online from Wellcare Pharmacy in Agra. Fast delivery across Agra city. 100% authentic products.`,
  };
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
