import * as functions from "firebase-functions";
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
