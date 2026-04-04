"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, TrendingUp, History, UserPlus, 
  MinusCircle, PlusCircle, Search, 
  Loader2, BadgeDollarSign, Wallet,
  Zap, Crown, ShieldCheck, Heart, User, ArrowRight, X, Sparkles, RefreshCcw,
  BarChart3, Settings, Shield
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
    const { data: points } = await supabase.from("dc_points").select("*").order("points", { ascending: false }).limit(6);
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

        await supabase.from("dc_points").upsert({
            user_id: adjusting.user_id,
            guild_id: "global",
            points: Math.max(0, newTotal),
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,guild_id' });

        await supabase.from("dc_points_log").insert({
            user_id: adjusting.user_id,
            guild_id: "global",
            amount: adjustment,
            reason: reason,
            given_by: "Administrator"
        });

        await supabase.from("dc_stats").insert({
            event_type: "points_adjusted",
            details: `Neural nodes for ${adjusting.user_name} were re-routed.`
        });

        alert("Financial flow synchronized! 💰");
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

  const cleanId = (id: string) => {
    if (!id) return "NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase().slice(0, 10);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <Coins size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Neural Wealth Liquidity</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            General <span className="text-zinc-300">Wealth Hub</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Oversee the flow of neural value across the network. Calibrate node balances and regulate the agency's credit circulation.
          </p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: The Sovereign Ledger */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between px-10">
                    <h3 className="text-xl font-black text-zinc-950 flex items-center gap-4 tracking-tighter italic">
                        <Wallet className="text-zinc-400" /> Neural Assets Registry
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-950 font-black text-[9px] uppercase bg-white px-4 py-2 rounded-xl shadow-sm border border-zinc-100 italic">
                        <BarChart3 size={14} className="text-emerald-500" /> SYNC_REALTIME
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-5 p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">
                        <div className="pl-4">Node Rank</div>
                        <div className="col-span-2">Beneficiary</div>
                        <div>Balance</div>
                        <div className="text-right pr-4">Operations</div>
                    </div>
                    
                    <div className="p-2">
                        {loading ? (
                            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" size={40} /></div>
                        ) : topPoints.length === 0 ? (
                            <div className="p-32 text-center opacity-10">
                                <History size={60} className="mx-auto" />
                                <p className="text-xl font-black uppercase italic tracking-tighter mt-4">Liquidity void. No nodes found.</p>
                            </div>
                        ) : topPoints.map((user, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={user.user_id} 
                                className="grid grid-cols-5 items-center p-4 rounded-2xl hover:bg-zinc-50 transition-all group"
                            >
                                <div className="pl-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl font-black bg-white text-zinc-400 border border-zinc-100 shadow-sm text-sm italic">
                                        #{idx + 1}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-black text-xs">BT</div>
                                     <div>
                                         <div className="font-black text-zinc-950 text-sm italic tracking-tighter leading-none mb-1 group-hover:underline underline-offset-4 decoration-zinc-100">{user.user_name || "Cipher_User"}</div>
                                         <div className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest leading-none">NODE_{cleanId(user.user_id)}</div>
                                     </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-zinc-950 font-black text-2xl tracking-tighter italic">
                                        {user.points?.toLocaleString() || 0} <span className="text-[10px] opacity-20 mr-1 italic">HC</span>
                                    </div>
                                </div>
                                <div className="text-right pr-4">
                                    <button 
                                        onClick={() => setAdjusting(user)}
                                        className="p-3 bg-zinc-950 text-white rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100">
                                        <BadgeDollarSign size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Asset Trace Hub */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"><ShieldCheck size={200} /></div>
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-6 flex items-center gap-3 tracking-tighter italic">
                    <Zap className="text-white" size={20} /> Fiscal Control
                 </h3>
                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest leading-none">Total Circulation</span>
                        <span className="text-xl font-black italic tracking-tighter leading-none">{topPoints.reduce((acc, curr) => acc + curr.points, 0).toLocaleString()} <span className="opacity-20 text-[10px]">HC</span></span>
                    </div>
                    <button className="w-full py-4 bg-red-600 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                        TERMINATE ALL ASSETS
                    </button>
                 </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
                <h4 className="font-black text-xl text-zinc-950 mb-8 flex items-center gap-3 tracking-tighter underline underline-offset-8 decoration-zinc-50">
                    <History size={20} className="text-zinc-400" /> Fiscal Trace
                </h4>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                    {pointsLog.map((log, idx) => (
                        <div key={idx} className="flex gap-4 group">
                             <div className="pt-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${log.amount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {log.amount > 0 ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
                                </div>
                             </div>
                             <div className="flex-1 border-b border-zinc-50 pb-4 group-last:border-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-black text-zinc-950 uppercase italic group-hover:underline decoration-zinc-100">{log.user_name || 'ANON_NODE'}</span>
                                    <span className={`text-sm font-black italic ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {log.amount > 0 ? '+' : ''}{log.amount}
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-zinc-400 italic">"{log.reason}"</p>
                             </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-zinc-50 text-center">
                    <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Access Financial Ledger <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
             </div>
        </div>
      </div>

      <AnimatePresence>
        {adjusting && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-zinc-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><BadgeDollarSign size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-zinc-50 pb-8">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Sparkles className="text-zinc-400" /> Calibration: <span className="underline underline-offset-8 decoration-zinc-50">{adjusting.user_name}</span>
                    </h3>
                    <button onClick={() => setAdjusting(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all shadow-sm"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Redirect Amount (HC)</label>
                        <input 
                            type="number" 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-4xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 italic transition-all" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="000,000"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Fiscal Justification</label>
                        <textarea 
                            rows={3} 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-4 ring-zinc-950/5 font-bold text-zinc-900 leading-relaxed italic transition-all outline-none" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Specify reason for redistribution..."
                        />
                    </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-6">
                    <button 
                        onClick={() => handleAdjustPoints(true)}
                        disabled={saving}
                        className="py-6 bg-zinc-950 text-white font-black text-[10px] rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic leading-none"
                    >
                         {saving ? <Loader2 className="animate-spin" /> : "INJECT ASSET"}
                    </button>
                    <button 
                        onClick={() => handleAdjustPoints(false)}
                        disabled={saving}
                        className="py-6 bg-zinc-50 text-zinc-950 border border-zinc-100 font-black text-[10px] rounded-3xl shadow-sm hover:bg-zinc-950 hover:text-white transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic leading-none"
                    >
                        EXTRACT ASSET
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
