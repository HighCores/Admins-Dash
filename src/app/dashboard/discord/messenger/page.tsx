"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, Users, MessageSquare, Image as ImageIcon, 
    Zap, Sparkles, Loader2, AlertCircle, CheckCircle2,
    Megaphone, Trash2, Plus, Terminal, Cpu
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

    // These should ideally be in a central config or .env
    const BOT_API = process.env.NEXT_PUBLIC_BOT_API || "http://localhost:8080/api";
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "secret_key"; 

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
        <div className="w-full flex flex-col h-full overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
            
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 font-mono">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <Send size={18} className="text-emerald-500 crt-glow" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] leading-none">Subsystem // Comms Relay</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Protocol <span className="text-emerald-500 crt-glow">Messenger</span>
                    </h1>
                    <p className="text-sm font-medium text-zinc-500 max-w-2xl">
                        Despatching custom encrypted messages or global broadcasts across the Highcore Neural Net.
                    </p>
                </div>

                <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/5 shadow-2xl shrink-0">
                    <button 
                        onClick={() => setIsBroadcast(false)}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${!isBroadcast ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
                        <MessageSquare size={16} /> Direct Link
                    </button>
                    <button 
                        onClick={() => setIsBroadcast(true)}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${isBroadcast ? 'bg-emerald-500 text-black shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
                        <Megaphone size={16} /> Broadcast
                    </button>
                </div>
            </header>

            {/* Content Card */}
            <div className="flex-1 pb-10 overflow-y-auto custom-scrollbar">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="terminal-card rounded-[2.5rem] p-10 bg-zinc-950/40 relative overflow-hidden group border-white/5"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Terminal size={120} className="text-emerald-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 relative z-10 font-mono">
                        <div className="space-y-6">
                            <DiscordSelect 
                                label={isBroadcast ? "Target Role (Optional Descriptor)" : "Target Sync Channel"}
                                type={isBroadcast ? "role" : "channel"} 
                                value={isBroadcast ? roleId : channelId}
                                onChange={isBroadcast ? setRoleId : setChannelId}
                                placeholder={isBroadcast ? "Public despatches to all units..." : "Establishing channel lock..."}
                            />

                            {isBroadcast && (
                                <div className="flex items-start gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                                    <AlertCircle size={18} className="text-amber-500 mt-1 shrink-0 animate-pulse" />
                                    <p className="text-[10px] font-black text-amber-500/80 leading-loose uppercase tracking-widest">
                                        PROTOCOL_WARNING: Global broadcasts are metered at 7-second intervals to maintain bot fidelity. Node connection must remain active.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block pl-2">Attachment Telemetry (RAW_URL)</label>
                            <div className="space-y-3">
                                {attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-3 group/att">
                                        <div className="relative flex-1">
                                            <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/att:text-emerald-500 transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="https://cdn.highcore.link/asset.jpg"
                                                value={att}
                                                onChange={(e) => updateAttachment(i, e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl outline-none focus:border-emerald-500/30 focus:bg-zinc-950 transition-all font-black text-[10px] uppercase tracking-widest text-zinc-300 placeholder:text-zinc-800"
                                            />
                                        </div>
                                        {attachments.length > 1 && (
                                            <button 
                                                onClick={() => removeAttachment(i)}
                                                className="p-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {attachments.length < 3 && (
                                    <button 
                                        onClick={addAttachment}
                                        className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] hover:text-emerald-500 transition-colors pl-2 mt-4"
                                    >
                                        <Plus size={14} /> Add Peripheral Link
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10 font-mono">
                        <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block pl-2 italic underline decoration-white/5 underline-offset-8">Data Stream Payload</label>
                        <div className="relative group/msg">
                            <textarea 
                                rows={8} 
                                placeholder="Enter payload content... // {user} = Mention // {name} = ID_STRING"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-8 bg-black/40 border border-white/5 rounded-[2.5rem] focus:bg-zinc-950 focus:border-emerald-500/20 outline-none transition-all font-bold text-zinc-400 leading-relaxed shadow-inner resize-none overflow-y-auto custom-scrollbar font-sans text-sm"
                            />
                            <div className="absolute bottom-10 right-10 flex items-center gap-6 opacity-30 group-hover/msg:opacity-100 transition-opacity pointer-events-none">
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 font-mono">
                                    <Zap size={14} className="crt-glow" /> Emoji_Sync_Enabled
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-zinc-500 font-mono">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 crt-glow animate-pulse" /> Live_Telemetry
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-t border-white/5 pt-10">
                        <div className="flex items-center gap-10 font-mono">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-zinc-700 uppercase leading-none mb-2 tracking-widest">Despatch Latency</span>
                                <span className={`text-sm font-black italic tracking-tighter ${isBroadcast ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {isBroadcast ? "7,000ms // Metered" : "Direct // Realtime"}
                                </span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-zinc-700 uppercase leading-none mb-2 tracking-widest">Protocol Mode</span>
                                <span className="text-sm font-black text-white italic tracking-tighter">
                                    {isBroadcast ? "Global Outbound" : "Channel Lock"}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSend}
                            disabled={loading || (!message && !isBroadcast)}
                            className={`min-w-[280px] flex items-center justify-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95 disabled:opacity-20 ${isBroadcast ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20' : 'bg-white text-black hover:bg-emerald-500 hover:text-white'}`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                            {isBroadcast ? "Inactivate Broadcast" : "Confirm Despatch"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
