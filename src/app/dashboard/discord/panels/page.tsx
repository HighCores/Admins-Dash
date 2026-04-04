"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelsTopLeft, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield, 
  Settings2, Activity, Terminal
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
  const [triggerCommand, setTriggerCommand] = useState("");
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
    setTriggerCommand(menu.trigger_command || "");
  };

  const createNewMenu = () => {
    const newId = `panel_${Date.now()}`;
    const newMenu = { menu_id: newId, title: "New Dynamic Panel", description: "Default payload description", platform: "discord" };
    setActiveMenu(newMenu);
    setMenuId(newId);
    setTitle(newMenu.title);
    setContent(newMenu.description);
    setImageUrl("");
    setChannelId("");
    setTriggerCommand("");
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
            trigger_command: triggerCommand,
            platform: "discord",
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'menu_id' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "panel_updated",
            details: `Panel ${title} was recalibrated.`
        });

        alert("System Synchronized! ⚡");
        fetchMenus();
    } catch (err: any) {
        alert(`ERR_LOGIC: ${err.message}`);
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <Zap size={20} className="text-zinc-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Architect Domain</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            System <span className="text-zinc-300">Panels</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Design high-end interactive interfaces. All changes propagate instantly through the High Core network.
          </p>
        </div>
        
        <button 
            onClick={createNewMenu}
            className="flex items-center gap-4 px-8 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 italic tracking-widest"
        >
            <Plus size={18} /> INITIATE NEW NODE
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Interactive List Rack */}
        <div className="xl:col-span-3 flex flex-col min-h-0">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Rack</span>
                <span className="text-[9px] font-black bg-zinc-950 text-white px-2 py-1 rounded-md">{menus.length} ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-zinc-300" /></div>
                ) : (
                    menus.map((menu) => (
                        <button
                            key={menu.menu_id}
                            onClick={() => handleEdit(menu)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all group ${
                                activeMenu?.menu_id === menu.menu_id 
                                ? "bg-zinc-950 text-white shadow-xl shadow-zinc-200" 
                                : "hover:bg-zinc-50 text-zinc-900 border border-transparent hover:border-zinc-100"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Layout size={16} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-30"} />
                                <div className="truncate">
                                    <span className="font-bold text-sm block truncate pr-4">{menu.title || "Untitled"}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${activeMenu?.menu_id === menu.menu_id ? "text-zinc-500" : "text-zinc-300"}`}>
                                        {menu.menu_id.replace("panel_", "")}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={14} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-20"} />
                        </button>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* Center: The Core Architect */}
        <div className="xl:col-span-5 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
                {activeMenu ? (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-zinc-50 rounded-2xl"><Settings2 className="text-zinc-900" size={20} /></div>
                                    <h3 className="font-black text-xl tracking-tighter">Edit System Node</h3>
                                </div>
                                <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Structural ID</label>
                                        <input 
                                            type="text" 
                                            value={menuId} 
                                            onChange={(e) => setMenuId(e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Triggering Command</label>
                                        <div className="relative">
                                            <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <input 
                                                type="text" 
                                                value={triggerCommand} 
                                                onChange={(e) => setTriggerCommand(e.target.value)}
                                                className="w-full pl-10 pr-5 py-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 focus:bg-white transition-all outline-none"
                                                placeholder="e.g. support"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DiscordSelect 
                                    label="Target Relay Channel"
                                    type="channel"
                                    value={channelId}
                                    onChange={setChannelId}
                                    placeholder="Select deployment route..."
                                />

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Headline Content</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-900 outline-none hover:border-zinc-200 focus:bg-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Payload Body</label>
                                    <textarea 
                                        rows={4}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-800 leading-relaxed outline-none hover:border-zinc-200 focus:bg-white"
                                    />
                                </div>

                                <div className="space-y-3">
                                     <div className="flex justify-between items-center px-1">
                                         <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Visual Asset URL</label>
                                         <LinkIcon size={12} className="text-zinc-300" />
                                     </div>
                                     <input 
                                        type="text" 
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-500 text-xs outline-none"
                                        placeholder="https://content.asset.bot/img.png"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full py-5 bg-zinc-950 text-white font-black text-[10px] rounded-xl shadow-xl hover:bg-black transition-all disabled:opacity-50 tracking-[0.4em]"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : "DEPLOY TO NETWORK"}
                                </button>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Activity size={100} /></div>
                             <div className="flex items-center justify-between mb-6">
                                <h4 className="font-black text-sm italic tracking-widest flex items-center gap-2">
                                   <Bot size={16} /> ACTION NODES
                                </h4>
                                <button className="px-4 py-2 bg-white text-zinc-950 text-[9px] font-black rounded-lg hover:scale-102 transition-transform">
                                     NEW ACTION
                                </button>
                             </div>
                             <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px]">1</div>
                                    <span className="text-xs font-bold italic">Open Ticket Logic</span>
                                </div>
                                <Trash2 size={14} className="opacity-20 hover:text-red-400 hover:opacity-100" />
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-20 bg-zinc-50/50 rounded-[3rem] text-center border-dashed border-2 border-zinc-200">
                        <Layout size={40} className="text-zinc-200 mb-6" />
                        <h3 className="text-sm font-black text-zinc-300 tracking-[0.3em] uppercase">Select Node to Architect</h3>
                    </div>
                )}
            </AnimatePresence>
        </div>

        {/* Right: Mirror Stream Viewable (High End) */}
        <div className="xl:col-span-4 self-start">
             <div className="bg-white p-4 rounded-3xl border border-zinc-100 mb-6 flex justify-center gap-2">
                 <button onClick={() => setIsPreviewMobile(false)} className={`p-4 rounded-2xl transition-all ${!isPreviewMobile ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-300'}`}><Monitor size={20} /></button>
                 <button onClick={() => setIsPreviewMobile(true)} className={`p-4 rounded-2xl transition-all ${isPreviewMobile ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-300'}`}><Smartphone size={20} /></button>
             </div>

             <div className={`${isPreviewMobile ? 'w-[320px]' : 'w-full'} mx-auto bg-[#2b2d31] rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}>
                <div className="p-8 border-l-[6px] border-zinc-400 flex flex-col gap-6">
                    <div className="space-y-4">
                        <h4 className="text-white font-black text-xl tracking-tight">{title || "Structural Headline"}</h4>
                        <p className="text-[#dbdee1] text-sm leading-relaxed font-medium">
                            {content || "Payload description will materialize here after network sync."}
                        </p>
                    </div>
                    {imageUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-inner border border-white/5">
                            <img src={imageUrl} alt="Panel" className="w-full h-auto object-cover" />
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button className="px-5 py-2.5 bg-[#4e5058] text-white text-[10px] font-black rounded-lg shadow-lg">Primary Action</button>
                    </div>
                </div>
                <div className="px-8 py-4 bg-black/20 flex items-center justify-between border-t border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">High Core Payload</span>
                    <Bot size={14} className="text-white/20" />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
