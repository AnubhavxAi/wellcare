import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { error } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        phone:     body.phone,
        user_id:   body.userId || null,
        file_url:  body.fileUrl,
        file_name: body.fileName,
        file_size: body.fileSize,
        status:    "pending_review"
      });

    if (error) {
      console.error("Prescription recording error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify pharmacy owner
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    fetch(`${siteUrl}/api/send-whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+919897397532",
        message: `💊 PRESCRIPTION UPLOADED\nPhone: ${body.phone}\nFile: ${body.fileUrl}\nCall customer to confirm order.`,
      }),
    }).catch(err => console.error("WhatsApp notification failed:", err));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
