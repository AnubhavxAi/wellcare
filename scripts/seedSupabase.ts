import { createClient } from "@supabase/supabase-js";
import { allProducts } from "../src/data/products";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding products...");
  
  const { error } = await supabase
    .from("products")
    .upsert(
      allProducts.map(p => ({
        slug:          p.slug,
        name:          p.name,
        brand:         p.brand,
        category:      p.category,
        price:         p.price,
        mrp:           p.originalPrice || p.price,
        stock:         100,
        unit:          p.packSize || "Unit",
        image_url:     p.imageSrc || null,
        description:   p.description,
        benefits:      p.benefits || [],
        how_to_use:    p.howToUse || [],
        ingredients:   p.ingredients || [],
        form:          p.form || "",
        requires_prescription: p.rxRequired || false,
        in_stock:      true,
      })),
      { onConflict: "slug" }
    );

  if (error) {
    console.error("Seed error:", error);
  } else {
    console.log(`✓ Seeded ${allProducts.length} products`);
  }
}

seed();
