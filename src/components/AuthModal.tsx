"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import OtpInputBoxes from "./OtpInputBoxes";

interface AuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [screen, setScreen] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { setUser } = useAuth();

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // SEND OTP with Supabase
  const handleSendOtp = async () => {
    const trimmedPhone = phone.trim();
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");
    const fullPhone = "+91" + trimmedPhone;

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    if (error) {
      setError(error.message);
    } else {
      setScreen("otp");
      startCountdown(30);
    }
    setLoading(false);
  };

  // VERIFY OTP with Supabase
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setOtpError("");
    const fullPhone = "+91" + phone.trim();

    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setOtpError("Incorrect OTP. Please try again.");
      setLoading(false);
      return;
    }

    // Check if new user
    const { data: existingUser } = await supabase
      .from("users")
      .select("name")
      .eq("phone", fullPhone)
      .maybeSingle();

    if (!existingUser) {
      // New user — create profile
      await supabase.from("users").insert({
        phone: fullPhone,
        name: "",
      });
      setScreen("name");
    } else {
      // Returning user
      setUser({
        phone: fullPhone,
        name: existingUser.name || "",
        isLoggedIn: true,
      });
      onSuccess();
    }
    setLoading(false);
  };

  // SAVE NAME for new users
  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    const fullPhone = "+91" + phone.trim();

    try {
      const { error } = await supabase
        .from("users")
        .update({ name: name.trim() })
        .eq("phone", fullPhone);

      if (error) throw error;

      setUser({
        phone: fullPhone,
        name: name.trim(),
        isLoggedIn: true,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src="/logo.png" alt="Wellcare" style={{ height: "36px" }} />
        </div>

        {screen === "phone" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>Welcome to Wellcare</h2>
            <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center", marginBottom: "24px" }}>Login or create your account</p>
            <div style={{ display: "flex", border: "1.5px solid #D1D5DB", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ padding: "0 14px", background: "#F9FAFB", display: "flex", alignItems: "center", borderRight: "1px solid #D1D5DB", fontSize: "15px", color: "#374151" }}>+91</div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                style={{ flex: 1, padding: "14px", border: "none", outline: "none", fontSize: "16px" }}
                maxLength={10}
              />
            </div>
            {error && <p style={{ color: "#EF4444", fontSize: "12px", marginBottom: "8px" }}>{error}</p>}
            <button onClick={handleSendOtp} disabled={loading || phone.length !== 10} style={{ width: "100%", padding: "14px", background: loading || phone.length !== 10 ? "#9CA3AF" : "#16A34A", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "8px" }}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {screen === "otp" && (
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, textAlign: "center", marginBottom: "4px" }}>Enter OTP</h2>
            <p style={{ fontSize: "13px", color: "#6B7280", textAlign: "center", marginBottom: "24px" }}>
              Sent to +91 {phone} <button onClick={() => setScreen("phone")} style={{ color: "#16A34A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Change</button>
            </p>
            <OtpInputBoxes value={otp} onChange={setOtp} hasError={!!otpError} />
            {otpError && <p style={{ color: "#EF4444", fontSize: "12px", textAlign: "center", marginTop: "8px" }}>{otpError}</p>}
            <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} style={{ width: "100%", padding: "14px", background: loading || otp.length !== 6 ? "#9CA3AF" : "#16A34A", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "20px" }}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p style={{ fontSize: "13px", color: "#6B7280", textAlign: "center", marginTop: "16px" }}>
              {countdown > 0 ? `Resend OTP in 00:${String(countdown).padStart(2,"0")}` : <button onClick={handleSendOtp} style={{ color: "#16A34A", background: "none", border: "none", cursor: "pointer" }}>Resend OTP</button>}
            </p>
          </div>
        )}

        {screen === "name" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>Welcome! 🎉</h2>
            <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center", marginBottom: "24px" }}>What should we call you?</p>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSaveName()}
              style={{ width: "100%", padding: "14px", border: "1.5px solid #D1D5DB", borderRadius: "10px", fontSize: "16px", outline: "none", marginBottom: "8px" }}
              autoFocus
            />
            {error && <p style={{ color: "#EF4444", fontSize: "12px" }}>{error}</p>}
            <button onClick={handleSaveName} disabled={loading || !name.trim()} style={{ width: "100%", padding: "14px", background: loading || !name.trim() ? "#9CA3AF" : "#16A34A", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "8px" }}>
              {loading ? "Saving..." : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
