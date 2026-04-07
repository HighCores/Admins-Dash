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
  
  // Specific Log Nodes
  const [logJoin, setLogJoin] = useState("");
  const [logMsg, setLogMsg] = useState("");
  const [logTicket, setLogTicket] = useState("");
  const [logCmd, setLogCmd] = useState("");
  const [logMod, setLogMod] = useState("");
  const [logWarn, setLogWarn] = useState("");
  
  const [botPrefix, setBotPrefix] = useState("!");

  const GUILD_ID = "global";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
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

        setLogJoin(find("LOG_JOIN_LEFT"));
        setLogMsg(find("LOG_MESSAGE"));
        setLogTicket(find("LOG_TICKETS"));
        setLogCmd(find("LOG_COMMANDS"));
        setLogMod(find("LOG_MODS_CMD"));
        setLogWarn(find("LOG_WARNING"));
        
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

            { guild_id: GUILD_ID, key: "LOG_JOIN_LEFT", value: logJoin },
            { guild_id: GUILD_ID, key: "LOG_MESSAGE", value: logMsg },
            { guild_id: GUILD_ID, key: "LOG_TICKETS", value: logTicket },
            { guild_id: GUILD_ID, key: "LOG_COMMANDS", value: logCmd },
            { guild_id: GUILD_ID, key: "LOG_MODS_CMD", value: logMod },
            { guild_id: GUILD_ID, key: "LOG_WARNING", value: logWarn },
            
            { guild_id: GUILD_ID, key: "BOT_PREFIX", value: botPrefix },
        ];

        const { error } = await supabase.from("dc_settings").upsert(updates, { onConflict: 'key,guild_id' });

        if (error) throw error;

        await fetchSettings();
        showToast("Settings saved! ⚡");
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

        showToast("Initial defaults loaded! ⚡");
    } catch (err: any) {
        showToast(`Error: ${err.message}`, true);
    } finally {
        setSeeding(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <Settings size={18} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Management // Global Configuration Hub</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
            Bot <span className="text-emerald-500 crt-glow">Settings</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Configuring system parameters, communication channels, and staff roles for the Highcore Bot.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchSettings}
                className="p-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-emerald-500 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                disabled={saving}
                onClick={handleSave}
                className="flex items-center gap-6 px-10 py-5 bg-emerald-500 text-black font-black text-[11px] rounded-2xl shadow-[0_0_25px_#10b981] hover:scale-[1.02] hover:shadow-[0_0_35px_#10b981] transition-all group disabled:opacity-50 uppercase tracking-[0.2em] italic"
            >
                {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Sync_Settings
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0 overflow-hidden pb-10">
        
        {/* Left: Configuration Rack */}
        <div className="xl:col-span-8 flex flex-col min-h-0 h-full overflow-hidden">
             <div className="terminal-card flex-1 flex flex-col overflow-hidden bg-zinc-950/40 rounded-[2.5rem]">
                  <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between font-mono">
                     <h3 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <Terminal size={18} className="text-emerald-500" /> System Configuration
                     </h3>
                     <span className="p-1 px-4 bg-emerald-500/10 text-emerald-500 text-[9px] rounded-lg font-black tracking-widest border border-emerald-500/20 crt-glow">AUTHORIZED</span>
                  </div>

                  <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Shard 1: Infrastructure */}
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 italic font-mono border-b border-white/5 pb-2">Part 1: Primary Infrastructure</h4>
                            
                            <DiscordSelect 
                                label="Log Category"
                                type="category"
                                value={logCategory}
                                onChange={setLogCategory}
                                placeholder="SELECT_CAT..."
                            />
                            <DiscordSelect 
                                label="Ticket Category"
                                type="category"
                                value={ticketCategory}
                                onChange={setTicketCategory}
                                placeholder="SELECT_CAT..."
                            />
                            <DiscordSelect 
                                label="Transcript Channel"
                                type="channel"
                                value={transcriptChannel}
                                onChange={setTranscriptChannel}
                                placeholder="SELECT_CH..."
                            />
                            <DiscordSelect 
                                label="Welcome Channel"
                                type="channel"
                                value={welcomeChannel}
                                onChange={setWelcomeChannel}
                                placeholder="SELECT_CH..."
                            />

                             <div className="space-y-3 font-mono">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 leading-none italic">Bot Prefix</label>
                                <input 
                                    type="text"
                                    maxLength={3}
                                    value={botPrefix}
                                    onChange={(e) => setBotPrefix(e.target.value)}
                                    className="w-full p-5 rounded-2xl bg-black border border-white/5 font-black text-center text-3xl text-emerald-500 focus:border-emerald-500/30 outline-none transition-all italic uppercase"
                                    placeholder="!"
                                />
                            </div>
                        </div>

                        {/* Shard 2: Authority & Operations */}
                        <div className="space-y-10">
                             <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 italic font-mono border-b border-white/5 pb-2">Part 2: Staff Roles</h4>
                             <DiscordSelect 
                                label="Admin Role"
                                type="role"
                                value={roleHigh}
                                onChange={setRoleHigh}
                                placeholder="SELECT_ROLE..."
                            />
                            <DiscordSelect 
                                label="Founder Role"
                                type="role"
                                value={roleFounder}
                                onChange={setRoleFounder}
                                placeholder="SELECT_ROLE..."
                            />
                            <DiscordSelect 
                                label="Moderator Role"
                                type="role"
                                value={roleMod}
                                onChange={setRoleMod}
                                placeholder="SELECT_ROLE..."
                            />
                            
                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-8 mb-4 italic font-mono border-b border-white/5 pb-2">Service Operations</h4>
                            <DiscordSelect 
                                label="Announcement Channel"
                                type="channel"
                                value={chStartup}
                                onChange={setChStartup}
                            />
                            <DiscordSelect 
                                label="Orders Feed"
                                type="channel"
                                value={chOrder}
                                onChange={setChOrder}
                            />

                            <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-8 mb-4 italic font-mono border-b border-white/5 pb-2">Event Logs</h4>
                            <DiscordSelect 
                                label="Member Activity (Join/Leave)"
                                type="channel"
                                value={logJoin}
                                onChange={setLogJoin}
                            />
                            <DiscordSelect 
                                label="Message Analysis"
                                type="channel"
                                value={logMsg}
                                onChange={setLogMsg}
                            />
                            <DiscordSelect 
                                label="Support History"
                                type="channel"
                                value={logTicket}
                                onChange={setLogTicket}
                            />
                            <DiscordSelect 
                                label="Command Usage"
                                type="channel"
                                value={logCmd}
                                onChange={setLogCmd}
                            />
                            <DiscordSelect 
                                label="Administrative Audit"
                                type="channel"
                                value={logMod}
                                onChange={setLogMod}
                            />
                            <DiscordSelect 
                                label="Security Events"
                                type="channel"
                                value={logWarn}
                                onChange={setLogWarn}
                            />
                        </div>
                     </div>
                  </div>
             </div>
        </div>

        {/* Right: Operations */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0 h-full overflow-hidden font-mono">
             <div className="terminal-card bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 shadow-xl relative overflow-hidden flex flex-col items-center justify-center group flex-1 shrink-0">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none rotate-12 group-hover:rotate-0 transition-transform duration-700 text-emerald-500"><Bot size={140} /></div>
                <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 italic tracking-tighter uppercase shrink-0">
                    Sync Status
                </h3>

                <div className="w-full space-y-6">
                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Connection Link</span>
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${welcomeChannel ? 'bg-emerald-500 text-black border-emerald-500 crt-glow' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {welcomeChannel ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">System Latency</span>
                             <span className="text-emerald-500 text-xs font-black tracking-tighter italic">24MS</span>
                        </div>
                    </div>

                    <button 
                        disabled={seeding}
                        onClick={handleSeedDefaults}
                        className="w-full flex flex-col items-center gap-5 p-10 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] group hover:bg-emerald-500 hover:border-transparent transition-all relative overflow-hidden"
                    >
                        <Database size={28} className={`text-zinc-800 ${seeding ? 'animate-spin' : 'group-hover:text-black group-hover:scale-110'} transition-all`} />
                        <div className="text-center">
                            <span className="text-[11px] font-black italic tracking-widest text-zinc-600 group-hover:text-black uppercase block mb-1">Load Initial Defaults</span>
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest italic block">RESET_COMMANDS</span>
                        </div>
                    </button>
                </div>
             </div>

             <div className="terminal-card bg-zinc-950 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5 shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none text-red-500"><ShieldAlert size={160} /></div>
                <h4 className="text-lg font-black italic text-white mb-2 tracking-tighter flex items-center gap-4 uppercase">
                   Emergency Reset
                </h4>
                <p className="text-[10px] text-zinc-600 mb-8 font-black leading-relaxed italic pr-4 uppercase tracking-widest">Clear local cache and restart bot session immediately.</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  className="w-full py-5 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all italic shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                >
                  LOGOUT SESSION
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

