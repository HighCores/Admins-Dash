"use client";

import { motion } from "framer-motion";
import { 
  Settings, Bot, ShieldCheck, Activity, 
  Save, Loader2, Zap, Sparkles, 
  Bell, FileText, UserPlus, Server,
  RefreshCcw, Terminal, HardDrive, Smartphone, Cpu,
  Globe, History, TrendingUp, ArrowRight
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
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <Settings size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Central Nervous System Configuration</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Bot <span className="text-zinc-300">Nexus</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            The heart of the High Core entity. Calibrate global settings, link logical nodes, and monitor the bot's health across the network architecture.
          </p>
        </div>
        
        <button 
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-4 px-10 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 group disabled:opacity-50 italic tracking-widest"
        >
            {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={22} className="group-hover:rotate-180 transition-transform duration-1000" />}
            SYNC NEXUS CORE
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Configuration Rack */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden p-12">
                 <div className="flex items-center justify-between mb-12 border-b border-zinc-50 pb-8">
                    <h3 className="text-xl font-black text-zinc-950 flex items-center gap-4 tracking-tighter italic underline underline-offset-8 decoration-zinc-100">
                        <Terminal className="text-zinc-400" /> Core Calibrations
                    </h3>
                    <div className="text-[9px] bg-zinc-950 text-white px-4 py-2 rounded-lg font-black tracking-widest uppercase">SECURE_SYNC</div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto custom-scrollbar px-2">
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
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Logical Prefix</label>
                            <input 
                                type="text"
                                maxLength={3}
                                value={botPrefix}
                                onChange={(e) => setBotPrefix(e.target.value)}
                                className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-4xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 transition-all text-center italic shadow-inner"
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
                        
                        <div className="p-10 bg-zinc-950 text-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black transition-all relative overflow-hidden h-44">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <ShieldCheck size={32} className="text-emerald-400 mb-4 group-hover:scale-125 transition-transform" />
                            <h4 className="text-sm font-black italic tracking-widest underline decoration-emerald-500 underline-offset-4 mb-2">SYSTEM HANDSHAKE</h4>
                            <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] leading-relaxed px-10 italic">Synchronize settings with the backend processor.</p>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right: Operations Monitor */}
        <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex flex-col group min-h-[400px]">
                <h3 className="text-xl font-black text-zinc-950 mb-12 flex items-center gap-4 italic tracking-tighter underline underline-offset-8 decoration-zinc-50">
                    <Activity className="text-zinc-400" /> The Nexus Pulse
                </h3>

                <div className="space-y-12 flex-1 flex flex-col justify-center">
                     <div className="relative text-center">
                        <div className="w-48 h-48 rounded-full border-4 border-zinc-50 mx-auto flex items-center justify-center relative bg-white shadow-xl">
                             <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-100 animate-spin-slow"></div>
                             <div className="text-center group">
                                <div className="text-4xl font-black text-zinc-950 italic tracking-tighter group-hover:scale-110 transition-transform">99.9<span className="text-sm opacity-20">%</span></div>
                                <div className="text-[9px] font-black opacity-20 uppercase tracking-[0.4em] italic mt-1 leading-none">Uptime_Metric</div>
                             </div>
                        </div>
                     </div>

                     <div className="space-y-6 px-4">
                        <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-zinc-400" size={16} />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Treads</span>
                            </div>
                            <span className="text-xl font-black text-zinc-950 italic tracking-tighter">24/24</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                            <div className="flex items-center gap-3">
                                <Bot className="text-zinc-400" size={16} />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Shard Latency</span>
                            </div>
                            <span className="text-xl font-black text-emerald-600 italic tracking-tighter">0.14ms</span>
                        </div>
                     </div>
                </div>
            </div>

            <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Bell size={140} /></div>
                <h4 className="text-lg font-black italic mb-2 tracking-tighter flex items-center gap-3 uppercase">
                   <Zap className="text-white" size={20} /> Emergency Protocol
                </h4>
                <p className="text-[10px] opacity-40 mb-8 font-bold leading-relaxed pr-10 italic">High Core security failsafe. Abort all active system threads immediately across all shards.</p>
                <button className="w-full py-4 bg-white text-zinc-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-zinc-100 transition-all italic underline decoration-zinc-200 underline-offset-4">
                    TERMINATE_ALL_SESSIONS
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
