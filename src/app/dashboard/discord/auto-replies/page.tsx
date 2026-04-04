"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Plus, Search, Trash2, Edit3, 
  Save, Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, Command, Layout,
  Terminal, History, Settings, TrendingUp, Filter, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AutoRepliesPage() {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingReply, setEditingReply] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_auto_responses").select("*").order("keyword", { ascending: true });
    if (data) setReplies(data);
    setLoading(false);
  };

  const handleEdit = (reply: any) => {
    setEditingReply(reply);
    setKeyword(reply.keyword || "");
    setResponse(reply.response_text || "");
    setIsActive(reply.is_active !== false);
  };

  const cleanId = (id: string) => {
    if (!id) return "NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase();
  };

  const handleSave = async () => {
    if (!keyword || !response) return alert("Keyword and response are required.");
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_auto_responses").upsert({
            keyword: keyword.toLowerCase().trim(),
            response_text: response,
            is_active: isActive,
            updated_at: new Date().toISOString()
        }, { onConflict: 'keyword' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "auto_reply_updated",
            details: `Neural trigger [${keyword}] was recalibrated.`
        });

        alert("Neural trigger synchronized! 🧠⚡");
        setEditingReply(null);
        fetchReplies();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (kw: string) => {
    if (!confirm(`Deep-delete the [${kw}] trigger?`)) return;
    await supabase.from("dc_auto_responses").delete().eq("keyword", kw);
    fetchReplies();
  };

  const filteredReplies = replies.filter(r => r.keyword.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <MessageSquare size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Semantic Trigger Matrix</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Neural <span className="text-zinc-300">Automations</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Design intelligent keyword Pattern-match triggers. all neural responses are processed instantly across the High Core environment.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Scan keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 rounded-[1.5rem] bg-white border border-zinc-100 shadow-sm w-72 font-black text-zinc-950 focus:ring-4 ring-zinc-950/5 outline-none transition-all placeholder:opacity-30"
                />
            </div>
            <button 
                onClick={() => handleEdit({ keyword: '', response_text: '', is_active: true })}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 italic tracking-widest"
            >
                <Plus size={20} /> INJECT TRIGGER
            </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Trigger List */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-hidden">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-4 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div className="pl-4">Pattern Anchor</div>
                    <div className="col-span-2">Payload Output</div>
                    <div className="text-right pr-4">Metrics</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : filteredReplies.length === 0 ? (
                        <div className="p-32 text-center opacity-10">
                            <Sparkles size={60} className="mx-auto mb-6" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Neural Silence. No active triggers.</h3>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredReplies.map((reply, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={reply.keyword}
                                    className="grid grid-cols-4 items-center p-4 rounded-2xl hover:bg-zinc-50 transition-all group"
                                >
                                    <div className="pl-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm">
                                            <Zap size={14} />
                                        </div>
                                        <div>
                                            <span className="font-black text-zinc-950 text-sm italic tracking-tighter uppercase">{reply.keyword}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${reply.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">{reply.is_active ? 'Active' : 'Disabled'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-zinc-500 leading-relaxed pr-10 truncate line-clamp-2 italic">
                                            "{reply.response_text}"
                                        </p>
                                    </div>
                                    <div className="text-right pr-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(reply)}
                                            className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={16} /></button>
                                        <button 
                                            onClick={() => handleDelete(reply.keyword)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Neural Hub Console */}
        <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"><Bot size={200} /></div>
                <h3 className="text-xl font-black mb-8 flex items-center gap-4 italic tracking-tighter subrayado-glow cursor-default">
                    <Sparkles className="text-zinc-400" /> Pattern Core Hub
                </h3>
                
                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest leading-none">Active Matrix Tiers</span>
                        <span className="text-3xl font-black italic tracking-tighter leading-none">{replies.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest leading-none">Hit Frequency</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full shadow-lg italic leading-none">OPTIMAL</span>
                    </div>
                    <div className="pt-4">
                        <button className="w-full py-5 bg-white text-zinc-950 font-black text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] italic leading-none">
                            RECALIBRATE NEURAL NODES
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1 group">
                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><Layout size={100} /></div>
                <h4 className="font-black text-xl text-zinc-950 mb-4 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100">
                    <History size={20} className="text-zinc-400" /> Trace Log
                </h4>
                <p className="text-[10px] font-bold text-zinc-400 leading-relaxed mb-8 italic pr-12">
                   Bypass all semantic triggers and lock the neural responses to manual mode in case of network instability. 
                </p>
                <button className="w-full py-4 bg-zinc-50 text-zinc-950 border border-zinc-100 font-black text-[10px] rounded-2xl shadow-sm hover:bg-zinc-950 hover:text-white transition-all uppercase tracking-widest italic group-hover:shadow-2xl">
                    FORCE BYPASS PROTOCOL
                </button>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal */}
      <AnimatePresence>
        {editingReply && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-zinc-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><MessageSquare size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-zinc-50 pb-8">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Zap className="text-zinc-400" /> Neural Calibration
                    </h3>
                    <button onClick={() => setEditingReply(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all shadow-sm"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 pr-2 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Pattern Match Trigger (Keyword)</label>
                        <input 
                            type="text" 
                            className="w-full p-5 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 italic transition-all" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g. price_node"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Neural Response Output (Payload)</label>
                        <textarea 
                            rows={4} 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-4 ring-zinc-950/5 font-bold text-zinc-900 leading-relaxed italic transition-all outline-none" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter the automated system response..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-red-500 animate-pulse'}`}></div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Status: {isActive ? 'ACTIVE_FLOW' : 'TERMINATED'}</span>
                    </div>
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border transition-all ${isActive ? 'text-red-500 border-red-100 hover:bg-red-50' : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                    >
                        {isActive ? 'SHUTDOWN' : 'ACTIVATE'}
                    </button>
                </div>

                <div className="pt-2">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-zinc-950 text-white font-black text-[10px] rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={22} />} 
                        RECALIBRATE NEURAL NODE
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
