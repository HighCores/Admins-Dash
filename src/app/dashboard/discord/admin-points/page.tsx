"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, ShieldCheck, Activity, Target, 
  Flame, Award, Loader2, Sparkles, 
  Zap, Clock, History, BarChart3, TrendingUp, ShieldAlert,
  User as UserIcon, Terminal, Globe, ArrowRight, RefreshCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPointsPage() {
  const [staffStats, setStaffStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalActions, setTotalActions] = useState(0);

  useEffect(() => {
    fetchStaffStats();
  }, []);

  const fetchStaffStats = async () => {
    setLoading(true);
    // Fetch stats for claimed and closed tickets
    const { data: stats } = await supabase
        .from("dc_stats")
        .select("*")
        .in("event_type", ["ticket_claimed", "ticket_closed"])
        .order("created_at", { ascending: false });

    if (stats) {
        // Group by user_id and count
        const adminMap: Record<string, any> = {};
        stats.forEach(s => {
            const uid = s.user_id || "SYSTEM";
            if (!adminMap[uid]) adminMap[uid] = { user_id: uid, claimed: 0, closed: 0, total: 0 };
            if (s.event_type === "ticket_claimed") adminMap[uid].claimed++;
            if (s.event_type === "ticket_closed") adminMap[uid].closed++;
            adminMap[uid].total++;
        });

        const sortedStaff = Object.values(adminMap).sort((a: any, b: any) => b.total - a.total);
        setStaffStats(sortedStaff);
        setTotalActions(stats.length);
    }
    setLoading(false);
  };

  const cleanId = (id: string) => {
    if (!id) return "USER_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase().slice(0, 10);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-visible">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Crown size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Staff Performance Record</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Admin <span className="text-zinc-300">Performance</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Monitoring agency staff efficiency and response guidelines.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchStaffStats}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-zinc-950 text-white rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-900 group">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors cursor-default">{totalActions} ACTIONS_LOGGED</span>
            </div>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-visible">
        
        {/* Left: Honor Grid (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-visible">
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                    {loading ? (
                        <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : staffStats.length === 0 ? (
                        <div className="col-span-full p-20 text-center opacity-10 italic uppercase font-black tracking-widest">No staff activity found</div>
                    ) : staffStats.map((staff, idx) => (
                        <motion.div 
                            key={staff.user_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-visible group hover:shadow-2xl hover:border-zinc-200 transition-all"
                        >
                             <div className={`absolute top-6 right-6 w-11 h-11 flex flex-col items-center justify-center rounded-xl shadow-lg transform group-hover:scale-110 transition-transform ${
                                idx === 0 ? 'bg-zinc-950 text-white rotate-3' : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                             }`}>
                                <span className="text-[8px] font-black uppercase opacity-60 leading-none mb-0.5">Rank</span>
                                <span className="text-base font-black italic">#{idx + 1}</span>
                             </div>

                             <div className="flex items-center gap-5 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-xl font-black text-zinc-300 italic group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-inner">
                                    {staff.user_id?.charAt(0) || 'A'}
                                </div>
                                <div className="min-w-0 pr-12">
                                    <h4 className="text-lg font-black text-zinc-950 leading-none mb-1 italic tracking-tighter uppercase truncate underline decoration-zinc-50 underline-offset-4">Admin {cleanId(staff.user_id)}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-emerald-600 transition-colors">STAFF_ONLINE</span>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-50 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-inner">
                                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-2 leading-none italic">Claimed</div>
                                    <div className="text-2xl font-black italic tracking-tighter leading-none">{staff.claimed}</div>
                                </div>
                                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-50 hover:bg-emerald-500 hover:text-white transition-all shadow-inner">
                                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-2 leading-none italic">Closures</div>
                                    <div className="text-2xl font-black italic tracking-tighter leading-none">{staff.closed}</div>
                                </div>
                             </div>

                             <div className="space-y-2 px-1">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em] opacity-30 italic">Force Efficiency Proxy</div>
                                <div className="w-full h-1 bg-zinc-50 rounded-full overflow-visible shadow-inner border border-zinc-100">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (staff.total / (totalActions / 2)) * 100)}%` }}
                                        className="h-full bg-zinc-950 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                                    ></motion.div>
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
             </div>
        </div>

        {/* Right: Activity Audit (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
                <div className="p-8 border-b border-zinc-50 bg-zinc-50/20">
                    <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <History size={18} className="text-zinc-400" /> Activity Audit
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 relative">
                    <div className="absolute left-10 top-2 bottom-8 w-px bg-zinc-50 pointer-events-none"></div>
                    
                    <AnimatePresence mode="popLayout">
                        {staffStats.slice(0, 12).map((staff, idx) => (
                            <motion.div 
                                key={staff.user_id + idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative pl-10 group"
                            >
                                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-100 group-hover:border-zinc-950 group-hover:bg-zinc-950 transition-all z-10 shadow-sm"></div>
                                <div className="flex justify-between items-center group-hover:bg-zinc-50/50 p-2 rounded-xl transition-all -ml-2">
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <span className="text-[10px] font-black text-zinc-950 italic group-hover:underline underline-offset-4 decoration-zinc-100 uppercase tracking-tighter truncate">{cleanId(staff.user_id)}</span>
                                        <span className="text-[8px] font-black text-zinc-300 mt-1 italic tracking-[0.1em] font-mono leading-none">ACTIVITY_LOGGED</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-lg font-black text-zinc-950 italic leading-none">{staff.total}</div>
                                        <div className="text-[7px] font-black text-zinc-300 uppercase italic leading-none mt-0.5 tracking-widest">POINTS</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                <div className="p-6 bg-zinc-50/50 border-t border-zinc-100">
                    <button className="w-full flex items-center justify-center gap-4 py-4 bg-zinc-50 text-zinc-400 font-black text-[9px] rounded-xl border border-zinc-100 hover:text-zinc-950 hover:border-zinc-200 transition-all uppercase tracking-[0.3em] italic underline decoration-zinc-100 underline-offset-4 decoration-2">
                        View Activity Logs <ArrowRight size={14} />
                    </button>
                </div>
             </div>

             <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] shadow-2xl relative overflow-visible group border border-zinc-900 shrink-0">
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none"><Zap size={140} /></div>
                <h4 className="text-sm font-black italic mb-2 tracking-tighter flex items-center gap-2">
                   <Target size={16} className="text-zinc-400" /> Performance Bonus
                </h4>
                <p className="text-[10px] opacity-40 mb-6 font-bold leading-relaxed pr-6">Instantly grant bonus points to the top performer node of the current cycle.</p>
                <button className="w-full py-4 bg-white text-zinc-950 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all italic underline decoration-zinc-950/10 underline-offset-4">REWARD_TOP_STAFF</button>
            </div>
        </div>
      </div>
    </div>
  );
}
