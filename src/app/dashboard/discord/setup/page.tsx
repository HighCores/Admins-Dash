"use client";

import { motion } from "framer-motion";
import { 
  Settings, ShieldCheck, Hash, LogIn, 
  Database, Zap, Save, Globe, Lock, 
  Cpu, Activity, RefreshCcw, Loader2,
  Trash2, Plus, Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_settings").select("*");
    if (data) setSettings(data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-500/10 text-slate-600 rounded-xl animate-spin-slow">
                <Settings size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Core Configuration</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Bot <span className="text-slate-500/40">Nexus</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Configure the central neural system of your agency bot. Manage roles, channels, and global API keys.
          </p>
        </div>
        
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
                <RefreshCcw size={20} /> Force Reboot
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Core Settings (The Scary Engine) */}
        <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Role Mapping Card */}
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-2xl relative overflow-hidden group">
                     <ShieldCheck className="absolute -right-6 -top-6 text-indigo-500/10 rotate-12" size={120} />
                     <h3 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2 subrayado-glow">
                        <Lock size={20} className="text-indigo-600" /> Hierarchy Setup
                     </h3>
                     <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">H.I.G.H Management Role ID</label>
                            <input type="text" className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl font-bold text-indigo-950 focus:ring-2 ring-indigo-500/20 outline-none" placeholder="123456789..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">Founder Role ID</label>
                            <input type="text" className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl font-bold text-indigo-950 focus:ring-2 ring-indigo-500/20 outline-none" placeholder="123456789..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">Moderator Role ID</label>
                            <input type="text" className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl font-bold text-indigo-950 focus:ring-2 ring-indigo-500/20 outline-none" placeholder="123456789..." />
                        </div>
                     </div>
                </div>

                {/* Channel Mapping Card */}
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-2xl relative overflow-hidden group">
                     <Hash className="absolute -right-6 -top-6 text-sunset-500/10 rotate-12" size={120} />
                     <h3 className="text-xl font-black text-sunset-900 mb-6 flex items-center gap-2 subrayado-glow-orange">
                        <Globe size={20} className="text-sunset-600" /> Environment Map
                     </h3>
                     <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">Audit Logs Channel</label>
                            <input type="text" className="w-full p-4 bg-sunset-50/50 border border-sunset-100 rounded-2xl font-bold text-sunset-900 focus:ring-2 ring-sunset-500/20 outline-none" placeholder="987654321..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">Welcome Greeting Channel</label>
                            <input type="text" className="w-full p-4 bg-sunset-50/50 border border-sunset-100 rounded-2xl font-bold text-sunset-900 focus:ring-2 ring-sunset-500/20 outline-none" placeholder="987654321..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest px-1 italic">Ticket Transcript Archival</label>
                            <input type="text" className="w-full p-4 bg-sunset-50/50 border border-sunset-100 rounded-2xl font-bold text-sunset-900 focus:ring-2 ring-sunset-500/20 outline-none" placeholder="987654321..." />
                        </div>
                     </div>
                </div>
            </div>

            {/* Advanced Logic Sync */}
            <div className="glass-card p-10 rounded-[3rem] bg-indigo-950 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 bottom-0 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Cpu size={300} /></div>
                 <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                    <Sparkles className="text-yellow-400" /> Synaptic Sync
                 </h2>
                 <p className="text-white/60 mb-8 max-w-2xl font-medium italic">
                    Force a total synchronization between the Discord Guild, the Java Application Server, and this Dashboard. This will refresh all cached role states and channel IDs.
                 </p>
                 <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-white text-indigo-900 font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                        Initiate Global Pulse
                    </button>
                    <button className="flex-1 py-4 bg-indigo-600 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-indigo-500 transition-all uppercase tracking-widest">
                        Refactor Database
                    </button>
                 </div>
            </div>
        </div>

        {/* Right: Bot Status/Logs (The Scary Monitoring) */}
        <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl bg-white/60 backdrop-blur-lg">
                <h3 className="text-xl font-black text-sunset-900 mb-8 flex items-center gap-3">
                    <Activity className="text-emerald-500 animate-pulse" size={24} /> Hardware Health
                </h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                             <span className="text-xs font-bold text-sunset-900">Java Runtime</span>
                         </div>
                         <span className="text-[10px] font-black opacity-30">STABLE</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                             <span className="text-xs font-bold text-sunset-900">Supabase REST</span>
                         </div>
                         <span className="text-[10px] font-black opacity-30">PULSE: 24ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                             <span className="text-xs font-bold text-sunset-900">N8N Workflows</span>
                         </div>
                         <span className="text-[10px] font-black opacity-30 text-red-500">BUSY</span>
                    </div>
                </div>

                <hr className="my-8 border-sunset-50" />

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="text-slate-400">LAST SYNC</span>
                        <span className="text-sunset-900">04/04/2026 06:12:20</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-relaxed font-mono">
                        [CORE] Attempting handshake with N8N... SUCCESS.<br/>
                        [DB] Syncing dc_settings table... DONE (12 keys).<br/>
                        [API] Token scope: guilds.members.read VALID.
                    </div>
                </div>
                
                <button className="w-full py-4 mt-6 bg-sunset-900 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-[0.3em]">
                    Save Registry
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
