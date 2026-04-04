"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, Activity, MessageSquare, 
  Bot, ShieldCheck, Zap, Sparkles, 
  Clock, ArrowRight, Loader2, RefreshCcw,
  PlusCircle, CheckCircle2, AlertCircle, Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    activeUsers: 0,
    activeCommands: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Stats (filtered by platform='telegram' where applicable or globally)
    const [{ count: totalTickets }, { count: openTickets }, { count: activeCommands }] = await Promise.all([
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("platform", "telegram"),
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("status", "open").eq("platform", "telegram"),
        supabase.from("dc_commands").select("*", { count: 'exact', head: true }).eq("platform", "telegram").eq("is_active", true),
    ]);

    setStats({
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        activeUsers: 0, // Calculated from sessions if needed
        activeCommands: activeCommands || 0,
    });

    // 2. Fetch Recent Activity from dc_stats (Generic or filtered)
    const { data: activity } = await supabase
        .from("dc_stats")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
    
    if (activity) setRecentActivity(activity);
    
    setLoading(false);
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      
      {/* Header with Telegram Blue Theme */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-1">
             <Send size={14} className="animate-pulse" /> Telegram Nexus Proxy
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-blue-950 tracking-tighter glow-text-blue">
            N8N <span className="opacity-30">Relay</span>
          </h1>
          <p className="text-lg font-medium text-blue-900/60 max-w-xl italic">
            Monitoring Telegram bot interactions and N8N webhook handshakes with absolute precision.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchDashboardData}
                className="p-4 bg-white/50 hover:bg-white rounded-2xl shadow-xl border border-blue-100 transition-all active:scale-95 group"
            >
                <RefreshCcw size={20} className={`text-blue-500 group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-blue-950 text-white rounded-[2rem] shadow-2xl flex items-center gap-3 border border-blue-400/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Flow Connected</span>
            </div>
        </div>
      </header>

      {/* Stats Grid - Telegram Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Ticket size={24} />} title="Telegram Inquiries" value={stats.totalTickets} diff="+5% Since sync" color="blue" />
        <StatCard icon={<Activity size={24} />} title="Pending Handshakes" value={stats.openTickets} diff="Awaiting agent" color="sky" />
        <StatCard icon={<Share2 size={24} />} title="Webhook Chains" value={stats.activeCommands} diff="N8N Active" color="indigo" />
        <StatCard icon={<Bot size={24} />} title="Logic Nodes" value="LIVE" diff="Neural online" color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Recent Activity Feed */}
        <div className="xl:col-span-8 space-y-6">
            <div className="glass-card rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl">
                 <div className="p-10 border-b border-blue-100/50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent">
                    <h3 className="text-2xl font-black text-blue-950 flex items-center gap-3">
                        <Activity className="text-blue-500" /> Telegram Network Trace
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black uppercase italic tracking-widest leading-none">
                        <Loader2 size={12} className="animate-spin" /> Live Proxy
                    </div>
                 </div>

                 <div className="p-6 md:p-10 space-y-8">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
                    ) : recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center opacity-30 italic font-black text-blue-900">
                             <Send size={60} className="mb-4 text-blue-200" />
                             <p>Initial Telegram sync in progress...</p>
                        </div>
                    ) : (
                        recentActivity.map((event, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={event.id} 
                                className="flex gap-6 relative group"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-blue-50 flex items-center justify-center text-blue-900 group-hover:scale-110 transition-transform">
                                        <Sparkles size={18} className="text-blue-400 group-hover:text-blue-600" />
                                    </div>
                                    {idx !== recentActivity.length - 1 && <div className="w-0.5 h-full bg-blue-100/50 my-2"></div>}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-black text-blue-950 leading-none mb-1 uppercase tracking-tight">{event.event_type.replace(/_/g, ' ')}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                                <span className="text-xs font-bold text-blue-900/30 italic">PROXY_RELAY: {event.user_id || 'N8N'}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-blue-900/30 uppercase bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1 italic border border-blue-100">
                                            <Clock size={10} /> {new Date(event.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-blue-900/60 border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed">
                                        "{event.details || 'Telegram logic node transmission was completed successfully.'}"
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                 </div>
            </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="xl:col-span-4 space-y-8">
             <div className="glass-card p-10 rounded-[3rem] bg-blue-950 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Send size={240} /></div>
                 <h3 className="text-2xl font-black mb-6 border-b border-white/10 pb-4 flex items-center gap-3 italic">
                    <CheckCircle2 className="text-sky-400" /> Instant Broadcast
                 </h3>
                 <div className="space-y-4">
                    <button className="w-full py-4 bg-white text-blue-950 font-black text-xs rounded-2xl shadow-xl hover:scale-[1.03] transition-all uppercase tracking-widest flex items-center justify-center gap-2 italic">
                        <PlusCircle size={16} /> NEW TELE_PANEL
                    </button>
                    <button className="w-full py-4 bg-white/10 text-white font-black text-xs border border-white/20 rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest italic">
                        Refresh Webhook API
                    </button>
                 </div>
             </div>

             <div className="glass-card p-8 rounded-[3rem] border border-blue-100 shadow-xl bg-white/80">
                <h4 className="font-black text-blue-950 mb-6 flex items-center gap-2 subrayado-glow cursor-default italic">
                    <ShieldCheck size={20} className="text-blue-500" /> N8N Handshake
                </h4>
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black opacity-30 uppercase italic">Response Latency</div>
                            <div className="text-xl font-black text-blue-950 italic">0.2<span className="text-xs opacity-30 ml-1">MS</span></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black opacity-30 uppercase italic">API Authorization</div>
                            <div className="text-xl font-black text-emerald-600 italic">SECURE</div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, diff, color }: any) {
    const colorMap: any = {
        blue: "bg-blue-500 group-hover:bg-blue-600 shadow-blue-500/20",
        sky: "bg-sky-500 group-hover:bg-sky-600 shadow-sky-500/20",
        indigo: "bg-indigo-500 group-hover:bg-indigo-600 shadow-indigo-500/20",
        emerald: "bg-emerald-500 group-hover:bg-emerald-600 shadow-emerald-500/20",
    };

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 rounded-[3rem] border border-white shadow-xl group cursor-pointer transition-all relative overflow-hidden"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl transition-all duration-500 ${colorMap[color]}`}>
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="text-xs font-black text-blue-900/40 uppercase tracking-widest italic">{title}</h3>
                <div className="text-3xl font-black text-blue-950 tracking-tighter">{value || 0}</div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 opacity-60">
                <Activity size={12} /> {diff}
            </div>
        </motion.div>
    );
}
