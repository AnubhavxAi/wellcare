export type CategoryKey =
  | "All"
  | "Medicines"
  | "Vitamins & Supplements"
  | "Personal Care"
  | "Baby Care"
  | "Medical Devices"
  | "Skincare"
  | "Pain Relief"
  | "First Aid"
  | "Oral Care"
  | "Nutrition"
  | "Mankind Products";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: CategoryKey;
  description: string;
  fullDescription: string;
  imageSrc: string;
  additionalImages?: string[];
  inStock: boolean;
  benefits: string[];
  howToUse: string[];
  ingredients: string[];
  form: string;
  rxRequired: boolean;
  packSize: string;
  // New medical-grade fields
  saltComposition?: string;
  manufacturer?: string;
  storageInstructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  drugInteractions?: string[];
  ageGroup?: "Adults" | "Children" | "All ages";
  warning?: string;
}
