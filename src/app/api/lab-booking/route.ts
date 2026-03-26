import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Generate booking ID
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 900) + 100;
    const bookingId = `LB-${dateStr}-${random}`;

    const { error } = await supabaseAdmin
      .from("lab_bookings")
      .insert({
        booking_id:       bookingId,
        test_name:        body.testName,
        price:            body.price,
        customer_name:    body.customerName,
        phone:            body.phone,
        email:            body.email || null,
        age:              body.age || null,
        gender:           body.gender || null,
        address:          body.address,
        landmark:         body.landmark || null,
        preferred_date:   body.preferredDate,
        preferred_time:   body.preferredTime,
        fasting_required: body.fastingRequired || false,
        notes:            body.notes || null,
        status:           "pending"
      });

    if (error) {
      console.error("Lab booking error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify pharmacy owner via WhatsApp (fire and forget)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    fetch(`${siteUrl}/api/send-whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+919897397532",
        message: `🧪 LAB BOOKING — Wellcare\n` +
          `ID: ${bookingId}\nTest: ${body.testName} (₹${body.price})\n` +
          `Patient: ${body.customerName}\nPhone: ${body.phone}\n` +
          `Date: ${body.preferredDate} ${body.preferredTime}\n` +
          `Address: ${body.address}`,
      }),
    }).catch(err => console.error("WhatsApp notification failed:", err));

    return NextResponse.json({ success: true, bookingId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
