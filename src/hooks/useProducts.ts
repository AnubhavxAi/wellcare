"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { allProducts, type Product } from "@/data/products";

interface UseProductsOptions {
  category?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook that fetches products from Firestore in real-time.
 * Falls back to hardcoded data if Firestore is unavailable.
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);

  useEffect(() => {
    // Build Firestore query
    const productsRef = collection(db, "products");
    let q;

    try {
      if (options.category && options.category !== "All") {
        q = query(
          productsRef,
          where("category", "==", options.category),
          where("inStock", "==", true)
        );
      } else {
        q = query(productsRef, where("inStock", "==", true));
      }
    } catch {
      // If query construction fails, fall back
      setTimeout(() => {
        setProducts(allProducts);
        setLoading(false);
        setFirestoreAvailable(false);
      }, 0);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty && !firestoreAvailable) {
          // No products in Firestore — use hardcoded fallback
          setProducts(allProducts);
        } else if (!snapshot.empty) {
          const firestoreProducts = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              slug: data.slug || "",
              name: data.name || "",
              brand: data.brand || "",
              price: data.price || 0,
              originalPrice: data.mrp || data.originalPrice,
              category: data.category || "",
              description: data.description || "",
              fullDescription: data.fullDescription || data.description || "",
              imageSrc: data.imageUrl || data.imageSrc || "",
              inStock: data.inStock !== false,
              benefits: data.benefits || [],
              howToUse: data.howToUse || [],
              ingredients: data.ingredients || [],
              form: data.form || "Tablet",
              rxRequired: data.rxRequired || false,
              packSize: data.packSize || "",
            } as Product;
          });
          setProducts(firestoreProducts);
          setFirestoreAvailable(true);
        } else {
          // Empty collection but Firestore is reachable — use hardcoded as fallback
          setProducts(allProducts);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn("Firestore unavailable, using local data:", err.message);
        setProducts(allProducts);
        setLoading(false);
        setError(null); // Don't show error to user — graceful fallback
        setFirestoreAvailable(false);
      }
    );

    return () => unsubscribe();
  }, [options.category, firestoreAvailable]);

  return { products, loading, error };
}
