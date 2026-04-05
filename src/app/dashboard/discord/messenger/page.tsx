"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, Users, MessageSquare, Image as ImageIcon, 
    Zap, Sparkles, Loader2, AlertCircle, CheckCircle2,
    LayoutDashboard, Megaphone, Terminal, Trash2, Plus
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
    const API_KEY = "secret_key"; // Matches Config.API_KEY default

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
        if (!message) return showToast("يرجى كتابة نص الرسالة أولاً.", true);
        if (!isBroadcast && !channelId) return showToast("يرجى اختيار القناة أولاً.", true);

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
                throw new Error(err.error || "Failed to communicate with bot.");
            }

            showToast(isBroadcast ? "تم بدء عملية البرودكاست بنجاح! 🚀" : "تم إرسال الرسالة بنجاح! ✅");
            if (!isBroadcast) setMessage(""); // Clear message if simple send
            
        } catch (err: any) {
            showToast(`فشل الإرسال: ${err.message}`, true);
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
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-mono leading-none">Highcore Messenger Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
                        Bot <span className="text-zinc-300">Messenger</span>
                    </h1>
                    <p className="text-sm font-bold text-zinc-500 max-w-2xl">
                        ارسل رسائل احترافية بضغطة زر. يدعم الإيموجي والمنشن والمرفقات المتعددة.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
                    <button 
                        onClick={() => setIsBroadcast(false)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-xs transition-all ${!isBroadcast ? 'bg-white text-zinc-950 shadow-md border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <MessageSquare size={16} /> رسالة بسيطة
                    </button>
                    <button 
                        onClick={() => setIsBroadcast(true)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-xs transition-all ${isBroadcast ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <Megaphone size={16} /> برودكاست شامل
                    </button>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 min-h-0 pb-10">
                
                {/* Left: Editor (8 cols) */}
                <div className="xl:col-span-12 flex flex-col gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000 rotate-12">
                            {isBroadcast ? <Megaphone size={200} /> : <MessageSquare size={200} />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-4 italic">
                                    {isBroadcast ? "\u0631\u062a\u0628\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u064a\u0646 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)" : "\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0642\u0646\u0627\u0629"}
                                </label>
                                <DiscordSelect 
                                    type={isBroadcast ? "role" : "channel"} 
                                    value={isBroadcast ? roleId : channelId}
                                    onChange={isBroadcast ? setRoleId : setChannelId}
                                    placeholder={isBroadcast ? "ارسل للجميع (بدون تحديد)" : "ابحث عن قناة..."}
                                />
                                {isBroadcast && (
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <AlertCircle size={18} className="text-amber-600 mt-1 shrink-0" />
                                        <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                                            تحذير: سيتم إرسال هذا البرودكاست لجميع الأعضاء بفارق 7 ثوانٍ لضمان سلامة البوت. لا تغلق الصفحة حتى تتأكد من بدء العملية.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-4 italic">
                                    روابط المرفقات (صور)
                                </label>
                                <div className="space-y-3">
                                    {attachments.map((att, i) => (
                                        <div key={i} className="flex items-center gap-3 group/item">
                                            <div className="relative flex-1">
                                                <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover/item:text-zinc-950 transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="https://image-url.png"
                                                    value={att}
                                                    onChange={(e) => updateAttachment(i, e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white outline-none transition-all font-bold text-xs italic"
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
                                            className="flex items-center gap-3 text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-950 transition-colors italic px-4 group"
                                        >
                                            <Plus size={14} className="group-hover:rotate-90 transition-transform" /> {attachments.length === 0 ? "\u0625\u0636\u0627\u0641\u0629 \u0645\u0631\u0641\u0642" : "\u0625\u0636\u0627\u0641\u0629 \u0645\u0631\u0641\u0642 \u0622\u062e\u0631"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-4 italic">
                                محتوى الرسالة
                            </label>
                            <div className="relative group">
                                <textarea 
                                    rows={10} 
                                    placeholder="Type your message here... (Use {user} to mention and {name} for name)"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] focus:bg-white outline-none transition-all font-bold text-zinc-900 leading-relaxed italic shadow-inner resize-none overflow-hidden"
                                />
                                <div className="absolute bottom-6 right-8 flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                        <Zap size={14} className="text-zinc-400" /> Smart Emoji Active
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Markdown Support
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Estimated Delay</span>
                                    <span className="text-sm font-black text-zinc-950 italic tracking-tighter">
                                        {isBroadcast ? "~7 seconds per message" : "Instant (<1s)"}
                                    </span>
                                </div>
                                <div className="w-[1px] h-8 bg-zinc-100 hidden md:block" />
                                <div className="flex flex-col hidden md:flex">
                                    <span className="text-[9px] font-black text-zinc-300 uppercase leading-none mb-1">Target Registry</span>
                                    <span className="text-sm font-black text-zinc-950 italic tracking-tighter">
                                        {isBroadcast ? (roleId ? "Segmented Role Rank" : "Global User Index") : (channelId ? "Specific Signal Node" : "Waiting for Node ID...")}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={handleSend}
                                disabled={loading || (!message && !isBroadcast)}
                                className={`flex items-center gap-6 px-12 py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] italic text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isBroadcast ? 'bg-zinc-950 text-white hover:bg-black shadow-zinc-400/20' : 'bg-zinc-50 text-zinc-950 hover:bg-zinc-100 shadow-zinc-100'}`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className={isBroadcast ? 'text-zinc-400' : 'text-zinc-600'} />}
                                {isBroadcast ? "\u0641\u062a\u062d \u0642\u0646\u0627\u0629 \u0627\u0644\u0628\u0631\u0648\u062f\u0643\u0627\u0633\u062a" : "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
