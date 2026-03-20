import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import twilio = require("twilio");

admin.initializeApp();

// Twilio settings (shared)
const getTwilioClient = () => {
  const accountSid = functions.config().twilio.account_sid;
  const authToken  = functions.config().twilio.auth_token;
  const verifySid  = functions.config().twilio.verify_sid;

  if (!accountSid || !authToken || !verifySid) {
    console.error("Twilio credentials missing from functions.config()");
    throw new functions.https.HttpsError(
      "internal",
      "Service configuration error. Please contact support."
    );
  }
  return { client: twilio(accountSid, authToken), verifySid };
};

const getFromToNumbers = () => {
  const fromNumber = functions.config().twilio.from || "whatsapp:+14155238886"; // Twilio Sandbox
  const toNumber = functions.config().twilio.to || "whatsapp:+919897397532"; // Wellcare Admin
  return { fromNumber, toNumber };
};

async function sendWhatsApp(message: string) {
  try {
    const { client } = getTwilioClient();
    const { fromNumber, toNumber } = getFromToNumbers();
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
  .onCreate(async (snapshot) => {
    const order = snapshot.data();
    const items = (order.items || [])
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
  .onCreate(async (snapshot) => {
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
  .onCreate(async (snapshot) => {
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

export const sendOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data;

  // Validate Indian phone number format
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneNumber)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Please enter a valid 10-digit Indian mobile number."
    );
  }

  const { client, verifySid } = getTwilioClient();

  try {
    await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log(`OTP sent successfully to ${phoneNumber}`);
    return { success: true };

  } catch (error: any) {
    console.error("Twilio sendOtp error:", error.message, error.code);

    // Map Twilio error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      "20003": "Authentication failed. Please contact support.",
      "20404": "Service not found. Please contact support.",
      "21211": "Invalid phone number format.",
      "60200": "Invalid phone number.",
      "60203": "Max OTP attempts reached. Try again in 10 minutes.",
      "60212": "Too many requests. Please wait a few minutes.",
    };

    const userMessage = errorMessages[String(error.code)] 
      || "Failed to send OTP. Please try again.";

    throw new functions.https.HttpsError("internal", userMessage);
  }
});

export const verifyOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber, code, name } = data;

  const { client, verifySid } = getTwilioClient();

  let verificationCheck;
  try {
    verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });
  } catch (error: any) {
    console.error("Twilio verifyOtp error:", error.message);
    throw new functions.https.HttpsError(
      "internal",
      "OTP verification failed. Please try again."
    );
  }

  if (verificationCheck.status !== "approved") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Incorrect OTP. Please check and try again."
    );
  }

  // OTP correct — create or update user in Firestore
  const db = admin.firestore();
  const userRef = db.collection("users").doc(phoneNumber);
  const userSnap = await userRef.get();
  const isNewUser = !userSnap.exists;

  if (isNewUser) {
    await userRef.set({
      phone: phoneNumber,
      name: name || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      addresses: [],
      orderCount: 0,
    });
  } else {
    await userRef.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      ...(name && { name }),
    });
  }

  // Create custom Firebase auth token
  const customToken = await admin.auth().createCustomToken(
    phoneNumber.replace("+", ""), 
    { phone: phoneNumber }
  );

  return {
    success: true,
    isNewUser,
    customToken,
    user: {
      phone: phoneNumber,
      name: isNewUser ? (name || "") : (userSnap.data()?.name || ""),
    },
  };
});


