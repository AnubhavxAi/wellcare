"use client";

import { motion } from "framer-motion";
import { FlaskConical, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export interface LabTest {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  tag: string;
}

export const labTests: LabTest[] = [
  {
    id: "lt1",
    name: "Complete Blood Count (CBC)",
    price: 299,
    originalPrice: 450,
    description: "Measures red & white blood cells, hemoglobin, platelets",
    tag: "Most Popular",
  },
  {
    id: "lt2",
    name: "Blood Sugar (Fasting)",
    price: 99,
    originalPrice: 150,
    description: "Fasting blood glucose test for diabetes screening",
    tag: "Quick Test",
  },
  {
    id: "lt3",
    name: "Thyroid Profile (T3, T4, TSH)",
    price: 399,
    originalPrice: 600,
    description: "Complete thyroid function test panel",
    tag: "Recommended",
  },
  {
    id: "lt4",
    name: "Urine Routine Test",
    price: 149,
    originalPrice: 200,
    description: "Tests for infections, kidney function, diabetes indicators",
    tag: "",
  },
  {
    id: "lt5",
    name: "Lipid Profile",
    price: 499,
    originalPrice: 700,
    description: "Cholesterol, triglycerides, HDL, LDL measurement",
    tag: "Heart Health",
  },
  {
    id: "lt6",
    name: "Vitamin D",
    price: 599,
    originalPrice: 900,
    description: "25-Hydroxy Vitamin D test for bone & immune health",
    tag: "",
  },
];

export default function LabTestBooking() {
  const router = useRouter();

  return (
    <section id="lab-tests" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FlaskConical size={16} />
            <span>Lab Tests at Home</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-navy)] mb-3">
            Book a Lab Test at Home
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Get accurate lab tests with home sample collection across Agra. Results delivered digitally.
          </p>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {labTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              {test.tag && (
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {test.tag}
                </span>
              )}

              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FlaskConical size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
                    {test.name}
                  </h3>
                  <p className="text-xs text-gray-500">{test.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-extrabold text-[var(--color-brand-navy)]">
                    ₹{test.price}
                  </span>
                  {test.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{test.originalPrice}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/book-test?test=${encodeURIComponent(test.name)}`)}
                  className="px-5 py-2.5 bg-[var(--color-brand-green)] text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Book Now
                </button>
              </div>

              <div className="flex items-center space-x-1.5 mt-3 text-xs text-emerald-600">
                <Home size={14} />
                <span className="font-medium">Home Collection Available</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
