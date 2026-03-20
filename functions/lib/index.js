"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = exports.newPrescriptionAlert = exports.newLabBookingAlert = exports.newOrderAlert = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const twilio = require("twilio");
admin.initializeApp();
const getTwilioClient = () => {
    const accountSid = functions.config().twilio.account_sid;
    const authToken = functions.config().twilio.auth_token;
    const verifySid = functions.config().twilio.verify_sid;
    if (!accountSid || !authToken || !verifySid) {
        console.error("Twilio credentials missing from functions.config()");
        throw new functions.https.HttpsError("internal", "Service configuration error. Please contact support.");
    }
    return { client: twilio(accountSid, authToken), verifySid };
};
const getFromToNumbers = () => {
    const fromNumber = functions.config().twilio.from || "whatsapp:+14155238886";
    const toNumber = functions.config().twilio.to || "whatsapp:+919897397532";
    return { fromNumber, toNumber };
};
async function sendWhatsApp(message) {
    try {
        const { client } = getTwilioClient();
        const { fromNumber, toNumber } = getFromToNumbers();
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
    .onCreate(async (snapshot) => {
    const order = snapshot.data();
    const items = (order.items || [])
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
exports.newPrescriptionAlert = functions.firestore
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
exports.sendOtp = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        throw new functions.https.HttpsError("invalid-argument", "Please enter a valid 10-digit Indian mobile number.");
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
    }
    catch (error) {
        console.error("Twilio sendOtp error:", error.message, error.code);
        const errorMessages = {
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
exports.verifyOtp = functions.https.onCall(async (data, context) => {
    var _a;
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
    }
    catch (error) {
        console.error("Twilio verifyOtp error:", error.message);
        throw new functions.https.HttpsError("internal", "OTP verification failed. Please try again.");
    }
    if (verificationCheck.status !== "approved") {
        throw new functions.https.HttpsError("unauthenticated", "Incorrect OTP. Please check and try again.");
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
        await userRef.update(Object.assign({ lastLogin: admin.firestore.FieldValue.serverTimestamp() }, (name && { name })));
    }
    const customToken = await admin.auth().createCustomToken(phoneNumber.replace("+", ""), { phone: phoneNumber });
    return {
        success: true,
        isNewUser,
        customToken,
        user: {
            phone: phoneNumber,
            name: isNewUser ? (name || "") : (((_a = userSnap.data()) === null || _a === void 0 ? void 0 : _a.name) || ""),
        },
    };
});
//# sourceMappingURL=index.js.map