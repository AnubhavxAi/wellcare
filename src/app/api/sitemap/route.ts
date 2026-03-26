import { NextResponse } from "next/server";
import { allProducts } from "@/data/products";

export async function GET() {
  const baseUrl = "https://wellcare-pharmacy-76524.vercel.app";

  const staticPages = [
    "",
    "/shop",
    "/lab-tests",
    "/offers",
    "/cart",
    "/checkout",
  ];

  const productPages = allProducts.map((p) => `/product/${p.slug}`);

  const categoryPages = [
    "medicines",
    "personal-care",
    "devices",
    "nutrition",
    "baby-care",
    "ayurveda",
    "homeopathy",
    "supplements",
    "healthcare",
    "skincare",
    "pain-relief",
    "first-aid",
    "oral-care",
  ].map((c) => `/shop/${c}`);

  const allPages = [...staticPages, ...productPages, ...categoryPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
