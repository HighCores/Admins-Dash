"use client";

import { motion } from "framer-motion";
import { Activity, ServerCrash, Users, MessagesSquare, CheckCircle2 } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "Active Bots", value: "2", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
    { label: "Total Users", value: "8,430", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Messages Handled", value: "45.2K", icon: MessagesSquare, color: "text-purple-500", bg: "bg-purple-100" },
    { label: "System Status", value: "Online", icon: Activity, color: "text-sunset-500", bg: "bg-sunset-100" },
  ];

  return (
    <div className="w-full space-y-6 z-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Overview</h1>
        <p className="text-sunset-800/70 font-medium">Welcome back, High Admin. Systems are running smoothly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <div>
                <p className="text-sunset-800/70 text-sm font-semibold uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-sunset-900">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-sunset-900 mb-6">Java Discord Bot</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-white/60">
              <span className="font-medium text-sunset-800">Connection Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-white/60">
              <span className="font-medium text-sunset-800">Gateway Latency</span>
              <span className="font-bold text-sunset-900">42ms</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-sunset-900 mb-6">N8N Telegram Bot</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-white/60">
              <span className="font-medium text-sunset-800">Webhook Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Listening
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-white/60">
              <span className="font-medium text-sunset-800">Last Sync</span>
              <span className="font-bold text-sunset-900">2 mins ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
