"use client";

import { motion } from "framer-motion";
import { 
  Settings, Bot, ShieldCheck, Activity, 
  Save, Loader2, Zap, Sparkles, 
  Bell, FileText, UserPlus, Server,
  RefreshCcw, Terminal, HardDrive, Smartphone, Cpu
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
            details: "Core bot settings were recalibrated in the Nexus."
        });

        alert("Nexus synchronized! Central nervous system updated. 🧠⚡");
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl animate-pulse shadow-glow-indigo-small">
                <Settings size={24} />
            </div>
            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest leading-none font-mono italic">Central Nervous System</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Bot <span className="opacity-30">Nexus</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            The heart of the High Core entity. Calibrate global settings, link logical nodes, and monitor the bot's health across the entire network architecture.
          </p>
        </div>
        
        <button 
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-4 px-10 py-6 bg-indigo-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group disabled:opacity-50"
        >
            {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={22} className="group-hover:rotate-180 transition-transform duration-1000" />}
            SYNC NEXUS CORE
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Configuration Grid (Breathing Space) */}
        <div className="xl:col-span-8 space-y-8">
            <div className="glass-card p-12 rounded-[4rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl">
                 <div className="flex items-center justify-between mb-12 border-b border-indigo-50 pb-8">
                    <h3 className="text-3xl font-black text-sunset-950 italic tracking-tighter flex items-center gap-4 subrayado-glow cursor-default">
                        <Terminal className="text-indigo-500" /> Core Calibrations
                    </h3>
                    <div className="text-[10px] bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-black tracking-widest italic animate-pulse">ENCRYPTED SOURCE</div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
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
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Logical Prefix</label>
                            <input 
                                type="text"
                                maxLength={3}
                                value={botPrefix}
                                onChange={(e) => setBotPrefix(e.target.value)}
                                className="w-full p-5 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 font-black text-3xl text-indigo-900 focus:outline-none focus:ring-8 ring-indigo-500/5 transition-all text-center placeholder:opacity-10 italic"
                                placeholder="!"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
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
                        
                        <div className="p-8 bg-indigo-900 text-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black transition-all relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <ShieldCheck size={32} className="text-emerald-400 mb-4 group-hover:scale-125 transition-transform" />
                            <h4 className="text-sm font-black italic tracking-widest underline decoration-emerald-500 underline-offset-4 mb-2">SYSTEM HANDSHAKE</h4>
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] leading-relaxed italic">Synchronize settings with the Java backend process.</p>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card p-10 rounded-[3.5rem] bg-white border border-sunset-100 shadow-xl relative group overflow-hidden">
                    <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700"><HardDrive size={140} /></div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-inner"><Cpu size={28} /></div>
                        <div>
                             <h4 className="text-xl font-black text-sunset-950 italic tracking-tighter">Neural Capacity</h4>
                             <span className="text-[10px] font-black opacity-30 uppercase italic tracking-widest leading-none">CPU THREADS_04</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black opacity-30 uppercase italic">Memory Leak Shield</div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[88%] shadow-glow-indigo-small"></div></div>
                         </div>
                         <div className="flex justify-between items-center text-xs font-black text-sunset-950 italic">
                            <span>Last Flush</span>
                            <span className="text-emerald-600">04:22:11 AM</span>
                         </div>
                    </div>
                 </div>
                 
                 <div className="glass-card p-10 rounded-[3.5rem] bg-indigo-950 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute left-0 bottom-0 p-8 opacity-5 -scale-x-100"><Zap size={140} /></div>
                    <h4 className="text-2xl font-black italic border-b border-white/10 pb-6 mb-8 flex items-center gap-3 tracking-tighter subrayado-glow">
                        <Smartphone size={24} className="text-indigo-400" /> API Webhook Rack
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase italic tracking-widest">N8N Trigger Relay</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 italic">
                            <div className="flex items-center gap-3 opacity-30">
                                <Server size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Shard Matrix Ping</span>
                            </div>
                            <span className="text-[10px] font-black opacity-20 italic">0.14ms</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right: Operations Monitor (Nexus Pulse) */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl bg-white/40 backdrop-blur-xl flex flex-col min-h-[600px] group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <h3 className="text-2xl font-black text-sunset-950 mb-12 flex items-center gap-4 italic tracking-tighter subrayado-glow cursor-default">
                    <Activity className="text-indigo-500 animate-pulse" /> The Nexus Pulse
                </h3>

                <div className="space-y-12">
                     <div className="relative text-center">
                        <div className="w-56 h-56 rounded-full border-8 border-indigo-50 mx-auto flex items-center justify-center relative bg-white shadow-2xl">
                             <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-200 animate-spin-slow"></div>
                             <div className="text-center group">
                                <div className="text-4xl font-black text-indigo-600 italic tracking-tighter group-hover:scale-125 transition-transform">99.9<span className="text-sm opacity-30">%</span></div>
                                <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] italic mt-1 leading-none">Uptime_Metric</div>
                             </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-10">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-yellow-400" size={18} />
                                <span className="text-xs font-black text-sunset-950 uppercase italic tracking-widest">Active Neural Nodes</span>
                            </div>
                            <span className="text-2xl font-black text-indigo-900 italic">24/24</span>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Bot className="text-indigo-400" size={18} />
                                <span className="text-xs font-black text-sunset-950 uppercase italic tracking-widest">Sub-Process Threads</span>
                            </div>
                            <span className="text-2xl font-black text-indigo-900 italic">08</span>
                        </div>
                     </div>
                </div>
                
                <div className="mt-auto pt-10">
                    <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><AlertCircle size={80} /></div>
                        <h4 className="font-black text-indigo-950 mb-4 italic tracking-tighter flex items-center gap-3">
                           <Bell className="animate-swing" /> Emergency Protocol
                        </h4>
                        <p className="text-xs font-bold text-indigo-900 opacity-40 leading-relaxed mb-6 italic">Abort all active system threads immediately. High Core security failsafe.</p>
                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all">TERMINATE_ALL</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ size, className }: any) { return <div className={className}><Bot size={size} /></div> }
