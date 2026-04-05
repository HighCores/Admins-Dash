"use client";

import { motion } from "framer-motion";
import { 
  Users, MessageSquare, Plus, Activity, 
  Terminal, ShieldCheck, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";

export default function OverviewPage() {
  const [stats, setStats] = useState({
      members: 1542,
      commandsUsed: 12053,
      panels: 4,
      tickets: 142
  });

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Activity size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Core System</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Dashboard <span className="text-zinc-300">Overview</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             High Core neural telemetry and server activity ledger.
          </p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
         {/* Main Content */}
         <div className="lg:col-span-8 flex flex-col gap-8 min-h-0">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
               {[
                   { label: "Total Members", value: stats.members, icon: Users, color: "text-blue-500" },
                   { label: "Commands Executed", value: stats.commandsUsed, icon: Terminal, color: "text-emerald-500" },
                   { label: "Active Panels", value: stats.panels, icon: Zap, color: "text-amber-500" },
                   { label: "Tickets Resolved", value: stats.tickets, icon: MessageSquare, color: "text-rose-500" }
               ].map((stat, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm flex flex-col gap-4 group"
                   >
                       <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <stat.icon size={18} className={stat.color} />
                       </div>
                       <div>
                           <div className="text-2xl font-black tracking-tighter text-zinc-950">{stat.value.toLocaleString()}</div>
                           <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic mt-1">{stat.label}</div>
                       </div>
                   </motion.div>
               ))}
            </div>

            {/* Neural Graph Placeholder */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col min-h-0">
               <div className="p-6 border-b border-zinc-50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 italic flex items-center gap-2">
                      <Activity size={16} className="text-zinc-400" /> Server Activity Matrix
                  </h3>
               </div>
               <div className="flex-1 p-8 flex items-center justify-center bg-zinc-50/20">
                   <div className="text-zinc-300 font-black uppercase tracking-[0.3em] text-xs">Awaiting Telemetry Sync...</div>
               </div>
            </div>
         </div>

         {/* Sidebar Content */}
         <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
            <div className="bg-zinc-950 p-8 rounded-[3rem] text-white overflow-hidden relative shadow-2xl flex-1 flex flex-col min-h-0 group shrink-0 h-64">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={180} />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter mb-2 flex items-center gap-3">
                   System Status
                </h3>
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Stable & Online</span>
                </div>

                <div className="mt-auto">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Shard 0 Latency</div>
                    <div className="text-4xl font-black tracking-tighter">14<span className="text-lg text-zinc-500 ml-1">ms</span></div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
