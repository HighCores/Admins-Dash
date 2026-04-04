"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, Activity, MessageSquare, 
  Bot, ShieldCheck, Zap, Sparkles, 
  Clock, ArrowRight, Loader2, RefreshCcw,
  PlusCircle, CheckCircle2, AlertCircle, Share2,
  Terminal, Globe, History, TrendingUp
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
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Stats accurately for Telegram
    const [
        { count: totalTickets }, 
        { count: openTickets }, 
        { count: activeCommands }
    ] = await Promise.all([
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("platform", "telegram"),
        supabase.from("dc_tickets").select("*", { count: 'exact', head: true }).eq("status", "open").eq("platform", "telegram"),
        supabase.from("dc_commands").select("*", { count: 'exact', head: true }).eq("platform", "telegram").eq("is_active", true),
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
        .limit(6);
    
    if (activity) setRecentActivity(activity);
    
    setLoading(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      
      {/* Header Area - Telegram Nexus */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200"><Send size={16} className="text-white" /></div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Global Relay Protocol</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-zinc-950 tracking-tighter">
            Telegram <span className="text-blue-500">Nexus</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-xl">
             Monitoring Telegram bot telemetry and API handshakes with absolute precision across the High Core network.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchDashboardData}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all active:scale-95 group"
            >
                <RefreshCcw size={20} className={`text-blue-400 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-zinc-950 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-900">
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Relay Operational</span>
            </div>
        </div>
      </header>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 overflow-hidden">
        <StatCard icon={<TicketIcon size={20} />} title="Telegram Feed" value={stats.totalTickets} subtitle="Registry Sync" />
        <StatCard icon={<AlertCircle size={20} />} title="Awaiting Relay" value={stats.openTickets} subtitle="Secure Webhook" highlight />
        <StatCard icon={<Share2 size={20} />} title="System Logic" value={stats.activeCommands} subtitle="Webhook Chains" />
        <StatCard icon={<Globe size={20} />} title="Global API" value="SECURE" subtitle="Encryption SSL" />
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Stream Feed */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                 <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                    <h3 className="text-xl font-black text-zinc-950 flex items-center gap-4 tracking-tighter">
                        <Terminal className="text-zinc-400" /> Telegram Telemetry
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-lg tracking-widest uppercase">Proxy Trace</span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-20">
                             <History size={60} className="mb-4" />
                             <p className="text-2xl font-black tracking-tighter italic uppercase">Waiting for Webhook Data...</p>
                        </div>
                    ) : (
                        recentActivity.map((event, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={event.id} 
                                className="flex gap-6 group"
                            >
                                <div className="pt-1">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl">
                                        <Sparkles size={14} />
                                    </div>
                                </div>
                                <div className="flex-1 border-b border-zinc-50 pb-6 group-last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-zinc-950 tracking-widest uppercase">{event.event_type.replace(/_/g, ' ')}</h4>
                                        <span className="text-[9px] font-black text-zinc-300 bg-zinc-50 px-2 py-1 rounded-md">{new Date(event.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-500 leading-relaxed font-sans pr-10">
                                        {event.details || 'Telegram system transmission was completed successfully.'}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                 </div>
                 
                 <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 text-center">
                    <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Access Nexus Audit Log <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
            </div>
        </div>

        {/* Right: Controller Hub */}
        <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"><ShieldCheck size={200} /></div>
                 <h3 className="text-xl font-black mb-4 border-b border-white/10 pb-6 flex items-center gap-3 tracking-tighter italic">
                    <Zap className="text-white" size={20} /> Nexus Command
                 </h3>
                 <p className="text-white/60 mb-8 text-xs font-bold leading-relaxed pr-8">
                    Manual override for Telegram bot logic. broadcast messages or reset N8N webhook chains instantly.
                 </p>
                 <div className="space-y-3 relative z-10">
                    <button className="w-full py-4 bg-white text-blue-600 font-black text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                        <PlusCircle size={16} /> BROADCAST TO TELEGRAM
                    </button>
                    <button className="w-full py-4 bg-white/5 text-white/40 font-black text-[10px] border border-white/5 rounded-2xl hover:bg-white/20 hover:text-white transition-all uppercase tracking-widest italic">
                        RESET N8N WEBHOOKS
                    </button>
                 </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm flex-1">
                <h4 className="font-black text-zinc-950 mb-8 flex items-center gap-3 tracking-tighter underline underline-offset-8 decoration-zinc-50">
                    <TrendingUp size={18} className="text-zinc-400" /> Relay Health
                </h4>
                <div className="space-y-8">
                    <HealthRow label="API Handshake" value="EXCELLENT" percent={100} color="zinc-950" />
                    <HealthRow label="Message Flow" value="STABLE" percent={98} color="zinc-950" />
                    <HealthRow label="Logic Sync" value="ALIGNED" percent={100} color="zinc-950" />
                </div>
                <div className="mt-10 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-500">TG</div>
                     <div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-1">Session ID</span>
                        <span className="text-lg font-black text-zinc-950 tracking-tighter">HC_TRANS_07</span>
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
        <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xl group-hover:scale-110 ${highlight ? 'bg-blue-600 text-white' : 'bg-zinc-50 text-zinc-400 group-hover:text-zinc-950 group-hover:bg-white border border-zinc-50'}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-zinc-950 tracking-tighter">{value || 0}</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-50 text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">{subtitle}</div>
        </div>
    );
}

function HealthRow({ label, value, percent, color }: any) {
    return (
        <div className="space-y-2">
             <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
                <span className="text-sm font-black text-zinc-950 tracking-tighter italic">{value}</span>
             </div>
             <div className="w-full h-1 bg-zinc-50 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full bg-zinc-950 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                />
             </div>
        </div>
    );
}

function TicketIcon({ size }: any) { return <TicketIconIcon size={size} /> }
function TicketIconIcon({ size }: any) { return <Ticket size={size} /> }
function Share2Icon({ size }: any) { return <Share2 size={size} /> }
