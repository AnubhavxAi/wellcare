import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types/database";

export function useOrders(phone: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("phone", phone)
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }

    fetchOrders();

    // Real-time subscription for order status updates
    const channel = supabase
      .channel("orders_" + phone)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `phone=eq.${phone}`,
        },
        (payload) => {
          setOrders(prev =>
            prev.map(o =>
              o.id === payload.new.id
                ? { ...o, ...payload.new } as Order
                : o
            )
          );
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [phone]);

  return { orders, loading };
}
