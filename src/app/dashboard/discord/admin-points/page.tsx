"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, ShieldCheck, Activity, Target, 
  Flame, Award, Loader2, Sparkles, 
  Zap, Clock, History, BarChart3, TrendingUp, ShieldAlert,
  User as UserIcon, Terminal, Globe, ArrowRight
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
    if (!id) return "NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase().slice(0, 8);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <Crown size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">High Command Performance Monitoring</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Admin <span className="text-zinc-300">Glory & Stats</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            The hall of legends. Monitor the performance of your agency operators, measure response efficiency, and reward the most dedicated agents.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="px-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all h-20">
                 <div className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-400 flex items-center justify-center font-black group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm"><Activity size={18} /></div>
                 <div>
                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">Global Load</div>
                    <div className="text-lg font-black text-zinc-950 leading-none">{totalActions} Actions</div>
                 </div>
            </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: The Honor Grid (Staff Leaderboard) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : staffStats.length === 0 ? (
                        <div className="col-span-full bg-white border border-zinc-100 rounded-[3rem] p-32 text-center opacity-10">
                            <ShieldAlert size={60} className="mx-auto mb-6" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">No active operations detected.</h3>
                        </div>
                    ) : staffStats.map((staff, idx) => (
                        <motion.div 
                            key={staff.user_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
                        >
                             {/* Rank Badge */}
                             <div className={`absolute top-6 right-6 w-12 h-12 flex flex-col items-center justify-center rounded-2xl shadow-xl transform group-hover:rotate-12 transition-transform ${
                                idx === 0 ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-400 border border-zinc-50'
                             }`}>
                                <span className="text-[8px] font-black uppercase opacity-60 leading-none">RANK</span>
                                <span className="text-lg font-black italic underline underline-offset-4 decoration-zinc-100">#{idx + 1}</span>
                             </div>

                             <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl font-black text-zinc-300 italic group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500 shadow-inner">
                                    {staff.user_id?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-zinc-950 leading-none mb-1 italic tracking-tighter uppercase underline decoration-zinc-50 underline-offset-8">Admin {cleanId(staff.user_id)}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald"></div>
                                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-emerald-600 transition-colors">OPERATIONAL_ACTIVE</span>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-zinc-50 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300 shadow-inner">
                                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-3">Claimed</div>
                                    <div className="text-3xl font-black italic tracking-tighter leading-none">{staff.claimed}</div>
                                </div>
                                <div className="p-6 bg-zinc-50 rounded-[1.5rem] border border-zinc-50 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-inner">
                                    <div className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-3">Closures</div>
                                    <div className="text-3xl font-black italic tracking-tighter leading-none">{staff.closed}</div>
                                </div>
                             </div>

                             <div className="space-y-3 px-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Efficiency Factor</div>
                                <div className="w-full h-1 bg-zinc-50 rounded-full overflow-hidden shadow-inner border border-zinc-50">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (staff.total / (totalActions / 2)) * 100)}%` }}
                                        className="h-full bg-zinc-950 rounded-full"
                                    ></motion.div>
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: The Trace (Admin Audit) */}
        <div className="xl:col-span-4 flex flex-col gap-6 min-h-0 overflow-hidden">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
                <h3 className="text-xl font-black text-zinc-950 mb-12 flex items-center gap-4 italic tracking-tighter underline underline-offset-8 decoration-zinc-50">
                    <History className="text-zinc-400" /> Operational Trace
                </h3>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10 relative">
                    <div className="absolute left-6 top-2 bottom-8 w-0.5 bg-zinc-50"></div>
                    
                    <AnimatePresence mode="popLayout">
                        {staffStats.slice(0, 10).map((staff, idx) => (
                            <motion.div 
                                key={staff.user_id + idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-12 group"
                            >
                                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border border-zinc-200 group-hover:border-zinc-950 group-hover:bg-zinc-950 transition-all z-10"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-zinc-950 italic group-hover:underline underline-offset-4 decoration-zinc-100 uppercase tracking-tighter">{cleanId(staff.user_id)}</span>
                                        <span className="text-[9px] font-black text-emerald-600 mt-1.5 italic tracking-[0.2em] font-mono leading-none">STABILIZED</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-zinc-950 italic leading-none">{staff.total}</div>
                                        <div className="text-[8px] font-black text-zinc-300 uppercase italic mt-1">ACTIONS</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                <div className="pt-8 mt-6 border-t border-zinc-50">
                    <div className="bg-zinc-950 p-8 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Zap size={140} /></div>
                        <h4 className="text-sm font-black italic mb-2 tracking-tighter">Reward the Best</h4>
                        <p className="text-[10px] opacity-40 mb-6 font-bold leading-relaxed pr-6">Instantly grant bonus High Core Nodes to the month's top performer node.</p>
                        <button className="w-full py-4 bg-white text-zinc-950 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all italic">REWARD_MUTATION</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
