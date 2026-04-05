"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Bot, ShieldCheck, Activity, 
  Save, Loader2, Zap, Sparkles, 
  Bell, FileText, UserPlus, Server,
  RefreshCcw, Terminal, HardDrive, Smartphone, Cpu,
  Globe, History, TrendingUp, ArrowRight, ShieldAlert,
  Hash, Command, Layout, Monitor, Shield, Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function SetupPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Java-aligned Keys (Direct from Config.java)
  const [welcomeChannel, setWelcomeChannel] = useState("");
  const [logCategory, setLogCategory] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");
  const [transcriptChannel, setTranscriptChannel] = useState("");
  
  // Roles
  const [roleHigh, setRoleHigh] = useState("");
  const [roleFounder, setRoleFounder] = useState("");
  const [roleMod, setRoleMod] = useState("");
  const [roleStaff, setRoleStaff] = useState("");
  
  // Operational Channels
  const [chSignup, setChSignup] = useState("");
  const [chOrder, setChOrder] = useState("");
  const [chUpdates, setChUpdates] = useState("");
  const [chTicket, setChTicket] = useState("");
  
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
        setWelcomeChannel(find("WELCOME_CHANNEL_ID"));
        setLogCategory(find("LOG_CATEGORY_ID"));
        setTicketCategory(find("TICKET_CATEGORY_ID"));
        setTranscriptChannel(find("TRANSCRIPT_CHANNEL_ID"));
        
        setRoleHigh(find("ROLE_HIGH"));
        setRoleFounder(find("ROLE_FOUNDER"));
        setRoleMod(find("ROLE_MODERATOR"));
        setRoleStaff(find("ROLE_STAFF"));
        
        setChSignup(find("CH_STARTUP"));
        setChOrder(find("CH_ORDER"));
        setChUpdates(find("CH_UPDATES"));
        setChTicket(find("CH_TICKET"));
        
        setBotPrefix(find("BOT_PREFIX") || "!");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const updates = [
            { key: "WELCOME_CHANNEL_ID", value: welcomeChannel },
            { key: "LOG_CATEGORY_ID", value: logCategory },
            { key: "TICKET_CATEGORY_ID", value: ticketCategory },
            { key: "TRANSCRIPT_CHANNEL_ID", value: transcriptChannel },
            
            { key: "ROLE_HIGH", value: roleHigh },
            { key: "ROLE_FOUNDER", value: roleFounder },
            { key: "ROLE_MODERATOR", value: roleMod },
            { key: "ROLE_STAFF", value: roleStaff },
            
            { key: "CH_STARTUP", value: chSignup },
            { key: "CH_ORDER", value: chOrder },
            { key: "CH_UPDATES", value: chUpdates },
            { key: "CH_TICKET", value: chTicket },
            
            { key: "BOT_PREFIX", value: botPrefix },
        ];

        for (const update of updates) {
            await supabase.from("dc_settings").upsert(update, { onConflict: 'key' });
        }

        await supabase.from("dc_stats").insert({
            event_type: "settings_updated",
            details: "Core Java bot shards were recalibrated."
        });

        alert("System Synchronized! Shards updated. ⚡");
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Populate empty Logic Nodes with system defaults? (/ping, /help, etc)")) return;
    setSeeding(true);
    try {
        const defaultCommands = [
            { name: 'ping', response_text: 'Neural latency: **POLLING_STABLE** (0.12ms)', permission: 'everyone', platform: 'discord' },
            { name: 'help', response_text: '### High Core Navigation\n- `/setup`: Calibration Suite\n- `/panels`: Deployment Hub\n- `/levels`: Neural Progression', permission: 'everyone', platform: 'discord' },
            { name: 'info', response_text: '**High Core Agency**\nLogic Status: `OPERATIONAL`\nNodes: `ACTIVE`', permission: 'everyone', platform: 'discord' }
        ];

        for (const cmd of defaultCommands) {
            await supabase.from("dc_commands").upsert(cmd, { onConflict: 'name' });
        }

        alert("Default logic nodes injected successfully! ⚡");
    } catch (err: any) {
        alert(`SEEDING_ERR: ${err.message}`);
    } finally {
        setSeeding(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Settings size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Java Bot Nexus Calibration</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Nexus <span className="text-zinc-300">Setup</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Calibrating global settings and parent shards for the Java High Core relay.
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
                Sync Nexus Shards
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-visible">
        
        {/* Left: Configuration Rack (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-visible">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
                  <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <Terminal size={18} className="text-zinc-400" /> Core Calibrations
                     </h3>
                     <span className="bg-zinc-950 text-white text-[9px] px-3 py-1.5 rounded-lg font-black tracking-widest leading-none italic">SECURE_SYNC_STABLE</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Shard 1: Infrastructure */}
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.4em] mb-6 italic opacity-20">Infrastructure Shards</h4>
                            <DiscordSelect 
                                label="Log Shard (Category)"
                                type="category"
                                value={logCategory}
                                onChange={setLogCategory}
                                placeholder="Select log category..."
                            />
                            <DiscordSelect 
                                label="Ticket Nest (Category)"
                                type="category"
                                value={ticketCategory}
                                onChange={setTicketCategory}
                                placeholder="Select ticket category..."
                            />
                            <DiscordSelect 
                                label="Transcript Ledger (Channel)"
                                type="channel"
                                value={transcriptChannel}
                                onChange={setTranscriptChannel}
                                placeholder="Select transcript channel..."
                            />
                            <DiscordSelect 
                                label="Arrival Port (Welcome)"
                                type="channel"
                                value={welcomeChannel}
                                onChange={setWelcomeChannel}
                                placeholder="Select welcome channel..."
                            />
                             <div className="space-y-3">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Logical Prefix</label>
                                <input 
                                    type="text"
                                    maxLength={3}
                                    value={botPrefix}
                                    onChange={(e) => setBotPrefix(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 transition-all text-center italic"
                                    placeholder="!"
                                />
                            </div>
                        </div>

                        {/* Shard 2: Authority & Operations */}
                        <div className="space-y-10">
                             <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.4em] mb-6 italic opacity-20">Authority Shards</h4>
                             <DiscordSelect 
                                label="High Authority (ROLE_HIGH)"
                                type="role"
                                value={roleHigh}
                                onChange={setRoleHigh}
                                placeholder="Select High role..."
                            />
                            <DiscordSelect 
                                label="Founder (ROLE_FOUNDER)"
                                type="role"
                                value={roleFounder}
                                onChange={setRoleFounder}
                                placeholder="Select Founder role..."
                            />
                            <DiscordSelect 
                                label="Moderator (ROLE_MOD)"
                                type="role"
                                value={roleMod}
                                onChange={setRoleMod}
                                placeholder="Select Moderator role..."
                            />
                            
                            <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.4em] mt-10 mb-6 italic opacity-20">Operational Ports</h4>
                            <DiscordSelect 
                                label="Startup Signal (CH_STARTUP)"
                                type="channel"
                                value={chSignup}
                                onChange={setChSignup}
                            />
                            <DiscordSelect 
                                label="Order Feed (CH_ORDER)"
                                type="channel"
                                value={chOrder}
                                onChange={setChOrder}
                            />
                        </div>
                     </div>
                  </div>
             </div>
        </div>

        {/* Right: Operations Pulse (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-visible flex flex-col items-center justify-center group flex-1 shrink-0">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><Activity size={120} /></div>
                <h3 className="text-xl font-black text-zinc-950 mb-10 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                    <Activity size={18} className="text-zinc-400" /> Nexus Pulse
                </h3>

                <div className="w-full space-y-6">
                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Discord_Uplink</span>
                            <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${welcomeChannel ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                {welcomeChannel ? 'CONNECTED_STABLE' : 'OFFLINE_ERR'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Supabase_Matrix</span>
                            <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${settings.length > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-500/10 text-zinc-400'}`}>
                                {settings.length > 0 ? 'SYNCHRONIZED' : 'POLLING...'}
                            </span>
                        </div>
                    </div>

                    <button 
                        disabled={seeding}
                        onClick={handleSeedDefaults}
                        className="w-full flex flex-col items-center gap-4 p-8 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2.5rem] group hover:bg-zinc-950 hover:border-transparent transition-all shadow-inner relative overflow-visible"
                    >
                        <Database size={24} className={`text-zinc-300 ${seeding ? 'animate-spin' : 'group-hover:text-emerald-400 group-hover:scale-125'} transition-all`} />
                        <div className="text-center">
                            <span className="text-[10px] font-black italic tracking-widest text-zinc-950 group-hover:text-white uppercase block mb-1">Seed System Defaults</span>
                            <span className="text-[7px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-zinc-500">INJECT_LOGIC_NODES</span>
                        </div>
                    </button>
                </div>
             </div>

             <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] shadow-2xl relative overflow-visible group border border-zinc-900 shrink-0">
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none"><Bell size={140} /></div>
                <h4 className="text-sm font-black italic mb-2 tracking-tighter flex items-center gap-3 uppercase">
                   <ShieldAlert className="text-red-500 animate-pulse" size={18} /> Forced Shutdown
                </h4>
                <p className="text-[10px] opacity-40 mb-6 font-bold leading-relaxed pr-10 italic">High Core emergency security failsafe. Abort all active entity threads immediately across all network shards.</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  className="w-full py-4 bg-white text-zinc-950 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:bg-zinc-100 transition-all italic underline decoration-zinc-200 underline-offset-4"
                >
                  TERMINATE_ENTITY_SESSION
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
