"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = exports.newPrescriptionAlert = exports.newLabBookingAlert = exports.newOrderAlert = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
admin.initializeApp();
const twilioSid = (_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.sid;
const twilioToken = (_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.token;
const verifySid = (_c = functions.config().twilio) === null || _c === void 0 ? void 0 : _c.verify_sid;
const fromNumber = ((_d = functions.config().twilio) === null || _d === void 0 ? void 0 : _d.from) || "whatsapp:+14155238886";
const toNumber = ((_e = functions.config().twilio) === null || _e === void 0 ? void 0 : _e.to) || "whatsapp:+919897397532";
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
exports.sendOtp = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        throw new functions.https.HttpsError("invalid-argument", "Please enter a valid 10-digit Indian mobile number.");
    }
    if (!client || !verifySid) {
        throw new functions.https.HttpsError("failed-precondition", "Twilio credentials not configured.");
    }
    try {
        await client.verify.v2
            .services(verifySid)
            .verifications.create({
            to: phoneNumber,
            channel: "sms",
        });
        return { success: true, message: "OTP sent successfully." };
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
});
exports.verifyOtp = functions.https.onCall(async (data, context) => {
    var _a;
    const { phoneNumber, code, name } = data;
    if (!client || !verifySid) {
        throw new functions.https.HttpsError("failed-precondition", "Twilio credentials not configured.");
    }
    let verificationCheck;
    try {
        verificationCheck = await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({
            to: phoneNumber,
            code: code,
        });
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
    if (verificationCheck.status !== "approved") {
        throw new functions.https.HttpsError("unauthenticated", "Invalid or expired OTP. Please try again.");
    }
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
    }
    else {
        await userRef.update({
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    const customToken = await admin.auth().createCustomToken(phoneNumber, {
        phone: phoneNumber,
    });
    return {
        success: true,
        isNewUser,
        customToken,
        user: {
            phone: phoneNumber,
            name: isNewUser ? (name || "") : (_a = userSnap.data()) === null || _a === void 0 ? void 0 : _a.name,
        },
    };
});
//# sourceMappingURL=index.js.map