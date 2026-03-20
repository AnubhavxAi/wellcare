// scripts/seedProducts.ts
import * as admin from "firebase-admin";
import { allProducts } from "../src/data/products";
import * as path from "path";
import * as fs from "fs";

// Path to service account key
const serviceAccountPath = path.join(__dirname, "../service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Error: service-account.json not found in the root directory.");
  console.log("Please download your service account key from:");
  console.log("Firebase Console > Project Settings > Service Accounts > Generate New Private Key");
  console.log("And save it as 'service-account.json' in the root of your project.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  console.log(`🚀 Starting seeding process for ${allProducts.length} products...`);
  
  const productsCol = db.collection("products");
  
  // Optional: Clear existing products to avoid duplicates during testing
  // console.log("🧹 Clearing old products...");
  // const snapshot = await productsCol.get();
  // const deleteBatch = db.batch();
  // snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
  // await deleteBatch.commit();

  const batchSize = 20;
  for (let i = 0; i < allProducts.length; i += batchSize) {
    const batch = db.batch();
    const chunk = allProducts.slice(i, i + batchSize);
    
    chunk.forEach((product) => {
      // Use the product slug as the document ID for cleaner URLs and indexing
      const ref = productsCol.doc(product.slug);
      batch.set(ref, {
        ...product,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        // Map any legacy fields if necessary
        imageUrl: product.imageSrc, 
        mrp: product.originalPrice || product.price
      });
    });

    await batch.commit();
    console.log(`✅ Seeded batch ${Math.floor(i/batchSize) + 1} (${i + chunk.length}/${allProducts.length})`);
  }

  console.log("✨ Successfully seeded all products to Firestore!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
