"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Bot, ShieldCheck, Activity, 
  Save, Loader2, Zap, Sparkles, 
  Bell, FileText, UserPlus, Server,
  RefreshCcw, Terminal, HardDrive, Smartphone, Cpu,
  Globe, History, TrendingUp, ArrowRight, ShieldAlert,
  Hash, Command, Layout, Monitor, Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function SetupPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [logChannel, setLogChannel] = useState("");
  const [welcomeChannel, setWelcomeChannel] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [supportRole, setSupportRole] = useState("");
  const [botPrefix, setBotPrefix] = useState("!");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_settings").select("*");
    if (data) {
        setSettings(data);
        const find = (key: string) => data.find(s => s.key === key)?.value || "";
        setLogChannel(find("log_channel"));
        setWelcomeChannel(find("welcome_channel"));
        setAdminRole(find("admin_role"));
        setSupportRole(find("support_role"));
        setBotPrefix(find("bot_prefix") || "!");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const updates = [
            { key: "log_channel", value: logChannel },
            { key: "welcome_channel", value: welcomeChannel },
            { key: "admin_role", value: adminRole },
            { key: "support_role", value: supportRole },
            { key: "bot_prefix", value: botPrefix },
        ];

        for (const update of updates) {
            await supabase.from("dc_settings").upsert(update, { onConflict: 'key' });
        }

        await supabase.from("dc_stats").insert({
            event_type: "settings_updated",
            details: "Core bot settings were recalibrated in the High Core Nexus."
        });

        alert("Nexus synchronized! Central nervous system updated. 🧠⚡");
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Settings size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Central Nervous System Configuration</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Bot <span className="text-zinc-300">Nexus</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Calibrating global settings and monitoring the entity's health across the network architecture.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchSettings}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                disabled={saving}
                onClick={handleSave}
                className="flex items-center gap-4 px-10 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 group disabled:opacity-50 italic tracking-widest uppercase"
            >
                {saving ? <Loader2 className="animate-spin" /> : <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />}
                Sync Nexus Core
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Configuration Rack (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-hidden">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <Terminal size={18} className="text-zinc-400" /> Core Calibrations
                     </h3>
                     <span className="bg-zinc-950 text-white text-[9px] px-3 py-1.5 rounded-lg font-black tracking-widest leading-none italic">SECURE_SYNC_STABLE</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-10">
                            <DiscordSelect 
                                label="Incident Log Shard (Channel)"
                                type="channel"
                                value={logChannel}
                                onChange={setLogChannel}
                                placeholder="Select log channel..."
                            />
                            <DiscordSelect 
                                label="Arrival Port (Welcome Channel)"
                                type="channel"
                                value={welcomeChannel}
                                onChange={setWelcomeChannel}
                                placeholder="Select welcome channel..."
                            />
                             <div className="space-y-3">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Logical Command Prefix</label>
                                <input 
                                    type="text"
                                    maxLength={3}
                                    value={botPrefix}
                                    onChange={(e) => setBotPrefix(e.target.value)}
                                    className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-5xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 transition-all text-center italic shadow-inner"
                                    placeholder="!"
                                />
                            </div>
                        </div>

                        <div className="space-y-10">
                             <DiscordSelect 
                                label="High Authority Key (Admin Role)"
                                type="role"
                                value={adminRole}
                                onChange={setAdminRole}
                                placeholder="Select admin role..."
                            />
                            <DiscordSelect 
                                label="Field Agent Token (Support Role)"
                                type="role"
                                value={supportRole}
                                onChange={setSupportRole}
                                placeholder="Select support role..."
                            />
                            
                            <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-zinc-950 transition-all relative overflow-hidden h-48 shadow-inner">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12 transition-transform group-hover:scale-125 duration-1000"><Shield size={140} /></div>
                                <ShieldCheck size={32} className="text-zinc-300 mb-4 group-hover:text-emerald-400 group-hover:scale-125 transition-all" />
                                <h4 className="text-sm font-black italic tracking-widest text-zinc-950 group-hover:text-white underline underline-offset-4 mb-2 uppercase">System Matrix Sync</h4>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] leading-relaxed px-10 italic">Align all shards with the backend processor protocols.</p>
                            </div>
                        </div>
                     </div>
                  </div>
             </div>
        </div>

        {/* Right: Operations Pulse (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group flex-1 shrink-0">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><Activity size={120} /></div>
                <h3 className="text-xl font-black text-zinc-950 mb-10 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                    <Activity size={18} className="text-zinc-400" /> Nexus Pulse
                </h3>

                <div className="flex-1 flex flex-col items-center justify-center p-4 relative w-full">
                     <div className="w-48 h-48 rounded-full border-8 border-zinc-50 relative bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center group/pulse">
                          <div className="absolute inset-0 rounded-full border-4 border-dashed border-zinc-100 animate-spin-slow opacity-20"></div>
                          <div className="text-center">
                                <div className="text-5xl font-black text-zinc-950 italic tracking-tighter group-hover/pulse:scale-110 transition-transform">99.9<span className="text-sm opacity-20 ml-1">%</span></div>
                                <div className="text-[9px] font-black opacity-20 uppercase tracking-[0.4em] italic mt-2 leading-none">UPTIME_INDEX</div>
                          </div>
                     </div>
                </div>

                <div className="w-full space-y-4 mt-8">
                     <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Neural Shards</span>
                        <span className="text-lg font-black text-zinc-950 italic tracking-tighter uppercase">5 Active Nodes</span>
                     </div>
                     <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Sync Latency</span>
                        <span className="text-lg font-black text-emerald-600 italic tracking-tighter uppercase">0.14ms_Optimal</span>
                     </div>
                </div>
             </div>

             <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-zinc-900 shrink-0">
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none"><Bell size={140} /></div>
                <h4 className="text-sm font-black italic mb-2 tracking-tighter flex items-center gap-3 uppercase">
                   <ShieldAlert className="text-red-500 animate-pulse" size={18} /> Forced Shutdown
                </h4>
                <p className="text-[10px] opacity-40 mb-6 font-bold leading-relaxed pr-10 italic">High Core emergency security failsafe. Abort all active entity threads immediately across all network shards.</p>
                <button className="w-full py-4 bg-white text-zinc-950 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:bg-zinc-100 transition-all italic underline decoration-zinc-200 underline-offset-4">TERMINATE_ENTITY_CYCLE</button>
            </div>
        </div>
      </div>
    </div>
  );
}
