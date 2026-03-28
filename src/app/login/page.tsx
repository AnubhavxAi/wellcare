"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
  const refs = useRef<(HTMLInputElement | null)[]>([]);

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

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
      options: { channel: "whatsapp" },
    });

    if (error) {
      const map: Record<string, string> = {
        "422": "Phone number format invalid. Must be +91XXXXXXXXXX",
        "429": "Too many requests. Wait 60 seconds and try again.",
        "500": "SMS provider error. Check logs.",
        "400": "SMS provider not configured correctly.",
      };
      setError(
        map[String(error.status)] ||
          error.message ||
          "Failed to send OTP. Please try again."
      );
    } else {
      setScreen("otp");
      startCountdown(60);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.length === 6 ? otp : otp.replace(/\D/g, ''); // Ensure safe handling if coming from array
    if (otpString.length !== 6) {
      setOtpError("Enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setOtpError("");
    const fullPhone = "+91" + phone.replace(/\D/g, "");

    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otpString,
      type: "sms",
    });

    if (error) {
      setOtpError("Incorrect code. Please check and try again.");
      setLoading(false);
      return;
    }

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

      const redirect = localStorage.getItem("wellcare_redirect");
      if (redirect) {
        localStorage.removeItem("wellcare_redirect");
        router.push(redirect);
      } else {
        router.push("/");
      }
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
    
    // Welcome Toast simulation or real depending on implementation
    alert("Welcome to Wellcare, " + name.trim() + "!");
    
    const redirect = localStorage.getItem("wellcare_redirect");
    if (redirect) {
      localStorage.removeItem("wellcare_redirect");
      router.push(redirect);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const a = (typeof otp === 'string' ? otp.split('') : otp || []).concat(Array(6).fill('')).slice(0, 6);
    a[i] = v;
    setOtp(a.join(""));
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
      const a = (typeof otp === 'string' ? otp.split('') : otp || []).concat(Array(6).fill('')).slice(0, 6);
      a[i - 1] = "";
      setOtp(a.join(""));
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "");
    if (p.length === 6) {
      setOtp(p);
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #030d06 0%, #0b3d12 40%, #0b6b1d 70%, #053d0d 100%)",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* BACKGROUND ORBS */}
      <div style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,133,52,0.4) 0%, transparent 70%)",
          top: "-200px", right: "-100px",
          filter: "blur(60px)",
          animation: "floatOrb1 8s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(157,248,152,0.25) 0%, transparent 70%)",
          bottom: "-100px", left: "5%",
          filter: "blur(50px)",
          animation: "floatOrb2 10s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute",
          width: "250px", height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          top: "40%", left: "40%",
          filter: "blur(40px)",
          animation: "floatOrb3 12s ease-in-out infinite",
        }}/>
      </div>

      {/* THE GLASS LOGIN PANEL */}
      <div style={{
        maxWidth: "460px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        border: "1px solid rgba(255, 255, 255, 0.20)",
        borderRadius: "28px",
        padding: "52px 48px",
        boxShadow: "0 40px 100px rgba(0,0,0,0.40), 0 20px 40px rgba(11,107,29,0.15), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.10)",
        position: "relative",
        zIndex: 10
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img src="/logo.png" alt="Wellcare"
            style={{ height: "44px", filter: "brightness(0) invert(1)", display: "inline-block" }}/>
          <p style={{
            color: "rgba(255,255,255,0.50)",
            fontSize: "0.8rem",
            marginTop: "8px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Wellcare Pharmacy · Agra
          </p>
        </div>

        {screen === "phone" && (
          <>
            <h1 style={{
              fontFamily: "Manrope, sans-serif",
              color: "white",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "8px",
              textAlign: "center",
            }}>
              Welcome Back
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              fontSize: "0.95rem",
              marginBottom: "40px",
            }}>
              Sign in to continue to Wellcare
            </p>

            {/* Phone input — glass input style */}
            <label style={{ 
              color: "rgba(255,255,255,0.70)", 
              fontSize: "0.82rem", 
              fontWeight: 500,
              letterSpacing: "0.04em",
              display: "block", 
              marginBottom: "8px" 
            }}>
              MOBILE NUMBER
            </label>
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "8px",
              transition: "all 0.2s ease",
            }} className="focus-within:border-[rgba(157,248,152,0.60)] focus-within:shadow-[0_0_0_3px_rgba(157,248,152,0.10)]">
              <div style={{
                padding: "0 16px",
                background: "rgba(157,248,152,0.10)",
                borderRight: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center",
                color: "#9df898",
                fontSize: "0.95rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                +91
              </div>
              <input
                type="tel" inputMode="numeric" maxLength={10}
                placeholder="Enter your number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                autoFocus
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "1.05rem",
                  padding: "16px 20px",
                  letterSpacing: "0.06em",
                }}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(186,26,26,0.20)",
                border: "1px solid rgba(186,26,26,0.40)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "12px",
                color: "#ffb4ab",
                fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span className="material-symbols-outlined" style={{fontSize:"16px"}}>
                  error
                </span>
                {error}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length !== 10}
              style={{
                width: "100%",
                padding: "17px",
                background: phone.length === 10 && !loading
                  ? "linear-gradient(135deg, #9df898 0%, #2e8534 100%)"
                  : "rgba(255,255,255,0.10)",
                color: phone.length === 10 && !loading ? "#003008" : "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: phone.length === 10 ? "pointer" : "not-allowed",
                marginTop: "8px",
                marginBottom: "24px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                letterSpacing: "0.02em",
                boxShadow: phone.length === 10
                  ? "0 8px 24px rgba(157,248,152,0.25)"
                  : "none",
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{fontSize:"20px"}}>
                    chat
                  </span>
                  Send OTP via WhatsApp
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "16px",
              marginBottom: "24px",
            }}>
              <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.10)" }}/>
              <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "0.8rem" }}>or</span>
              <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.10)" }}/>
            </div>

            {/* Sign up link */}
            <p style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.50)",
              fontSize: "0.88rem",
            }}>
              New to Wellcare?{" "}
              <Link href="/signup" style={{
                color: "#9df898",
                textDecoration: "none",
                fontWeight: 600,
              }}>
                Create account →
              </Link>
            </p>
          </>
        )}

        {screen === "otp" && (
          <>
            <h1 style={{ color:"white", fontFamily:"Manrope", 
              fontSize:"1.8rem", fontWeight:800, textAlign:"center", 
              marginBottom:"8px" }}>
              Check WhatsApp
            </h1>
            <p style={{ color:"rgba(255,255,255,0.55)", textAlign:"center", 
              marginBottom:"8px", fontSize:"0.95rem" }}>
              We sent a 6-digit code to
            </p>
            <p style={{ color:"#9df898", textAlign:"center", 
              fontWeight:600, marginBottom:"36px", fontSize:"1.05rem" }}>
              +91 {phone}
              <button onClick={() => setScreen("phone")} style={{
                background:"none", border:"none", color:"rgba(255,255,255,0.40)",
                cursor:"pointer", fontSize:"0.8rem", marginLeft:"12px",
                textDecoration:"underline",
              }}>
                Change
              </button>
            </p>

            {/* 6 OTP boxes */}
            <div style={{ display:"flex", gap:"10px", 
              justifyContent:"center", marginBottom:"24px" }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} ref={el=> {refs.current[i]=el;}}
                  type="tel" inputMode="numeric" maxLength={1}
                  value={otp[i]||""}
                  onChange={e=>handleOtpChange(i,e.target.value)}
                  onKeyDown={e=>handleOtpKey(i,e)}
                  onPaste={handleOtpPaste}
                  style={{
                    width:"52px", height:"60px",
                    textAlign:"center",
                    fontSize:"1.4rem", fontWeight: 700,
                    background: otp[i] 
                      ? "rgba(157,248,152,0.15)" 
                      : "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                    border: otpError
                      ? "2px solid rgba(186,26,26,0.70)"
                      : otp[i]
                        ? "2px solid rgba(157,248,152,0.60)"
                        : "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    color: "white",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={e => { 
                    e.target.style.border = "2px solid rgba(157,248,152,0.80)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(157,248,152,0.10)";
                  }}
                  onBlur={e => {
                    e.target.style.border = otp[i] 
                      ? "2px solid rgba(157,248,152,0.60)"
                      : "1px solid rgba(255,255,255,0.18)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ color:"#ffb4ab", textAlign:"center", 
                fontSize:"0.85rem", marginBottom:"12px" }}>
                {otpError}
              </p>
            )}

            <button onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              style={{
                width:"100%", padding:"17px",
                background: otp.length===6 && !loading
                  ? "linear-gradient(135deg, #9df898 0%, #2e8534 100%)"
                  : "rgba(255,255,255,0.10)",
                color: otp.length===6 ? "#003008" : "rgba(255,255,255,0.35)",
                border:"none", borderRadius:"14px",
                fontSize:"1rem", fontWeight:700, cursor:"pointer",
                marginBottom:"20px",
                transition: "all 0.3s ease",
                boxShadow: otp.length===6 ? "0 8px 24px rgba(157,248,152,0.25)" : "none",
              }}>
              {loading ? "Verifying..." : "Verify & Continue →"}
            </button>

            <p style={{ textAlign:"center", fontSize:"0.85rem",
              color:"rgba(255,255,255,0.40)" }}>
              {countdown > 0
                ? `Resend code in ${String(countdown).padStart(2,"0")}s`
                : (
                  <button onClick={handleSendOtp} style={{
                    background:"none", border:"none",
                    color:"#9df898", cursor:"pointer", fontWeight:600,
                  }}>
                    Resend OTP
                  </button>
                )
              }
            </p>
          </>
        )}

        {screen === "name" && (
          <>
            <h1 style={{ color:"white", fontFamily:"Manrope",
              fontSize:"2rem", fontWeight:800, textAlign:"center",
              marginBottom:"8px" }}>
              Almost there! 🎉
            </h1>
            <p style={{ color:"rgba(255,255,255,0.55)", textAlign:"center",
              marginBottom:"36px" }}>
              What should we call you?
            </p>
            <input type="text" placeholder="Your full name"
              value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSaveName()}
              autoFocus
              className="glass-input"
              style={{
                width:"100%", padding:"16px 20px",
                fontSize:"1.05rem",
                marginBottom:"20px", boxSizing:"border-box",
              }}
            />
            <button onClick={handleSaveName} disabled={loading||!name.trim()}
              className="glass-btn-primary"
              style={{
                width:"100%", padding:"17px",
                fontSize:"1rem", fontWeight:700, cursor:"pointer",
              }}>
              {loading ? "Saving..." : "Get Started →"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
