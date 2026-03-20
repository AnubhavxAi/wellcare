"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const {
    sendOtp,
    verifyOtp,
    updateUserName,
    error,
    clearError,
    otpSent,
    otpLoading,
    user,
  } = useAuth();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Close modal when user logs in successfully
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setName("");
      setOtp(["", "", "", "", "", ""]);
      clearError();
    }
  }, [isOpen, clearError]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const handleSendOtp = async () => {
    if (phone.length >= 10) {
      await sendOtp(phone, "recaptcha-container");
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      await verifyOtp(otpString);
      // If register tab, save name
      if (tab === "register" && name.trim()) {
        await updateUserName(name.trim());
      }
    }
  };

  const handleReset = () => {
    setOtp(["", "", "", "", "", ""]);
    setPhone("");
    setName("");
    clearError();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[var(--color-brand-green)] to-emerald-600 px-6 py-8 text-white text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <User size={32} />
                </div>
                <h2 className="text-xl font-bold">Welcome to Wellcare</h2>
                <p className="text-white/80 text-sm mt-1">
                  Sign in to track orders & save prescriptions
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => {
                    setTab("login");
                    handleReset();
                  }}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    tab === "login"
                      ? "text-[var(--color-brand-green)] border-b-2 border-[var(--color-brand-green)]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setTab("register");
                    handleReset();
                  }}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    tab === "register"
                      ? "text-[var(--color-brand-green)] border-b-2 border-[var(--color-brand-green)]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 border-b border-red-100 px-4 py-3 flex items-center space-x-2"
                >
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Form Body */}
              <div className="p-6 space-y-5">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-brand-green)] focus-within:border-transparent">
                        <span className="px-3 text-gray-500 text-sm font-medium bg-gray-50 h-full py-3 border-r border-gray-200">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="9876543210"
                          className="flex-1 px-3 py-3 outline-none text-gray-900 placeholder-gray-400"
                        />
                        <div className="px-3">
                          <Phone size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {tab === "register" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleSendOtp}
                      disabled={phone.length < 10 || otpLoading}
                      className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center space-x-2 ${
                        phone.length >= 10 && !otpLoading
                          ? "bg-[var(--color-brand-green)] text-white hover:bg-opacity-90 shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <span>Send OTP</span>
                      )}
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center">
                      <Lock size={24} className="mx-auto text-[var(--color-brand-green)] mb-2" />
                      <p className="text-sm text-gray-600">
                        Enter the 6-digit OTP sent to{" "}
                        <span className="font-bold text-gray-900">+91 {phone}</span>
                      </p>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          maxLength={1}
                          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[var(--color-brand-green)] focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none transition-colors"
                        />
                      ))}
                    </div>

                    <button
                      disabled={otp.join("").length < 6 || otpLoading}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                        otp.join("").length >= 6 && !otpLoading
                          ? "bg-[var(--color-brand-green)] text-white hover:bg-opacity-90 shadow-md"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleVerifyOtp}
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify & {tab === "login" ? "Login" : "Register"}</span>
                      )}
                    </button>

                    <button
                      onClick={handleReset}
                      className="w-full text-sm text-gray-500 hover:text-[var(--color-brand-green)] transition-colors"
                    >
                      ← Change phone number
                    </button>
                  </motion.div>
                )}

                <p className="text-xs text-gray-400 text-center pt-2">
                  By continuing, you agree to our Terms of Service & Privacy Policy.
                </p>
              </div>

              {/* Invisible reCAPTCHA container */}
              <div id="recaptcha-container"></div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
