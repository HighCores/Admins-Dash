"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelsTopLeft, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function PanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [imageMode, setImageMode] = useState<"link" | "upload">("link");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_menus").select("*").eq("platform", "discord").order("position", { ascending: true });
    if (data) setMenus(data);
    setLoading(false);
  };

  const handleEdit = (menu: any) => {
    setActiveMenu(menu);
    setMenuId(menu.menu_id || "");
    setTitle(menu.title || "");
    setContent(menu.description || "");
    setImageUrl(menu.image_url || "");
    setChannelId(menu.channel_id || "");
  };

  const createNewMenu = () => {
    const newId = `panel_${Date.now()}`;
    const newMenu = { menu_id: newId, title: "New Panel", description: "Default description", platform: "discord" };
    setActiveMenu(newMenu);
    setMenuId(newId);
    setTitle(newMenu.title);
    setContent(newMenu.description);
    setImageUrl("");
    setChannelId("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_menus").upsert({
            menu_id: menuId,
            title: title,
            description: content,
            image_url: imageUrl,
            channel_id: channelId,
            platform: "discord",
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'menu_id' });

        if (error) throw error;

        // Log to dc_stats
        await supabase.from("dc_stats").insert({
            event_type: "panel_updated",
            details: `Panel ${title} was updated in the architect.`
        });

        alert("Panel deployed successfully! ⚡");
        fetchMenus();
    } catch (err: any) {
        alert(`Error saving panel: ${err.message}`);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this panel?")) return;
    setLoading(true);
    await supabase.from("dc_menus").delete().eq("menu_id", id);
    if (activeMenu?.menu_id === id) setActiveMenu(null);
    fetchMenus();
  };

  return (
    <div className="w-full space-y-12 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-sunset-500/10 text-sunset-600 rounded-2xl animate-pulse">
                <Zap size={24} />
            </div>
            <span className="text-xs font-black text-sunset-500 uppercase tracking-widest leading-none">The Architect</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Panels <span className="opacity-30">Designer</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic">
            Visual editor for Discord embeds. Create interactive menus with real-time preview and server synching.
          </p>
        </div>
        
        <button 
            onClick={createNewMenu}
            className="flex items-center gap-3 px-8 py-5 bg-sunset-900 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            INITIATE NEW PANEL
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: Interactive Menu Rack */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-card p-10 rounded-[3rem] border border-white/60 shadow-2xl bg-white/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-sunset-950 uppercase italic underline underline-offset-8 decoration-sunset-200">Active Rack</h3>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] px-3 py-1.5 rounded-full font-black tracking-widest">{menus.length} LIVE</span>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sunset-500" /></div>
            ) : (
                <div className="space-y-4">
                    {menus.map((menu) => (
                        <motion.button
                            key={menu.menu_id}
                            whileHover={{ x: 10 }}
                            onClick={() => handleEdit(menu)}
                            className={`w-full flex items-center justify-between p-6 rounded-[2rem] text-left transition-all border ${
                                activeMenu?.menu_id === menu.menu_id 
                                ? "bg-sunset-900 text-white shadow-2xl border-transparent" 
                                : "hover:bg-white text-sunset-950 border-sunset-50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <Layout size={20} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-20"} />
                                <div>
                                    <span className="font-black italic text-lg leading-none block mb-1">{menu.title || "Untitled"}</span>
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{menu.menu_id}</span>
                                </div>
                            </div>
                            <ChevronRight size={18} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-20"} />
                        </motion.button>
                    ))}
                </div>
            )}
          </div>
        </div>

        {/* Right: Core Architect Engine */}
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Editor Workspace */}
            <AnimatePresence mode="wait">
                {activeMenu ? (
                    <motion.div 
                        key={menuId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="glass-card p-10 rounded-[3rem] border border-white/80 shadow-2xl space-y-8 bg-white/60 backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-sunset-100 pb-6">
                                <h3 className="text-2xl font-black text-sunset-950 italic flex items-center gap-3 tracking-tighter">
                                    <Sparkles className="text-sunset-500" size={24} /> Neural Overlap: <span className="text-sunset-500">{activeMenu.title}</span>
                                </h3>
                                <button 
                                    onClick={() => handleDelete(activeMenu.menu_id)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={22} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-sunset-950/40 uppercase tracking-[0.2em] px-2 italic">Structural ID (Unique)</label>
                                    <input 
                                        type="text" 
                                        value={menuId} 
                                        onChange={(e) => setMenuId(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-sunset-50 font-black text-sunset-950 focus:ring-4 ring-sunset-500/5 outline-none transition-all"
                                        placeholder="panel_unique_id"
                                    />
                                </div>

                                <DiscordSelect 
                                    label="Target Deployment Channel"
                                    type="channel"
                                    value={channelId}
                                    onChange={setChannelId}
                                    placeholder="Select a Discord channel..."
                                />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-sunset-950/40 uppercase tracking-[0.2em] px-2 italic">Embed Headline</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-sunset-50 font-black text-sunset-900 placeholder:opacity-20 outline-none"
                                        placeholder="The BIG Catchy Title..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-sunset-950/40 uppercase tracking-[0.2em] px-2 italic">The Message Payload</label>
                                    <textarea 
                                        rows={6}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-sunset-50 font-medium text-sunset-800 leading-relaxed outline-none"
                                        placeholder="Describe the service or utility..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-sunset-950/40 uppercase tracking-[0.2em] italic">Visual Asset Overlay</label>
                                        <div className="flex bg-sunset-50 p-1 rounded-xl">
                                            <button 
                                                onClick={() => setImageMode("link")}
                                                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${imageMode === 'link' ? 'bg-white text-sunset-900 shadow-xl' : 'text-sunset-400'}`}>SOURCE LINK</button>
                                            <button 
                                                onClick={() => setImageMode("upload")}
                                                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${imageMode === 'upload' ? 'bg-white text-sunset-900 shadow-xl' : 'text-sunset-400'}`}>DIRECT UPLOAD</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {imageMode === "link" ? (
                                            <div className="relative">
                                                <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-400" />
                                                <input 
                                                    type="text" 
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-sunset-50 font-bold text-sunset-600 text-sm outline-none"
                                                    placeholder="https://content.highcore.bot/asset.png"
                                                />
                                            </div>
                                        ) : (
                                            <label className="w-full flex flex-col items-center justify-center py-10 px-6 bg-sunset-50/50 border-2 border-dashed border-sunset-200 rounded-[2.5rem] cursor-pointer hover:bg-sunset-100/50 transition-all group shadow-inner">
                                                <ImageIcon size={32} className="text-sunset-300 group-hover:text-sunset-600 mb-4 transition-transform group-hover:scale-125" />
                                                <span className="text-sm font-black text-sunset-600 underline underline-offset-4">Inject Asset from Terminal...</span>
                                                <input type="file" className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-sunset-900 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                                    PUSH TO SUPABASE PRODUCTION
                                </button>
                            </div>
                        </div>

                        {/* Interactive Logic Terminal (Buttons) */}
                        <div className="glass-card p-8 rounded-[3rem] border border-white/60 shadow-xl bg-gradient-to-br from-indigo-950 to-indigo-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><MousePointer2 size={120} /></div>
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-black text-xl italic flex items-center gap-3 subrayado-glow tracking-tighter">
                                    <Bot size={22} className="text-emerald-400" /> Action Nodes
                                </h4>
                                <button className="p-2 px-5 bg-white text-indigo-950 text-[10px] font-black rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                                     <Plus size={14} /> NEW NODE
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-all cursor-crosshair">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">1</div>
                                        <div>
                                            <div className="text-sm font-black italic">Claim Tickets</div>
                                            <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Logic: OPEN_MODAL</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-32 glass-card rounded-[4rem] text-center border-dashed border-4 border-sunset-100/50 bg-white/20">
                        <div className="p-10 bg-sunset-50 rounded-full mb-8 animate-pulse text-sunset-200">
                           <Layout size={80} />
                        </div>
                        <h3 className="text-3xl font-black text-sunset-900 opacity-20 tracking-tighter">SELECT A SYSTEM NODE TO INITIATE ARCHITECT</h3>
                    </div>
                )}
            </AnimatePresence>

            {/* Mirror Stream (Preview) */}
            <div className="hidden lg:block sticky top-8 self-start">
                <div className="flex items-center gap-3 mb-6 bg-white/50 w-fit p-1.5 rounded-[1.5rem] mx-auto shadow-sm border border-sunset-50">
                    <button onClick={() => setIsPreviewMobile(false)} className={`p-3 rounded-xl transition-all ${!isPreviewMobile ? 'bg-sunset-900 shadow-xl text-white' : 'text-sunset-400 hover:bg-white'}`}><Monitor size={20} /></button>
                    <button onClick={() => setIsPreviewMobile(true)} className={`p-3 rounded-xl transition-all ${isPreviewMobile ? 'bg-sunset-900 shadow-xl text-white' : 'text-sunset-400 hover:bg-white'}`}><Smartphone size={20} /></button>
                </div>

                <div className={`${isPreviewMobile ? 'w-[320px]' : 'w-full'} mx-auto transition-all duration-700 ease-in-out`}>
                    <div className="bg-[#2b2d31] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group border border-white/5">
                        {/* Glow Spectrum Border */}
                        <div className="absolute inset-0 border-2 border-sunset-500/0 rounded-[2rem] group-hover:border-sunset-500/20 transition-all duration-1000 pointer-events-none"></div>
                        
                        <div className="flex gap-6">
                            <div className="w-[6px] bg-sunset-500 rounded-full h-auto shadow-glow-sunset"></div>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-white font-black text-2xl tracking-tighter italic">{title || "The Epic Core Headline"}</h4>
                                    <p className="text-[#dbdee1] text-base leading-relaxed font-medium whitespace-pre-wrap opacity-90">
                                       {content || "Craft your message here... it supports Discord Markdown and renders with absolute precision across the High Core network."}
                                    </p>
                                </div>
                                
                                {imageUrl && (
                                    <div className="rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl group/img">
                                        <img src={imageUrl} alt="Panel" className="w-full h-auto object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-4">
                                    <button className="px-6 py-2 bg-[#4e5058] hover:bg-sunset-600 text-white text-xs font-black rounded-lg transition-all shadow-md italic">Claim Support</button>
                                    <button className="px-6 py-2 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-xs font-black rounded-lg transition-all shadow-md italic">View Docs</button>
                                </div>
                            </div>
                        </div>

                        {/* Branding Watermark */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 opacity-20 group-hover:opacity-60 transition-opacity">
                                <div className="p-1 bg-white rounded-md"><Bot size={12} className="text-black" /></div>
                                <span className="text-[10px] text-white font-black uppercase tracking-[0.3em] italic">High Core Protocol</span>
                            </div>
                            <span className="text-[10px] text-white/20 font-black italic">TRANSMISSION: ONLINE</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-5 bg-gradient-to-r from-sunset-900 to-black text-white rounded-[2rem] text-[10px] font-black text-center uppercase tracking-[0.4em] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="flex items-center justify-center gap-3"><Eye size={14} className="animate-pulse" /> Live Mirror Synchronized</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function User({ size, className }: any) { return <Bot size={size} className={className} /> }
