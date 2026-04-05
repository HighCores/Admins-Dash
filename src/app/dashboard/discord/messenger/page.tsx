"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, Users, MessageSquare, Image as ImageIcon, 
    Zap, Sparkles, Loader2, AlertCircle, CheckCircle2,
    Megaphone, Trash2, Plus
} from "lucide-react";
import { useState } from "react";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function MessengerPage() {
    const [loading, setLoading] = useState(false);
    const [isBroadcast, setIsBroadcast] = useState(false);
    
    // Inputs
    const [channelId, setChannelId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<string[]>([""]);

    const BOT_API = "http://localhost:8080/api";
    const API_KEY = "secret_key"; 

    const addAttachment = () => {
        if (attachments.length < 3) setAttachments([...attachments, ""]);
    };

    const updateAttachment = (idx: number, val: string) => {
        const newAtts = [...attachments];
        newAtts[idx] = val;
        setAttachments(newAtts);
    };

    const removeAttachment = (idx: number) => {
        setAttachments(attachments.filter((_, i) => i !== idx));
    };

    const handleSend = async () => {
        if (!message) return showToast("Please enter a message.", true);
        if (!isBroadcast && !channelId) return showToast("Please select a target channel.", true);

        setLoading(true);
        try {
            const validFiles = attachments.filter(a => a.trim() !== "");
            
            let endpoint = `${BOT_API}/channels/${channelId}/message`;
            let payload: any = { message, files: validFiles };

            if (isBroadcast) {
                endpoint = `${BOT_API}/broadcast`;
                payload = { 
                    message, 
                    role_id: roleId || null, 
                    attachment_url: validFiles.length > 0 ? validFiles[0] : null 
                };
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to communicate with bot server.");
            }

            showToast(isBroadcast ? "Broadcast sequence started successfully!" : "Message sent successfully!");
            if (!isBroadcast) setMessage(""); 
            
        } catch (err: any) {
            showToast(`Error: ${err.message}`, true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col h-full min-h-0 overflow-y-auto custom-scrollbar lg:pl-4">
            
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-zinc-950 rounded-xl shadow-lg">
                            <Send size={18} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-mono leading-none">Highcore Agency Messenger</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-950 tracking-tight">
                        Bot <span className="text-zinc-300 font-medium">Messenger</span>
                    </h1>
                    <p className="text-sm font-semibold text-zinc-500 max-w-2xl">
                        Send custom messages or global broadcasts with attachments and smart emoji support.
                    </p>
                </div>

                <div className="flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 shadow-sm overflow-visible shrink-0">
                    <button 
                        onClick={() => setIsBroadcast(false)}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${!isBroadcast ? 'bg-white text-zinc-950 shadow-md border border-zinc-100' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                        <MessageSquare size={16} /> Direct Message
                    </button>
                    <button 
                        onClick={() => setIsBroadcast(true)}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${isBroadcast ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                        <Megaphone size={16} /> Global Broadcast
                    </button>
                </div>
            </header>

            {/* Content Card */}
            <div className="flex-1 pb-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm relative overflow-visible group"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 relative z-10">
                        <div className="space-y-6">
                            <DiscordSelect 
                                label={isBroadcast ? "Target Role (Optional)" : "Target Channel"}
                                type={isBroadcast ? "role" : "channel"} 
                                value={isBroadcast ? roleId : channelId}
                                onChange={isBroadcast ? setRoleId : setChannelId}
                                placeholder={isBroadcast ? "Send to everyone..." : "Search for a channel..."}
                            />

                            {isBroadcast && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <AlertCircle size={18} className="text-amber-600 mt-1 shrink-0" />
                                    <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                                        Safety Notice: Broadcasts are sent with a 7-second interval to protect the bot instance. Do not disconnect until finalized.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-2 font-mono">Attachment URLs (Optional)</label>
                            <div className="space-y-3">
                                {attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <input 
                                                type="text" 
                                                placeholder="https://image-url.png/image.jpg"
                                                value={att}
                                                onChange={(e) => updateAttachment(i, e.target.value)}
                                                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white outline-none transition-all font-semibold text-xs"
                                            />
                                        </div>
                                        {attachments.length > 1 && (
                                            <button 
                                                onClick={() => removeAttachment(i)}
                                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {attachments.length < 3 && (
                                    <button 
                                        onClick={addAttachment}
                                        className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-950 transition-colors pl-2"
                                    >
                                        <Plus size={14} /> Add another attachment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-2 font-mono">Message Content</label>
                        <div className="relative group">
                            <textarea 
                                rows={10} 
                                placeholder="Type your message here... (Use {user} to mention and {name} for member names)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] focus:bg-white outline-none transition-all font-bold text-zinc-900 leading-relaxed shadow-inner resize-none overflow-y-auto custom-scrollbar"
                            />
                            <div className="absolute bottom-6 right-8 flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                    <Zap size={14} className="text-zinc-400" /> Emojis Enabled
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Status
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-t border-zinc-50 pt-10">
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-1">Transmission Speed</span>
                                <span className="text-sm font-black text-zinc-950 tracking-tight">
                                    {isBroadcast ? "Slow (7s Sync)" : "Instant (<1s)"}
                                </span>
                            </div>
                            <div className="w-[1px] h-8 bg-zinc-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-1">Target Mode</span>
                                <span className="text-sm font-black text-zinc-950 tracking-tight">
                                    {isBroadcast ? "Global Outreach" : "Channel Direct"}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSend}
                            disabled={loading || (!message && !isBroadcast)}
                            className={`min-w-[240px] flex items-center justify-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isBroadcast ? 'bg-zinc-950 text-white hover:bg-black shadow-zinc-400/20' : 'bg-white text-zinc-950 border border-zinc-100 hover:bg-zinc-50 shadow-sm'}`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                            {isBroadcast ? "Start Broadcast" : "Send Message"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
