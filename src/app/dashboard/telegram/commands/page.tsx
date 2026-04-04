"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Power, Edit3, ShieldCheck, Zap, 
  Search, Plus, Save, Trash2, Loader2, Sparkles, AlertCircle, X, Terminal, Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramCommandsPage() {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCommand, setEditingCommand] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_commands").select("*").eq("platform", "telegram").order("name", { ascending: true });
    if (data) setCommands(data);
    setLoading(false);
  };

  const handleEdit = (cmd: any) => {
    setEditingCommand(cmd);
    setName(cmd.name || "");
    setResponse(cmd.response_text || "");
    setIsActive(cmd.is_active !== false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_commands").upsert({
            name: name.replace(/\//g, ''),
            response_text: response,
            is_active: isActive,
            platform: "telegram",
            updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "tg_command_updated",
            details: `Telegram Command /${name} was updated.`
        });

        alert("Telegram Logic Node Stabilized! /" + name + " is live. ✈️⚡");
        setEditingCommand(null);
        fetchCommands();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (cmdName: string) => {
    if (!confirm(`Delete Telegram path /${cmdName}?`)) return;
    await supabase.from("dc_commands").delete().eq("name", cmdName);
    fetchCommands();
  };

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl animate-spin-slow">
                <Share2 size={24} />
            </div>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest leading-none font-mono italic">N8N Logic Hub</span>
          </div>
          <h1 className="text-5xl font-black text-blue-950 tracking-tighter glow-text-blue">
            Command <span className="opacity-30">Pulse</span>
          </h1>
          <p className="text-lg font-medium text-blue-900/60 max-w-2xl italic leading-relaxed">
            Monitor and calibrate Telegram logic nodes. Each command is mirrored to your N8N flow hooks for real-time interaction.
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
            <div className="relative group">
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-hover:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Telegram nodes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-14 pr-8 py-5 rounded-[2rem] bg-white border border-blue-50 shadow-xl w-80 font-black text-blue-950 focus:ring-8 ring-blue-500/5 outline-none transition-all placeholder:italic"
                />
            </div>
            <button 
                onClick={() => handleEdit({ name: 'tele_cmd', response_text: '', is_active: true })}
                className="flex items-center gap-3 px-8 py-5 bg-blue-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 group italic"
            >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                NEW RELAY NODE
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Logic Grid */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
                <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
            ) : filteredCommands.length === 0 ? (
                <div className="col-span-full glass-card p-24 text-center border-dashed border-4 border-blue-100/50 bg-white/20 rounded-[4rem]">
                    <Zap size={60} className="text-blue-200 mb-6 mx-auto" />
                    <h3 className="text-2xl font-black text-blue-950 opacity-20 tracking-tighter uppercase italic">No active Telegram paths detected.</h3>
                </div>
            ) : filteredCommands.map((cmd) => (
                <motion.div 
                    layoutId={cmd.name}
                    key={cmd.name}
                    className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden bg-white/40 backdrop-blur-xl"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                                <Send size={22} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-blue-950 tracking-tighter italic">/{cmd.name}</h4>
                                <span className="text-[10px] font-black bg-blue-50 text-blue-400 px-3 py-1 rounded-full uppercase italic">N8N_NODE_SECURE</span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={cmd.is_active} className="sr-only peer" readOnly />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                        </label>
                    </div>
                    
                    <p className="text-sm font-medium text-blue-900 opacity-60 line-clamp-3 mb-10 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-1">
                        "{cmd.response_text || 'Default response placeholder...'}"
                    </p>

                    <div className="flex items-center justify-between border-t border-blue-50 pt-6 mt-auto">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic opacity-60">LOGIC_ACTIVE</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleEdit(cmd)}
                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                            <button 
                                onClick={() => handleDelete(cmd.name)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Right Status Panel */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[4rem] bg-gradient-to-br from-blue-950 to-blue-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                    <Send size={200} />
                </div>
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 subrayado-glow tracking-tighter italic">
                    <Sparkles size={24} className="text-sky-400 font-black" /> Telegram Shard
                </h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/10 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest">Logic Hub Status</span>
                        <span className="text-[10px] font-black bg-blue-400 text-blue-950 px-4 py-1.5 rounded-full shadow-lg italic">REACHABLE</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest">Active Paths</span>
                        <span className="text-2xl font-black italic">{commands.length}</span>
                    </div>
                    <div className="pt-4">
                        <button className="w-full py-5 bg-white text-blue-900 font-black text-xs rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] italic">
                            Refresh N8N Hooks
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal */}
      <AnimatePresence>
        {editingCommand && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-blue-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Send size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-blue-50 pb-8">
                    <h3 className="text-3xl font-black text-blue-950 italic tracking-tighter uppercase underline decoration-blue-200 underline-offset-8">
                        Adjust Node: /{name}
                    </h3>
                    <button onClick={() => setEditingCommand(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                </div>
                
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Node Path Label</label>
                        <input 
                            type="text" 
                            className="w-full p-5 rounded-3xl bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-8 ring-blue-500/10 font-black text-xl text-blue-950 italic" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="command_name"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Automated Payload</label>
                        <textarea 
                            rows={5} 
                            className="w-full p-6 rounded-[2.5rem] bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-8 ring-blue-500/10 font-bold text-blue-950 leading-relaxed italic" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter Telegram response..."
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Active Relay Link</label>
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={`w-full p-5 rounded-3xl font-black text-sm flex items-center justify-between transition-all border ${
                                isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'
                            }`}
                        >
                            <span className="italic">{isActive ? 'RELAY ONLINE' : 'NODE SEVERED'}</span>
                            <Power size={18} className={isActive ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 pt-6">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-6 bg-blue-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic group disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={22} />} 
                        PUSH LOGIC TO N8N
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
