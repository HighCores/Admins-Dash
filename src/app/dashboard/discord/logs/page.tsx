"use client";

import { History, Save, Loader2, ServerCog, ShieldAlert, Cpu, Terminal, Zap, Globe, ShieldCheck, Activity, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import DiscordSelect from "@/components/DiscordSelect";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/CustomToaster";

export default function LogsPage() {
  const [logChannelId, setLogChannelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
        setLoading(true);
        const { data } = await supabase
            .from("dc_settings")
            .select("value")
            .eq("key", "LOG_CHANNEL")
            .single();
        
        if (data) setLogChannelId(data.value);
        setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase
            .from("dc_settings")
            .upsert({ 
                guild_id: 'global', 
                key: 'LOG_CHANNEL', 
                value: logChannelId 
            }, { onConflict: 'key,guild_id' });
        
        if (error) throw error;
        showToast("Audit pipeline synchronized! ⚡");
    } catch (err: any) {
        showToast(err.message, true);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <History size={18} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Highcore Agency // Activity Logs</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
            Server <span className="text-emerald-500 crt-glow">Logs</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Monitoring administrative actions and structural modifications across the Highcore Agency server.
          </p>
        </div>
        
        <div className="flex items-center gap-4 font-mono">
            <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-4 px-10 py-5 bg-emerald-500 text-black font-black text-[11px] rounded-2xl shadow-[0_0_25px_#10b981] hover:scale-[1.02] hover:shadow-[0_0_35px_#10b981] transition-all active:scale-95 disabled:opacity-20 uppercase tracking-[0.3em] italic"
            >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                SYNC_LOGS
            </button>
        </div>
      </header>

      {loading ? (
          <div className="flex flex-col items-center justify-center p-40 opacity-20 font-mono">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
            <span className="text-[10px] uppercase font-black tracking-widest">establishing log link...</span>
          </div>
      ) : (
          <div className="flex-1 pb-10 overflow-hidden grid grid-cols-1 xl:grid-cols-12 gap-10">
             <div className="xl:col-span-8 terminal-card p-12 bg-zinc-950/40 rounded-[3rem] text-white relative overflow-hidden flex flex-col group border border-white/5">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <ShieldAlert size={260} className="text-emerald-500" />
                  </div>
                  
                  <div className="relative z-10 font-mono">
                      <div className="flex items-center gap-6 mb-12">
                          <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl"><ServerCog size={34} className="crt-glow" /></div>
                          <div>
                              <h3 className="font-black text-3xl uppercase tracking-tighter italic text-white mb-1">Admin Control</h3>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Log Records Configuration</p>
                          </div>
                      </div>
    
                      <div className="space-y-10 max-w-2xl">
                          <DiscordSelect 
                              label="AGENCY_LOG_CHANNEL"
                              type="channel"
                              value={logChannelId}
                              onChange={setLogChannelId}
                              placeholder="SELECT_CHANNEL..."
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 select-none pointer-events-none italic">
                                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">MODERATION_LOG</h4>
                                    <p className="text-[9px] font-black text-zinc-600">STABILITY_ENABLED</p>
                                </div>
                                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">ADMIN_TRACE</h4>
                                    <p className="text-[9px] font-black text-zinc-600">STABILITY_ENABLED</p>
                                </div>
                          </div>
                      </div>
                  </div>
    
                  <div className="mt-auto p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex items-center gap-8 font-mono">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
                          <Activity size={24} className="animate-pulse" />
                      </div>
                      <div className="space-y-1">
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">Real-time Logging Active</h4>
                          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.1em] italic leading-relaxed">
                              System is actively monitoring admin actions, message deletions, and role metadata in real-time. System stable.
                          </p>
                      </div>
                  </div>
              </div>
              
              <div className="xl:col-span-4 terminal-card p-10 bg-zinc-900/40 rounded-[3rem] border border-white/5 flex flex-col font-mono relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 p-10 opacity-[0.03] text-emerald-500 pointer-events-none group-hover:scale-110 transition-transform"><Terminal size={180} /></div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-8 border-b border-white/5 pb-4">Log Details</h3>
                  <div className="space-y-6">
                      <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-xl border border-white/5 italic">
                          <span className="text-[9px] font-black text-zinc-600 uppercase">SECURITY</span>
                          <span className="text-xs font-black text-emerald-500 tracking-widest uppercase italic">AGENCY_SECURE</span>
                      </div>
                      <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-xl border border-white/5 italic">
                          <span className="text-[9px] font-black text-zinc-600 uppercase">LOG_RETENTION</span>
                          <span className="text-xs font-black text-white tracking-widest uppercase italic font-mono">PERMANENT_ARCHIVE</span>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

