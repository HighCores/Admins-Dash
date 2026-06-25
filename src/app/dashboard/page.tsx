"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePlatform } from "@/context/PlatformContext";
import { MessageSquare, ShoppingCart, Tag, Clock } from "lucide-react";

export default function OverviewPage() {
  const { platform } = usePlatform();
  const [stats, setStats] = useState({ tickets: 0, orders: 0, discounts: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (platform === "discord") {
        const [
          { count: tickets },
          { count: orders },
          { count: discounts },
          { data: ticketsData }
        ] = await Promise.all([
          supabase.from("dc_tickets").select("*", { count: "exact", head: true }),
          supabase.from("dc_orders").select("*", { count: "exact", head: true }),
          supabase.from("dc_discounts").select("*", { count: "exact", head: true }),
          supabase.from("dc_tickets").select("*").order("created_at", { ascending: false }).limit(5)
        ]);
        
        setStats({ tickets: tickets || 0, orders: orders || 0, discounts: discounts || 0 });
        setRecentTickets(ticketsData || []);
      } else {
        const [
          { count: tickets },
          { count: orders },
          { count: vouchers },
          { data: ticketsData }
        ] = await Promise.all([
          supabase.from("tg_tickets").select("*", { count: "exact", head: true }),
          supabase.from("tg_orders").select("*", { count: "exact", head: true }),
          supabase.from("tg_vouchers").select("*", { count: "exact", head: true }),
          supabase.from("tg_tickets").select("*").order("created_at", { ascending: false }).limit(5)
        ]);
        
        setStats({ tickets: tickets || 0, orders: orders || 0, discounts: vouchers || 0 });
        setRecentTickets(ticketsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [platform]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-sunset-900 capitalize tracking-tight">{platform} Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/5 border border-blue-100">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-2xl shadow-inner">
            <MessageSquare size={28} />
          </div>
          <div>
            <p className="text-sm text-sunset-600 font-bold uppercase tracking-wider">Total Tickets</p>
            {loading ? (
              <div className="h-9 w-16 bg-sunset-200 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <h2 className="text-4xl font-black text-sunset-900">{stats.tickets}</h2>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-green-500/5 border border-green-100">
          <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-2xl shadow-inner">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-sm text-sunset-600 font-bold uppercase tracking-wider">Total Orders</p>
            {loading ? (
              <div className="h-9 w-16 bg-sunset-200 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <h2 className="text-4xl font-black text-sunset-900">{stats.orders}</h2>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-purple-500/5 border border-purple-100">
          <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-2xl shadow-inner">
            <Tag size={28} />
          </div>
          <div>
            <p className="text-sm text-sunset-600 font-bold uppercase tracking-wider">Active {platform === "discord" ? "Discounts" : "Vouchers"}</p>
            {loading ? (
              <div className="h-9 w-16 bg-sunset-200 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <h2 className="text-4xl font-black text-sunset-900">{stats.discounts}</h2>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl flex flex-col gap-6 border border-sunset-200">
        <div className="flex items-center gap-3 text-sunset-900 border-b border-sunset-100 pb-4">
          <div className="p-2 bg-sunset-100 rounded-xl">
            <Clock size={20} className="text-sunset-600" />
          </div>
          <h2 className="text-2xl font-bold">Recent Tickets</h2>
        </div>
        
        {loading ? (
          <div className="flex flex-col gap-3 mt-4">
            {[1,2,3].map(i => <div key={i} className="w-full h-16 bg-sunset-100 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : recentTickets.length === 0 ? (
          <p className="text-center text-sunset-500 py-8 font-medium">No recent tickets available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sunset-500 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold">ID</th>
                  <th className="pb-4 font-bold">User</th>
                  <th className="pb-4 font-bold">Subject</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sunset-100">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-sunset-50/50 transition-colors group">
                    <td className="py-4 text-sunset-700 font-bold group-hover:text-sunset-900 transition-colors">{t.ticket_id}</td>
                    <td className="py-4 font-bold text-sunset-900">{t.user_name || t.user_id}</td>
                    <td className="py-4 text-sunset-600 font-medium">{t.subject || "No Subject"}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        t.status === "open" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
