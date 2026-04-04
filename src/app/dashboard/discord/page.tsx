"use client";

import { motion } from "framer-motion";
import { Ticket, Users, MessageSquare, ShieldAlert, Activity, Bot, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DiscordOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    autoReplies: 0,
    servers: "1 Active", // Usually a single instance for custom bots
  });

  useEffect(() => {
    async function loadStats() {
      // Fetch Total Tickets
      const { count: totalTickets } = await supabase
        .from("dc_tickets")
        .select("*", { count: "exact", head: true });

      // Fetch Open Tickets
      const { count: openTickets } = await supabase
        .from("dc_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      // Fetch Auto Replies
      const { count: autoReplies } = await supabase
        .from("dc_auto_responses")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      setStats({
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        autoReplies: autoReplies || 0,
        servers: "1 Active",
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Discord Overview</h1>
        <p className="text-sunset-800/70 font-medium">Real-time stats from your Discord bot database.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-sunset-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600"><Ticket size={24} /></div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Live</span>
            </div>
            <h3 className="text-sunset-800/60 font-semibold mb-1">Total Tickets</h3>
            <p className="text-3xl font-bold text-sunset-900">{stats.totalTickets}</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-600"><Activity size={24} /></div>
              <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-lg">Action Needed</span>
            </div>
            <h3 className="text-sunset-800/60 font-semibold mb-1">Open Tickets</h3>
            <p className="text-3xl font-bold text-sunset-900">{stats.openTickets}</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-sunset-500/10 rounded-2xl text-sunset-600"><MessageSquare size={24} /></div>
            </div>
            <h3 className="text-sunset-800/60 font-semibold mb-1">Auto Replies</h3>
            <p className="text-3xl font-bold text-sunset-900">{stats.autoReplies}</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600"><Bot size={24} /></div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Online</span>
            </div>
            <h3 className="text-sunset-800/60 font-semibold mb-1">Bot Status</h3>
            <p className="text-lg font-bold text-sunset-900">{stats.servers}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
