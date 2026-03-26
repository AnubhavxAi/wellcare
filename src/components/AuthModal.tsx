// MANUAL SETUP REQUIRED (one-time):
// 1. Go to console.firebase.google.com
// 2. Open wellcare-pharmacy-76524 project
// 3. Go to Authentication → Sign-in method
// 4. Enable "Phone" provider → Save
// That's it. No other configuration needed.

"use client";
import { useState, useEffect, useRef } from "react";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } 
  from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import OtpInputBoxes from "./OtpInputBoxes";

interface AuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  
  // Screen: "phone" | "otp" | "name"
  const [screen, setScreen] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = 
    useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const { setUser } = useAuth();

  // Setup invisible reCAPTCHA on mount
  useEffect(() => {
    // Use invisible reCAPTCHA — user never sees it
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container", 
        {
          size: "invisible",  // ← INVISIBLE, no annoying checkbox
          callback: () => {},
          "expired-callback": () => {
            recaptchaVerifierRef.current?.clear();
            recaptchaVerifierRef.current = null;
          },
        }
      );
    }
    return () => {
      // Cleanup on unmount
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  // Countdown timer for resend
  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // SEND OTP using Firebase Phone Auth
  const handleSendOtp = async () => {
    const trimmedPhone = phone.trim();
    
    // Validate 10-digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    const fullPhone = "+91" + trimmedPhone;

    try {
      // Re-initialize verifier if needed
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible", callback: () => {} }
        );
      }

      // Firebase sends OTP directly — no Cloud Function needed
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(result);
      setScreen("otp");
      startCountdown(30);

    } catch (err: any) {
      console.error("sendOTP error:", err.code, err.message);
      
      // Map Firebase error codes to friendly messages
      const errorMap: Record<string, string> = {
        "auth/invalid-phone-number": 
          "Invalid phone number. Please check and try again.",
        "auth/too-many-requests": 
          "Too many attempts. Please wait a few minutes.",
        "auth/quota-exceeded": 
          "SMS quota exceeded. Please try again tomorrow.",
        "auth/captcha-check-failed": 
          "Verification failed. Please refresh and try again.",
        "auth/network-request-failed": 
          "Network error. Please check your connection.",
      };
      
      setError(
        errorMap[err.code] || 
        "Failed to send OTP. Please try again."
      );

      // Reset reCAPTCHA on error so next attempt works
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;

    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP using Firebase confirmationResult
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setOtpError("Session expired. Please go back and resend OTP.");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      // Confirm the OTP with Firebase
      const userCredential = await confirmationResult.confirm(otp);
      const firebaseUser = userCredential.user;
      const phoneNumber = firebaseUser.phoneNumber || ("+91" + phone);

      // Check if user exists in Firestore
      const userRef = doc(db, "users", phoneNumber);
      const userSnap = await getDoc(userRef);
      const isNewUser = !userSnap.exists();

      if (isNewUser) {
        // New user — save to Firestore, ask for name
        await setDoc(userRef, {
          phone: phoneNumber,
          name: "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          addresses: [],
          orderCount: 0,
        });
        setScreen("name");
      } else {
        // Returning user — update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });
        // Set user in context and close modal
        setUser({
          phone: phoneNumber,
          name: userSnap.data()?.name || "",
          isLoggedIn: true,
        });
        onSuccess();
      }

    } catch (err: any) {
      console.error("verifyOTP error:", err.code, err.message);
      
      const errorMap: Record<string, string> = {
        "auth/invalid-verification-code": 
          "Incorrect OTP. Please check and try again.",
        "auth/code-expired": 
          "OTP has expired. Please request a new one.",
        "auth/session-expired": 
          "Session expired. Please go back and resend OTP.",
      };

      setOtpError(
        errorMap[err.code] || 
        "Incorrect OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // SAVE NAME for new users
  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    const phoneNumber = "+91" + phone;

    try {
      const userRef = doc(db, "users", phoneNumber);
      await updateDoc(userRef, { name: name.trim() });

      setUser({
        phone: phoneNumber,
        name: name.trim(),
        isLoggedIn: true,
      });
      onSuccess();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Invisible reCAPTCHA container — MUST be in the DOM */}
      <div id="recaptcha-container"></div>

      {/* Modal backdrop */}
      <div
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && screen === "phone") 
            onClose();
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px 28px",
            width: "100%",
            maxWidth: "380px",
            position: "relative",
          }}
        >
          {/* Close button — only on phone screen */}
          {screen === "phone" && (
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "none", border: "none",
                fontSize: "20px", cursor: "pointer", color: "#6B7280",
              }}
            >
              ×
            </button>
          )}

          {/* Wellcare logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <img 
              src="/logo.png" 
              alt="Wellcare" 
              style={{ height: "36px" }} 
            />
          </div>

          {/* === SCREEN 1: PHONE === */}
          {screen === "phone" && (
            <div>
              <h2 style={{
                fontSize: "20px", fontWeight: 600,
                textAlign: "center", marginBottom: "6px", color: "#111827"
              }}>
                Welcome to Wellcare
              </h2>
              <p style={{
                fontSize: "14px", color: "#6B7280",
                textAlign: "center", marginBottom: "24px"
              }}>
                Login or create your account
              </p>

              {/* Phone input */}
              <div style={{
                display: "flex", border: "1.5px solid #D1D5DB",
                borderRadius: "10px", overflow: "hidden",
                marginBottom: "8px",
              }}>
                <div style={{
                  padding: "0 14px", background: "#F9FAFB",
                  display: "flex", alignItems: "center",
                  borderRight: "1px solid #D1D5DB",
                  fontSize: "15px", color: "#374151", fontWeight: 500,
                }}>
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                  style={{
                    flex: 1, padding: "14px",
                    border: "none", outline: "none",
                    fontSize: "16px",
                  }}
                  maxLength={10}
                  inputMode="numeric"
                  autoFocus
                />
              </div>

              {error && (
                <p style={{ 
                  color: "#EF4444", fontSize: "12px", 
                  marginBottom: "8px" 
                }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                style={{
                  width: "100%", padding: "14px",
                  background: loading || phone.length !== 10 
                    ? "#9CA3AF" : "#16A34A",
                  color: "white", border: "none",
                  borderRadius: "10px", fontSize: "16px",
                  fontWeight: 600, cursor: loading ? "wait" : "pointer",
                  marginTop: "8px",
                }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <p style={{
                fontSize: "12px", color: "#9CA3AF",
                textAlign: "center", marginTop: "12px"
              }}>
                🔒 We'll send a 6-digit OTP to your number
              </p>
            </div>
          )}

          {/* === SCREEN 2: OTP === */}
          {screen === "otp" && (
            <div>
              <h2 style={{
                fontSize: "18px", fontWeight: 600,
                textAlign: "center", marginBottom: "4px", color: "#111827"
              }}>
                Enter OTP
              </h2>
              <p style={{
                fontSize: "13px", color: "#6B7280",
                textAlign: "center", marginBottom: "24px"
              }}>
                Sent to +91 {phone}{" "}
                <button
                  onClick={() => {
                    setScreen("phone");
                    setOtp("");
                    setOtpError("");
                  }}
                  style={{
                    color: "#16A34A", background: "none",
                    border: "none", cursor: "pointer",
                    fontSize: "13px", textDecoration: "underline",
                  }}
                >
                  Change
                </button>
              </p>

              <OtpInputBoxes
                value={otp}
                onChange={setOtp}
                hasError={!!otpError}
              />

              {otpError && (
                <p style={{
                  color: "#EF4444", fontSize: "12px",
                  textAlign: "center", marginTop: "8px"
                }}>
                  {otpError}
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                style={{
                  width: "100%", padding: "14px",
                  background: loading || otp.length !== 6 
                    ? "#9CA3AF" : "#16A34A",
                  color: "white", border: "none",
                  borderRadius: "10px", fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading ? "wait" : "pointer",
                  marginTop: "20px",
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p style={{
                fontSize: "13px", color: "#6B7280",
                textAlign: "center", marginTop: "16px"
              }}>
                {countdown > 0 ? (
                  `Resend OTP in 00:${String(countdown).padStart(2,"0")}`
                ) : (
                  <button
                    onClick={handleSendOtp}
                    style={{
                      color: "#16A34A", background: "none",
                      border: "none", cursor: "pointer",
                      fontSize: "13px", textDecoration: "underline",
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          )}

          {/* === SCREEN 3: NAME (new users only) === */}
          {screen === "name" && (
            <div>
              <h2 style={{
                fontSize: "20px", fontWeight: 600,
                textAlign: "center", marginBottom: "6px", color: "#111827"
              }}>
                Welcome! 🎉
              </h2>
              <p style={{
                fontSize: "14px", color: "#6B7280",
                textAlign: "center", marginBottom: "24px"
              }}>
                What should we call you?
              </p>

              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
                style={{
                  width: "100%", padding: "14px",
                  border: "1.5px solid #D1D5DB",
                  borderRadius: "10px", fontSize: "16px",
                  outline: "none", marginBottom: "8px",
                }}
                autoFocus
              />

              {error && (
                <p style={{ color: "#EF4444", fontSize: "12px" }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSaveName}
                disabled={loading || !name.trim()}
                style={{
                  width: "100%", padding: "14px",
                  background: loading || !name.trim() 
                    ? "#9CA3AF" : "#16A34A",
                  color: "white", border: "none",
                  borderRadius: "10px", fontSize: "16px",
                  fontWeight: 600, cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                {loading ? "Saving..." : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
