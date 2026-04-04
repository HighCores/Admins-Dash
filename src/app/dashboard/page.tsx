"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Ticket, Activity, MessageSquare, 
  Bot, ShieldCheck, Zap, Sparkles, 
  Clock, ArrowRight, Loader2, RefreshCcw,
  PlusCircle, CheckCircle2, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    totalUsers: 0,
    activeCommands: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Stats
    const [{ count: totalTickets }, { count: openTickets }, { count: totalUsers }, { count: activeCommands }] = await Promise.all([
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }),
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("status", "open"),
        supabase.from("dc_levels").select("*", { count: 'exact', head: true }),
        supabase.from("dc_commands").select("*", { count: 'exact', head: true }).eq("is_active", true),
    ]);

    setStats({
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        totalUsers: totalUsers || 0,
        activeCommands: activeCommands || 0,
    });

    // 2. Fetch Recent Activity from dc_stats
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
      
      {/* Header with Breathing Room */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sunset-500 font-black text-xs uppercase tracking-[0.3em] mb-1">
             <Zap size={14} className="animate-pulse" /> Agency Core Monitoring
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Agency <span className="opacity-30">Pulse</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/60 max-w-xl italic">
            Visual intelligence hub for High Core Agency. Monitoring Discord & Telegram status in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchDashboardData}
                className="p-4 bg-white/50 hover:bg-white rounded-2xl shadow-xl border border-sunset-100 transition-all active:scale-95 group"
            >
                <RefreshCcw size={20} className={`text-sunset-500 group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-sunset-900 text-white rounded-[2rem] shadow-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">System Normal</span>
            </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Ticket size={24} />} title="Total Support Tickets" value={stats.totalTickets} diff="+12% Since yesterday" color="sunset" />
        <StatCard icon={<AlertCircle size={24} />} title="Awaiting Response" value={stats.openTickets} diff="Urgent priority" color="red" />
        <StatCard icon={<Users size={24} />} title="Network Users" value={stats.totalUsers} diff="Active accounts" color="indigo" />
        <StatCard icon={<Bot size={24} />} title="Neural Nodes" value={stats.activeCommands} diff="Commands online" color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Recent Activity Feed (The Heartbeat) */}
        <div className="xl:col-span-8 space-y-6">
            <div className="glass-card rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl">
                 <div className="p-10 border-b border-sunset-100/50 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-sunset-900 flex items-center gap-3">
                        <Activity className="text-sunset-500" /> Recent Agency Activity
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] bg-sunset-50 text-sunset-600 px-3 py-1 rounded-lg font-black uppercase italic tracking-widest leading-none">
                        <Loader2 size={12} className="animate-spin" /> Live Trace
                    </div>
                 </div>

                 <div className="p-6 md:p-10 space-y-8">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sunset-500" size={40} /></div>
                    ) : recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center opacity-30 italic font-bold text-sunset-900">
                             <Zap size={60} className="mb-4 text-sunset-200" />
                             <p>Initial sync in progress. No activity recorded yet.</p>
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
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-sunset-50 flex items-center justify-center text-sunset-900 group-hover:scale-110 transition-transform">
                                        <Sparkles size={18} className="text-sunset-400 group-hover:text-sunset-600" />
                                    </div>
                                    {idx !== recentActivity.length - 1 && <div className="w-0.5 h-full bg-sunset-100/50 my-2"></div>}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-black text-sunset-900 leading-none mb-1 uppercase tracking-tight">{event.event_type.replace(/_/g, ' ')}</h4>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-sunset-400" />
                                                <span className="text-xs font-bold text-sunset-800/40 italic">System Actor: {event.user_id || 'BOT'}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-sunset-800/30 uppercase bg-sunset-50 px-2 py-1 rounded-md flex items-center gap-1 italic">
                                            <Clock size={10} /> {new Date(event.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-sunset-800/70 border-l-4 border-sunset-100 pl-4 py-1 italic leading-relaxed">
                                        "{event.details || 'Internal operation was completed successfully by High Core logic.'}"
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                 </div>
                 
                 <div className="p-8 bg-sunset-50/50 border-t border-sunset-100/50 text-center">
                    <button className="text-xs font-black text-sunset-500 uppercase tracking-[0.3em] hover:text-sunset-900 transition-colors flex items-center justify-center gap-2 mx-auto group">
                        Enter Deep Analytics <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
            </div>
        </div>

        {/* Right: Quick Command Center (Breathing Action) */}
        <div className="xl:col-span-4 space-y-8">
             <div className="glass-card p-10 rounded-[3rem] bg-sunset-900 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Zap size={240} /></div>
                 <h3 className="text-2xl font-black mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400" /> Instant Push
                 </h3>
                 <p className="text-white/60 mb-10 text-sm italic font-medium leading-relaxed">
                    Broadcast a global notification across all agency channels or refresh the entire database cache with one click.
                 </p>
                 <div className="space-y-4">
                    <button className="w-full py-4 bg-white text-sunset-900 font-black text-xs rounded-2xl shadow-xl hover:scale-[1.03] transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                        <PlusCircle size={16} /> New Global Panel
                    </button>
                    <button className="w-full py-4 bg-white/10 text-white font-black text-xs border border-white/20 rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest">
                        Reboot Neural Network
                    </button>
                 </div>
             </div>

             <div className="glass-card p-8 rounded-[3rem] border border-sunset-100 shadow-xl bg-white/80">
                <h4 className="font-black text-sunset-900 mb-6 flex items-center gap-2 subrayado-glow-orange cursor-default">
                    <ShieldCheck size={20} className="text-sunset-500" /> Agency Health
                </h4>
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black opacity-30 uppercase italic">Guild Latency</div>
                            <div className="text-xl font-black text-sunset-900">14<span className="text-xs opacity-30 ml-1">MS</span></div>
                        </div>
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 w-[95%]"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black opacity-30 uppercase italic">N8N Handshake</div>
                            <div className="text-xl font-black text-sunset-900">SECURE</div>
                        </div>
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-indigo-500 w-[100%]"></div>
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
        sunset: "bg-sunset-500 group-hover:bg-sunset-600 shadow-sunset-500/20",
        red: "bg-red-500 group-hover:bg-red-600 shadow-red-500/20",
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
                <h3 className="text-xs font-black text-sunset-800/40 uppercase tracking-widest italic">{title}</h3>
                <div className="text-3xl font-black text-sunset-900 tracking-tighter">{value || 0}</div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-sunset-500 opacity-60">
                <Activity size={12} /> {diff}
            </div>
        </motion.div>
    );
}

function User({ size, className }: any) { return <Users size={size} className={className} /> }
