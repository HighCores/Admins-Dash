"use client";

import { motion } from "framer-motion";
import { ShieldAlert, LogIn, AlertOctagon } from "lucide-react";
import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase"; // We will fetch logs here

export default function LogsPage() {
  const [logs, setLogs] = useState([
    { id: 1, action: "Admin Login", user: "Omar", time: "2 minutes ago", status: "Success", type: "auth" },
    { id: 2, action: "Updated Auto-reply", user: "Ahmed", time: "1 hour ago", status: "Success", type: "system" },
    { id: 3, action: "Failed Access Attempt", user: "Unknown", time: "5 hours ago", status: "Blocked", type: "security" },
  ]);

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Access & Audit Logs</h1>
        <p className="text-sunset-800/70 font-medium">Monitor dashboard interactions and security events.</p>
      </header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sunset-100/50 text-sunset-900 border-b border-sunset-400/20">
              <th className="p-5 font-semibold">Action</th>
              <th className="p-5 font-semibold">User</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-sunset-400/10 hover:bg-white/30 transition-colors">
                <td className="p-5 flex items-center gap-3 font-medium text-sunset-900">
                  {log.type === "auth" && <LogIn size={18} className="text-blue-500" />}
                  {log.type === "security" && <AlertOctagon size={18} className="text-red-500" />}
                  {log.type === "system" && <ShieldAlert size={18} className="text-sunset-600" />}
                  {log.action}
                </td>
                <td className="p-5 font-bold text-sunset-800">{log.user}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    log.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-5 text-right text-sunset-800/60 text-sm font-medium">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
