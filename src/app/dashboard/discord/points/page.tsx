"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, TrendingUp, History, UserPlus, 
  MinusCircle, PlusCircle, Search, 
  Loader2, BadgeDollarSign, Wallet,
  Zap, Crown, ShieldCheck, Heart, User, ArrowRight, X, Sparkles, RefreshCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PointsPage() {
  const [topPoints, setTopPoints] = useState<any[]>([]);
  const [pointsLog, setPointsLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Top Points
    const { data: points } = await supabase.from("dc_points").select("*").order("points", { ascending: false }).limit(6);
    // Fetch Logs
    const { data: logs } = await supabase.from("dc_points_log").select("*").order("created_at", { ascending: false }).limit(10);
    
    if (points) setTopPoints(points);
    if (logs) setPointsLog(logs);
    setLoading(false);
  };

  const handleAdjustPoints = async (isAdd: boolean) => {
    if (!adjusting || !amount || !reason) return alert("Fill all fields.");
    setSaving(true);
    try {
        const adjustment = isAdd ? parseInt(amount) : -parseInt(amount);
        const { data: currentData } = await supabase.from("dc_points").select("points").eq("user_id", adjusting.user_id).single();
        const newTotal = (currentData?.points || 0) + adjustment;

        // 1. Update points
        await supabase.from("dc_points").upsert({
            user_id: adjusting.user_id,
            guild_id: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "current_guild",
            points: Math.max(0, newTotal),
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,guild_id' });

        // 2. Log transaction
        await supabase.from("dc_points_log").insert({
            user_id: adjusting.user_id,
            guild_id: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "current_guild",
            amount: adjustment,
            reason: reason,
            given_by: "Agency Admin"
        });

        // 3. Log to global tech stats
        await supabase.from("dc_stats").insert({
            event_type: "points_adjusted",
            details: `User ${adjusting.user_id} received ${adjustment} nodes.`
        });

        alert("Financial nodes re-routed successfully! 💰");
        setAdjusting(null);
        setAmount("");
        setReason("");
        fetchData();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl animate-spin-slow">
                <Coins size={24} />
            </div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest leading-none font-mono italic">Liquid Wealth System</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            General <span className="opacity-30">Wealth & Rep</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            Oversee the flow of value across the High Core network. Invest in your top performers and regulate the agency's credit circulation.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Financial Leaderboard & Reputation */}
        <div className="xl:col-span-7 space-y-8">
            <div className="glass-card rounded-[3.5rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl">
                 <div className="p-10 border-b border-sunset-50 bg-gradient-to-br from-amber-50/20 to-transparent flex items-center justify-between">
                    <h3 className="text-2xl font-black text-sunset-900 uppercase tracking-tighter flex items-center gap-4 italic subrayado-glow-orange cursor-default">
                        <Wallet className="text-amber-500" /> The Sovereign Ledger
                    </h3>
                    <div className="p-3 bg-white shadow-xl rounded-2xl border border-amber-50 text-[10px] font-black text-amber-600 tracking-widest leading-none group cursor-pointer hover:bg-amber-600 hover:text-white transition-all">
                        <RefreshCcw size={12} className="inline mr-1" /> SYNC BALANCE
                    </div>
                 </div>

                 <div className="p-4 overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-sunset-800/40 text-[10px] font-black uppercase tracking-[0.3em] px-8 italic leading-none">
                                <th className="px-8 py-2">Node Rank</th>
                                <th className="px-8 py-2">Beneficiary</th>
                                <th className="px-8 py-2 text-right">Balance</th>
                                <th className="px-8 py-2 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-amber-500" size={40} /></td></tr>
                            ) : topPoints.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-sunset-900 opacity-20 italic font-black text-xl">NO WEALTH RECORDED. START INJECTION.</td></tr>
                            ) : topPoints.map((user, idx) => (
                                <tr key={user.user_id} className="group hover:bg-white transition-all cursor-crosshair">
                                    <td className="px-8 py-4 font-black italic text-sunset-100 text-3xl group-hover:text-sunset-900 transition-colors">{idx + 1}</td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-500 border border-amber-100 shadow-inner italic">💰</div>
                                            <div>
                                                <div className="font-black text-sunset-950 text-base italic leading-tight">{user.user_name || "Unknown_Entity"}</div>
                                                <div className="text-[10px] text-sunset-800/30 font-mono tracking-tighter">UID: {user.user_id?.split('-')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2 text-amber-600 font-extrabold italic text-2xl tracking-tighter leading-none">
                                                {user.points?.toLocaleString() || 0} <Coins size={16} className="opacity-30" />
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-pink-500 font-black tracking-widest italic opacity-60">
                                                <Heart size={10} fill="currentColor" className="opacity-30" /> {user.rep_points || 0} REP_NODES
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button 
                                            onClick={() => setAdjusting(user)}
                                            className="p-3 bg-sunset-50 text-sunset-900 rounded-2xl hover:bg-sunset-900 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0">
                                            <BadgeDollarSign size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card p-12 rounded-[4rem] bg-sunset-900 text-white shadow-2xl group cursor-pointer border border-white/5 relative overflow-hidden transition-all hover:scale-105 active:scale-95">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-45 transition-transform duration-700"><Zap size={140} /></div>
                    <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-4 italic">Maintenance Terminal</div>
                    <h4 className="text-2xl font-black italic mb-2 tracking-tighter">Liquidate All Assets</h4>
                    <p className="text-sm opacity-60 mb-10 font-medium italic leading-relaxed">Instantly reset global points back to zero. Proceed with extreme caution.</p>
                    <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-700 transition-all">TERMINATE TOTAL WEALTH</button>
                 </div>
                 <div className="glass-card p-10 rounded-[3.5rem] bg-white border border-sunset-100 shadow-2xl flex flex-col justify-between group hover:border-emerald-200 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[2rem] shadow-xl group-hover:rotate-12 transition-transform"><TrendingUp size={28} /></div>
                        <div className="text-right">
                            <div className="text-xs font-black text-sunset-800/40 uppercase tracking-widest italic leading-none mb-2">Net Circulation</div>
                            <div className="text-3xl font-black text-sunset-900 tracking-tighter leading-none italic">
                                {topPoints.reduce((acc, curr) => acc + curr.points, 0).toLocaleString()} <span className="text-sm opacity-20">HC_FLUX</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 flex gap-4">
                        <button className="flex-1 py-5 bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-emerald-700 transition-all uppercase tracking-widest hover:scale-105 active:scale-95 italic">Mass Infusion</button>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right: Asset History Rack (The Trace) */}
        <div className="xl:col-span-5 space-y-8">
            <div className="glass-card p-10 rounded-[4rem] border border-white/60 shadow-2xl bg-white/40 backdrop-blur-xl flex flex-col min-h-[600px]">
                <h3 className="text-2xl font-black text-sunset-950 mb-12 flex items-center gap-4 italic tracking-tighter subrayado-glow-orange-light cursor-default">
                    <History className="text-amber-500 animate-spin-slow" /> The Wealth Audit
                </h3>

                <div className="flex-1 space-y-10 relative pl-4">
                    <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-sunset-100/50"></div>
                    
                    {loading ? (
                         <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" size={32} /></div>
                    ) : pointsLog.length === 0 ? (
                        <div className="p-20 text-center text-sunset-900 opacity-20 italic font-black text-lg">NO TRANSACTIONS DETECTED.</div>
                    ) : pointsLog.map((log, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex gap-8 relative group"
                        >
                             <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-2xl relative z-10 transition-all group-hover:scale-110 ${
                                    log.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {log.amount > 0 ? <PlusCircle size={18} /> : <MinusCircle size={18} />}
                                </div>
                             </div>
                             <div className="flex-1 pb-4 translate-y-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-sunset-950 leading-none italic underline decoration-sunset-100 decoration-4 underline-offset-4">{log.user_name || 'Anonymous_Proxy'}</span>
                                        <span className="text-[10px] font-black opacity-30 mt-2 italic font-mono uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <span className={`text-2xl font-black italic tracking-tighter ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()} <span className="opacity-20 text-xs">HC</span>
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-sunset-800/60 italic leading-relaxed pl-4 border-l-4 border-sunset-50 mb-4 bg-sunset-50/30 py-2 rounded-r-xl">"{log.reason || 'Logic manual override'}"</p>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={12} className="text-amber-500 opacity-40" />
                                    <span className="text-[9px] font-black uppercase text-sunset-800/30 tracking-[0.2em] italic">Operator: {log.given_by || 'CORE_SYSTEM'}</span>
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
                
                <button className="w-full py-6 mt-12 bg-white text-sunset-900 border border-sunset-100 font-black text-xs rounded-[2.5rem] shadow-xl hover:bg-sunset-900 hover:text-white transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-3 italic group">
                    <Search size={16} className="group-hover:rotate-90 transition-transform" /> Access Full Audit Terminal
                </button>
            </div>
        </div>
      </div>

      {/* Financial Adjustment Modal (Scary Premium) */}
      <AnimatePresence>
        {adjusting && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-amber-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
                 animate={{ scale: 1, opacity: 1, rotate: 0 }}
                 exit={{ scale: 0.9, opacity: 0, rotate: 2 }}
                 className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-amber-100 flex flex-col gap-10 relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><BadgeDollarSign size={240} /></div>
                 
                 <div className="flex justify-between items-center border-b border-amber-100 pb-8">
                    <h3 className="text-3xl font-black text-amber-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Sparkles size={28} className="text-amber-500" /> Adjusting Node: <span className="underline decoration-4 underline-offset-8 decoration-amber-200">{adjusting.user_name}</span>
                    </h3>
                    <button onClick={() => setAdjusting(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-[1.5rem] transition-all"><X size={24} /></button>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-amber-900/40 uppercase tracking-[0.3em] px-4 italic font-mono">Infusion Count (HC Nodes)</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-6 h-20 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 focus:outline-none focus:ring-8 ring-amber-500/10 font-black text-4xl text-amber-950 placeholder:opacity-20 transition-all font-mono italic" 
                            placeholder="000,000"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-amber-900/40 uppercase tracking-[0.3em] px-4 italic font-mono">Justification Clause</label>
                        <textarea 
                            rows={3} 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-6 rounded-[2rem] bg-amber-50/50 border border-amber-100 focus:outline-none focus:ring-8 ring-amber-500/10 font-bold text-amber-900 leading-relaxed italic" 
                            placeholder="Specify reason for redistribution..."
                        />
                    </div>
                 </div>

                 <div className="flex gap-6 pt-4">
                    <button 
                        disabled={saving}
                        onClick={() => handleAdjustPoints(true)}
                        className="flex-1 h-20 bg-emerald-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <PlusCircle size={24} />} 
                        ADD FUNDS
                    </button>
                    <button 
                        disabled={saving}
                        onClick={() => handleAdjustPoints(false)}
                        className="flex-1 h-20 bg-red-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <MinusCircle size={24} />} 
                        REDUCE
                    </button>
                 </div>
               </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
