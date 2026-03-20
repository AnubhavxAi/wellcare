import {
  collection,
  addDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  serverTimestamp,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "COD" | "UPI" | "Card";
  prescriptionUrl?: string;
  status: "pending" | "confirmed" | "dispatched" | "delivered";
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

export async function placeOrder(cart: any[], customerInfo: any, user: any) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  const counterRef = doc(db, "orderCounters", dateStr);
  
  // Need to import getDoc, setDoc, increment if not imported at top
  const { getDoc, setDoc, increment } = require("firebase/firestore");
  
  const counterSnap = await getDoc(counterRef);
  const currentCount = counterSnap.exists() ? counterSnap.data().count + 1 : 1;
  await setDoc(counterRef, { count: currentCount }, { merge: true });

  const orderId = `WC-${dateStr}-${String(currentCount).padStart(3, "0")}`;

  const orderData = {
    orderId,
    customerName: customerInfo.name,
    phone: customerInfo.phone,
    email: customerInfo.email || "",
    address: `${customerInfo.address1}, ${customerInfo.address2 || ""}, ${customerInfo.area}, Agra - ${customerInfo.pincode}`.trim(),
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      qty: item.qty || item.quantity, // Support both depending on CartContext
      price: item.price,
      imageUrl: item.imageUrl || "",
    })),
    subtotal: cart.reduce((s: number, i: any) => s + i.price * (i.qty || i.quantity), 0),
    deliveryCharge: cart.reduce((s: number, i: any) => s + i.price * (i.qty || i.quantity), 0) >= 499 ? 0 : 49,
    totalAmount: cart.reduce((s: number, i: any) => s + i.price * (i.qty || i.quantity), 0) >= 499
      ? cart.reduce((s: number, i: any) => s + i.price * (i.qty || i.quantity), 0)
      : cart.reduce((s: number, i: any) => s + i.price * (i.qty || i.quantity), 0) + 49,
    paymentMethod: customerInfo.paymentMethod,
    status: "pending",
    userId: user?.phone || "guest",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);

  if (user?.phone) {
    const userRef = doc(db, "users", user.phone);
    await updateDoc(userRef, { orderCount: increment(1) });
  }

  // Clear the cart from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("wellcare_cart");
  }

  return { orderId, docId: docRef.id };
}

/**
 * Fetches all orders for a customer's phone number.
 */
export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("phone", "==", phone),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Order);
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatus(
  docId: string,
  status: Order["status"]
): Promise<void> {
  await updateDoc(doc(db, "orders", docId), { status });
}

/**
 * Generates a lab booking reference: LB-YYYYMMDD-XXX
 */
export async function generateLabBookingId(): Promise<string> {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const counterRef = doc(db, "counters", "labBookings");

  const newCount = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists() || counterDoc.data().date !== dateStr) {
      transaction.set(counterRef, { date: dateStr, count: 1 });
      return 1;
    }

    const current = counterDoc.data().count || 0;
    transaction.update(counterRef, { count: current + 1 });
    return current + 1;
  });

  return `LB-${dateStr}-${String(newCount).padStart(3, "0")}`;
}

/**
 * Places a lab test booking in Firestore.
 */
export async function placeLabBooking(booking: {
  testName: string;
  testPrice: number;
  customerName: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
}): Promise<string> {
  const bookingId = await generateLabBookingId();

  await addDoc(collection(db, "labBookings"), {
    ...booking,
    bookingId,
    status: "pending",
    bookedAt: serverTimestamp(),
  });

  return bookingId;
}
