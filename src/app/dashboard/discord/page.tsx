"use client";

import { motion } from "framer-motion";
import { Ticket, Users, MessageSquare, ShieldAlert, Activity, Bot, Loader2, RefreshCcw, Zap, Terminal, Globe, ShieldCheck, TrendingUp, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DiscordOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    autoReplies: 0,
    servers: "STABLE",
  });
  const [telemetry, setTelemetry] = useState({
    latency: "---",
    uptime: "---",
    status: "OFFLINE"
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    const { data: settings } = await supabase
        .from("dc_settings")
        .select("key, value")
        .in("key", ["bot_latency", "bot_uptime", "bot_status"]);
    
    if (settings) {
        const tel: any = { latency: "---", uptime: "---", status: "OFFLINE" };
        settings.forEach(s => {
            if (s.key === "bot_latency") tel.latency = s.value;
            if (s.key === "bot_uptime") tel.uptime = s.value;
            if (s.key === "bot_status") tel.status = s.value;
        });
        setTelemetry(tel);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await fetchTelemetry();
    
    const [
        { count: totalTickets }, 
        { count: openTickets }, 
        { count: autoReplies }
    ] = await Promise.all([
        supabase.from("dc_tickets").select("*", { count: "exact", head: true }).or('platform.eq.discord,platform.is.null'),
        supabase.from("dc_tickets").select("*", { count: "exact", head: true }).eq("status", "open").or('platform.eq.discord,platform.is.null'),
        supabase.from("dc_auto_responses").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    setStats({
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        autoReplies: autoReplies || 0,
        servers: "STABLE",
    });
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <Bot size={18} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Highcore Agency // Discord Analytics</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
            Discord <span className="text-emerald-500 crt-glow">Overview</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Real-time activity from the Highcore Agency Discord. Monitoring connection quality and data synchronisation.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchDashboardData}
                className="p-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all active:scale-95 group"
            >
                <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-emerald-500 transition-all duration-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/20">
                <div className={`w-2 h-2 rounded-full ${telemetry.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">System {telemetry.status === 'ONLINE' ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-40 opacity-20 font-mono">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
          <span className="text-[10px] uppercase font-black tracking-widest">Loading Agency Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 overflow-hidden">
          <StatCard icon={<Ticket size={20} />} title="Total Activity" value={stats.totalTickets} subtitle="Records Synced" />
          <StatCard icon={<Activity size={20} />} title="Open Cases" value={stats.openTickets} subtitle="Awaiting Action" highlight />
          <StatCard icon={<MessageSquare size={20} />} title="Auto Responses" value={stats.autoReplies} subtitle="Smart Logic" />
          <StatCard icon={<ShieldCheck size={20} />} title="Agency Shield" value={stats.servers} subtitle="Protection SSL" />
        </div>
      )}

      {/* Industrial Visuals */}
      {!loading && (
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden pb-10">
            <div className="xl:col-span-8 terminal-card p-10 rounded-[3rem] bg-zinc-950/40 relative overflow-hidden flex flex-col border border-white/5 group">
                <div className="absolute right-0 top-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none text-emerald-500"><Terminal size={240} /></div>
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 italic tracking-tighter uppercase border-b border-white/5 pb-4">
                    <TrendingUp size={18} className="text-emerald-500" /> Operational Growth
                </h3>
                <div className="flex-1 flex flex-col justify-center items-center font-mono opacity-20 select-none">
                    <Globe size={80} className="mb-6 animate-pulse" />
                    <span className="text-2xl font-black tracking-[0.5em] uppercase italic">RELAY_STABLE</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Authorization Confirmed // Sector 7G</span>
                </div>
            </div>
            
            <div className="xl:col-span-4 terminal-card p-10 rounded-[3rem] bg-zinc-900/40 border-white/5 shadow-xl relative overflow-hidden group font-mono">
                <div className="absolute left-0 bottom-0 p-10 opacity-[0.03] pointer-events-none text-emerald-500"><Cpu size={140} /></div>
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 italic tracking-tighter uppercase border-b border-white/5 pb-4">
                    <Activity size={18} className="text-emerald-500" /> Diagnostic Health
                </h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Latency Delay</span>
                        <span className="text-lg font-black text-emerald-500 tracking-tighter italic crt-glow">{telemetry.latency}</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Uptime Ratio</span>
                        <span className="text-lg font-black text-emerald-500 tracking-tighter italic crt-glow">{telemetry.uptime}</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, highlight }: any) {
    return (
        <div className="terminal-card p-6 rounded-3xl bg-zinc-900/40 border-white/5 shadow-xl hover:bg-zinc-900/60 transition-all group flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xl group-hover:scale-110 border ${highlight ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-black/20 text-zinc-600 group-hover:text-emerald-500 group-hover:border-emerald-500/10 border-white/5'}`}>
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</h3>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white tracking-tighter italic drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">{value || 0}</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">{subtitle}</div>
        </div>
    );
}

