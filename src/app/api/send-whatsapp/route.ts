import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, to } = await req.json();

    const TWILIO_SID   = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const FROM_NUMBER  = process.env.TWILIO_WHATSAPP_FROM;

    if (!TWILIO_SID || !TWILIO_TOKEN || !FROM_NUMBER) {
      console.warn("WhatsApp notification (skipped, missing credentials):", message);
      return NextResponse.json({ success: true, method: "logged" });
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${FROM_NUMBER}`,
          To:   `whatsapp:${to}`,
          Body: message,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("Twilio error:", result);
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("WhatsApp API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
