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

/**
 * Generates a human-readable order ID: WC-YYYYMMDD-XXX
 * Uses a Firestore counter document for daily auto-increment.
 */
async function generateOrderId(): Promise<string> {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const counterRef = doc(db, "counters", "orders");

  const newCount = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists() || counterDoc.data().date !== dateStr) {
      // New day — reset counter
      transaction.set(counterRef, { date: dateStr, count: 1 });
      return 1;
    }

    const current = counterDoc.data().count || 0;
    transaction.update(counterRef, { count: current + 1 });
    return current + 1;
  });

  return `WC-${dateStr}-${String(newCount).padStart(3, "0")}`;
}

/**
 * Places an order in Firestore.
 * Returns the generated orderId.
 */
export async function placeOrder(
  items: OrderItem[],
  customerInfo: {
    customerName: string;
    phone: string;
    address: string;
    pincode: string;
    paymentMethod: "COD" | "UPI" | "Card";
    prescriptionUrl?: string;
  }
): Promise<string> {
  const orderId = await generateOrderId();
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order: Order = {
    orderId,
    customerName: customerInfo.customerName,
    phone: customerInfo.phone,
    address: customerInfo.address,
    pincode: customerInfo.pincode,
    items,
    totalAmount,
    paymentMethod: customerInfo.paymentMethod,
    prescriptionUrl: customerInfo.prescriptionUrl || "",
    status: "pending",
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "orders"), order);
  return orderId;
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
