"use client";
import { useRef } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}

export default function OtpInputBoxes({ value, onChange, hasError }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const newOtp = value.split("").concat(Array(6).fill("")).slice(0, 6);
    newOtp[index] = digit;
    onChange(newOtp.join(""));
    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newOtp = value.split("");
      newOtp[index - 1] = "";
      onChange(newOtp.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === 6) {
      onChange(pasted);
      inputs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: "44px", height: "52px",
            textAlign: "center", fontSize: "22px",
            fontWeight: 600,
            border: `2px solid ${
              hasError ? "#EF4444" : 
              value[i] ? "#16A34A" : "#D1D5DB"
            }`,
            borderRadius: "10px", outline: "none",
            color: "#111827",
            transition: "border-color 0.15s",
          }}
          onFocus={e => {
            e.target.style.borderColor = hasError ? "#EF4444" : "#16A34A";
          }}
          onBlur={e => {
            e.target.style.borderColor = 
              hasError ? "#EF4444" : value[i] ? "#16A34A" : "#D1D5DB";
          }}
        />
      ))}
    </div>
  );
}
