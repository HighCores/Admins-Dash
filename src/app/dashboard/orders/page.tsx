"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePlatform } from "@/context/PlatformContext";
import { Eye, Clock, CheckCircle } from "lucide-react";
import { TranscriptModal } from "@/components/TranscriptModal";

export default function OrdersPage() {
  const { platform } = usePlatform();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [platform]);

  async function fetchOrders() {
    setLoading(true);
    const table = platform === "discord" ? "dc_orders" : "tg_orders";
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (data) {
      setOrders(data);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sunset-900 capitalize">{platform} Orders</h1>
        <button onClick={fetchOrders} className="px-4 py-2 bg-sunset-100 text-sunset-700 rounded-xl font-medium hover:bg-sunset-200 transition">
          Refresh List
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl">
        {loading ? (
          <p className="text-center text-sunset-500 py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-sunset-500 py-10">No {platform} orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sunset-200/50">
                  <th className="pb-4 font-semibold text-sunset-800">Order #</th>
                  <th className="pb-4 font-semibold text-sunset-800">User</th>
                  <th className="pb-4 font-semibold text-sunset-800">Project / Details</th>
                  <th className="pb-4 font-semibold text-sunset-800">Date Opened</th>
                  <th className="pb-4 font-semibold text-sunset-800">Status</th>
                  <th className="pb-4 font-semibold text-sunset-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sunset-100">
                {orders.map((o) => (
                  <tr key={o.id || o.order_num} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 text-sunset-700 font-bold">{o.order_num}</td>
                    <td className="py-4 font-medium text-sunset-900">{o.user_name || o.user_id}</td>
                    <td className="py-4 text-sunset-700 max-w-[200px] truncate">{o.project || o.details || "N/A"}</td>
                    <td className="py-4 text-sm text-sunset-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span dir="ltr" className="inline-block" style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}>
                          {new Date(o.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        o.status?.toLowerCase() === "completed" || o.status?.toLowerCase() === "delivered" 
                          ? "bg-green-100 text-green-700" 
                          : o.status?.toLowerCase() === "pending" 
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {o.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(o.order_num)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition" 
                        title="View Transcript"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TranscriptModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        ticketId={selectedOrder || ""} 
        platform={platform} 
      />
    </div>
  );
}
