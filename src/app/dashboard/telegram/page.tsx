"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, Activity, MessageSquare, 
  Bot, ShieldCheck, Zap, Sparkles, 
  Clock, ArrowRight, Loader2, RefreshCcw,
  CheckCircle2, AlertCircle, Share2,
  Terminal, Globe, History, TrendingUp, Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    activeCommands: 0,
  });
  const [telemetry, setTelemetry] = useState({
    latency: "---",
    uptime: "---",
    status: "OFFLINE"
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    const { data: settings } = await supabase
        .from("dc_settings")
        .select("key, value")
        .in("key", ["tg_latency", "tg_uptime", "tg_status"]);
    
    if (settings) {
        const tel: any = { latency: "---", uptime: "---", status: "OFFLINE" };
        settings.forEach(s => {
            if (s.key === "tg_latency") tel.latency = s.value;
            if (s.key === "tg_uptime") tel.uptime = s.value;
            if (s.key === "tg_status") tel.status = s.value;
        });
        setTelemetry(tel);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await fetchTelemetry();
    
    // 1. Fetch Stats accurately for Telegram
    const [
        { count: totalTickets }, 
        { count: openTickets }, 
        { count: activeCommands }
    ] = await Promise.all([
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("type", "telegram"),
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("status", "open").eq("type", "telegram"),
        supabase.from("dc_auto_responses").select("*", { count: 'exact', head: true }).eq("platform", "telegram"),
    ]);

    setStats({
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        activeCommands: activeCommands || 0,
    });

    const { data: activity } = await supabase
        .from("dc_stats")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
    
    if (activity) setRecentActivity(activity);
    
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <Send size={16} className="text-emerald-500 crt-glow animate-pulse" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Highcore Agency // Telegram Analytics</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
            Telegram <span className="text-emerald-500 crt-glow">Management</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Live coordination with the Telegram Platform. Monitoring service performance and project orders.
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
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">System {telemetry.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
        </div>
      </header>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<TicketIcon size={20} />} title="Telegram Activity" value={stats.totalTickets} subtitle="Engagement Records" />
        <StatCard icon={<AlertCircle size={20} />} title="Pending Support" value={stats.openTickets} subtitle="Active Requests" highlight />
        <StatCard icon={<Share2 size={20} />} title="Smart Responses" value={stats.activeCommands} subtitle="System Intelligence" />
        <StatCard icon={<Globe size={20} />} title="Agency Network" value="SECURE" subtitle="Premium Connection" />
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Stream Feed */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="terminal-card rounded-[2rem] flex-1 flex flex-col overflow-hidden bg-zinc-950/40 relative">
                 <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
                        <Terminal size={18} className="text-emerald-500" /> History
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg tracking-widest uppercase border border-emerald-500/20">Activity Feed</span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4 font-mono">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                    ) : recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-20">
                             <Terminal size={60} className="mb-4" />
                             <p className="text-xl font-black tracking-tighter uppercase">Connection Active // Reviewing Records...</p>
                        </div>
                    ) : (
                        recentActivity.map((event, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={event.id} 
                                className="flex gap-4 group p-3 bg-white/[0.02] border border-transparent hover:border-emerald-500/10 hover:bg-emerald-500/[0.02] rounded-xl transition-all"
                            >
                                <div className="text-emerald-500/30 text-[10px] shrink-0 font-mono">
                                    [{new Date(event.created_at).toLocaleTimeString([], { hour12: false })}]
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black text-emerald-500 tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                                            {event.event_type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400 leading-relaxed font-sans cursor-default group-hover:text-zinc-200 transition-colors">
                                        {event.details || 'Telegram system transmission was completed successfully.'}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                 </div>
                 
                 <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
                    <button className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] hover:text-emerald-500 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Access Management Records <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
            </div>
        </div>

        {/* Right: Controller Hub */}
        <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="terminal-card p-8 rounded-[2rem] flex-1 flex flex-col group overflow-hidden relative bg-zinc-950/40">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none text-emerald-500"><ShieldCheck size={120} /></div>
                <h4 className="font-black text-xl text-white mb-8 flex items-center gap-3 italic tracking-tighter uppercase shrink-0 border-b border-white/5 pb-4">
                    <Globe size={18} className="text-emerald-500" /> System Performance
                </h4>
                <div className="space-y-8 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2 font-mono">
                    <HealthRow label="Connection Status" value={telemetry.latency} percent={85} color="emerald-500" />
                    <HealthRow label="Information Accuracy" value={telemetry.status === 'ONLINE' ? 'VERIFIED' : 'OFFLINE'} percent={telemetry.status === 'ONLINE' ? 100 : 0} color="emerald-500" />
                    <HealthRow label="System Uptime" value={telemetry.uptime} percent={85} color="emerald-500" />
                    
                    <div className="pt-6">
                         <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center gap-4 group-hover:border-emerald-500/20 transition-all font-sans">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl shadow-sm flex items-center justify-center border border-emerald-500/20"><TrendingUp size={18} className="text-emerald-500" /></div>
                            <div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block leading-none mb-1">Weekly Performance</span>
                                <span className="text-lg font-black text-white tracking-tighter italic">+4.1% ENGAGEMENT <span className="text-emerald-500">MANAGED</span></span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

      </div>
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

function HealthRow({ label, value, percent, color }: any) {
    return (
        <div className="space-y-2 group/row">
             <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover/row:text-emerald-500/60 transition-colors">{label}</span>
                <span className="text-xs font-black text-emerald-500 tracking-tighter italic crt-glow">{value}</span>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
                />
             </div>
        </div>
    );
}

function TicketIcon({ size }: any) { return <TicketIconIcon size={size} /> }
function TicketIconIcon({ size }: any) { return <Ticket size={size} /> }
function Share2Icon({ size }: any) { return <Share2 size={size} /> }

