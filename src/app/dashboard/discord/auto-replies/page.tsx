"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Plus, Search, Trash2, Edit3, 
  Save, Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, Command, Layout,
  Terminal, History, Settings, TrendingUp, Filter, ArrowRight, ShieldCheck, Power
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/CustomToaster";

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
    // Legacy support: Include records where platform is NULL as they were likely Discord replies.
    const { data } = await supabase
        .from("dc_auto_responses")
        .select("*")
        .or('platform.eq.discord,platform.is.null')
        .order("keyword", { ascending: true });
    
    if (data) setReplies(data);
    setLoading(false);
  };

  const handleEdit = (reply: any) => {
    setEditingReply(reply);
    setKeyword(reply.keyword || "");
    setResponse(reply.response_text || "");
    setIsActive(reply.is_active !== false);
  };

  const handleSave = async () => {
    if (!keyword || !response) return showToast("Keyword and response are required.", true);
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

        showToast("Neural trigger synchronized! 🧠⚡");
        setEditingReply(null);
        fetchReplies();
    } catch (err: any) {
        showToast(err.message, true);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (kw: string) => {
    if (!confirm(`Deep-delete the [${kw}] trigger?`)) return;
    await supabase.from("dc_auto_responses").delete().eq("keyword", kw);
    fetchReplies();
    showToast("Neural trigger purged.");
  };

  const filteredReplies = replies.filter(r => r.keyword.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <MessageSquare size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Semantic Trigger Matrix</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Neural <span className="text-zinc-300">Automations</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Design intelligent keyword Pattern-match triggers for the High Core environment.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Scan keywords..."
                    className="pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm outline-none focus:ring-8 ring-zinc-950/5 transition-all font-bold text-sm w-72 italic"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchReplies}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => handleEdit({ keyword: '', response_text: '', is_active: true })}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group italic tracking-widest uppercase"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Inject Trigger
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Trigger Flow (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-12 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      <div className="col-span-4 pl-4">Pattern Anchor</div>
                      <div className="col-span-6">Payload Output</div>
                      <div className="col-span-2 text-right pr-4">Metrics</div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                     ) : filteredReplies.length === 0 ? (
                         <div className="p-32 text-center opacity-10">
                            <Sparkles size={60} className="mx-auto mb-6" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Neural Silence. No active triggers.</h3>
                         </div>
                     ) : (
                         filteredReplies.map((reply, idx) => (
                             <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 key={reply.keyword}
                                 className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group"
                             >
                                 <div className="col-span-4 pl-4 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm">
                                         <Zap size={14} />
                                     </div>
                                     <div className="min-w-0">
                                         <span className="font-black text-zinc-950 text-sm italic tracking-tighter uppercase truncate block">{reply.keyword}</span>
                                         <div className="flex items-center gap-1.5 mt-0.5">
                                             <div className={`w-1.5 h-1.5 rounded-full ${reply.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                             <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">{reply.is_active ? 'Active' : 'Disabled'}</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="col-span-6">
                                     <p className="text-xs font-bold text-zinc-500 leading-relaxed pr-10 truncate italic">
                                         "{reply.response_text}"
                                     </p>
                                 </div>
                                 <div className="col-span-2 text-right pr-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                         onClick={() => handleEdit(reply)}
                                         className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={16} /></button>
                                     <button 
                                         onClick={() => handleDelete(reply.keyword)}
                                         className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Automation Console (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><Bot size={200} /></div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-4 italic tracking-tighter">
                    <Sparkles className="text-zinc-400" /> Pattern Core
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Active Matrix</span>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">{replies.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Frequency</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg shadow-lg italic leading-none">HIGH-SYD</span>
                    </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1 group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><ShieldCheck size={120} /></div>
                <h4 className="font-black text-xl text-zinc-950 mb-6 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase">
                    <History size={18} className="text-zinc-400" /> Neural Trace
                </h4>
                <p className="text-[10px] font-bold text-zinc-400 leading-relaxed mb-8 italic pr-12">
                   Emergency override for all semantic triggers. Use only during severe network instability or agency calibration breaches. 
                </p>
                <div className="space-y-3">
                    <button className="w-full py-4 bg-zinc-50 text-zinc-950 border border-zinc-100 font-black text-[9px] rounded-2xl shadow-sm hover:bg-zinc-950 hover:text-white transition-all uppercase tracking-widest italic group-hover:shadow-2xl">
                        FORCE_BYPASS_LOGIC
                    </button>
                    <button className="w-full py-4 bg-white/50 text-zinc-300 font-black text-[9px] rounded-2xl hover:text-zinc-950 transition-all uppercase tracking-widest italic">
                        neural_audit_sweep
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Neural Editor Modal */}
      <AnimatePresence>
        {editingReply && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/10 animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-8 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><MessageSquare size={240} /></div>
                
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4 py-2 border-b-2 border-zinc-950">
                        <Zap className="text-zinc-950" size={24} /> Calibration
                    </h3>
                    <button onClick={() => setEditingReply(null)} className="p-4 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-2xl transition-all"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Pattern Anchor</label>
                            <input 
                                type="text" 
                                className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-lg text-zinc-950 focus:bg-white outline-none italic transition-all" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="price_check"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Flow Status</label>
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full p-4 rounded-xl transition-all border flex items-center justify-between group h-[58px] ${isActive ? 'bg-zinc-50 border-zinc-100 text-zinc-950' : 'bg-red-50 border-red-100 text-red-500'}`}
                            >
                                <span className="text-[9px] font-black uppercase tracking-widest">{isActive ? 'ACTIVE' : 'SEVERED'}</span>
                                <Power size={18} className={isActive ? 'text-emerald-500' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Neural Response Payload</label>
                        <textarea 
                            rows={4} 
                            className="w-full p-6 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white font-bold text-zinc-900 leading-relaxed italic transition-all outline-none resize-none" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter the automated system response..."
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                        Sync Neural Trigger
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
