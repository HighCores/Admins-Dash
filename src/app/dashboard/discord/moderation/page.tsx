"use client";

import { Terminal } from "lucide-react";

export default function ModerationPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <header className="mb-8 flex flex-col justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Terminal size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Protection Module</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Moderation <span className="text-zinc-300">Settings</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Configure kick, ban, timeout functionality and assign moderator roles.
          </p>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden p-8">
        <div className="flex-1 flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest">
            Module under construction
        </div>
      </div>
    </div>
  );
}
