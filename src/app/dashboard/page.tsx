"use client";

import { motion } from "framer-motion";
import { Ticket, MessageSquare, Activity, Bot, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    autoReplies: 0,
    servers: "1 Active",
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: totalTickets } = await supabase
          .from("dc_tickets")
          .select("*", { count: "exact", head: true });

        const { count: openTickets } = await supabase
          .from("dc_tickets")
          .select("*", { count: "exact", head: true })
          .eq("status", "open");

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
      } catch (e) {
        console.error("Error loading stats", e);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Main Overview</h1>
        <p className="text-sunset-800/70 font-medium">Real-time indicators for your agency bots.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-sunset-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card icon={<Ticket size={24} />} title="Total Tickets" value={stats.totalTickets} color="blue" />
          <Card icon={<Activity size={24} />} title="Open Tickets" value={stats.openTickets} color="red" />
          <Card icon={<MessageSquare size={24} />} title="Auto Replies" value={stats.autoReplies} color="orange" />
          <Card icon={<Bot size={24} />} title="Bot Status" value={stats.servers} color="indigo" />
        </div>
      )}
      
      <div className="glass-card p-10 rounded-3xl text-center border border-sunset-200 mt-10">
        <h2 className="text-2xl font-bold text-sunset-900 mb-2">Welcome to High Core Dashboard</h2>
        <p className="text-sunset-800/60 max-w-lg mx-auto">Use the sidebar on the left to navigate between different bot modules and platforms.</p>
      </div>
    </div>
  );
}

function Card({ icon, title, value, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-500/10 text-blue-600",
    red: "bg-red-500/10 text-red-600",
    orange: "bg-sunset-500/10 text-sunset-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
  };
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>{icon}</div>
      </div>
      <h3 className="text-sunset-800/60 font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-sunset-900">{value}</p>
    </motion.div>
  );
}
