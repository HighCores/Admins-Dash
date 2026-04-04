"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, ShieldCheck, Activity, Target, 
  Flame, Award, Loader2, Sparkles, 
  Zap, Clock, History, BarChart3, TrendingUp, ShieldAlert
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

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl animate-pulse">
                <Crown size={24} />
            </div>
            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest leading-none font-mono italic">High Command Monitoring</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Admin <span className="opacity-30">Glory & Stats</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            The hall of legends. Monitor the performance of your agency operators, measure their response efficiency, and reward the most dedicated moderators.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="px-8 py-5 bg-white border border-indigo-100 rounded-[2rem] shadow-xl flex items-center gap-4 group hover:border-indigo-400 transition-all cursor-default">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-inner"><Activity size={20} /></div>
                 <div>
                    <div className="text-[10px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">Global Load</div>
                    <div className="text-xl font-black text-sunset-950 leading-none">{totalActions} Actions</div>
                 </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: The Honor Grid (Staff Leaderboard) */}
        <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
                ) : staffStats.length === 0 ? (
                    <div className="col-span-full glass-card p-24 text-center border-dashed border-4 border-sunset-100/50 bg-white/20 rounded-[4rem]">
                        <ShieldAlert size={60} className="text-sunset-200 mb-6 mx-auto" />
                        <h3 className="text-2xl font-black text-sunset-900 opacity-20 tracking-tighter uppercase italic">No active operations detected from the administrative team.</h3>
                    </div>
                ) : staffStats.map((staff, idx) => (
                    <motion.div 
                        key={staff.user_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-10 rounded-[3.5rem] border border-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all bg-white/40 backdrop-blur-xl"
                    >
                         {/* Rank Badge */}
                         <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex flex-col items-center justify-center rounded-2xl shadow-2xl transform group-hover:rotate-12 transition-transform">
                            <span className="text-[8px] font-black uppercase opacity-60 leading-none">RANK</span>
                            <span className="text-xl font-black italic underline decoration-white/20 underline-offset-4">{idx + 1}</span>
                         </div>

                         <div className="flex items-center gap-6 mb-10">
                            <div className="w-18 h-18 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-indigo-300 italic group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                {staff.user_id?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-sunset-950 leading-none mb-1 italic tracking-tighter ">Admin Node_{staff.user_id?.split('-')[0]}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping"></div>
                                    <span className="text-[10px] font-black text-sunset-800/20 uppercase tracking-widest italic group-hover:text-emerald-600 transition-colors">OPERATIONAL_STATUS: ACTIVE</span>
                                </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-6 bg-white/60 rounded-[2rem] border border-sunset-50 group-hover:bg-sunset-900 group-hover:text-white transition-all duration-300">
                                <div className="text-[10px] font-black opacity-30 uppercase italic mb-2">Tickets Claimed</div>
                                <div className="text-3xl font-black italic tracking-tighter">{staff.claimed}</div>
                            </div>
                            <div className="p-6 bg-white/60 rounded-[2rem] border border-sunset-50 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                                <div className="text-[10px] font-black opacity-30 uppercase italic mb-2">Final Closures</div>
                                <div className="text-3xl font-black italic tracking-tighter">{staff.closed}</div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Efficiency Factor</div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (staff.total / (totalActions / 2)) * 100)}%` }}
                                    className="h-full bg-indigo-500 shadow-glow-indigo rounded-full"
                                ></motion.div>
                            </div>
                         </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Right: The Trace (Admin Audit) */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl flex flex-col min-h-[600px]">
                <h3 className="text-2xl font-black text-sunset-950 mb-12 flex items-center gap-4 italic tracking-tighter subrayado-glow cursor-default">
                    <History className="text-indigo-500" /> The Admin Trace
                </h3>

                <div className="flex-1 space-y-10 relative pl-4 border-l-2 border-indigo-50/50">
                    <AnimatePresence mode="popLayout">
                        {staffStats.slice(0, 8).map((staff, idx) => (
                            <motion.div 
                                key={staff.user_id + idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-white border-4 border-indigo-400 shadow-lg z-10 group-hover:scale-150 transition-transform"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-sunset-950 italic underline decoration-transparent group-hover:decoration-indigo-200 decoration-4 underline-offset-4 transition-all">Node_{staff.user_id?.split('-')[0]}</span>
                                        <span className="text-[10px] font-black text-emerald-600 mt-1 italic tracking-[0.2em] font-mono leading-none">STABILIZED TICKETS</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-indigo-600 transition-all italic leading-none">{staff.total}</div>
                                        <div className="text-[10px] font-black text-sunset-800/20 uppercase italic">ACTIONS_TOTAL</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                <div className="border-t border-indigo-50/50 pt-8 mt-10">
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-900 to-black text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group mb-8">
                        <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Zap size={140} /></div>
                        <h4 className="text-xl font-black italic mb-2 tracking-tighter">Reward the Best</h4>
                        <p className="text-sm opacity-50 mb-6 font-medium italic leading-relaxed">Instantly grant bonus High Core Points to the month's top performer node.</p>
                        <button className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all italic">INITIALIZE REWARD_MUTATION</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
