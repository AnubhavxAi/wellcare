import { supabase } from "./supabase";
import { CartItem } from "@/context/CartContext";

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address1: string;
  address2?: string;
  area: string;
  pincode: string;
  paymentMethod: "COD" | "UPI" | "Card";
}

export async function placeOrder(
  cart: CartItem[],
  customerInfo: CustomerInfo
): Promise<{ orderId: string }> {
  // Generate order ID via API route (uses service role)
  const res = await fetch("/api/generate-order-id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: new Date().toISOString().slice(0, 10) }),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate order ID");
  }
  
  const { orderId } = await res.json();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;

  const { error } = await supabase.from("orders").insert({
    order_id:       orderId,
    customer_name:  customerInfo.name,
    phone:          customerInfo.phone,
    email:          customerInfo.email || null,
    address:        `${customerInfo.address1}${customerInfo.address2 ? ", " + customerInfo.address2 : ""}, ${customerInfo.area}, Agra - ${customerInfo.pincode}`,
    pincode:        customerInfo.pincode,
    items:          cart.map(i => ({
      id:    i.id,
      name:  i.name,
      brand: i.brand,
      qty:   i.qty,
      price: i.price,
    })),
    subtotal,
    delivery_charge: deliveryCharge,
    total_amount:    subtotal + deliveryCharge,
    payment_method:  customerInfo.paymentMethod,
    status:         "pending",
  });

  if (error) {
    console.error("Order insertion error:", error);
    throw new Error(error.message);
  }

  // Update user order count via RPC
  const { error: rpcError } = await supabase.rpc("increment_order_count", {
    user_phone: customerInfo.phone,
  });
  if (rpcError) console.error("Failed to increment order count:", rpcError);

  // Clear the cart from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("wellcare_cart_v2");
  }

  return { orderId };
}
