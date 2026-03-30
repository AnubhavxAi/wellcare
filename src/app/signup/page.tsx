"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Smartphone, Mail, Calendar, User as UserIcon, MapPin, ArrowRight, CheckCircle2, ChevronLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";



export default function SignupPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.phone.length !== 10) {
      setError("Please fill all required fields correctly");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: `+91${formData.phone}`,
        options: { 
          channel: "whatsapp",
          data: {
            full_name: formData.name,
          }
        },
      });

      if (otpError) throw otpError;
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+91${formData.phone}`,
        token: otp,
        type: "sms",
      });

      if (verifyError) throw verifyError;

      // Sync with users table
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          phone: data.user.phone,
          name: formData.name,
          last_login: new Date().toISOString()
        });
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Left Side: Nature Image */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <Image
          src="/images/nature-bg.png"
          alt="Nature"
          fill
          className="object-cover brightness-75 grayscale-[0.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/40"></div>
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

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative bg-black overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          {step === 1 ? (
            <>
              <div className="mb-10 text-left">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight">Create an account</h1>
                <p className="text-gray-400">Join our community for faster healthcare services.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* Name */}
                  <div className="group relative">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                    <div className="flex items-center border-b border-gray-800 group-focus-within:border-emerald-500 transition-colors py-2">
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent w-full focus:outline-none text-white text-lg placeholder:text-gray-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group relative">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Mobile Number</label>
                    <div className="flex items-center border-b border-gray-800 group-focus-within:border-emerald-500 transition-colors py-2">
                      <span className="text-gray-400 mr-2 font-medium">+91</span>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10)})}
                        className="bg-transparent w-full focus:outline-none text-white text-lg placeholder:text-gray-700"
                        required
                      />
                    </div>
                  </div>


                </div>

                <div className="pt-6 space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Verify Number via WhatsApp</span>
                        <MessageSquare size={18} />
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } })}
                    className="w-full bg-transparent border border-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center space-x-3"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)}
                className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ChevronLeft size={16} className="mr-1" />
                Edit Details
              </button>

              <div className="mb-10 text-left">
                <h1 className="text-4xl font-semibold mb-2 tracking-tight">Verify WhatsApp OTP</h1>
                <p className="text-gray-400 text-lg">Sent to +91 {formData.phone}</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-12">
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              </form>
            </>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-white font-semibold hover:text-emerald-500 transition-colors underline underline-offset-4">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
