import * as functions from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as twilio from "twilio";

admin.initializeApp();

// Twilio credentials from environment variables
// Set these using: firebase functions:config:set twilio.sid="AC..." twilio.token="token..." twilio.from="+1..." twilio.to="+91..."
const twilioSid = functions.config().twilio?.sid;
const twilioToken = functions.config().twilio?.token;
const fromNumber = functions.config().twilio?.from || "whatsapp:+14155238886"; // Twilio Sandbox
const toNumber = functions.config().twilio?.to || "whatsapp:+919897397532"; // Wellcare Admin

const client = twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;

async function sendWhatsApp(message: string) {
  if (!client) {
    console.warn("Twilio credentials not set. Message not sent:", message);
    return;
  }
  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });
    console.log("WhatsApp alert sent successfully");
  } catch (error) {
    console.error("Failed to send WhatsApp alert:", error);
  }
}

/**
 * Triggered when a new order is placed.
 */
export const newOrderAlert = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snapshot, context) => {
    const order = snapshot.data();
    const items = order.items
      .map((i: any) => `${i.qty}x ${i.name}`)
      .join(", ");

    const message = `🚨 *New Order Received!*
------------------------
*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Amount:* ₹${order.totalAmount}
*Items:* ${items}
*Address:* ${order.address}, Agra
------------------------
Open Admin: wellcare-pharmacy-76524.web.app/admin`;

    await sendWhatsApp(message);
  });

/**
 * Triggered when a new lab booking is made.
 */
export const newLabBookingAlert = functions.firestore
  .document("labBookings/{bookingId}")
  .onCreate(async (snapshot, context) => {
    const booking = snapshot.data();

    const message = `🧪 *New Lab Test Booking!*
------------------------
*Booking ID:* ${booking.bookingId}
*Test:* ${booking.testName}
*Customer:* ${booking.customerName}
*Phone:* ${booking.phone}
*Date/Time:* ${booking.preferredDate} at ${booking.preferredTime}
*Address:* ${booking.address}
------------------------`;

    await sendWhatsApp(message);
  });

/**
 * Triggered when a new prescription is uploaded.
 */
export const newPrescriptionAlert = functions.firestore
  .document("prescriptions/{docId}")
  .onCreate(async (snapshot, context) => {
    const rx = snapshot.data();

    const message = `📄 *New Prescription Uploaded!*
------------------------
*Phone:* ${rx.phone}
*File Name:* ${rx.fileName}
*URL:* ${rx.fileUrl}
------------------------
Please review and call the customer.`;

    await sendWhatsApp(message);
  });

// --- TWILIO VERIFY OTP FUNCTIONS ---

const ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const AUTH_TOKEN  = defineSecret("TWILIO_AUTH_TOKEN");
const VERIFY_SID  = defineSecret("TWILIO_VERIFY_SID");

export const sendOtp = onCall(
  { secrets: [ACCOUNT_SID, AUTH_TOKEN, VERIFY_SID] },
  async (request) => {
    const { phoneNumber } = request.data;

    // Validate Indian phone number
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new HttpsError(
        "invalid-argument",
        "Please enter a valid 10-digit Indian mobile number."
      );
    }

    const verifyClient = twilio(ACCOUNT_SID.value(), AUTH_TOKEN.value());

    try {
      await verifyClient.verify.v2
        .services(VERIFY_SID.value())
        .verifications.create({
          to: phoneNumber,
          channel: "sms",
        });
      return { success: true, message: "OTP sent successfully." };
    } catch (error: any) {
      throw new HttpsError("internal", error.message);
    }
  }
);

export const verifyOtp = onCall(
  { secrets: [ACCOUNT_SID, AUTH_TOKEN, VERIFY_SID] },
  async (request) => {
    const { phoneNumber, code, name } = request.data;
    const verifyClient = twilio(ACCOUNT_SID.value(), AUTH_TOKEN.value());

    // Step 1: Check OTP with Twilio
    let verificationCheck;
    try {
      verificationCheck = await verifyClient.verify.v2
        .services(VERIFY_SID.value())
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });
    } catch (error: any) {
      throw new HttpsError("internal", error.message);
    }

    // Step 2: If OTP wrong or expired
    if (verificationCheck.status !== "approved") {
      throw new HttpsError(
        "unauthenticated",
        "Invalid or expired OTP. Please try again."
      );
    }

    // Step 3: OTP is correct — create or find user in Firestore
    const db = admin.firestore();
    const userRef = db.collection("users").doc(phoneNumber);
    const userSnap = await userRef.get();

    const isNewUser = !userSnap.exists;

    if (isNewUser) {
      // Register new user
      await userRef.set({
        phone: phoneNumber,
        name: name || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        addresses: [],
        orderCount: 0,
      });
    } else {
      // Update last login time
      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Step 4: Create a custom Firebase Auth token
    const customToken = await admin.auth().createCustomToken(phoneNumber, {
      phone: phoneNumber,
    });

    return {
      success: true,
      isNewUser,
      customToken,
      user: {
        phone: phoneNumber,
        name: isNewUser ? (name || "") : userSnap.data()?.name,
      },
    };
  }
);
