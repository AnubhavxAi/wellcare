// scripts/seedCategories.ts
export {};
const admin = require("firebase-admin");
const serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const categories = [
  { name: "Medicines", icon: "💊", order: 1 },
  { name: "Personal Care", icon: "🧴", order: 2 },
  { name: "Nutrition", icon: "🍎", order: 3 },
  { name: "Wellness", icon: "🧘", order: 4 },
  { name: "Devices", icon: "🌡️", order: 5 },
  { name: "Skin Care", icon: "✨", order: 6 },
  { name: "Baby Care", icon: "👶", order: 7 }
];

async function seed() {
  console.log("Seeding categories...");
  const batch = db.batch();
  
  categories.forEach((cat) => {
    const ref = db.collection("categories").doc();
    batch.set(ref, cat);
  });

  await batch.commit();
  console.log("Successfully seeded", categories.length, "categories!");
  process.exit();
}

seed().catch(console.error);
