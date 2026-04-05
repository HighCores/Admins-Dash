"use client";

import { motion } from "framer-motion";
import { 
  Users, Save, Image as ImageIcon, MessageSquare, 
  Terminal, Monitor, Smartphone, Settings2, BellRing,
  Hash, Bot, Power, AlignLeft, AtSign, Loader2, Link as LinkIcon, Plus
} from "lucide-react";
import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase"; // For future backend usage
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
  const [color, setColor] = useState("#5865F2");
  const [embedTitle, setEmbedTitle] = useState("A new member approached!");
  const [imageUrl, setImageUrl] = useState("https://assets.hc.agency/welcome-banner.png");
  const [thumbnailUrl, setThumbnailUrl] = useState("{user_avatar}");

  const handleSave = async () => {
      setSaving(true);
      // await supabase logic here...
      setTimeout(() => {
          setSaving(false);
          showToast("Welcome logic synchronized. ⚡");
      }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible p-1">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Users size={16} className="text-white" />
             </div>
             <span className="text-xs font-bold text-blue-600">Engagement Module</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">
            Welcome <span className="text-zinc-300">& Leave</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Configure greeting messages and embeds for new members.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-xl shadow-sm transition-all ${
                    isActive ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
            >
                <Power size={16} />
                {isActive ? "System Active" : "System Paused"}
            </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-y-auto xl:overflow-visible p-1">
        
        {/* Architect Workspace (Editor) */}
        <div className="xl:col-span-7 flex flex-col min-h-0">
            <div className={`bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden transition-all ${!isActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-3">
                        <Settings2 size={18} className="text-blue-500" /> Welcome Configuration
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 overflow-x-visible">
                    
                    <DiscordSelect 
                        label="Greeting Channel"
                        type="channel"
                        value={channelId}
                        onChange={setChannelId}
                        placeholder="Select welcome channel..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setMessageType("text")}
                            className={`p-4 rounded-xl border-2 transition-all font-bold text-xs flex items-center justify-center gap-2 ${
                                messageType === "text" ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                            }`}
                        >
                            <AlignLeft size={16} /> Plain Text
                        </button>
                        <button 
                            onClick={() => setMessageType("embed")}
                            className={`p-4 rounded-xl border-2 transition-all font-bold text-xs flex items-center justify-center gap-2 ${
                                messageType === "embed" ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                            }`}
                        >
                            <Monitor size={16} /> Embed Message
                        </button>
                    </div>

                    {messageType === "embed" && (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 px-1">Embed Title</label>
                                    <div className="relative">
                                        <BellRing size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={embedTitle}
                                            onChange={(e) => setEmbedTitle(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-950 text-sm transition-all outline-none focus:bg-white shadow-inner"
                                            placeholder="Enter title (e.g. Welcome to the server!)"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 px-1">Accent Color</label>
                                        <div className="flex gap-4">
                                            <input 
                                                type="color" 
                                                className="w-12 h-12 rounded-xl cursor-pointer border-4 border-white shadow-lg bg-transparent"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                className="flex-1 p-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-xs text-zinc-950 outline-none"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 px-1">Thumbnail Image</label>
                                        <div className="relative">
                                            <ImageIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <input 
                                                type="text" 
                                                value={thumbnailUrl}
                                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                                className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-500 text-xs transition-all outline-none focus:bg-white shadow-inner"
                                                placeholder="{user_avatar} or URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 px-1">Large Background / Banner</label>
                                    <div className="relative">
                                        <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-500 text-xs transition-all outline-none focus:bg-white shadow-inner"
                                            placeholder="URL to your welcome banner image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-4">
                            <label className="text-xs font-bold text-zinc-500">Message Body</label>
                        </div>
                        <textarea 
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-800 leading-relaxed transition-all outline-none focus:bg-white resize-none shadow-inner"
                            placeholder="Type your welcome message..."
                        />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {["{user}", "{user.tag}", "{server}", "{member_count}", "{user_avatar}"].map(v => (
                                <button 
                                    key={v}
                                    onClick={() => setMessage(prev => prev + " " + v)}
                                    className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md hover:bg-zinc-200 transition-all"
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="p-6 bg-zinc-50/50 border-t border-zinc-50">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-950 text-white font-bold text-sm rounded-xl shadow-md hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                        Save Settings
                    </button>
                </div>
            </div>
        </div>

        {/* Live Mirror (Preview) */}
        <div className="xl:col-span-5 flex flex-col min-h-0 overflow-hidden">
             {/* Device Switcher */}
             <div className="bg-white p-2 rounded-2xl border border-zinc-100 mb-6 flex justify-center gap-2 shrink-0">
                 <button onClick={() => setIsPreviewMobile(false)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs font-bold ${!isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-950'}`}>
                    <Monitor size={14} /> Desktop
                 </button>
                 <button onClick={() => setIsPreviewMobile(true)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs font-bold ${isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-950'}`}>
                    <Smartphone size={14} /> Mobile
                 </button>
             </div>
 
             <div className="flex-1 overflow-hidden relative group">
                <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreviewMobile ? 'max-w-[340px] mx-auto' : 'w-full'}`}>
                    {/* Realistic Discord UI background */}
                    <div className="h-full bg-[#313338] rounded-[2.5rem] shadow-2xl flex flex-col border border-[#1e1f22] overflow-hidden !font-sans">
                        
                        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar flex flex-col gap-3">
                            {/* Discord Message Header Info */}
                            <div className="flex items-start gap-3 px-1 mb-1 mt-4">
                                <div className="w-10 h-10 rounded-full bg-[#5865f2] shrink-0 flex items-center justify-center text-white"><Bot size={24} /></div>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 baseline">
                                        <h4 className="font-semibold text-white/90 leading-tight">High Core</h4>
                                        <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded flex items-center font-bold">APP</span>
                                        <span className="text-[#949ba4] text-[11px] ml-1">Today at 12:00 PM</span>
                                    </div>
                                    
                                    {messageType === "text" ? (
                                        <div className="text-[#dbdee1] text-[15px] leading-relaxed whitespace-pre-wrap mt-0.5">
                                            {(() => {
                                                const formatted = (message || "")
                                                    .replace(/{user}/g, "@NewUser")
                                                    .replace(/{server}/g, "High Core Server")
                                                    .replace(/{member_count}/g, "1,452")
                                                    .replace(/\\n/g, '\n')
                                                    .replace(/^(#+)\s*(.*?)$/gm, '**$2**');
                                                return formatted.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                });
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex max-w-full">
                                            {/* Component v2 Embed */}
                                            <div className="bg-[#2b2d31] rounded-[8px] flex flex-col max-w-[400px] overflow-hidden shrink-0 transition-colors relative">
                                                {/* Embed Color Line */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 flex-shrink-0 rounded-l-[8px]" style={{ backgroundColor: color || '#202225' }}></div>
                                                
                                                <div className="p-4 pl-5 flex flex-col gap-2 w-full">
                                                    <div className="flex items-start gap-3 w-full">
                                                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                                                            {embedTitle && <h3 className="text-white font-bold text-[15px] leading-tight pr-6">{embedTitle}</h3>}
                                                            {message && (
                                                                <div className="text-[#dbdee1] text-[14px] leading-relaxed whitespace-pre-wrap break-words font-medium">
                                                                    {(() => {
                                                                        const formatted = message
                                                                            .replace(/{user}/g, "@NewUser")
                                                                            .replace(/{server}/g, "High Core Server")
                                                                            .replace(/{member_count}/g, "1,452")
                                                                            .replace(/\\n/g, '\n')
                                                                            .replace(/^(#+)\s*(.*?)$/gm, '**$2**');
                                                                        return formatted.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                                return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                                                                            }
                                                                            return part;
                                                                        });
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {thumbnailUrl && thumbnailUrl !== "{none}" && (
                                                            <div className="w-[50px] h-[50px] shrink-0 rounded-md overflow-hidden bg-[#232428] ml-auto">
                                                                {thumbnailUrl === "{user_avatar}" ? (
                                                                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">U</div>
                                                                ) : (
                                                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {imageUrl && (
                                                    <div className="px-4 pb-4">
                                                        <img src={imageUrl} alt="Banner" className="w-full h-auto rounded-lg max-w-[400px]" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-[#2b2d31] flex items-center gap-4 border-t border-[#1e1f22] shrink-0 pointer-events-none opacity-50">
                            <div className="w-8 h-8 rounded-full bg-[#383a40] flex items-center justify-center">
                                <Plus size={16} className="text-[#b5bac1]" />
                            </div>
                            <div className="flex-1 bg-[#383a40] rounded-full h-10 px-4 flex items-center text-[#949ba4] text-[14px]">
                                Message #welcome
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
