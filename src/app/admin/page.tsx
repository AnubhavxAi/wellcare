"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types/database";

type StatusFilter = "all" | "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
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

  useEffect(() => {
    if (!isAuthed) return;

    // 1. Initial load
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();

    // 2. Real-time subscription
    const channel = supabase
      .channel("admin_orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders(prev => [payload.new as Order, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } as Order : o));
          } else if (payload.eventType === "DELETE") {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthed]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: orders.length,
      today: orders.filter(o => new Date(o.created_at).toDateString() === today).length,
      revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total_amount || 0), 0),
      pending: orders.filter(o => o.status === "pending").length
    };
  }, [orders]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none mb-3"
          />
          {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
          <button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold text-gray-900">Wellcare Admin</h1><p className="text-sm text-gray-500">Order Management</p></div>
          <button onClick={() => setIsAuthed(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-sm text-gray-500">Today&apos;s Orders</p><p className="text-2xl font-bold text-blue-600">{stats.today}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-sm text-gray-500">Today&apos;s Revenue</p><p className="text-2xl font-bold text-green-600">₹{stats.revenue}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></div>
        </div>

        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {["all", "pending", "confirmed", "dispatched", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as StatusFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${statusFilter === status ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

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
                    <th className="text-left px-4 py-3">Order ID</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Items</th>
                    <th className="text-left px-4 py-3">Total</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 text-xs">{order.order_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{order.customer_name}</td>
                      <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={order.items?.map(i => `${i.qty}x ${i.name}`).join(", ")}>
                        {order.items?.map(i => `${i.qty}x ${i.name}`).join(", ")}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">₹{order.total_amount}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                            order.status === "pending" ? "bg-amber-100 text-amber-700" :
                            order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            order.status === "dispatched" ? "bg-purple-100 text-purple-700" :
                            order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(order.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
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
