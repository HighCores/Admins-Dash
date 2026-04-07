"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Plus, Search, Trash2, Edit3, 
  Save, Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, Command, Layout,
  Terminal, History, Settings, TrendingUp, Filter, ArrowRight, ShieldCheck, Power, Cpu
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
    const { data } = await supabase
        .from("dc_auto_responses")
        .select("*")
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
    if (!confirm(`Permanently delete the [${kw}] auto-reply?`)) return;
    await supabase.from("dc_auto_responses").delete().eq("keyword", kw);
    fetchReplies();
    showToast("Auto-reply removed.");
  };

  const filteredReplies = replies.filter(r => r.keyword.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <MessageSquare size={16} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Subsystem // Neural Auto-Response Node</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Automation <span className="text-emerald-500 crt-glow">Triggers</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Calibrating automatic semantic responses for specific primary keywords across the Highcore relay.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="relative group font-mono">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="SEARCH_REPLIES..."
                    className="pl-12 pr-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl outline-none focus:border-emerald-500/30 transition-all font-black text-[10px] w-72 uppercase tracking-widest placeholder:text-zinc-800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchReplies}
                className="p-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-emerald-500 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => handleEdit({ keyword: '', response_text: '', is_active: true })}
                className="flex items-center gap-4 px-8 py-4 bg-emerald-500 text-black font-black text-[10px] rounded-2xl shadow-[0_0_20px_#10b981] hover:scale-[1.02] hover:shadow-[0_0_30px_#10b981] transition-all uppercase tracking-widest italic group"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Add_Response
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Trigger Flow (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 h-full overflow-hidden">
             <div className="terminal-card flex-1 flex flex-col overflow-hidden bg-zinc-950/40 rounded-[2rem]">
                  <div className="grid grid-cols-12 p-6 border-b border-white/5 bg-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">
                      <div className="col-span-4 pl-4 flex items-center gap-2"><Zap size={10} className="text-emerald-500" /> Keyword</div>
                      <div className="col-span-6 flex items-center gap-2"><Terminal size={10} className="text-emerald-500" /> Response Message</div>
                      <div className="col-span-2 text-right pr-4">Total_Usage</div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                     ) : filteredReplies.length === 0 ? (
                         <div className="p-32 text-center opacity-10 font-mono">
                            <Sparkles size={60} className="mx-auto mb-6 text-emerald-500 animate-pulse" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">No active triggers detected.</h3>
                         </div>
                     ) : (
                         filteredReplies.map((reply, idx) => (
                             <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 key={reply.keyword}
                                 className="grid grid-cols-12 items-center p-4 rounded-xl transition-all border border-transparent hover:bg-emerald-500/[0.02] hover:border-emerald-500/10 group bg-white/[0.01]"
                             >
                                 <div className="col-span-4 pl-4 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-sm crt-glow">
                                         <Zap size={14} />
                                     </div>
                                     <div className="min-w-0 font-mono">
                                         <span className="font-black text-white text-sm tracking-tight uppercase truncate block italic group-hover:text-emerald-500 transition-colors">{reply.keyword}</span>
                                         <div className="flex items-center gap-1.5 mt-1">
                                             <div className={`w-1 h-2 rounded-full ${reply.is_active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}></div>
                                             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Status: {reply.is_active ? 'Optimal' : 'Severed'}</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="col-span-6">
                                     <p className="text-xs font-medium text-zinc-500 leading-relaxed pr-10 truncate font-sans">
                                         "{reply.response_text}"
                                     </p>
                                 </div>
                                 <div className="col-span-2 text-right pr-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                         onClick={() => handleEdit(reply)}
                                         className="p-3 bg-zinc-900 text-zinc-400 rounded-xl hover:text-emerald-500 transition-all border border-white/5 hover:border-emerald-500/20"><Edit3 size={16} /></button>
                                     <button 
                                         onClick={() => handleDelete(reply.keyword)}
                                         className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><Trash2 size={16} /></button>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Automation Console (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="terminal-card bg-zinc-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group shrink-0 border-white/10">
                <div className="absolute right-0 bottom-0 p-8 opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none text-emerald-500"><Bot size={200} /></div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-4 tracking-tighter uppercase italic border-b border-white/5 pb-4">
                    <Sparkles className="text-emerald-500" size={18} /> System Status
                </h3>
                
                <div className="space-y-4 relative z-10 font-mono">
                    <div className="flex justify-between items-center bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">Registered Messages</span>
                        <span className="text-2xl font-black text-white tracking-tighter leading-none italic crt-glow">{replies.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                        <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Sync Stability</span>
                        <span className="text-xs font-black text-emerald-500 px-3 py-1.5 rounded-lg leading-none crt-glow">ACTIVE_SYNC</span>
                    </div>
                </div>
             </div>

             <div className="terminal-card bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5 shadow-xl relative overflow-hidden flex-1 group">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none text-emerald-500"><ShieldCheck size={120} /></div>
                <h4 className="font-black text-xl text-white mb-6 flex items-center gap-3 italic tracking-tighter uppercase shrink-0 border-b border-white/5 pb-4">
                    <History size={18} className="text-emerald-500" /> Activity Log
                </h4>
                <p className="text-[10px] font-black text-zinc-600 leading-relaxed mb-8 italic pr-8 uppercase tracking-widest font-mono">
                   Security controls for the automation system. Use these options only to maintain the professional integrity of the agency services. 
                </p>
                <div className="space-y-3 font-mono">
                    <button className="w-full py-4 bg-zinc-950 text-emerald-500/30 border border-emerald-500/10 font-black text-[9px] rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-[0.4em] italic group-hover:border-emerald-500/30">
                        RESET_ALL_LOGIC
                    </button>
                    <button className="w-full py-4 bg-white/5 text-zinc-800 font-black text-[9px] rounded-2xl hover:text-zinc-400 transition-all uppercase tracking-[0.4em] italic">
                        system_audit_sweep
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Neural Editor Modal */}
      <AnimatePresence>
        {editingReply && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60 animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-zinc-900 rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-8 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45 text-emerald-500"><MessageSquare size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-4 italic">
                        <Zap className="text-emerald-500 crt-glow" size={24} /> Configuration
                    </h3>
                    <button onClick={() => setEditingReply(null)} className="p-4 text-zinc-600 hover:text-white bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 relative z-10 font-mono">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 leading-none italic">Keyword Anchor</label>
                            <input 
                                type="text" 
                                className="w-full p-4 rounded-xl bg-black/40 border border-white/5 font-black text-lg text-emerald-500 focus:bg-black/60 focus:border-emerald-500/30 outline-none italic transition-all uppercase placeholder:text-zinc-800" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="PRICE_LIST"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 leading-none italic">System Status</label>
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full p-4 rounded-xl transition-all border flex items-center justify-between group h-[60px] ${isActive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">{isActive ? 'ACTIVE' : 'DISABLED'}</span>
                                <Power size={18} className={isActive ? 'crt-glow' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 leading-none italic">Response Message</label>
                        <textarea 
                            rows={4} 
                            className="w-full p-6 rounded-xl bg-black/40 border border-white/5 focus:bg-black/60 focus:border-emerald-500/30 font-medium text-zinc-400 font-sans leading-relaxed italic transition-all outline-none resize-none placeholder:text-zinc-800" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="ENTER_RESPONSE_HERE..."
                        />
                    </div>
                </div>

                <div className="pt-4 font-mono">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-emerald-500 text-black font-black text-[11px] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_#10b981] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                        Save_Selection
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

