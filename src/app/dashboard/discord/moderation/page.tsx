"use client";

import { 
  Shield, Terminal, Save, Loader2, Zap, 
  ShieldAlert, Settings2, History, CheckCircle2,
  Lock, UserCheck, MessageSquare, AlertTriangle,
  Flame, VolumeX, Ban, UserMinus, Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";
import { motion } from "framer-motion";

export default function ModerationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings State
  const [modRoles, setModRoles] = useState<string[]>([]);
  const [adminRoles, setAdminRoles] = useState<string[]>([]);
  const [logChannelId, setLogChannelId] = useState("");
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);
  const [muteRoleId, setMuteRoleId] = useState("");
  const [defaultMuteTime, setDefaultMuteTime] = useState(10); // in minutes

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_moderation_config").select("*").eq('guild_id', 'global').single();
    if (data) {
      setModRoles(data.moderator_roles || []);
      setAdminRoles(data.admin_roles || []);
      setLogChannelId(data.log_channel_id || "");
      setMuteRoleId(data.mute_role_id || "");
      setDefaultMuteTime(data.default_mute_time || 10);
    }
    
    // Also fetch auto-mod if available
    const { data: amData } = await supabase.from("dc_automod_config").select("*").eq('guild_id', 'global').single();
    if (amData) {
      setAntiLink(amData.anti_link || false);
      setAntiSpam(amData.anti_spam || false);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Moderation Config
      const { error: modErr } = await supabase.from("dc_moderation_config").upsert({
        guild_id: 'global',
        moderator_roles: modRoles,
        admin_roles: adminRoles,
        log_channel_id: logChannelId,
        mute_role_id: muteRoleId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'guild_id' });

      if (modErr) throw modErr;

      // Save Auto-Mod Config
      const { error: amErr } = await supabase.from("dc_automod_config").upsert({
        guild_id: 'global',
        anti_link: antiLink,
        anti_spam: antiSpam,
        updated_at: new Date().toISOString()
      }, { onConflict: 'guild_id' });

      if (amErr) throw amErr;

      showToast("Security protocols updated! 🛡️");
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-20 bg-zinc-950/20 rounded-[2.5rem] text-center font-mono opacity-20">
        <Loader2 className="animate-spin text-emerald-500 mb-6" size={40} />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Establishing Secure Sync...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header - Terminal Style */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <Shield size={18} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Subsystem // Security Control</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Cyber <span className="text-emerald-500 crt-glow">Moderation</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-2xl">
             Managing staff nodes, automated filters, and server containment protocols.
          </p>
        </div>

        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-4 px-10 py-5 bg-white text-black font-black text-[10px] rounded-2xl shadow-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group tracking-[0.2em] uppercase italic"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Commit_Changes
        </button>
      </header>

      <div className="flex-1 space-y-8 pb-10">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Punishment Protocol Card */}
            <div className="terminal-card bg-zinc-950/40 rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <VolumeX size={120} className="text-emerald-500" />
                </div>
                
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic tracking-tighter uppercase border-b border-white/5 pb-4 font-mono">
                    <Cpu size={18} className="text-emerald-500" /> Punishment Protocol
                </h3>

                <div className="space-y-8 relative z-10 font-mono">
                    <DiscordSelect 
                        label="Containment Role (Muted)"
                        type="role"
                        value={muteRoleId}
                        onChange={setMuteRoleId}
                        placeholder="Establish mute node..."
                    />
                    
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block pl-1">Default Duration // MIN_SYNC</label>
                        <div className="relative group/input">
                            <History size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/input:text-emerald-500 transition-colors" />
                            <input 
                                type="number" 
                                className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-zinc-950 transition-all font-black text-[10px] uppercase tracking-widest text-white" 
                                value={defaultMuteTime}
                                onChange={(e) => setDefaultMuteTime(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Shield Authorization Card */}
            <div className="terminal-card bg-zinc-950/40 rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group">
                 <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic tracking-tighter uppercase border-b border-white/5 pb-4 font-mono">
                    <ShieldAlert size={18} className="text-emerald-500" /> Admin Permissions
                </h3>
                
                <div className="space-y-6 relative z-10 font-mono">
                     <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group/toggle hover:bg-white/[0.04] transition-all">
                        <Ban className="text-zinc-700 group-hover/toggle:text-emerald-500 transition-colors" size={18} />
                        <div className="flex-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Destructive Protocol</span>
                            <span className="text-xs font-black text-white italic tracking-tighter">Enable /BAN Operations</span>
                        </div>
                        <div className="w-12 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center px-1 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full ml-auto shadow-[0_0_12px_rgba(34,197,94,0.5)]"></div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group/toggle hover:bg-white/[0.04] transition-all">
                        <UserMinus className="text-zinc-700 group-hover/toggle:text-emerald-500 transition-colors" size={18} />
                        <div className="flex-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Eviction Protocol</span>
                            <span className="text-xs font-black text-white italic tracking-tighter">Enable /KICK Operations</span>
                        </div>
                        <div className="w-12 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full ml-auto"></div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group/toggle opacity-30 grayscale transition-all">
                        <UserCheck className="text-zinc-700" size={18} />
                        <div className="flex-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Hierarchical Guard</span>
                            <span className="text-xs font-black text-white italic tracking-tighter">Self-Demotion Lock</span>
                        </div>
                        <div className="w-12 h-6 bg-white/5 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Global Security Summary */}
        <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex items-center justify-between font-mono italic">
            <div className="flex items-center gap-4">
                <Shield className="text-emerald-500 animate-pulse" size={24} />
                <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">All security nodes operating within normal parameters.</span>
            </div>
            <span className="text-[10px] text-zinc-700 uppercase font-black tracking-widest">Mirror_Fidelity: 100%</span>
        </div>
      </div>
    </div>
  );
}
