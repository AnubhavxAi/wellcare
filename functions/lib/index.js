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
exports.newPrescriptionAlert = exports.newLabBookingAlert = exports.newOrderAlert = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const getFromToNumbers = () => {
    var _a, _b;
    const fromNumber = ((_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.from) || "whatsapp:+14155238886";
    const toNumber = ((_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.to) || "whatsapp:+919897397532";
    return { fromNumber, toNumber };
};
async function sendWhatsApp(message) {
    var _a, _b;
    try {
        const accountSid = (_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.account_sid;
        const authToken = (_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.auth_token;
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
//# sourceMappingURL=index.js.map