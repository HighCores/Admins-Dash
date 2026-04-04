"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Plus, Search, Trash2, Edit3, 
  Save, Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, Command, Layout
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
            details: `Auto-reply for keyword [${keyword}] was recalibrated.`
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
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl animate-pulse shadow-glow-purple-small">
                <MessageSquare size={24} />
            </div>
            <span className="text-xs font-black text-purple-500 uppercase tracking-widest leading-none font-mono italic">Semantic Trigger Matrix</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Auto <span className="opacity-30">Replies</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            Neural auto-response system. Define keyword patterns and automate the agent's logic flow for common inquiries.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="relative group">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Scan keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-14 pr-8 py-5 rounded-[2.5rem] bg-white border border-purple-50 shadow-xl w-80 font-black text-sunset-950 focus:ring-8 ring-purple-500/5 outline-none transition-all placeholder:italic"
                />
            </div>
            <button 
                onClick={() => handleEdit({ keyword: '', response_text: '', is_active: true })}
                className="flex items-center gap-4 px-8 py-5 bg-purple-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 group italic"
            >
                <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                NEW NEURAL NODE
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Trigger List */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
                <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-purple-500" size={40} /></div>
            ) : filteredReplies.length === 0 ? (
                <div className="col-span-full glass-card p-24 text-center border-dashed border-4 border-purple-100/50 bg-white/20 rounded-[4rem]">
                    <Sparkles size={60} className="text-purple-200 mb-6 mx-auto" />
                    <h3 className="text-2xl font-black text-sunset-900 opacity-20 tracking-tighter uppercase italic">The matrix is silent. No active auto-replies.</h3>
                </div>
            ) : filteredReplies.map((reply, idx) => (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={reply.keyword}
                    className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl hover:shadow-purple-500/10 transition-all group relative overflow-hidden bg-white/40 backdrop-blur-xl"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                                <Zap size={22} className="group-hover:animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-sunset-950 italic tracking-tighter uppercase">{reply.keyword}</h4>
                                <span className="text-[10px] font-black text-purple-400 bg-purple-50 px-2 py-0.5 rounded-lg leading-none italic">PATTERN_MATCH</span>
                            </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full shadow-glow-small ${reply.is_active ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    </div>
                    
                    <div className="p-6 bg-white/60 rounded-[2.5rem] border border-sunset-50 mb-8 max-h-32 overflow-y-auto custom-scrollbar italic leading-relaxed text-sm font-medium text-sunset-800/80">
                        "{reply.response_text}"
                    </div>

                    <div className="flex items-center justify-between border-t border-sunset-50 pt-6 mt-auto">
                        <div className="flex items-center gap-2 text-purple-600">
                             <Command size={14} className="opacity-40" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-40">Logic Activated</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleEdit(reply)}
                                className="p-3 bg-white text-sunset-900 rounded-xl hover:shadow-xl transition-all"><Edit3 size={16} /></button>
                            <button 
                                onClick={() => handleDelete(reply.keyword)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md"><Trash2 size={16} /></button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Neural Hub Console */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] bg-gradient-to-br from-purple-900 via-indigo-950 to-black text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Bot size={240} /></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-4 italic tracking-tighter subrayado-glow cursor-default">
                    <Sparkles className="text-yellow-400" /> Neural Sync Hub
                </h3>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-md border border-white/5">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest leading-none">Active Patterns</span>
                        <span className="text-3xl font-black italic italic ">{replies.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-md border border-white/5">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest leading-none">Global Accuracy</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full shadow-lg italic">OPTIMIZED</span>
                    </div>
                    <div className="pt-6">
                        <button className="w-full py-5 bg-white text-purple-950 font-black text-xs rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] italic leading-none">
                            RECALIBRATE LOGIC
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[3.5rem] border border-purple-100 bg-white/80 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-1000"><Layout size={100} /></div>
                <h4 className="font-black text-xl text-sunset-950 mb-4 flex items-center gap-3 italic tracking-tighter subrayado-glow cursor-default">
                    <AlertCircle size={22} className="text-orange-500" /> Logic Override
                </h4>
                <p className="text-xs font-bold text-sunset-800 opacity-40 leading-relaxed mb-8 italic">
                   Bypass all semantic triggers and lock the neural responses to manual mode only. 
                </p>
                <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-xs rounded-[2rem] shadow-2xl hover:scale-[1.03] transition-all uppercase tracking-widest italic leading-none">
                    TERMINATE AUTOMATION
                </button>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal */}
      <AnimatePresence>
        {editingReply && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-purple-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-purple-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><MessageSquare size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-purple-50 pb-8">
                    <h3 className="text-3xl font-black text-purple-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Zap className="text-purple-500" /> Neural Calibration
                    </h3>
                    <button onClick={() => setEditingReply(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-[1.5rem] transition-all"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 pr-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-purple-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Sensory Keyword Pattern</label>
                        <input 
                            type="text" 
                            className="w-full p-6 rounded-[2.5rem] bg-purple-50/50 border border-purple-100 font-black text-2xl text-purple-950 outline-none placeholder:opacity-10 italic" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g. price_list"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-purple-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Neural Response Payload</label>
                        <textarea 
                            rows={5} 
                            className="w-full p-8 rounded-[2.5rem] bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-8 ring-purple-500/5 font-bold text-purple-900 leading-relaxed italic" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter the automated response..."
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-7 bg-purple-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={22} />} 
                        CALIBRATE NEURAL PATHWAY
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
