"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Plus, Trash2, Edit3, Save, 
  Loader2, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, 
  Layout, Monitor, Smartphone, Search,
  ChevronRight, Hash, Send, History, ArrowRight, TrendingUp, Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramLevelsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLevel, setEditingLevel] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [level, setLevel] = useState(1);
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    setLoading(true);
    const { data } = await supabase
        .from("dc_level_rewards")
        .select("*")
        .eq("guild_id", "telegram_global") // Specific identifier for Telegram
        .order("level", { ascending: true });
    
    if (data) setLevels(data);
    setLoading(false);
  };

  const handleEdit = (reward: any) => {
    setEditingLevel(reward);
    setLevel(reward.level || 1);
    setRoleId(reward.role_id || "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_level_rewards").upsert({
            id: editingLevel?.id,
            guild_id: "telegram_global",
            level,
            role_id: roleId,
        }, { onConflict: 'guild_id,level' });

        if (error) throw error;
        setEditingLevel(null);
        fetchLevels();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Defragment this level reward?")) return;
    await supabase.from("dc_level_rewards").delete().eq("id", id);
    fetchLevels();
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Star size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Neural Escalation Protocol</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Levels & <span className="text-blue-500">Rewards</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Calibrating logical progression and tier rewards for the Telegram High Core relay.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchLevels}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-blue-400 group-hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => handleEdit({ level: 1, role_id: '' })}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group italic tracking-widest uppercase"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Inject Tier
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Progression Grid (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-hidden">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-12 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      <div className="col-span-3 pl-4">Logical Tier</div>
                      <div className="col-span-6">Escalation Reward (Telegram ID)</div>
                      <div className="col-span-3 text-right pr-4">Metrics</div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                     ) : levels.length === 0 ? (
                         <div className="p-32 text-center opacity-10 italic uppercase font-black tracking-widest font-mono">Progression Ledger Empty</div>
                     ) : (
                         levels.map((reward, idx) => (
                             <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 key={reward.id}
                                 className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group"
                             >
                                 <div className="col-span-3 pl-4">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center font-black text-zinc-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                             {reward.level}
                                         </div>
                                         <span className="font-black text-zinc-950 uppercase italic tracking-tighter text-lg leading-none truncate">Level {reward.level}</span>
                                     </div>
                                 </div>
                                 <div className="col-span-6 flex items-center gap-4">
                                     <div className="p-2 bg-white rounded-lg border border-zinc-100 shadow-sm text-zinc-400"><Hash size={14} /></div>
                                     <code className="text-[10px] font-black text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100 shadow-inner truncate max-w-xs">{reward.role_id}</code>
                                 </div>
                                 <div className="col-span-3 text-right pr-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                         onClick={() => handleEdit(reward)}
                                         className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={16} /></button>
                                     <button 
                                         onClick={() => handleDelete(reward.id)}
                                         className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Escaltion Monitor (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><TrendingUp size={200} /></div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-4 italic tracking-tighter">
                    <TrendingUp className="text-zinc-400" /> Escalation Sync
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Defined Tiers</span>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">{levels.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Matrix Status</span>
                        <span className="text-[9px] font-black bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg shadow-lg italic leading-none">ALIGNED</span>
                    </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1 flex flex-col min-h-0 group">
                <h4 className="font-black text-xl text-zinc-950 mb-8 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                    <History size={18} className="text-zinc-400" /> Progression Trace
                </h4>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 relative overflow-hidden">
                     <div className="flex flex-col items-center gap-6 text-center relative z-10 opacity-20">
                        <Bot size={48} className="text-zinc-400 animate-pulse" />
                        <h5 className="text-sm font-black uppercase tracking-[0.2em] italic">Neural Flow Monitored</h5>
                     </div>
                </div>

                <div className="mt-8 text-center shrink-0">
                    <button className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Access Performance Ledger <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Reward Editor Modal */}
      <AnimatePresence>
        {editingLevel && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/10 animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-8 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><Star size={240} /></div>
                
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-3 py-2 border-b-2 border-zinc-950">
                        <Sparkles className="text-zinc-950" size={24} /> Escalation Calibrator
                    </h3>
                    <button onClick={() => setEditingLevel(null)} className="p-4 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-2xl transition-all"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Escalation Tier (Level)</label>
                        <input 
                            type="number" 
                            className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-4xl text-zinc-950 focus:bg-white outline-none italic transition-all text-center" 
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Target Logical Node (Role/Group ID)</label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                            <input 
                                type="text"
                                className="w-full pl-12 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-xl font-bold text-sm text-zinc-950 outline-none focus:bg-white transition-all shadow-inner"
                                placeholder="Telegram Group/Role Identifier..."
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl relative overflow-hidden flex items-center gap-5">
                         <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md"><Zap size={24} /></div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">PROG_SYNC_ACTIVE</div>
                            <div className="text-xs font-bold text-white/60 leading-relaxed italic pr-10">Ensuring perfect logical synchronization across all network shards.</div>
                         </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={20} />} 
                        Align Progression Node
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
