"use client";

import { motion } from "framer-motion";
import { 
  Users, Save, Image as ImageIcon, MessageSquare, 
  Terminal, Monitor, Smartphone, Settings2, BellRing,
  Hash, Bot, Power, AlignLeft, AtSign, Loader2, Link as LinkIcon, Plus, Zap, Cpu, History
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function WelcomePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);

  // Welcome Config State
  const [isActive, setIsActive] = useState(true);
  const [channelId, setChannelId] = useState("");
  const [messageType, setMessageType] = useState<"text" | "embed">("embed");
  const [message, setMessage] = useState("Welcome {user} to **{server}**! 🎉\\nYou are our {member_count}th member.");
  const [color, setColor] = useState("#10b981");
  const [embedTitle, setEmbedTitle] = useState("WELCOME TO THE FAMILY");
  const [imageUrl, setImageUrl] = useState("https://assets.hc.agency/welcome-banner.png");
  const [thumbnailUrl, setThumbnailUrl] = useState("{user_avatar}");

  const handleSave = async () => {
      setSaving(true);
      try {
          // Sync to Supabase dc_settings or similar
          const updates = [
              { guild_id: 'global', key: 'WELCOME_ACTIVE', value: isActive.toString() },
              { guild_id: 'global', key: 'WELCOME_CHANNEL', value: channelId },
              { guild_id: 'global', key: 'WELCOME_TYPE', value: messageType },
              { guild_id: 'global', key: 'WELCOME_MSG', value: message },
              { guild_id: 'global', key: 'WELCOME_COLOR', value: color },
              { guild_id: 'global', key: 'WELCOME_TITLE', value: embedTitle },
              { guild_id: 'global', key: 'WELCOME_IMAGE', value: imageUrl },
              { guild_id: 'global', key: 'WELCOME_THUMBNAIL', value: thumbnailUrl },
          ];
          
          const { error } = await supabase.from("dc_settings").upsert(updates, { onConflict: 'key,guild_id' });
          if (error) throw error;
          
          showToast("Welcome settings saved! 🧠⚡");
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
                <Users size={18} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Management // Member Engagement System</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
            Welcome <span className="text-emerald-500 crt-glow">Protocols</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Calibrating onboarding sequences and greeting embeds for new members joining the Highcore Hub.
          </p>
        </div>
        
        <div className="flex items-center gap-3 font-mono">
             <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-3 px-8 py-4 font-black text-[10px] rounded-2xl shadow-xl transition-all border uppercase tracking-widest italic group ${
                    isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 crt-glow" : "bg-red-500/5 text-red-500 border-red-500/20"
                }`}
            >
                <Power size={16} className={isActive ? 'crt-glow' : ''} />
                {isActive ? "SYSTEM_ACTIVE" : "SYSTEM_OFFLINE"}
            </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0 overflow-hidden pb-10">
        
        {/* Architect Workspace (Editor) */}
        <div className="xl:col-span-7 flex flex-col min-h-0 h-full overflow-hidden">
            <div className={`terminal-card flex-1 flex flex-col overflow-hidden bg-zinc-950/40 rounded-[2.5rem] transition-all relative ${!isActive ? 'opacity-30 p-20' : ''}`}>
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between font-mono">
                    <h3 className="text-sm font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                        <Settings2 size={18} className="text-emerald-500" /> Configuration Rack
                    </h3>
                    {!isActive && <div className="absolute inset-0 z-50 flex items-center justify-center font-black text-red-500 text-3xl tracking-[0.5em] uppercase italic bg-black/40 backdrop-blur-sm">SYSTEM_PAUSED</div>}
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10 font-mono">
                    
                    <DiscordSelect 
                        label="TARGET_CHANNEL"
                        type="channel"
                        value={channelId}
                        onChange={setChannelId}
                        placeholder="SELECT_CH..."
                    />

                    <div className="grid grid-cols-2 gap-6 uppercase tracking-widest italic">
                        <button 
                            onClick={() => setMessageType("text")}
                            className={`p-5 rounded-2xl border transition-all font-black text-[9px] flex items-center justify-center gap-4 ${
                                messageType === "text" ? "bg-emerald-500 text-black border-emerald-500 shadow-lg crt-glow" : "bg-black/40 text-zinc-600 border-white/5 hover:border-emerald-500/20"
                            }`}
                        >
                            <AlignLeft size={16} /> PLAIN_TEXT
                        </button>
                        <button 
                            onClick={() => setMessageType("embed")}
                            className={`p-5 rounded-2xl border transition-all font-black text-[9px] flex items-center justify-center gap-4 ${
                                messageType === "embed" ? "bg-emerald-500 text-black border-emerald-500 shadow-lg crt-glow" : "bg-black/40 text-zinc-600 border-white/5 hover:border-emerald-500/20"
                            }`}
                        >
                            <Monitor size={16} /> MODERN_EMBED
                        </button>
                    </div>

                    {messageType === "embed" && (
                        <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 leading-none italic">Embed Header</label>
                                    <div className="relative">
                                        <BellRing size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                                        <input 
                                            type="text" 
                                            value={embedTitle}
                                            onChange={(e) => setEmbedTitle(e.target.value)}
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-black border border-white/5 font-black text-white text-[11px] transition-all outline-none focus:border-emerald-500/30 uppercase italic placeholder:text-zinc-800"
                                            placeholder="GREETING_HEX..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 leading-none italic">Color Accent</label>
                                        <div className="flex gap-4">
                                            <input 
                                                type="color" 
                                                className="w-16 h-16 rounded-2xl cursor-pointer bg-transparent border-0"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                className="flex-1 p-5 rounded-2xl bg-black border border-white/5 font-black text-xs text-white outline-none uppercase italic"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 leading-none italic">Avatar Image</label>
                                        <div className="relative">
                                            <ImageIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                                            <input 
                                                type="text" 
                                                value={thumbnailUrl}
                                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-black border border-white/5 font-black text-zinc-400 text-[10px] transition-all outline-none focus:border-emerald-500/30 uppercase italic placeholder:text-zinc-800"
                                                placeholder="{user_avatar} or URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 leading-none italic">Global Banner Link</label>
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                                        <input 
                                            type="text" 
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-black border border-white/5 font-black text-zinc-400 text-[10px] transition-all outline-none focus:border-emerald-500/30 uppercase italic placeholder:text-zinc-800"
                                            placeholder="URL_TO_BANNER..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none italic">Message Content</label>
                        </div>
                        <textarea 
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-8 py-6 rounded-[2.5rem] bg-black border border-white/5 font-medium text-zinc-300 leading-relaxed transition-all outline-none focus:border-emerald-500/20 resize-none font-sans text-sm"
                            placeholder="ENTER_WELCOME_MESSAGE..."
                        />
                        <div className="flex flex-wrap gap-2 pt-2 px-4 italic">
                            {["{user}", "{server}", "{member_count}", "{user_avatar}"].map(v => (
                                <button 
                                    key={v}
                                    onClick={() => setMessage(prev => prev + " " + v)}
                                    className="px-3 py-1.5 bg-emerald-500/5 text-emerald-500/40 text-[8px] font-black rounded-lg border border-emerald-500/10 hover:text-emerald-500 transition-all uppercase tracking-widest"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="p-8 border-t border-white/5 bg-white/5 font-mono">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-4 py-6 bg-emerald-500 text-black font-black text-[11px] rounded-[1.5rem] shadow-[0_0_25px_#10b981] hover:scale-[1.02] hover:shadow-[0_0_35px_#10b981] transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.4em] italic"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                        Sync_Settings
                    </button>
                </div>
            </div>
        </div>

        {/* Live Mirror (Preview) */}
        <div className="xl:col-span-5 flex flex-col min-h-0 h-full overflow-hidden">
             {/* Device Switcher */}
             <div className="bg-zinc-900/40 p-2 rounded-[2rem] border border-white/5 mb-8 flex justify-center gap-4 shrink-0 font-mono">
                 <button onClick={() => setIsPreviewMobile(false)} className={`flex-1 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest italic ${!isPreviewMobile ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}>
                    <Monitor size={14} /> Desktop_Preview
                 </button>
                 <button onClick={() => setIsPreviewMobile(true)} className={`flex-1 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest italic ${isPreviewMobile ? 'bg-emerald-500 text-black shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}>
                    <Smartphone size={14} /> Mobile_Preview
                 </button>
             </div>
 
             <div className="flex-1 overflow-visible relative group">
                <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreviewMobile ? 'max-w-[320px] mx-auto' : 'w-full'}`}>
                    <div className="h-full bg-[#1e1f22] rounded-[3rem] shadow-2xl flex flex-col border border-[#0b0b0c] overflow-hidden !font-sans pb-10">
                        <div className="flex-1 overflow-y-auto px-6 py-10 custom-scrollbar flex flex-col gap-6">
                            <div className="flex items-start gap-4 px-1 mb-1 mt-4">
                                <div className="w-10 h-10 rounded-full bg-[#5865f2] shrink-0 flex items-center justify-center text-white"><Bot size={24} /></div>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 baseline">
                                        <h4 className="font-semibold text-white/90 leading-tight">High Core</h4>
                                        <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded flex items-center font-bold">APP</span>
                                        <span className="text-[#949ba4] text-[11px] ml-1">Today at 12:00 PM</span>
                                    </div>
                                    
                                    {messageType === "text" ? (
                                        <div className="text-[#dbdee1] text-[14px] leading-relaxed whitespace-pre-wrap mt-1">
                                            {(() => {
                                                const formatted = (message || "")
                                                    .replace(/{user}/g, "@NewUser")
                                                    .replace(/{server}/g, "HighCore Agency")
                                                    .replace(/{member_count}/g, "1,452")
                                                    .replace(/\\n/g, '\n');
                                                return formatted;
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="mt-2 flex max-w-full">
                                            <div className="bg-[#2b2d31] rounded-[8px] flex flex-col max-w-[400px] overflow-hidden shrink-0 transition-colors relative border-l-4" style={{ borderLeftColor: color || '#10b981' }}>
                                                <div className="p-4 flex flex-col gap-2 w-full">
                                                    <div className="flex items-start gap-4 w-full">
                                                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                                            {embedTitle && <h3 className="text-white font-bold text-[15px] leading-tight pr-10">{embedTitle}</h3>}
                                                            {message && (
                                                                <div className="text-[#dbdee1] text-[13px] leading-relaxed whitespace-pre-wrap break-words font-medium opacity-90">
                                                                    {message.replace(/{user}/g, "@NewUser").replace(/{server}/g, "HighCore Agency").replace(/{member_count}/g, "1,452")}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {thumbnailUrl && thumbnailUrl !== "{none}" && (
                                                            <div className="w-[60px] h-[60px] shrink-0 rounded-md overflow-hidden bg-[#232428] ml-auto">
                                                                {thumbnailUrl === "{user_avatar}" ? (
                                                                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">U</div>
                                                                ) : (
                                                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {imageUrl && (
                                                    <div className="px-4 pb-4">
                                                        <img src={imageUrl} alt="Banner" className="w-full h-auto rounded-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-[#2b2d31] flex items-center gap-4 opacity-10 pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-[#383a40]" />
                            <div className="flex-1 bg-[#383a40] rounded-full h-10" />
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
