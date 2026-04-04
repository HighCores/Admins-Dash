"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield, Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramPanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [menuId, setMenuId] = useState("");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_menus").select("*").eq("platform", "telegram").order("position", { ascending: true });
    if (data) setMenus(data);
    setLoading(false);
  };

  const handleEdit = (menu: any) => {
    setActiveMenu(menu);
    setMenuId(menu.menu_id || "");
    setTitle(menu.title || "");
    setContent(menu.description || "");
    setImageUrl(menu.image_url || "");
  };

  const createNewMenu = () => {
    const newId = `tele_panel_${Date.now()}`;
    const newMenu = { menu_id: newId, title: "New Telegram Panel", description: "Default description", platform: "telegram" };
    setActiveMenu(newMenu);
    setMenuId(newId);
    setTitle(newMenu.title);
    setContent(newMenu.description);
    setImageUrl("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_menus").upsert({
            menu_id: menuId,
            title: title,
            description: content,
            image_url: imageUrl,
            platform: "telegram",
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'menu_id' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "tg_panel_updated",
            details: `Telegram Panel ${title} was updated.`
        });

        alert("Telegram Logic Synchronized! ✈️");
        fetchMenus();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this Telegram transmission?")) return;
    await supabase.from("dc_menus").delete().eq("menu_id", id);
    if (activeMenu?.menu_id === id) setActiveMenu(null);
    fetchMenus();
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl animate-pulse shadow-glow-blue-small">
                <Send size={24} />
            </div>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest leading-none font-mono italic">Telegram Architect</span>
          </div>
          <h1 className="text-5xl font-black text-blue-950 tracking-tighter glow-text-blue">
            Cloud <span className="opacity-30">Panels</span>
          </h1>
          <p className="text-lg font-medium text-blue-900/60 max-w-2xl italic leading-relaxed">
            N8N-powered visual editor for Telegram bot menus. Design the interface, link the webhooks, and deploy instantly to all users.
          </p>
        </div>
        
        <button 
            onClick={createNewMenu}
            className="flex items-center gap-3 px-8 py-5 bg-blue-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all group italic"
        >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            INITIALIZE TELE_NODE
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Proxy Rack */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-card p-10 rounded-[3rem] border border-blue-50 shadow-2xl bg-white/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-blue-950 uppercase italic underline underline-offset-8 decoration-blue-100">Live Proxies</h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1.5 rounded-full font-black tracking-widest leading-none underline decoration-blue-200">{menus.length} ACTIVE</span>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
                <div className="space-y-4">
                    {menus.map((menu) => (
                        <motion.button
                            key={menu.menu_id}
                            whileHover={{ x: 10 }}
                            onClick={() => handleEdit(menu)}
                            className={`w-full flex items-center justify-between p-6 rounded-[2rem] text-left transition-all border ${
                                activeMenu?.menu_id === menu.menu_id 
                                ? "bg-blue-950 text-white shadow-2xl border-transparent" 
                                : "hover:bg-white text-blue-950 border-blue-50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <Share2 size={18} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-20"} />
                                <div>
                                    <span className="font-black italic text-lg leading-none block mb-1">{menu.title || "Untitled"}</span>
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{menu.menu_id}</span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}
          </div>
        </div>

        {/* Right: Tele-Engine Architect */}
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Editor Workspace */}
            <AnimatePresence mode="wait">
                {activeMenu ? (
                    <motion.div 
                        key={menuId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="glass-card p-10 rounded-[3rem] border border-blue-100 shadow-2xl space-y-8 bg-white/60 backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-blue-50 pb-6">
                                <h3 className="text-2xl font-black text-blue-950 italic flex items-center gap-3 tracking-tighter">
                                    <Sparkles className="text-blue-500" size={24} /> Transmission: <span className="text-blue-500">{activeMenu.title}</span>
                                </h3>
                                <button 
                                    onClick={() => handleDelete(activeMenu.menu_id)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={22} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Structural ID (Unique)</label>
                                    <input 
                                        type="text" 
                                        value={menuId} 
                                        onChange={(e) => setMenuId(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-blue-50 font-black text-blue-950 focus:ring-8 ring-blue-500/5 transition-all outline-none"
                                        placeholder="tele_unique_id"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Panel Headline</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-blue-50 font-black text-blue-950 outline-none"
                                        placeholder="The BIG Catchy Title..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">The Message Payload</label>
                                    <textarea 
                                        rows={6}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-blue-50 font-bold text-blue-800 leading-relaxed outline-none"
                                        placeholder="Describe the logic flow..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-2 italic font-mono">Asset Mirror Link</label>
                                    <div className="relative">
                                        <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" />
                                        <input 
                                            type="text" 
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-blue-50 font-bold text-blue-600 outline-none"
                                            placeholder="https://t.me/i/asset.png"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-blue-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 italic uppercase tracking-widest"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                                    PUSH TO TELEGRAM NETWORK
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-32 glass-card rounded-[4rem] text-center border-dashed border-4 border-blue-100/50 bg-white/20">
                        <div className="p-10 bg-blue-50 rounded-full mb-8 animate-pulse text-blue-200">
                           <Layout size={80} />
                        </div>
                        <h3 className="text-3xl font-black text-blue-900 opacity-20 tracking-tighter uppercase italic">Select a node to initiate architect</h3>
                    </div>
                )}
            </AnimatePresence>

            {/* Telegram Mirror (Preview) */}
            <div className="hidden lg:block sticky top-8 self-start">
                <div className="w-full mx-auto transition-all duration-700 ease-in-out">
                    <div className="bg-[#242f3d] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Send size={150} /></div>
                        
                        <div className="space-y-6">
                             {imageUrl && (
                                <div className="rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl max-h-60">
                                    <img src={imageUrl} alt="Panel" className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            <div className="space-y-3">
                                <h4 className="text-blue-400 font-black text-xl italic tracking-tighter leading-none">{title || "Telegram_Node_Title"}</h4>
                                <p className="text-[#dbdee1] text-base leading-relaxed font-medium whitespace-pre-wrap opacity-90">
                                   {content || "Craft your message here... Telegram messages are delivered via High Core's N8N Relay Hub."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2 pt-4">
                                <button className="w-full py-3 bg-[#3390ec] text-white text-xs font-black rounded-lg shadow-xl shadow-blue-500/20 italic">Action: Trigger Webhook</button>
                                <button className="w-full py-3 border border-blue-500/30 text-blue-400 text-xs font-black rounded-lg italic">Secondary Flow</button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 opacity-20">
                                <Bot size={12} className="text-blue-400" />
                                <span className="text-[10px] text-white font-black uppercase tracking-[0.3em] font-mono italic">Proxy Status</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-black italic">CONNECTED</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-5 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-[2rem] text-[10px] font-black text-center uppercase tracking-[0.4em] shadow-2xl relative overflow-hidden group italic">
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="flex items-center justify-center gap-3"><Eye size={14} className="animate-pulse" /> Telegram Cloud Sync Active</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
