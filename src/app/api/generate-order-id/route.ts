import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { date } = await req.json();
    const dateKey = date.replace(/-/g, "");

    // Atomic counter increment
    const { data, error } = await supabaseAdmin
      .rpc("increment_order_counter", { date_key_input: dateKey });

    if (error) {
      console.error("Order ID generation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orderId = `WC-${dateKey}-${String(data).padStart(3, "0")}`;
    return NextResponse.json({ orderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
