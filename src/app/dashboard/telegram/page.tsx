"use client";

import { motion } from "framer-motion";
import { Send, Ticket, MessageSquare, Activity, Bot, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    activeUsers: 0,
    botStatus: "Online",
  });

  useEffect(() => {
    async function loadStats() {
      // For now, loading placeholder or basic shared stats if tables exist
      setStats({
        totalTickets: 0,
        openTickets: 0,
        activeUsers: 0,
        botStatus: "Online (N8N Connected)",
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-sunset-900 tracking-tight glow-text-sunset">Telegram Command Center</h1>
          <p className="text-sunset-800/70 font-medium">Real-time sync with your N8N & Python bot.</p>
        </div>
        <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
            <Send size={18} /> Platform: Telegram
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-sunset-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Ticket size={24} />} title="Telegram Tickets" value={stats.totalTickets} color="blue" />
          <StatCard icon={<Activity size={24} />} title="Open Cases" value={stats.openTickets} color="red" />
          <StatCard icon={<MessageSquare size={24} />} title="Users Interacting" value={stats.activeUsers} color="orange" />
          <StatCard icon={<Bot size={24} />} title="Bot Logic" value={stats.botStatus} color="indigo" />
        </div>
      )}

      <div className="glass-card p-12 rounded-[2.5rem] border border-blue-200 bg-white/40 backdrop-blur-md text-center shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Send size={200} className="rotate-12" />
         </div>
         <h2 className="text-3xl font-extrabold text-blue-900 mb-4 tracking-tight">The Sky is the Limit</h2>
         <p className="text-blue-800/60 text-lg max-w-2xl mx-auto">Your Telegram bot is now monitored by the High Core Agency Dashboard. Any action in N8N will be logged here.</p>
         <div className="mt-8 flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.05] transition-all">Configure Webhooks</button>
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-500/10 text-blue-600",
    red: "bg-red-500/10 text-red-600",
    orange: "bg-orange-500/10 text-orange-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
  };
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>{icon}</div>
      </div>
      <h3 className="text-sunset-800/60 font-semibold mb-1">{title}</h3>
      <p className="text-2xl font-bold text-sunset-900">{value}</p>
    </motion.div>
  );
}
