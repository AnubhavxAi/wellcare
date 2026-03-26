import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";

export function useProducts(options: { category?: string; limit?: number } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      let query = supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("name");

      if (options.category && options.category !== "All") {
        query = query.eq("category", options.category);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        const mapped = (data || []).map(p => ({
          ...p,
          imageSrc: p.image_url,
          rxRequired: p.requires_prescription,
          originalPrice: p.mrp,
          inStock: p.in_stock,
          packSize: p.unit,
        }));
        setProducts(mapped);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [options.category, options.limit]);

  return { products, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        setProduct({
          ...data,
          imageSrc: data.image_url,
          rxRequired: data.requires_prescription,
          originalPrice: data.mrp,
          inStock: data.in_stock,
          packSize: data.unit,
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  return { product, loading };
}
