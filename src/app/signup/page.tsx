"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [screen, setScreen] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [area, setArea] = useState("");
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { setUser } = useAuth();
  const router = useRouter();
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const areas = [
    "Arjun Nagar", "Tajganj", "Kamla Nagar", "Sikandra", 
    "Shahaganj", "Khandari", "Sadar Bazaar", "Sanjay Place", 
    "Bodla", "Other Agra area"
  ];

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
    setError("");
    if (!name.trim()) {
      setError("Full name is required");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!area) {
      setError("Please select a delivery area");
      return;
    }
    
    setLoading(true);
    const fullPhone = "+91" + digits;

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
      options: { channel: "whatsapp" },
    });

    if (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } else {
      setScreen("otp");
      startCountdown(60);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.length === 6 ? otp : otp.replace(/\D/g, '');
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

    // Check if user exists, if not create with all details
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone", fullPhone)
      .single();

    if (!existingUser) {
      await supabase.from("users").insert({
        phone: fullPhone,
        name: name.trim(),
        email: email.trim() || null,
        dob: dob || null,
        gender: gender || null,
        delivery_area: area,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        order_count: 0,
      });
    } else {
      // If user exists, update their profile with any new info provided
      await supabase.from("users").update({
        name: name.trim(),
        email: email.trim() || null,
        dob: dob || null,
        gender: gender || null,
        delivery_area: area,
        last_login: new Date().toISOString(),
      }).eq("phone", fullPhone);
    }
    
    setUser({
      phone: fullPhone,
      name: name.trim(),
      isLoggedIn: true,
    });

    alert("Account created! Welcome to Wellcare, " + name.trim() + "!");

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
      padding: "40px 20px"
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

      {/* THE GLASS SIGNUP PANEL */}
      <div style={{
        maxWidth: "500px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        border: "1px solid rgba(255, 255, 255, 0.20)",
        borderRadius: "28px",
        padding: "40px 48px",
        boxShadow: "0 40px 100px rgba(0,0,0,0.40), 0 20px 40px rgba(11,107,29,0.15), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.10)",
        position: "relative",
        zIndex: 10,
        maxHeight: "90vh",
        overflowY: "auto",
        scrollbarWidth: "none"
      }} className="scrollbar-hide">

        {screen === "form" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <h1 style={{
                fontFamily: "Manrope, sans-serif",
                color: "white",
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "4px",
              }}>
                Create Account
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>
                Join Wellcare Pharmacy · Agra
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "col", gap: "16px", marginBottom: "24px" }} className="flex-col">
              
              {/* FULL NAME */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                  FULL NAME *
                </label>
                <input
                  type="text" placeholder="Enter your full name"
                  value={name} onChange={e => {setName(e.target.value); setError("");}}
                  className="glass-input"
                  style={{ width: "100%", padding: "14px 16px", fontSize: "1rem" }}
                />
              </div>

              {/* MOBILE NUMBER */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                  MOBILE NUMBER *
                </label>
                <div style={{
                  display: "flex", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.18)", borderRadius: "14px", overflow: "hidden",
                  transition: "all 0.2s ease",
                }} className="focus-within:border-[rgba(157,248,152,0.60)] focus-within:shadow-[0_0_0_3px_rgba(157,248,152,0.10)]">
                  <div style={{
                    padding: "0 14px", background: "rgba(157,248,152,0.10)", borderRight: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", color: "#9df898", fontSize: "0.95rem", fontWeight: 600,
                  }}>
                    +91
                  </div>
                  <input
                    type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your number"
                    value={phone} onChange={e => {setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setError("");}}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "1.05rem", padding: "14px 16px", letterSpacing: "0.06em" }}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="glass-input"
                  style={{ width: "100%", padding: "14px 16px", fontSize: "1rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* DOB */}
                <div>
                  <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                    DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    value={dob} onChange={e => setDob(e.target.value)}
                    className="glass-input"
                    style={{ width: "100%", padding: "13px 16px", fontSize: "1rem", colorScheme: "dark" }}
                  />
                </div>

                {/* GENDER */}
                <div>
                  <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                    GENDER
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["Male", "Female", "Other"].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        style={{
                          flex: 1, padding: "10px 0", fontSize: "0.85rem", fontWeight: 600, borderRadius: "10px",
                          background: gender === g ? "rgba(157,248,152,0.20)" : "rgba(255,255,255,0.06)",
                          border: gender === g ? "1px solid rgba(157,248,152,0.60)" : "1px solid rgba(255,255,255,0.15)",
                          color: gender === g ? "#9df898" : "rgba(255,255,255,0.7)",
                          cursor: "pointer", transition: "all 0.2s"
                        }}
                      >
                        {g === "Female" ? "F" : g === "Male" ? "M" : "O"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DELIVERY AREA */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                  DELIVERY AREA IN AGRA *
                </label>
                <select
                  value={area} onChange={e => {setArea(e.target.value); setError("");}}
                  className="glass-input"
                  style={{ width: "100%", padding: "14px 16px", fontSize: "1rem", appearance: "none" }}
                >
                  <option value="" disabled style={{ color: "black" }}>Select your area...</option>
                  {areas.map(a => (
                    <option key={a} value={a} style={{ color: "black" }}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(186,26,26,0.20)", border: "1px solid rgba(186,26,26,0.40)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#ffb4ab", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{fontSize:"16px"}}>error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length !== 10 || !name.trim() || !area}
              className="glass-btn-primary"
              style={{
                width: "100%", padding: "17px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : (
                "Create My Account →"
              )}
            </button>

            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.40)", fontSize: "0.85rem", marginTop: "24px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#9df898", fontWeight: 600, textDecoration: "none" }}>
                Sign in →
              </Link>
            </p>
          </>
        )}

        {screen === "otp" && (
          <>
            {/* Same styling as Login OTP screen */}
            <h1 style={{ color:"white", fontFamily:"Manrope", fontSize:"1.8rem", fontWeight:800, textAlign:"center", marginBottom:"8px" }}>
              Check WhatsApp
            </h1>
            <p style={{ color:"rgba(255,255,255,0.55)", textAlign:"center", marginBottom:"8px", fontSize:"0.95rem" }}>
              We sent a 6-digit code to
            </p>
            <p style={{ color:"#9df898", textAlign:"center", fontWeight:600, marginBottom:"36px", fontSize:"1.05rem" }}>
              +91 {phone}
              <button onClick={() => setScreen("form")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.40)", cursor:"pointer", fontSize:"0.8rem", marginLeft:"12px", textDecoration:"underline" }}>
                Change
              </button>
            </p>

            <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginBottom:"24px" }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} ref={el=> {refs.current[i]=el;}}
                  type="tel" inputMode="numeric" maxLength={1}
                  value={otp[i]||""}
                  onChange={e=>handleOtpChange(i,e.target.value)}
                  onKeyDown={e=>handleOtpKey(i,e)}
                  onPaste={handleOtpPaste}
                  style={{
                    width:"52px", height:"60px", textAlign:"center", fontSize:"1.4rem", fontWeight: 700,
                    background: otp[i] ? "rgba(157,248,152,0.15)" : "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)",
                    border: otpError ? "2px solid rgba(186,26,26,0.70)" : otp[i] ? "2px solid rgba(157,248,152,0.60)" : "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "14px", color: "white", outline: "none", transition: "all 0.2s ease",
                  }}
                  onFocus={e => { e.target.style.border = "2px solid rgba(157,248,152,0.80)"; e.target.style.boxShadow = "0 0 0 3px rgba(157,248,152,0.10)"; }}
                  onBlur={e => { e.target.style.border = otp[i] ? "2px solid rgba(157,248,152,0.60)" : "1px solid rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ color:"#ffb4ab", textAlign:"center", fontSize:"0.85rem", marginBottom:"12px" }}>
                {otpError}
              </p>
            )}

            <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}
              className="glass-btn-primary"
              style={{ width:"100%", padding:"17px", fontSize:"1rem", marginBottom:"20px",
                background: otp.length===6 && !loading ? "linear-gradient(135deg, #9df898 0%, #2e8534 100%)" : "rgba(255,255,255,0.10)",
                color: otp.length===6 ? "#003008" : "rgba(255,255,255,0.35)",
              }}>
              {loading ? "Verifying..." : "Verify & Complete Profile"}
            </button>

            <p style={{ textAlign:"center", fontSize:"0.85rem", color:"rgba(255,255,255,0.40)" }}>
              {countdown > 0
                ? `Resend code in ${String(countdown).padStart(2,"0")}s`
                : (
                  <button onClick={handleSendOtp} style={{ background:"none", border:"none", color:"#9df898", cursor:"pointer", fontWeight:600 }}>
                    Resend OTP
                  </button>
                )
              }
            </p>
          </>
        )}

      </div>
    </div>
  );
}
