"use client";

import { motion } from "framer-motion";
import { 
  Coins, TrendingUp, History, UserPlus, 
  MinusCircle, PlusCircle, Search, 
  Loader2, BadgeDollarSign, Wallet,
  Zap, Crown, ShieldCheck, Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PointsPage() {
  const [topPoints, setTopPoints] = useState<any[]>([]);
  const [pointsLog, setPointsLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Top Points
    const { data: points } = await supabase.from("dc_points").select("*").order("points", { ascending: false }).limit(5);
    // Fetch Logs
    const { data: logs } = await supabase.from("dc_points_log").select("*").order("created_at", { ascending: false }).limit(10);
    
    if (points) setTopPoints(points);
    if (logs) setPointsLog(logs);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl animate-spin-slow">
                <Coins size={20} />
            </div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Economy Hub</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            General <span className="text-amber-500/40">Wealth & Rep</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Control the server's economy, manage member reputation, and oversee community points distribution.
          </p>
        </div>
        
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95">
                <BadgeDollarSign size={20} /> Distribute Points
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Points Leaderboard & Reputation */}
        <div className="xl:col-span-7 space-y-6">
            <div className="glass-card rounded-[2.5rem] border border-white/60 shadow-2xl relative overflow-hidden bg-gradient-to-br from-white to-amber-50/20">
                <div className="p-8 border-b border-white/40 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-sunset-900 uppercase tracking-tight flex items-center gap-3 italic">
                        <Wallet className="text-amber-500" /> Richest Members
                    </h3>
                </div>

                <div className="p-2 overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-sunset-800/40 text-[10px] font-black uppercase tracking-widest px-6">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Balance</th>
                                <th className="px-6 py-4">Reputation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-amber-500" /></td></tr>
                            ) : topPoints.map((user, idx) => (
                                <tr key={user.user_id} className="group hover:bg-white/40 transition-all cursor-crosshair">
                                    <td className="px-6 py-4 font-black italic text-sunset-900 opacity-20 text-xl">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center font-black text-amber-500 border border-amber-100">💰</div>
                                            <div>
                                                <div className="font-bold text-sunset-900 text-sm">{user.user_name || "Member"}</div>
                                                <div className="text-[10px] text-sunset-800/40 font-mono italic">{user.user_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-amber-600 font-extrabold italic text-lg tracking-tighter">
                                            {user.points || 0} <Coins size={14} className="opacity-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-pink-500 font-black">
                                            <Heart size={14} fill="currentColor" className="opacity-20" /> {user.rep_points || 0} REP
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="glass-card p-6 rounded-[2.5rem] bg-indigo-950 text-white shadow-2xl group cursor-pointer border border-indigo-900/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={100} /></div>
                    <div className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mb-4">Maintenance Action</div>
                    <h4 className="text-xl font-bold mb-2">Full Economic Reset</h4>
                    <p className="text-xs opacity-60 mb-6 font-medium italic">Wipe all points and start fresh. IRREVERSIBLE.</p>
                    <button className="w-full py-3 bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">TERMINATE ALL WEALTH</button>
                 </div>
                 <div className="glass-card p-6 rounded-[2.5rem] bg-white border border-sunset-200 shadow-xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
                        <div className="text-right">
                            <div className="text-xs font-black text-sunset-800/40 uppercase">Total Circulating</div>
                            <div className="text-2xl font-black text-sunset-900">145,290.00</div>
                        </div>
                    </div>
                    <div className="pt-6 flex gap-2">
                        <button className="flex-1 py-3 bg-emerald-600 text-white font-bold text-[10px] rounded-xl hover:bg-emerald-700 transition-all uppercase">Airdrop Points</button>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right: Points History (The Scary Paper Trail) */}
        <div className="xl:col-span-5 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl bg-white/60 backdrop-blur-lg">
                <h3 className="text-xl font-black text-sunset-900 mb-8 flex items-center gap-2 subrayado-glow-orange">
                    <History className="text-amber-500" /> Wealth Logs
                </h3>

                <div className="space-y-6">
                    {loading ? (
                         <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" /></div>
                    ) : pointsLog.length === 0 ? (
                        <div className="p-8 text-center text-sunset-800/30 italic font-bold">No historical data available.</div>
                    ) : pointsLog.map((log, idx) => (
                        <div key={idx} className="flex gap-4 relative group">
                             <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                                    log.amount > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                                }`}>
                                    {log.amount > 0 ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
                                </div>
                                {idx !== pointsLog.length - 1 && <div className="w-[1px] h-full bg-slate-100 my-2"></div>}
                             </div>
                             <div className="flex-1 pb-6 translate-y-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-sunset-900 leading-none">{log.user_name || 'Member'}</span>
                                    <span className={`text-sm font-black italic tracking-tighter ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {log.amount > 0 ? '+' : ''}{log.amount}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-sunset-800/40 italic mb-2">"{log.reason || 'System adjustment'}"</p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-sunset-800/20">
                                    <ShieldCheck size={10} /> <span>ADMIN: {log.given_by || 'SYSTEM'}</span>
                                    <span className="opacity-50">•</span>
                                    <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                
                <button className="w-full py-4 mt-6 bg-sunset-50 text-sunset-600 font-black text-xs rounded-2xl hover:bg-sunset-100 hover:text-sunset-900 transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-sunset-100">
                    <Search size={14} /> View Audit Logs
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
