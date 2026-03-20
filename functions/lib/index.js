"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPrescriptionAlert = exports.newLabBookingAlert = exports.newOrderAlert = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
admin.initializeApp();
const twilioSid = (_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.sid;
const twilioToken = (_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.token;
const fromNumber = ((_c = functions.config().twilio) === null || _c === void 0 ? void 0 : _c.from) || "whatsapp:+14155238886";
const toNumber = ((_d = functions.config().twilio) === null || _d === void 0 ? void 0 : _d.to) || "whatsapp:+919897397532";
const client = twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;
async function sendWhatsApp(message) {
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
    }
    catch (error) {
        console.error("Failed to send WhatsApp alert:", error);
    }
}
exports.newOrderAlert = functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snapshot, context) => {
    const order = snapshot.data();
    const items = order.items
        .map((i) => `${i.qty}x ${i.name}`)
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
exports.newLabBookingAlert = functions.firestore
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
exports.newPrescriptionAlert = functions.firestore
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
//# sourceMappingURL=index.js.map