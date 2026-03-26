import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const getFromToNumbers = () => {
  const fromNumber = functions.config().twilio?.from || "whatsapp:+14155238886"; // Twilio Sandbox
  const toNumber = functions.config().twilio?.to || "whatsapp:+919897397532"; // Wellcare Admin
  return { fromNumber, toNumber };
};

async function sendWhatsApp(message: string) {
  try {
    const accountSid = functions.config().twilio?.account_sid;
    const authToken  = functions.config().twilio?.auth_token;
    if (!accountSid || !authToken) {
      console.warn("Twilio credentials not set. Message not sent.");
      return;
    }
    const twilio = require("twilio");
    const client = twilio(accountSid, authToken);

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


