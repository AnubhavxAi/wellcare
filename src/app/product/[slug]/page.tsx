import React from "react";
import { Metadata } from "next";
import { allProducts } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Wellcare Pharmacy",
    };
  }

  return {
    title: `${product.name} - Buy Online | Wellcare Pharmacy Agra`,
    description: `Buy ${product.name} by ${product.brand} online at Wellcare Pharmacy in Agra. ₹${product.price}. ${product.description}`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.imageSrc],
      type: "website",
    },
    alternates: {
      canonical: `https://wellcare-pharmacy-76524.vercel.app/product/${product.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return []; // Vercel renders dynamically — no pre-generation needed
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
