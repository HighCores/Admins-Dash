"use client";

import { motion } from "framer-motion";
import { 
  Crown, ShieldCheck, Activity, Users, 
  BarChart3, Star, LogIn, ExternalLink,
  Zap, Loader2, Sparkles, AlertCircle, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPointsPage() {
  const [staffStats, setStaffStats] = useState<any[]>([]);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Staff Stats (Mocked or calculated from dc_stats)
    // For now, mockup of top performers
    setStaffStats([
      { name: "Founder X", role: "Founder", tickets: 145, rep: 98 },
      { name: "Dev Alpha", role: "H.I.G.H", tickets: 87, rep: 95 },
      { name: "Mod Gamma", role: "Moderator", tickets: 54, rep: 88 },
    ]);
    
    // Fetch Recent Admin Actions from dc_stats
    const { data: logs } = await supabase.from("dc_stats").select("*").order("created_at", { ascending: false }).limit(6);
    if (logs) setRecentActions(logs);
    
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20 text-sunset-900 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl animate-pulse">
                <Crown size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Command Center Elite</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight glow-text-sunset">
             Admin <span className="text-indigo-500/40">Glory & Stats</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
             Real-time monitoring of staff performance, ticket management, and reputation tracking for your agency elite.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Staff Leaderboard (The Elite) */}
        <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {staffStats.slice(0, 3).map((staff, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="glass-card p-6 rounded-[2.5rem] border border-white/60 shadow-2xl relative overflow-hidden group text-center"
                    >
                        {idx === 0 && <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">THE SOVEREIGN</div>}
                        <div className={`w-20 h-20 mx-auto mt-4 rounded-full flex items-center justify-center border-4 ${
                            idx === 0 ? 'border-orange-400 bg-orange-50' : 'border-indigo-100 bg-slate-50'
                        } text-3xl font-black text-indigo-950 mb-4 shadow-xl`}>
                            {staff.name.charAt(0)}
                        </div>
                        <h4 className="text-xl font-extrabold">{staff.name}</h4>
                        <span className="text-xs font-bold text-indigo-500/60 uppercase">{staff.role}</span>
                        
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-indigo-100">
                             <div>
                                <div className="text-[10px] font-black opacity-30 uppercase italic">Tickets</div>
                                <div className="text-xl font-black text-indigo-950">{staff.tickets}</div>
                             </div>
                             <div>
                                <div className="text-[10px] font-black opacity-30 uppercase italic">Rating</div>
                                <div className="text-xl font-black text-emerald-600">{staff.rep}%</div>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[3rem] border border-white/60 shadow-2xl bg-indigo-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Activity size={120} /></div>
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black flex items-center gap-2 subrayado-glow">
                        <Sparkles size={24} className="text-yellow-400" /> Performance Overlord
                    </h3>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md text-xs font-black uppercase">Live Updates Enabled</div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <div className="text-xs font-black opacity-40 uppercase tracking-widest leading-none">Response Time</div>
                            <div className="text-2xl font-black">~1.4 <span className="opacity-40 text-sm">MIN</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black opacity-40 uppercase tracking-widest leading-none">Global Solve Rate</div>
                            <div className="text-2xl font-black">98.2<span className="opacity-40 text-sm">%</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black opacity-40 uppercase tracking-widest leading-none">Staff Activity</div>
                            <div className="text-2xl font-black">12 <span className="opacity-40 text-sm">ON</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black opacity-40 uppercase tracking-widest leading-none">Agency Health</div>
                            <div className="text-2xl font-black text-emerald-400">CRITICAL</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Real-time Action Trace (The Trace) */}
        <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 bg-white/60 backdrop-blur-lg shadow-xl h-full flex flex-col">
                <h3 className="text-xl font-black text-indigo-950 mb-10 flex items-center gap-3">
                    <Zap className="text-yellow-500 animate-pulse" size={24} /> The Trace Log
                </h3>

                <div className="flex-1 space-y-8">
                    {loading ? (
                         <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500" /></div>
                    ) : recentActions.length === 0 ? (
                        <p className="text-center italic opacity-30 font-bold p-10">Waiting for first strike...</p>
                    ) : recentActions.map((action, idx) => (
                        <div key={idx} className="flex gap-4 group">
                             <div className="w-[2px] bg-indigo-100 relative translate-y-2">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 group-hover:scale-125 transition-transform"></div>
                             </div>
                             <div className="flex-1 pb-6 pl-4 border-b border-indigo-50 group-last:border-0">
                                <div className="flex justify-between items-start mb-1 text-xs">
                                    <span className="font-black text-indigo-950 uppercase">{action.event_type || 'CORE ACTION'}</span>
                                    <span className="opacity-30 font-mono italic">{new Date(action.created_at).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs font-bold text-sunset-800 opacity-60 italic mb-3">"{action.details || 'A internal action was performed'}"</p>
                                <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">ID</div>
                                   <span className="text-[10px] font-black text-indigo-600">STAFF: {action.user_id?.split('-')[0] || 'SYSTEM'}</span>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                
                <button className="w-full py-4 mt-6 bg-indigo-950 text-white font-black text-xs rounded-2xl shadow-xl shadow-indigo-900/10 hover:shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 group">
                    View Complete Artifact Log <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
