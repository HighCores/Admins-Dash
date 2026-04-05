"use client";

import { 
  Shield, Terminal, Save, Loader2, Zap, 
  ShieldAlert, Settings2, History, CheckCircle2,
  Lock, UserCheck, MessageSquare, AlertTriangle,
  Flame, VolumeX, Ban, UserMinus
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
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-300" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-1">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Shield size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Security Center</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">
            Server <span className="text-zinc-300">Moderation</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Manage staff roles, protection filters, and server safety protocols.
          </p>
        </div>

        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-4 px-10 py-5 bg-zinc-950 text-white font-bold text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group tracking-widest uppercase"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Settings
        </button>
      </header>

      <div className="flex-1 space-y-8 pb-10">
        {/* Horizontal Row 3: Punishment Protocol */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm p-8 flex flex-col lg:flex-row gap-12">
             <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-50 pb-6 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400"><VolumeX size={20} /></div>
                    <div>
                        <h3 className="font-bold text-zinc-950 uppercase tracking-tight">Vocal Restraint</h3>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mute / Timeout Configuration</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DiscordSelect 
                        label="Muted Role"
                        type="role"
                        value={muteRoleId}
                        onChange={setMuteRoleId}
                        placeholder="Select mute role..."
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 leading-none">Default Mute Time (Min)</label>
                        <input 
                            type="number" 
                            className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950" 
                            value={defaultMuteTime}
                            onChange={(e) => setDefaultMuteTime(parseInt(e.target.value))}
                        />
                    </div>
                </div>
             </div>

             <div className="lg:w-1/3 flex flex-col gap-4">
                 <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <Ban className="text-zinc-400" size={16} />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Allow Ban Commands</span>
                    <div className="ml-auto w-10 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <UserMinus className="text-zinc-400" size={16} />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Allow Kick Commands</span>
                    <div className="ml-auto w-10 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 opacity-50">
                    <UserCheck className="text-zinc-400" size={16} />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Self-Demote Guard</span>
                    <div className="ml-auto w-10 h-6 bg-zinc-200 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
