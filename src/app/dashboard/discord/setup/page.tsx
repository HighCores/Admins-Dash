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
import { showToast } from "@/components/CustomToaster";

export default function SetupPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Bot Config Keys
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
  const [chStartup, setChStartup] = useState("");
  const [chOrder, setChOrder] = useState("");
  const [chUpdates, setChUpdates] = useState("");
  const [chTicket, setChTicket] = useState("");
  
  const [botPrefix, setBotPrefix] = useState("!");

  const GUILD_ID = "global";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    // Fetch specifically for the 'global' guild to match Bot sync service
    const { data } = await supabase.from("dc_settings").select("*").eq("guild_id", GUILD_ID);
    
    if (data) {
        setSettings(data);
        const find = (k: string) => data.find(s => s.key.toUpperCase() === k.toUpperCase())?.value || "";
        
        setWelcomeChannel(find("WELCOME_CHANNEL_ID"));
        setLogCategory(find("LOG_CATEGORY_ID"));
        setTicketCategory(find("TICKET_CATEGORY_ID"));
        setTranscriptChannel(find("TRANSCRIPT_CHANNEL_ID"));
        
        setRoleHigh(find("ROLE_HIGH"));
        setRoleFounder(find("ROLE_FOUNDER"));
        setRoleMod(find("ROLE_MODERATOR"));
        setRoleStaff(find("ROLE_STAFF"));
        
        setChStartup(find("CH_STARTUP"));
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
            { guild_id: GUILD_ID, key: "WELCOME_CHANNEL_ID", value: welcomeChannel },
            { guild_id: GUILD_ID, key: "LOG_CATEGORY_ID", value: logCategory },
            { guild_id: GUILD_ID, key: "TICKET_CATEGORY_ID", value: ticketCategory },
            { guild_id: GUILD_ID, key: "TRANSCRIPT_CHANNEL_ID", value: transcriptChannel },
            
            { guild_id: GUILD_ID, key: "ROLE_HIGH", value: roleHigh },
            { guild_id: GUILD_ID, key: "ROLE_FOUNDER", value: roleFounder },
            { guild_id: GUILD_ID, key: "ROLE_MODERATOR", value: roleMod },
            { guild_id: GUILD_ID, key: "ROLE_STAFF", value: roleStaff },
            
            { guild_id: GUILD_ID, key: "CH_STARTUP", value: chStartup },
            { guild_id: GUILD_ID, key: "CH_ORDER", value: chOrder },
            { guild_id: GUILD_ID, key: "CH_UPDATES", value: chUpdates },
            { guild_id: GUILD_ID, key: "CH_TICKET", value: chTicket },
            
            { guild_id: GUILD_ID, key: "BOT_PREFIX", value: botPrefix },
        ];

        // Batch UPSERT into a single robust call
        const { error } = await supabase.from("dc_settings").upsert(updates, { onConflict: 'key,guild_id' });

        if (error) throw error;

        await fetchSettings(); // Refresh from DB
        showToast("Settings synchronized! ⚡");
    } catch (err: any) {
        showToast("Sync Failed: " + err.message, true);
    } finally {
        setSaving(false);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
        const defaultCommands = [
            { name: 'ping', response_text: 'Latency: **STABLE**', permission: 'everyone', platform: 'discord' },
            { name: 'help', response_text: '### Agency Commands\n- `/setup`: Bot Settings\n- `/messenger`: Broadcaster', permission: 'everyone', platform: 'discord' }
        ];

        const { error } = await supabase.from("dc_commands").upsert(defaultCommands, { onConflict: 'name' });
        if (error) throw error;

        showToast("Logic defaults injected! ⚡");
    } catch (err: any) {
        showToast(`Error: ${err.message}`, true);
    } finally {
        setSeeding(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-visible">
      
      {/* Header - Minimalist */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 lg:px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg">
                <Settings size={18} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Agency Bot Setup</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tight">
            Bot <span className="text-zinc-300">Settings</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-500 max-w-2xl">
             Manage global configurations, channels, and roles for your agency bot.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchSettings}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-300 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                disabled={saving}
                onClick={handleSave}
                className="flex items-center gap-5 px-10 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 group disabled:opacity-50 tracking-widest uppercase italic"
            >
                {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Sync Settings
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0 overflow-visible lg:px-4 pb-20">
        
        {/* Left: Configuration Rack */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-visible">
             <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
                  <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <h3 className="text-lg font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        Config Layer
                     </h3>
                     <span className="bg-emerald-500 text-white text-[9px] px-3 py-1.5 rounded-lg font-black tracking-widest shadow-lg">STABLE</span>
                  </div>

                  <div className="flex-1 p-12 space-y-12 overflow-visible">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-visible">
                        {/* Shard 1: Infrastructure */}
                        <div className="space-y-12 overflow-visible">
                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4 italic">General Channels</h4>
                            
                            <DiscordSelect 
                                label="Log Category"
                                type="category"
                                value={logCategory}
                                onChange={setLogCategory}
                                placeholder="Select category..."
                            />
                            <DiscordSelect 
                                label="Ticket Category"
                                type="category"
                                value={ticketCategory}
                                onChange={setTicketCategory}
                                placeholder="Select category..."
                            />
                            <DiscordSelect 
                                label="Transcript Channel"
                                type="channel"
                                value={transcriptChannel}
                                onChange={setTranscriptChannel}
                                placeholder="Select channel..."
                            />
                            <DiscordSelect 
                                label="Welcome Channel"
                                type="channel"
                                value={welcomeChannel}
                                onChange={setWelcomeChannel}
                                placeholder="Select channel..."
                            />

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-4 font-mono leading-none italic">Bot Prefix</label>
                                <input 
                                    type="text"
                                    maxLength={3}
                                    value={botPrefix}
                                    onChange={(e) => setBotPrefix(e.target.value)}
                                    className="w-full p-5 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold text-center text-3xl text-zinc-950 focus:bg-white outline-none placeholder:opacity-10 transition-all italic shadow-inner"
                                    placeholder="!"
                                />
                            </div>
                        </div>

                        {/* Shard 2: Authority & Operations */}
                        <div className="space-y-12 overflow-visible">
                             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4 italic">Standard Roles</h4>
                             <DiscordSelect 
                                label="Admin Role"
                                type="role"
                                value={roleHigh}
                                onChange={setRoleHigh}
                                placeholder="Select role..."
                            />
                            <DiscordSelect 
                                label="Founder Role"
                                type="role"
                                value={roleFounder}
                                onChange={setRoleFounder}
                                placeholder="Select role..."
                            />
                            <DiscordSelect 
                                label="Moderator Role"
                                type="role"
                                value={roleMod}
                                onChange={setRoleMod}
                                placeholder="Select role..."
                            />
                            
                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mt-8 mb-4 italic">Operational Channels</h4>
                            <DiscordSelect 
                                label="Startup Signal (CH_STARTUP)"
                                type="channel"
                                value={chStartup}
                                onChange={setChStartup}
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

        {/* Right: Operations */}
        <div className="xl:col-span-4 flex flex-col gap-10 min-h-0 overflow-visible">
             <div className="bg-white p-12 rounded-[3.5rem] border border-zinc-100 shadow-sm relative overflow-visible flex flex-col items-center justify-center group flex-1 shrink-0 shadow-inner">
                <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none rotate-12 group-hover:rotate-0 transition-transform duration-700"><Bot size={140} /></div>
                <h3 className="text-2xl font-black text-zinc-950 mb-12 flex items-center gap-4 italic tracking-tighter uppercase shrink-0">
                    Bot Status
                </h3>

                <div className="w-full space-y-6">
                    <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 space-y-5 shadow-inner">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Sync Status</span>
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${welcomeChannel ? 'bg-emerald-500 text-white shadow-lg' : 'bg-red-500 text-white'}`}>
                                {welcomeChannel ? 'CONNECTED' : 'DISCONNECTED'}
                            </span>
                        </div>
                    </div>

                    <button 
                        disabled={seeding}
                        onClick={handleSeedDefaults}
                        className="w-full flex flex-col items-center gap-5 p-10 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[3rem] group hover:bg-zinc-950 hover:border-transparent transition-all shadow-inner relative overflow-visible"
                    >
                        <Database size={28} className={`text-zinc-200 ${seeding ? 'animate-spin' : 'group-hover:text-emerald-400 group-hover:scale-110'} transition-all`} />
                        <div className="text-center">
                            <span className="text-[11px] font-black italic tracking-widest text-zinc-950 group-hover:text-white uppercase block mb-1">Load Defaults</span>
                            <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest italic">RESET_CMD_NODES</span>
                        </div>
                    </button>
                </div>
             </div>

             <div className="p-10 bg-zinc-950 text-white rounded-[3rem] shadow-2xl relative overflow-visible group border border-zinc-900 shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none"><ShieldAlert size={160} /></div>
                <h4 className="text-lg font-black italic mb-3 tracking-tighter flex items-center gap-4 uppercase">
                   Emergency Reset
                </h4>
                <p className="text-[11px] opacity-40 mb-8 font-bold leading-relaxed italic pr-4">Clear local cache and restart bot session immediately.</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  className="w-full py-5 bg-white text-zinc-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-zinc-100 transition-all italic"
                >
                  TERMINATE SESSION
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
