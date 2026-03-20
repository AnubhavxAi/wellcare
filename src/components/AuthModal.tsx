"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Loader2, ArrowRight } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import { functions, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}


export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const { user, setUser } = useAuth();
  
  // Screens: "phone", "otp", "name"
  const [screen, setScreen] = useState<"phone" | "otp" | "name">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Data
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Timers
  const [countdown, setCountdown] = useState(0);
  const [shake, setShake] = useState(false);

  // --- TIMER LOGIC ---
  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // --- PHONE SUBMIT ---
  const handleSendOtp = async () => {
    const rawPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(rawPhone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const sendOtp = httpsCallable(functions, "sendOtp");
      await sendOtp({ phoneNumber: "+91" + rawPhone });
      setScreen("otp");
      startCountdown(30);
    } catch (err: any) {
      const message = err?.message || err?.details || "Failed to send OTP. Please try again.";
      setError(message);
      console.error("sendOtp error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- OTP SUBMIT ---
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      triggerShake();
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const verifyOtp = httpsCallable(functions, "verifyOtp");
      const rawPhone = "+91" + phone.replace(/\D/g, "");
      const result = await verifyOtp({
        phoneNumber: rawPhone,
        code: otp,
        name: "",
      }) as any;
      
      const resData = result.data;
      await signInWithCustomToken(auth, resData.customToken);
      setUser({ ...resData.user, isLoggedIn: true });
      
      if (resData.isNewUser) {
        setIsNewUser(true);
        setScreen("name");
      } else {
        onSuccess();
      }
    } catch (err: any) {
      const message = err?.message || err?.details || "OTP verification failed. Please try again.";
      setError(message);
      console.error("verifyOtp error:", err);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // --- NAME SUBMIT (Only New Users) ---
  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Please enter your name contextually.");
      return;
    }
    setLoading(true);
    try {
      // Name was updated manually but wait, verifyOtp creates the user document
      // We need to update the Firestore document if necessary, or let AuthContext handle it.
      // But verifyOtp takes 'name' parameter. Actually we didn't pass name initially.
      // Let's just update AuthContext state here and make an API call, wait, we don't have an updateName HTTP function.
      // We can directly update Firestore here, but user is logged in now!
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const rawPhone = "+91" + phone.replace(/\D/g, "");
      await updateDoc(doc(db, "users", rawPhone), { name });
      
      setUser(user ? { ...user, name } : null);
      onSuccess();
    } catch (e) {
      setError("Failed to save name.");
    } finally {
      setLoading(false);
    }
  };

  // --- OTP INPUT EVENT HANDLERS ---
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  
  const handleOtpChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const newOtp = otp.split("");
    newOtp[index] = digit;
    const newValue = newOtp.join("");
    setOtp(newValue);
    
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };
  
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otp.length === 6) {
      handleVerifyOtp();
    }
  };
  
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted) {
      const chars = pasted.slice(0, 6).split("");
      setOtp(chars.join(""));
      const focusIndex = Math.min(chars.length, 5);
      otpInputs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[360px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden relative">
        
        {/* Header */}
        <div className="pt-8 pb-4 px-7 flex flex-col items-center border-b border-gray-100">
          <img src="/logo.png" alt="Wellcare Pharmacy logo" className="h-8 mb-4 object-contain" />
          {screen === "phone" && <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>}
        </div>

        {/* Content Screens */}
        <div className="p-7 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: PHONE */}
            {screen === "phone" && (
              <motion.div 
                key="phone"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <h2 className="text-[20px] font-semibold text-gray-900 text-center mb-1">Welcome to Wellcare</h2>
                <p className="text-[14px] text-gray-500 text-center mb-6">Login or create your account</p>

                <div className={`flex items-center h-[48px] border rounded-[10px] overflow-hidden transition-colors focus-within:border-[var(--color-brand-green)] focus-within:border-2 ${error ? "border-red-500" : "border-gray-300"}`}>
                  <div className="bg-gray-100 px-3 h-full flex items-center justify-center font-medium text-gray-700 border-r border-gray-300 select-none">
                    +91
                  </div>
                  <input 
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    className="flex-1 h-full px-3 outline-none text-[16px] text-gray-900"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-2 font-medium text-center">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                  className="mt-6 w-full h-[52px] bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-[10px] transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Send OTP</span>}
                </button>
                
                <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-gray-500">
                  <span className="opacity-70">🔒</span>
                  <span>We'll send a 6-digit OTP to your number</span>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: OTP */}
            {screen === "otp" && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <h2 className="text-[20px] font-semibold text-gray-900 text-center mb-1">Enter OTP</h2>
                <div className="flex items-center justify-center space-x-1 text-[14px]">
                  <span className="text-gray-500">Sent to +91 {phone}</span>
                  <button onClick={() => { setScreen("phone"); setOtp(""); setError(""); }} className="text-[var(--color-brand-green)] font-bold hover:underline">Change</button>
                </div>

                <motion.div 
                  animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between gap-2 mt-6 mb-4"
                >
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputs.current[i] = el; }}
                      type="tel"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className={`w-10 h-12 text-center text-xl font-bold bg-white border-2 rounded-xl outline-none transition-colors ${
                        error ? "border-red-500 text-red-600" : "border-gray-300 text-gray-900 focus:border-[var(--color-brand-green)]"
                      }`}
                    />
                  ))}
                </motion.div>
                {error && <p className="text-red-500 text-xs mt-1 font-medium text-center">{error}</p>}

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className="mt-6 w-full h-[52px] bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-[10px] transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Verify OTP</span>}
                </button>

                <div className="mt-4 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm font-medium text-gray-400">Resend OTP in 00:{String(countdown).padStart(2, "0")}</p>
                  ) : (
                    <button onClick={handleSendOtp} className="text-sm font-bold text-[var(--color-brand-green)] hover:underline">Resend OTP</button>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: NAME (Only new users) */}
            {screen === "name" && (
              <motion.div 
                key="name"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="flex justify-center mb-2 text-4xl">🎉</div>
                <h2 className="text-[20px] font-semibold text-gray-900 text-center mb-1">Welcome to Wellcare!</h2>
                <p className="text-[14px] text-gray-500 text-center mb-6">What should we call you?</p>

                <input 
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className={`w-full h-[48px] px-4 border rounded-[10px] outline-none text-[16px] text-gray-900 transition-colors focus:border-2 focus:border-[var(--color-brand-green)] ${error ? "border-red-500" : "border-gray-300"}`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-2 font-medium text-center">{error}</p>}

                <button
                  onClick={handleSaveName}
                  disabled={loading || name.trim().length === 0}
                  className="mt-6 w-full h-[52px] bg-[var(--color-brand-green)] hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-[10px] transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Continue</span><ArrowRight size={18} /></>}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
