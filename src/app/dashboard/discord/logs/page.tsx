"use client";

import { History, Save, Loader2, ServerCog, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import DiscordSelect from "@/components/DiscordSelect";

export default function LogsPage() {
  const [logChannelId, setLogChannelId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock loading
    fetch("/api/mock-supabase")
      .catch(() => {})
      .finally(() => {
        setLogChannelId("1234567890");
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
      <header className="mb-10 flex flex-col justify-between gap-4 shrink-0 px-4 mt-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2 text-zinc-400">
             <History size={16} />
             <span className="text-[10px] uppercase font-black tracking-[0.3em]">AUDIT PIPELINE</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter uppercase whitespace-nowrap flex items-center justify-between">
            <span>Server <span className="text-zinc-300">Logs</span></span>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 group hover:shadow-2xl hover:-translate-y-1"
            >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                Save Logs
            </button>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl mt-2">
             Track all structural and administrative changes within your community.
          </p>
        </div>
      </header>

      <div className="flex-1 px-4 pb-10">
         <div className="bg-zinc-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col group border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12 group-hover:scale-125 transition-transform duration-1000">
                  <ShieldAlert size={200} />
              </div>
              
              <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-zinc-400 border border-white/5 shadow-inner"><ServerCog size={28} /></div>
                      <div>
                          <h3 className="font-black text-2xl uppercase tracking-tight text-white mb-1">Action Logging</h3>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Track all moderation activities</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <DiscordSelect 
                          label="LOG_CHANNEL"
                          type="channel"
                          value={logChannelId}
                          onChange={setLogChannelId}
                          placeholder="Select a secure log channel..."
                      />
                  </div>
              </div>

              <div className="mt-12 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-5 max-w-2xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm border border-emerald-500/10 shrink-0">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  </div>
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] leading-relaxed">
                      System is actively monitoring all administrative protocols, message deletions, and role modifications in real-time.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}
