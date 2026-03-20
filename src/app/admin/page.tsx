"use client";

import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrderDoc {
  docId: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: Timestamp | null;
}

type StatusFilter = "all" | "pending" | "confirmed" | "dispatched" | "delivered";

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "wellcare_admin_2026";
    if (password === adminPass) {
      setIsAuthed(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid password");
    }
  };

  // Live orders listener
  useEffect(() => {
    if (!isAuthed) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map((d) => ({
          docId: d.id,
          ...(d.data() as Omit<OrderDoc, "docId">),
        }));
        setOrders(orderList);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAuthed]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const todayStart = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Timestamp.fromDate(now);
  }, []);

  const todayOrders = useMemo(
    () => orders.filter((o) => o.createdAt && o.createdAt >= todayStart),
    [orders, todayStart]
  );

  const todayRevenue = useMemo(
    () => todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [todayOrders]
  );

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", docId), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    }
  };

  const formatTime = (ts: Timestamp | null) => {
    if (!ts) return "—";
    const d = ts.toDate();
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Password Gate
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Wellcare Pharmacy</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mb-3">{passwordError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wellcare Admin</h1>
            <p className="text-sm text-gray-500">Order Management Dashboard</p>
          </div>
          <button
            onClick={() => setIsAuthed(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Today&apos;s Orders</p>
            <p className="text-2xl font-bold text-blue-600">{todayOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{todayRevenue}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {(["all", "pending", "confirmed", "dispatched", "delivered"] as StatusFilter[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({orders.filter((o) => o.status === status).length})
                  </span>
                )}
              </button>
            )
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Items</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.docId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 text-xs">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                        <div className="truncate" title={order.items?.map((i) => `${i.qty}x ${i.name}`).join(", ")}>
                          {order.items?.map((i) => `${i.qty}x ${i.name}`).join(", ") || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.docId, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "dispatched"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
