"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Command, Power, Edit3, ShieldCheck, Zap, 
  Search, Plus, Save, Trash2, Loader2, Sparkles, AlertCircle, X, Terminal
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function CommandsPage() {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCommand, setEditingCommand] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [permission, setPermission] = useState("everyone");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_commands").select("*").eq("platform", "discord").order("name", { ascending: true });
    if (data) setCommands(data);
    setLoading(false);
  };

  const handleEdit = (cmd: any) => {
    setEditingCommand(cmd);
    setName(cmd.name || "");
    setResponse(cmd.response_text || "");
    setPermission(cmd.permission || "everyone");
    setIsActive(cmd.is_active !== false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_commands").upsert({
            name: name.replace(/\//g, ''),
            response_text: response,
            permission: permission,
            is_active: isActive,
            platform: "discord",
            updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "command_updated",
            details: `Command /${name} was updated in the logic hub.`
        });

        alert("Logic node stabilized! /" + name + " is live. ⚡");
        setEditingCommand(null);
        fetchCommands();
    } catch (err: any) {
        alert(`Error saving command: ${err.message}`);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (cmdName: string) => {
    if (!confirm(`Are you sure you want to delete /${cmdName}?`)) return;
    await supabase.from("dc_commands").delete().eq("name", cmdName);
    fetchCommands();
  };

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full space-y-12 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl animate-spin-slow">
                <Terminal size={24} />
            </div>
            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest leading-none">Logic Hub</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Command <span className="opacity-30">Overlord</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic">
            Visual interface for your bot's neural pathways. Deploy, edit, and toggle commands with absolute precision.
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
            <div className="relative group">
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-400 group-hover:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search neural paths..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-14 pr-8 py-5 rounded-[2rem] bg-white border border-sunset-50 shadow-xl w-80 font-black text-sunset-900 focus:ring-4 ring-indigo-500/5 outline-none transition-all placeholder:italic"
                />
            </div>
            <button 
                onClick={() => handleEdit({ name: 'new_cmd', response_text: '', is_active: true })}
                className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group"
            >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                NEW LOGIC NODE
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Logic Grid with Breathing Space */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
                <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-sunset-500" size={40} /></div>
            ) : filteredCommands.length === 0 ? (
                <div className="col-span-full glass-card p-24 text-center border-dashed border-4 border-sunset-100/50 bg-white/20 rounded-[4rem]">
                    <Zap size={60} className="text-sunset-200 mb-6 mx-auto" />
                    <h3 className="text-2xl font-black text-sunset-900 opacity-20 tracking-tighter uppercase italic">No active commands found in the neural hub.</h3>
                </div>
            ) : filteredCommands.map((cmd) => (
                <motion.div 
                    layoutId={cmd.name}
                    key={cmd.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-8 rounded-[3rem] border border-white/60 shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden bg-white/40 backdrop-blur-xl"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                                <Command size={22} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-sunset-950 tracking-tighter italic">/{cmd.name}</h4>
                                <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase italic">Neural_Node_v1</span>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={cmd.is_active} className="sr-only peer" readOnly />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                        </label>
                    </div>
                    
                    <p className="text-sm font-medium text-sunset-800 opacity-60 line-clamp-3 mb-8 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                        "{cmd.response_text || 'Default response placeholder...'}"
                    </p>

                    <div className="flex items-center justify-between border-t border-sunset-50 pt-6 mt-auto">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{cmd.permission || 'EVERYONE'}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleEdit(cmd)}
                                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                            <button 
                                onClick={() => handleDelete(cmd.name)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Status Terminal */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-indigo-950 to-indigo-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                    <Zap size={200} />
                </div>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3 subrayado-glow tracking-tighter italic">
                    <Sparkles size={24} className="text-yellow-400" /> Agency Nexus
                </h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/10 p-5 rounded-[2rem] backdrop-blur-md border border-white/5">
                        <span className="text-xs font-black opacity-60 uppercase italic tracking-widest">Logic Core Status</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full shadow-lg">SYNCHRONIZED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-5 rounded-[2rem] backdrop-blur-md border border-white/5">
                        <span className="text-xs font-black opacity-60 uppercase italic tracking-widest">Active Paths</span>
                        <span className="text-2xl font-black italic">{commands.length}</span>
                    </div>
                    <div className="pt-4">
                        <button className="w-full py-5 bg-white text-indigo-900 font-black text-xs rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] italic">
                            Sync Java Handshake
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-sunset-100 bg-white/80 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700"><ShieldCheck size={100} /></div>
                <h4 className="font-black text-xl text-sunset-950 mb-4 flex items-center gap-3 italic tracking-tighter">
                    <AlertCircle size={22} className="text-orange-500" /> Maintenance Lockdown
                </h4>
                <p className="text-xs font-bold text-sunset-800 opacity-50 leading-relaxed mb-8 italic">
                    Emergency override for all non-admin logic nodes. Use only during severe network instability or agency breaches.
                </p>
                <button className="w-full py-5 border-4 border-orange-500/20 text-orange-600 font-black text-xs rounded-[2rem] hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest">
                    ENABLE LOCKDOWN
                </button>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal (Scary Premium Overlay) */}
      <AnimatePresence>
        {editingCommand && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-2xl p-12 shadow-2xl border border-indigo-100 flex flex-col gap-8 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Zap size={200} /></div>
                
                <div className="flex justify-between items-center border-b border-indigo-50 pb-6">
                    <h3 className="text-3xl font-black text-indigo-950 tracking-tighter italic uppercase underline decoration-indigo-200 underline-offset-8">
                        Adjust Node: /{name}
                    </h3>
                    <button onClick={() => setEditingCommand(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 flex-1 overflow-y-auto px-2 custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Node Path Label</label>
                        <input 
                            type="text" 
                            className="w-full p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100 focus:outline-none focus:ring-4 ring-indigo-500/10 font-black text-xl text-indigo-950" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="command_name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Automated Payload</label>
                        <textarea 
                            rows={5} 
                            className="w-full p-6 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 focus:outline-none focus:ring-4 ring-indigo-500/10 font-bold text-indigo-900 leading-relaxed" 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Enter command response..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DiscordSelect 
                            label="Auth Permission Token"
                            type="role"
                            value={permission}
                            onChange={setPermission}
                            placeholder="Select required role..."
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Active Linkage</label>
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full p-5 rounded-3xl font-black text-sm flex items-center justify-between transition-all border ${
                                    isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'
                                }`}
                            >
                                <span className="italic">{isActive ? 'SYSTEM ONLINE' : 'PATHWAY SEVERED'}</span>
                                <Power size={18} className={isActive ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 pt-6 mt-auto">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-6 bg-indigo-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={22} />} 
                        <span className="tracking-[0.2em]">PULSE LOGIC TO SYSTEM</span>
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
