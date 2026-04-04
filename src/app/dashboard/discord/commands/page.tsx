"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Command, Power, Edit3, ShieldCheck, Zap, 
  Search, Plus, Save, Trash2, Loader2, Sparkles, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CommandsPage() {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCommand, setEditingCommand] = useState<any | null>(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setLoading(true);
    // Fetch from dc_commands if exists, or mockup
    const { data } = await supabase.from("dc_commands").select("*").order("name", { ascending: true });
    if (data) setCommands(data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl animate-bounce">
                <Zap size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Logic Controller</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Command <span className="text-indigo-500/40">Overlord</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Hot-swap bot logic and adjust command responses without ever Touching the Java code.
          </p>
        </div>
        
        <div className="flex gap-3">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sunset-400" />
                <input 
                    type="text" 
                    placeholder="Search commands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-2xl glass-input w-64 font-bold text-sunset-900"
                />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">
                <Plus size={20} /> Add Command
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Command List Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
                <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-sunset-500" /></div>
            ) : commands.length === 0 ? (
                <div className="col-span-full glass-card p-12 text-center border-dashed border-2 border-sunset-200 opacity-50 font-bold italic text-sunset-900">
                    No commands found in database. The bot will use defaults.
                </div>
            ) : commands.map((cmd) => (
                <motion.div 
                    layoutId={cmd.id}
                    key={cmd.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Command size={18} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sunset-900">/{cmd.name}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase">SLASH</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={cmd.is_active} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>
                    
                    <p className="text-xs font-medium text-sunset-800/60 line-clamp-2 mb-4 leading-relaxed italic">
                        "{cmd.response_text || 'No response configured'}"
                    </p>

                    <div className="flex items-center justify-between border-t border-sunset-100 pt-4">
                        <div className="flex items-center gap-1 text-emerald-600">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{cmd.permission || 'Everyone'}</span>
                        </div>
                        <button 
                            onClick={() => setEditingCommand(cmd)}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Sidebar Status/Quick Actions */}
        <div className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 to-indigo-800 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                    <Zap size={140} />
                </div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 subrayado-glow">
                    <Sparkles size={20} /> System Core
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs font-semibold opacity-70">Global Toggle</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md">ENABLED</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                        <span className="text-xs font-semibold opacity-70">Total Logic Nodes</span>
                        <span className="text-xs font-black">{commands.length}</span>
                    </div>
                    <div className="pt-2">
                        <button className="w-full py-3 bg-white text-indigo-900 font-black text-xs rounded-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                            Sync Java Classes
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-[2rem] border border-sunset-200">
                <h4 className="font-bold text-sunset-900 mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-orange-500" /> Maintenance Mode</h4>
                <p className="text-xs font-medium text-sunset-800/60 leading-relaxed mb-4">
                    Enable maintenance mode to disable all non-admin commands instantly across the entire agency.
                </p>
                <button className="w-full py-3 border-2 border-orange-500 text-orange-600 font-bold text-xs rounded-xl hover:bg-orange-500 hover:text-white transition-all uppercase">
                    Enter Maintenance
                </button>
            </div>
        </div>
      </div>

      {/* Editor Modal (Skeleton) */}
      <AnimatePresence>
        {editingCommand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl border border-indigo-100 flex flex-col gap-6"
             >
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-indigo-950 tracking-tighter italic">RECONFIGURE /{editingCommand.name}</h3>
                    <button onClick={() => setEditingCommand(null)} className="p-2 text-slate-300 hover:text-red-500"><X size={24} /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-900/40 uppercase tracking-tighter">Response Message</label>
                        <textarea rows={4} className="w-full p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 focus:outline-none focus:ring-2 ring-indigo-500/20 font-medium text-indigo-900" defaultValue={editingCommand.response_text} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-900/40 uppercase tracking-tighter">Permission Role</label>
                            <select className="w-full p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 font-bold text-indigo-950">
                                <option>Everyone (@here)</option>
                                <option>Moderator</option>
                                <option>Founder</option>
                                <option>Agency HIGH</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-900/40 uppercase tracking-tighter">Command Type</label>
                            <div className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-400">SLASH ONLY</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> Push New Logic
                    </button>
                    <button className="p-4 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-colors">
                        <Trash2 size={24} />
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ size, className }: any) { return <AlertCircle size={size} className={className} /> }
