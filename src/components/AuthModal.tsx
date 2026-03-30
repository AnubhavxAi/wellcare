"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const startCountdown = (secs: number) => {
    setCountdown(secs);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(iv);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoading(true);
    setError("");
    const fullPhone = "+91" + digits;

    console.log("[OTP] Attempting send to:", fullPhone);

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
      options: { channel: "whatsapp" },
    });

    console.log("[OTP] Response:", { data, error });

    if (error) {
      console.error("[OTP] Error code:", error.status);
      console.error("[OTP] Error message:", error.message);
      const map: Record<string, string> = {
        "422": "Phone number format invalid. Must be +91XXXXXXXXXX",
        "429": "Too many requests. Wait 60 seconds and try again.",
        "500": "SMS provider error. Check Supabase Auth logs.",
        "400": "SMS provider not configured correctly in Supabase.",
      };
      setError(
        map[String(error.status)] ||
          error.message ||
          "Failed to send OTP. Please try again."
      );
    } else {
      console.log("[OTP] Success — WhatsApp OTP dispatched");
      setScreen("otp");
      startCountdown(60);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setOtpError("");
    const fullPhone = "+91" + phone.replace(/\D/g, "");

    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: "sms", // Supabase uses "sms" type even for WhatsApp
    });

    if (error) {
      setOtpError("Incorrect code. Please check and try again.");
      setLoading(false);
      return;
    }

    // Check / create user profile in Supabase users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("name, phone")
      .eq("phone", fullPhone)
      .single();

    if (!existingUser) {
      await supabase.from("users").insert({
        phone: fullPhone,
        name: "",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        order_count: 0,
      });
      setScreen("name");
    } else {
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("phone", fullPhone);
      setUser({
        phone: fullPhone,
        name: existingUser.name,
        isLoggedIn: true,
      });

      // Handle post-login redirect
      const redirect = localStorage.getItem("wellcare_redirect");
      if (redirect) {
        localStorage.removeItem("wellcare_redirect");
        router.push(redirect);
      }
      onSuccess();
    }
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    const fullPhone = "+91" + phone.replace(/\D/g, "");
    await supabase
      .from("users")
      .update({ name: name.trim() })
      .eq("phone", fullPhone);
    setUser({ phone: fullPhone, name: name.trim(), isLoggedIn: true });
    const redirect = localStorage.getItem("wellcare_redirect");
    if (redirect) {
      localStorage.removeItem("wellcare_redirect");
      router.push(redirect);
    }
    onSuccess();
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && screen === "phone") onClose();
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "36px 32px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
        }}
      >
        {screen === "phone" && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            ×
          </button>
        )}

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="/logo.png" alt="Wellcare" style={{ height: "40px" }} />
        </div>

        {screen === "phone" && (
          <>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "6px",
                color: "#111827",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              Welcome to Wellcare
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                textAlign: "center",
                marginBottom: "28px",
              }}
            >
              Login or create your account
            </p>
            <div
              style={{
                display: "flex",
                border: "1.5px solid #E5E7EB",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  padding: "0 14px",
                  background: "#F9FAFB",
                  display: "flex",
                  alignItems: "center",
                  borderRight: "1px solid #E5E7EB",
                  fontSize: "15px",
                  color: "#374151",
                  fontWeight: 500,
                }}
              >
                +91
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                }}
                maxLength={10}
                inputMode="numeric"
                autoFocus
              />
            </div>
            {error && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                {error}
              </p>
            )}
            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length !== 10}
              style={{
                width: "100%",
                padding: "15px",
                background:
                  loading || phone.length !== 10
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #0b6b1d, #2e8534)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <span style={{ fontSize: "18px" }}>💬</span>
                  Send OTP via WhatsApp
                </>
              )}
            </button>
            <p
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              🔒 We&apos;ll send a 6-digit code to your WhatsApp
            </p>

            <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }}></div>
              <span style={{ margin: "0 12px", color: "#9CA3AF", fontSize: "14px" }}>Or</span>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }}></div>
            </div>

            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } })}
              style={{
                width: "100%",
                padding: "15px",
                background: "white",
                color: "#374151",
                border: "1px solid #D1D5DB",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"}
              onMouseLeave={(e) => e.currentTarget.style.background = "white"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

          </>
        )}

        {screen === "otp" && (
          <>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "6px",
                color: "#111827",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              Enter WhatsApp OTP
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                textAlign: "center",
                marginBottom: "28px",
              }}
            >
              Code sent to WhatsApp: +91 {phone}{" "}
              <button
                onClick={() => {
                  setScreen("phone");
                  setOtp("");
                }}
                style={{
                  color: "#0b6b1d",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  textDecoration: "underline",
                }}
              >
                Change
              </button>
            </p>
            <OtpBoxes value={otp} onChange={setOtp} hasError={!!otpError} />
            {otpError && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                {otpError}
              </p>
            )}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              style={{
                width: "100%",
                padding: "15px",
                background:
                  loading || otp.length !== 6
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #0b6b1d, #2e8534)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                textAlign: "center",
                marginTop: "16px",
              }}
            >
              {countdown > 0 ? (
                `Resend in 00:${String(countdown).padStart(2, "0")}`
              ) : (
                <button
                  onClick={handleSendOtp}
                  style={{
                    color: "#0b6b1d",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Resend OTP
                </button>
              )}
            </p>
          </>
        )}

        {screen === "name" && (
          <>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "6px",
                color: "#111827",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              You&apos;re in! 🎉
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              What should we call you?
            </p>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              style={{
                width: "100%",
                padding: "14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
              autoFocus
            />
            {error && (
              <p style={{ color: "#EF4444", fontSize: "12px" }}>{error}</p>
            )}
            <button
              onClick={handleSaveName}
              disabled={loading || !name.trim()}
              style={{
                width: "100%",
                padding: "15px",
                background: !name.trim()
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #0b6b1d, #2e8534)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              {loading ? "Saving..." : "Continue →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
// 6-box OTP input component (inlined)
// ───────────────────────────────────────────
function OtpBoxes({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const a = value.split("").concat(Array(6).fill("")).slice(0, 6);
    a[i] = v;
    onChange(a.join(""));
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
      const a = value.split("");
      a[i - 1] = "";
      onChange(a.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "");
    if (p.length === 6) {
      onChange(p);
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: "46px",
            height: "54px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: 700,
            border: `2px solid ${hasError ? "#EF4444" : value[i] ? "#0b6b1d" : "#D1D5DB"}`,
            borderRadius: "12px",
            outline: "none",
            color: "#111827",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = hasError ? "#EF4444" : "#0b6b1d")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = hasError
              ? "#EF4444"
              : value[i]
                ? "#0b6b1d"
                : "#D1D5DB")
          }
        />
      ))}
    </div>
  );
}
