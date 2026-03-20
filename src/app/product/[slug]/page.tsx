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
    title: `${product.name} | ${product.brand} | Wellcare Pharmacy Agra`,
    description: `Buy ${product.name} online at Wellcare Pharmacy. ${product.description}. Genuine medicines and fast delivery in Arjun Nagar, Agra.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageSrc],
    },
  };
}

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
