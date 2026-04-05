"use client";

import { ShieldAlert, Lock, Flame, History, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AutoModPage() {
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock loading state
    fetch("/api/mock-supabase")
      .catch(() => {})
      .finally(() => {
        setAntiLink(true);
        setAntiSpam(false);
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
             <ShieldAlert size={16} />
             <span className="text-[10px] uppercase font-black tracking-[0.3em]">PROTECTION MODULE</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter uppercase whitespace-nowrap flex items-center justify-between">
            <span>Auto <span className="text-zinc-300">Moderation</span></span>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 group hover:shadow-2xl hover:-translate-y-1"
            >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                Update Rules
            </button>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl mt-2">
             Filter spam, block forbidden words, and enforce server safety autonomously.
          </p>
        </div>
      </header>

      <div className="flex-1 px-4 pb-10">
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm p-10 flex flex-col">
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Anti-Link */}
                 <button 
                     onClick={() => setAntiLink(!antiLink)}
                     className={`flex flex-col p-8 rounded-[2rem] border transition-all text-left ${antiLink ? 'bg-zinc-950 border-zinc-950 text-white shadow-2xl scale-[1.02]' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-white hover:shadow-md'}`}
                 >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${antiLink ? 'bg-white/10 text-white' : 'bg-white text-zinc-300 border border-zinc-100 shadow-sm'}`}>
                         <Lock size={24} />
                     </div>
                     <h4 className={`font-black uppercase tracking-tight text-xl mb-2 ${antiLink ? 'text-white' : 'text-zinc-950'}`}>Anti-Link</h4>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Block all external URLs and invite links.</p>
                 </button>

                 {/* Anti-Spam */}
                 <button 
                     onClick={() => setAntiSpam(!antiSpam)}
                     className={`flex flex-col p-8 rounded-[2rem] border transition-all text-left ${antiSpam ? 'bg-zinc-950 border-zinc-950 text-white shadow-2xl scale-[1.02]' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-white hover:shadow-md'}`}
                 >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${antiSpam ? 'bg-white/10 text-white text-orange-400' : 'bg-white text-zinc-300 border border-zinc-100 shadow-sm'}`}>
                         <Flame size={24} />
                     </div>
                     <h4 className={`font-black uppercase tracking-tight text-xl mb-2 ${antiSpam ? 'text-white' : 'text-zinc-950'}`}>Anti-Spam</h4>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Detect and stop message flooding and raids.</p>
                 </button>

                 {/* Auto-Audit */}
                 <div 
                     className="flex flex-col p-8 rounded-[2rem] border bg-zinc-50 border-zinc-100 text-zinc-300 opacity-50 cursor-not-allowed"
                 >
                     <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 border border-zinc-100 shadow-sm">
                         <History size={24} />
                     </div>
                     <h4 className="font-black uppercase tracking-tight text-xl mb-2 text-zinc-950">Auto-Audit</h4>
                     <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Coming Soon in v2.0</p>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
