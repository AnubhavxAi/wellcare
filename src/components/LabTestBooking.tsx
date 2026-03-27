"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export interface LabTest {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  icon: string;
  popular?: boolean;
}

export const labTests: LabTest[] = [
  {
    id: "lt1", slug: "cbc",
    name: "Complete Blood Count (CBC)",
    price: 299, originalPrice: 450,
    description: "Measures red & white blood cells, hemoglobin, platelets. Essential diagnostic baseline.",
    icon: "health_metrics", popular: true,
  },
  {
    id: "lt2", slug: "blood-sugar-fasting",
    name: "Blood Sugar (Fasting)",
    price: 99, originalPrice: 150,
    description: "Fasting blood glucose test for diabetes screening and monitoring.",
    icon: "glucose", popular: false,
  },
  {
    id: "lt3", slug: "thyroid-profile",
    name: "Thyroid Profile (T3, T4, TSH)",
    price: 399, originalPrice: 600,
    description: "Complete thyroid function test panel for hormonal balance assessment.",
    icon: "ecg_heart", popular: false,
  },
  {
    id: "lt4", slug: "urine-routine",
    name: "Urine Routine Examination",
    price: 149, originalPrice: 200,
    description: "Tests for infections, kidney function, and diabetes indicators.",
    icon: "labs", popular: false,
  },
  {
    id: "lt5", slug: "lipid-profile",
    name: "Lipid Profile",
    price: 499, originalPrice: 700,
    description: "Cholesterol, triglycerides, HDL, LDL — complete cardiovascular health marker.",
    icon: "cardiology", popular: false,
  },
  {
    id: "lt6", slug: "vitamin-d",
    name: "Vitamin D Total",
    price: 599, originalPrice: 900,
    description: "25-Hydroxy Vitamin D test for bone and immune health monitoring.",
    icon: "sunny", popular: false,
  },
];

export default function LabTestBooking() {
  const router = useRouter();

  return (
    <section id="lab-tests" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Precision <span className="text-primary">Diagnostics</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Book certified lab tests with home collection across Agra. Clear results, 
            professional care, and a sanctuary for your health data.
          </p>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_40px_rgba(25,28,28,0.04)] hover:translate-y-[-4px] hover:shadow-[0_20px_60px_rgba(25,28,28,0.08)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                  <span className="material-symbols-outlined">{test.icon}</span>
                </div>
                {test.popular && (
                  <span className="text-xs font-bold uppercase tracking-widest text-tertiary bg-tertiary-fixed px-2 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">
                {test.name}
              </h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                {test.description}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  {test.originalPrice && (
                    <span className="text-on-surface-variant line-through text-xs">
                      ₹{test.originalPrice}
                    </span>
                  )}
                  <div className="text-2xl font-extrabold text-on-surface font-headline">
                    ₹{test.price}
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/book-test?test=${encodeURIComponent(test.name)}`)}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="/lab-tests" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
            View All Tests
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
