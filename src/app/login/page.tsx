"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Smartphone, Lock, ArrowRight, MessageSquare, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // Auth State
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Name
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: { channel: "whatsapp" },
      });

      if (otpError) throw otpError;
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: "sms",
      });

      if (verifyError) throw verifyError;

      // Check if user has a name in metadata
      const user = data.user;
      if (user?.user_metadata?.full_name) {
        router.push(redirectPath);
      } else {
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set Name
  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (updateError) throw updateError;
      
      // Update users table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          phone: user.phone,
          name: name,
          last_login: new Promise(resolve => resolve(new Date().toISOString()))
        });
      }

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Left Side: Nature Image */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <Image
          src="/images/nature-bg.png"
          alt="Nature"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/30"></div>
        {/* Branding Overlay */}
        <div className="absolute top-12 left-12 z-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Wellcare</span>
          </Link>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative bg-black">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center space-x-2">
            <CheckCircle2 className="text-emerald-500" size={32} />
            <span className="text-xl font-bold">Wellcare</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
          )}

          <div className="mb-10">
            <h1 className="text-4xl font-semibold mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-400 text-lg">Please enter your details.</p>
          </div>

          <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleSetName} className="space-y-12">
            {step === 1 && (
              <div className="space-y-8">
                <div className="group relative">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Mobile Number</label>
                  <div className="flex items-center border-b border-gray-800 group-focus-within:border-emerald-500 transition-colors py-2">
                    <span className="text-gray-400 mr-2 font-medium">+91</span>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="bg-transparent w-full focus:outline-none text-white text-lg placeholder:text-gray-700"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="w-4 h-4 border border-gray-700 rounded flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                      <div className="w-2 h-2 bg-emerald-500 rounded-sm scale-0 group-has-[:checked]:scale-100 transition-transform"></div>
                    </div>
                    <input type="checkbox" className="hidden" defaultChecked />
                    <span className="text-gray-500 group-hover:text-gray-300">Remember me</span>
                  </label>
                  <button type="button" className="text-gray-500 hover:text-emerald-500 transition-colors">Forgot password?</button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Get OTP on WhatsApp</span>
                      <MessageSquare size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="group relative">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Enter 6-digit OTP</label>
                  <div className="border-b border-gray-800 group-focus-within:border-emerald-500 transition-colors py-2">
                    <input
                      type="text"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="bg-transparent w-full focus:outline-none text-white text-3xl tracking-[0.5em] placeholder:text-gray-700 text-center"
                      autoFocus
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Sent to +91 {phone}. <button type="button" onClick={() => setStep(1)} className="text-emerald-500 hover:underline">Change</button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="group relative">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                  <div className="border-b border-gray-800 group-focus-within:border-emerald-500 transition-colors py-2">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-white text-lg placeholder:text-gray-700"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Complete Profile</span>
                  )}
                </button>
              </div>
            )}
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white font-semibold hover:text-emerald-500 transition-colors underline underline-offset-4">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
