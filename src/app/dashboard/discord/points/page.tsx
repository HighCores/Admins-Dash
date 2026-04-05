"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, TrendingUp, History, UserPlus, 
  MinusCircle, PlusCircle, Search, 
  Loader2, BadgeDollarSign, Wallet,
  Zap, Crown, ShieldCheck, Heart, User, ArrowRight, X, Sparkles, RefreshCcw,
  BarChart3, Settings, Shield, Terminal
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
    const { data: points } = await supabase.from("dc_points").select("*").order("points", { ascending: false }).limit(10);
    const { data: logs } = await supabase.from("dc_points_log").select("*").order("created_at", { ascending: false }).limit(20);
    
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
    <div className="w-full h-full flex flex-col min-h-0 overflow-visible">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Coins size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Neural Wealth Liquidity hub</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            General <span className="text-zinc-300">Wealth Hub</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Regulating node balances and credit circulation across the network architecture.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchData}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-zinc-950 text-white rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-900 group">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors cursor-default">Liquidity Online</span>
            </div>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-visible">
        
        {/* Left: Ledger (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
                  <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <Wallet size={18} className="text-zinc-400" /> Neural Assets Registry
                     </h3>
                     <span className="bg-zinc-950 text-white text-[9px] px-3 py-1.5 rounded-lg font-black tracking-widest leading-none italic uppercase">Global_Circulation</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-12 p-6 border-b border-zinc-50 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                          <div className="col-span-1 pl-4">Rank</div>
                          <div className="col-span-5">Identity Node</div>
                          <div className="col-span-3">Asset Balance</div>
                          <div className="col-span-3 text-right pr-4">Logic Overlay</div>
                      </div>

                      <div className="p-2 space-y-1">
                         {loading ? (
                             <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" size={40} /></div>
                         ) : topPoints.length === 0 ? (
                             <div className="p-32 text-center opacity-10">
                                <History size={60} className="mx-auto" />
                                <p className="text-xl font-black uppercase italic tracking-tighter mt-4">Liquidity void. No nodes found.</p>
                             </div>
                         ) : (
                             topPoints.map((user, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={user.user_id}
                                    className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group"
                                >
                                    <div className="col-span-1 pl-4">
                                        <div className="w-9 h-9 flex items-center justify-center rounded-xl font-black bg-zinc-50 text-zinc-400 border border-zinc-100 shadow-inner text-xs italic">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-black text-[10px] uppercase shadow-sm italic">UN</div>
                                        <div className="min-w-0">
                                            <div className="font-black text-zinc-950 text-sm italic tracking-tighter truncate leading-none mb-1 group-hover:underline underline-offset-4 decoration-zinc-100">{user.user_name || "Cipher_User"}</div>
                                            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest truncate leading-none">NODE_{cleanId(user.user_id)}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-end gap-1.5">
                                            <span className="text-3xl font-black text-zinc-950 tracking-tighter italic leading-none">{user.points?.toLocaleString() || 0}</span>
                                            <span className="text-[10px] font-black text-zinc-300 mb-0.5 tracking-widest italic uppercase leading-none">HC_BITS</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-right pr-4">
                                        <button 
                                            onClick={() => setAdjusting(user)}
                                            className="p-3 bg-zinc-950 text-white rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 italic flex items-center gap-2 ml-auto text-[10px] font-black tracking-widest">
                                            CALIBRATE <BadgeDollarSign size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                             ))
                         )}
                      </div>
                  </div>
             </div>
        </div>

        {/* Right: Asset Trace Hub (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-visible group shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><ShieldCheck size={200} /></div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-4 italic tracking-tighter">
                    <Zap className="text-emerald-400" /> Fiscal Relay
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Active Matrix Flow</span>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">{topPoints.reduce((acc, curr) => acc + curr.points, 0).toLocaleString()} <span className="opacity-20 text-[10px]">HC</span></span>
                    </div>
                    <button className="w-full py-4 bg-red-600/10 text-red-500 font-black border border-red-500/20 text-[9px] rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                        TERMINATE ALL OVERRIDES
                    </button>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-visible flex-1 flex flex-col min-h-0 group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><History size={120} /></div>
                <h4 className="font-black text-xl text-zinc-950 mb-6 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                    <Terminal size={18} className="text-zinc-400" /> Fiscal Ledger
                </h4>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-5">
                    {pointsLog.length === 0 ? (
                        <div className="p-10 text-center opacity-10 italic uppercase font-black text-[10px] tracking-[0.3em]">No trace manifested</div>
                    ) : (
                        pointsLog.map((log, idx) => (
                            <div key={idx} className="flex gap-4 group/item">
                                 <div className="pt-1">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${log.amount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover/item:bg-emerald-600 group-hover/item:text-white' : 'bg-red-50 text-red-600 border-red-100 group-hover/item:bg-red-600 group-hover/item:text-white'}`}>
                                        {log.amount > 0 ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
                                    </div>
                                 </div>
                                 <div className="flex-1 border-b border-zinc-50 pb-4 group-last:border-0 min-w-0">
                                    <div className="flex justify-between items-start gap-4 mb-1">
                                        <span className="text-xs font-black text-zinc-950 uppercase italic truncate">{log.user_name || 'ANON_NODE'}</span>
                                        <span className={`text-sm font-black italic shrink-0 ${log.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {log.amount > 0 ? '+' : ''}{log.amount}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-400 italic line-clamp-1">"{log.reason}"</p>
                                 </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-50 text-center shrink-0">
                    <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Access Full Audit Log <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Asset Calibration Modal */}
      <AnimatePresence>
        {adjusting && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/10 animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-8 relative overflow-visible"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45 transition-transform group-hover:scale-125 duration-1000"><BadgeDollarSign size={240} /></div>
                
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex flex-col py-2 border-b-2 border-zinc-950">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-widest leading-none mb-1">Calibration Suite</span>
                        <span className="flex items-center gap-3 italic"><Sparkles className="text-zinc-950" size={24} /> {adjusting.user_name}</span>
                    </h3>
                    <button onClick={() => setAdjusting(null)} className="p-4 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-2xl transition-all"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Redirect Amount (HC_BITS)</label>
                        <input 
                            type="number" 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-4xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-20 italic transition-all" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="000,000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Fiscal Justification (Audit Log)</label>
                        <textarea 
                            rows={3} 
                            className="w-full p-6 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white font-bold text-zinc-900 leading-relaxed italic transition-all outline-none resize-none" 
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
                        className="py-5 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                         {saving ? <Loader2 className="animate-spin" /> : <PlusCircle size={18} />} 
                         INJECT ASSET
                    </button>
                    <button 
                        onClick={() => handleAdjustPoints(false)}
                        disabled={saving}
                        className="py-5 bg-zinc-50 text-zinc-950 border border-zinc-100 font-black text-[10px] rounded-2xl shadow-sm hover:text-white hover:bg-zinc-950 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        <MinusCircle size={18} /> EXTRACT ASSET
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
