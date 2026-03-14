"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, MapPin } from "lucide-react";

// List of valid Agra pincodes
const validPincodes = [
  '282001', '282002', '282003', '282004', '282005', 
  '282006', '282007', '282008', '282009', '282010'
];

interface PincodeValidatorProps {
  onValidationChange: (isValid: boolean) => void;
}

export default function PincodeValidator({ onValidationChange }: PincodeValidatorProps) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCheck = () => {
    const trimmedPincode = pincode.trim();
    if (trimmedPincode.length === 0) {
      setStatus("idle");
      onValidationChange(false);
      return;
    }

    if (validPincodes.includes(trimmedPincode)) {
      setStatus("success");
      onValidationChange(true);
    } else {
      setStatus("error");
      onValidationChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
    // Reset status when user starts typing again
    if (status !== "idle") {
      setStatus("idle");
      onValidationChange(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col space-y-3">
      <div className="flex items-center space-x-2 text-[var(--color-brand-navy)] mb-1">
        <MapPin size={18} />
        <span className="font-semibold text-sm">Check Delivery Availability</span>
      </div>
      
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={pincode}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={6}
          placeholder="Enter Delivery Pincode"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent outline-none transition-shadow text-sm"
        />
        <button 
          onClick={handleCheck}
          className="px-4 py-2 bg-[var(--color-brand-navy)] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors text-sm whitespace-nowrap"
        >
          Check
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start space-x-2 text-[var(--color-brand-green)] bg-green-50 p-2 rounded-lg border border-green-100"
          >
            <CheckCircle size={16} className="mt-0.5 shrink-0" />
            <span className="text-xs font-medium">Eligible for Fastest Delivery in Agra!</span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start space-x-2 text-red-600 bg-red-50 p-2 rounded-lg border border-red-100"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span className="text-xs font-medium">Currently, we only deliver within Agra city limits.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
