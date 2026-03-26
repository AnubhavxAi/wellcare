"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartDrawer() {
  const { 
    items, removeFromCart, updateQty, 
    cartTotal, cartCount, isOpen, closeCart 
  } = useCart();
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [pincode, setPincode] = useState("282001");
  const [pincodeMsg, setPincodeMsg] = useState(
    "Eligible for delivery in Agra"
  );

  const deliveryCharge = cartTotal >= 499 ? 0 : 49;
  const finalTotal = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    closeCart();
    if (!user) {
      openLogin(); // Opens auth modal
      // After login, AuthContext redirects to /checkout
      localStorage.setItem("wellcare_redirect", "/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const checkPincode = () => {
    const agraPin = /^282\d{3}$/;
    if (agraPin.test(pincode)) {
      setPincodeMsg("✓ Eligible for delivery in Agra!");
    } else {
      setPincodeMsg("✗ We currently deliver only in Agra (282xxx)");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 998,
        }}
      />

      {/* Drawer — FLEX COLUMN layout */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: "min(420px, 100vw)",
        height: "100vh",
        background: "white",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",  // ← KEY: flex column
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
      }}>

        {/* HEADER — flexShrink:0 so it never shrinks */}
        <div style={{
          flexShrink: 0,
          padding: "20px 24px 16px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{ 
              fontSize: "18px", fontWeight: 700, 
              color: "#111827", margin: 0 
            }}>
              Your Cart
            </h2>
            <p style={{ 
              fontSize: "13px", color: "#6B7280", margin: 0 
            }}>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            style={{
              width: "36px", height: "36px",
              borderRadius: "50%",
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              cursor: "pointer", fontSize: "18px",
              display: "flex", alignItems: "center",
              justifyContent: "center", color: "#6B7280",
            }}
          >
            ×
          </button>
        </div>

        {/* ITEMS — flex:1 + overflow:auto = SCROLLABLE MIDDLE */}
        <div style={{
          flex: 1,            // ← takes all available space
          overflowY: "auto",  // ← scrollable
          padding: "16px 24px",
        }}>
          {items.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "100%", gap: "12px",
            }}>
              <div style={{ fontSize: "48px" }}>🛒</div>
              <p style={{ 
                color: "#6B7280", fontSize: "15px",
                fontWeight: 500 
              }}>
                Your cart is empty
              </p>
              <p style={{ color: "#9CA3AF", fontSize: "13px" }}>
                Add medicines to get started
              </p>
              <button
                onClick={closeCart}
                style={{
                  padding: "10px 24px",
                  background: "#16A34A", color: "white",
                  border: "none", borderRadius: "8px",
                  cursor: "pointer", fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: "flex", gap: "12px",
                  padding: "12px",
                  background: "#F9FAFB",
                  borderRadius: "12px",
                  border: "1px solid #F3F4F6",
                }}>
                  {/* Product color block (category color) */}
                  <div style={{
                    width: "56px", height: "56px",
                    borderRadius: "8px",
                    background: getCategoryColor(item.category),
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                    fontSize: "20px",
                  }}>
                    {getCategoryEmoji(item.category)}
                  </div>

                  {/* Item info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 600,
                      color: "#111827", margin: "0 0 2px",
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {item.name}
                    </p>
                    <p style={{ 
                      fontSize: "11px", color: "#6B7280", margin: "0 0 6px" 
                    }}>
                      {item.brand} · {item.unit}
                    </p>
                    <div style={{ 
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between" 
                    }}>
                      {/* Qty controls */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: "white", borderRadius: "8px",
                        border: "1px solid #E5E7EB", padding: "2px 4px",
                      }}>
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          style={{
                            width: "24px", height: "24px",
                            border: "none", background: "none",
                            cursor: "pointer", fontSize: "16px",
                            color: "#374151", fontWeight: 700,
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span style={{ 
                          fontSize: "14px", fontWeight: 600,
                          color: "#111827", minWidth: "16px",
                          textAlign: "center",
                        }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{
                            width: "24px", height: "24px",
                            border: "none", background: "none",
                            cursor: "pointer", fontSize: "16px",
                            color: "#16A34A", fontWeight: 700,
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>
                      {/* Price */}
                      <div style={{ textAlign: "right" }}>
                        <p style={{ 
                          fontSize: "14px", fontWeight: 700,
                          color: "#111827", margin: 0 
                        }}>
                          ₹{item.price * item.qty}
                        </p>
                        {item.qty > 1 && (
                          <p style={{ 
                            fontSize: "11px", color: "#9CA3AF", margin: 0 
                          }}>
                            ₹{item.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      alignSelf: "flex-start",
                      background: "none", border: "none",
                      color: "#EF4444", cursor: "pointer",
                      fontSize: "16px", padding: "2px",
                    }}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Free delivery progress bar */}
              {cartTotal < 499 && (
                <div style={{
                  padding: "12px",
                  background: "#FFFBEB",
                  borderRadius: "10px",
                  border: "1px solid #FDE68A",
                }}>
                  <p style={{ 
                    fontSize: "12px", color: "#92400E", margin: "0 0 6px" 
                  }}>
                    Add ₹{499 - cartTotal} more for FREE delivery!
                  </p>
                  <div style={{
                    height: "6px", background: "#FEF3C7",
                    borderRadius: "3px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${(cartTotal / 499) * 100}%`,
                      background: "#F59E0B",
                      borderRadius: "3px",
                      transition: "width 0.3s ease",
                    }}/>
                  </div>
                </div>
              )}
              {cartTotal >= 499 && (
                <div style={{
                  padding: "10px 12px",
                  background: "#F0FDF4",
                  borderRadius: "10px",
                  border: "1px solid #BBF7D0",
                  fontSize: "12px", color: "#166534",
                  fontWeight: 500,
                }}>
                  🎉 You've unlocked FREE delivery!
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER — flexShrink:0 always stays at bottom */}
        {items.length > 0 && (
          <div style={{
            flexShrink: 0,
            borderTop: "1px solid #F3F4F6",
            padding: "16px 24px",
            background: "white",
          }}>
            {/* Pincode check */}
            <div style={{ marginBottom: "14px" }}>
              <p style={{ 
                fontSize: "12px", fontWeight: 500,
                color: "#374151", marginBottom: "6px" 
              }}>
                Check Delivery
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  value={pincode}
                  onChange={e => setPincode(
                    e.target.value.replace(/\D/g,"").slice(0,6)
                  )}
                  placeholder="Enter pincode"
                  style={{
                    flex: 1, padding: "8px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px", fontSize: "13px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={checkPincode}
                  style={{
                    padding: "8px 16px",
                    background: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  Check
                </button>
              </div>
              <p style={{ 
                fontSize: "11px", 
                color: pincodeMsg.startsWith("✓") 
                  ? "#16A34A" : "#EF4444",
                marginTop: "4px" 
              }}>
                {pincodeMsg}
              </p>
            </div>

            {/* Bill summary */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "13px", color: "#6B7280",
                marginBottom: "4px",
              }}>
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "13px", color: "#6B7280",
                marginBottom: "8px",
              }}>
                <span>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? "#16A34A" : "#374151" }}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "16px", fontWeight: 700, color: "#111827",
                paddingTop: "8px",
                borderTop: "1px solid #F3F4F6",
              }}>
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              style={{
                width: "100%", padding: "16px",
                background: "#16A34A", color: "white",
                border: "none", borderRadius: "12px",
                fontSize: "16px", fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}
            >
              Proceed to Checkout →
            </button>

            {/* WhatsApp order option */}
            <button
              onClick={() => {
                const msg = items.map(i => 
                  `${i.name} x${i.qty} = ₹${i.price * i.qty}`
                ).join("\n");
                const text = encodeURIComponent(
                  `Hello Wellcare Pharmacy!\n\nI'd like to order:\n${msg}\n\nTotal: ₹${finalTotal}\n\nPlease confirm availability.`
                );
                window.open(`https://wa.me/919897397532?text=${text}`,"_blank");
              }}
              style={{
                width: "100%", padding: "12px",
                background: "white",
                border: "1.5px solid #22C55E",
                borderRadius: "12px",
                fontSize: "14px", fontWeight: 600,
                cursor: "pointer", color: "#16A34A",
                marginTop: "8px",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}
            >
              📱 Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Helper functions
function getCategoryColor(category: string | undefined): string {
  if (!category) return "#F3F4F6";
  const colors: Record<string, string> = {
    medicines: "#DCFCE7",
    vitamins: "#FEF9C3",
    supplement: "#FEF9C3",
    vitaminsandsupplements: "#FEF9C3",
    devices: "#DBEAFE",
    medicaldevices: "#DBEAFE",
    personalcare: "#FCE7F3",
    babycare: "#D1FAE5",
    nutrition: "#FEF3C7",
    painrelief: "#FFE4E6",
    firstaid: "#FEE2E2",
    oralcare: "#CCFBF1",
    skincare: "#F3E8FF",
    mankindproducts: "#E0F2FE",
    default: "#F3F4F6",
  };
  const key = category.toLowerCase().replace(/ & /g, '').replace(/ /g, '').replace(/s$/g, '');
  return colors[key] || colors.default;
}

function getCategoryEmoji(category: string | undefined): string {
  if (!category) return "📦";
  const emojis: Record<string, string> = {
    medicines: "💊",
    vitamins: "🥦",
    supplement: "🥦",
    vitaminsandsupplements: "🥦",
    devices: "🌡️",
    medicaldevices: "🌡️",
    personalcare: "🧴",
    babycare: "👶",
    nutrition: "🥛",
    painrelief: "🔥",
    firstaid: "🩹",
    oralcare: "🦷",
    skincare: "✨",
    mankindproducts: "👨‍⚕️",
    default: "📦",
  };
  const key = category.toLowerCase().replace(/ & /g, '').replace(/ /g, '').replace(/s$/g, '');
  return emojis[key] || emojis.default;
}
