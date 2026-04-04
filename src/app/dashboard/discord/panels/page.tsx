"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelsTopLeft, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield, 
  Settings2, Activity, Terminal, RefreshCcw
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

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this Discord transmission?")) return;
    await supabase.from("dc_menus").delete().eq("menu_id", id);
    if (activeMenu?.menu_id === id) setActiveMenu(null);
    fetchMenus();
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <Zap size={18} className="text-zinc-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Architect Domain Console</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            System <span className="text-zinc-300">Panels</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Design high-end interactive interfaces for the High Core network architecture.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={fetchMenus}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={createNewMenu}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group italic tracking-widest"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                INITIATE NEW NODE
            </button>
        </div>
      </header>

      {/* Main Workspace - 3 Column Layout (SIDE-BY-SIDE, NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Column 1: Interactive List Rack */}
        <div className="xl:col-span-3 flex flex-col min-h-0">
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Global Rack</h3>
                <span className="text-[9px] font-black bg-zinc-950 text-white px-2.5 py-1 rounded-lg tracking-widest">{menus.length} ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-full p-10"><Loader2 className="animate-spin text-zinc-300" /></div>
                ) : menus.length === 0 ? (
                    <div className="p-12 text-center opacity-20"><Activity size={40} className="mx-auto mb-4" /><p className="text-sm font-black italic">No nodes detected.</p></div>
                ) : (
                    menus.map((menu) => (
                        <motion.button
                            key={menu.menu_id}
                            whileHover={{ x: 5 }}
                            onClick={() => handleEdit(menu)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all border ${
                                activeMenu?.menu_id === menu.menu_id 
                                ? "bg-zinc-950 text-white shadow-xl border-transparent" 
                                : "hover:bg-zinc-50 text-zinc-900 border-zinc-100 bg-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Layout size={16} className={activeMenu?.menu_id === menu.menu_id ? "text-zinc-400" : "text-zinc-300"} />
                                <div className="min-w-0">
                                    <span className="font-black italic text-sm leading-none block mb-1 truncate">{menu.title || "Untitled"}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest truncate block ${activeMenu?.menu_id === menu.menu_id ? "text-zinc-500" : "text-zinc-300"}`}>
                                        {menu.menu_id.replace("panel_", "")}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={14} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-20"} />
                        </motion.button>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* Column 2: Architect Workspace (Editor) */}
        <div className="xl:col-span-5 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
                {activeMenu ? (
                    <motion.div 
                        key={menuId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden"
                    >
                        <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                            <h3 className="text-sm font-black text-zinc-950 italic flex items-center gap-3 tracking-tighter uppercase">
                                <Sparkles size={18} className="text-zinc-400" /> Architect: <span className="text-zinc-400">{activeMenu.title}</span>
                            </h3>
                            <button 
                                onClick={() => handleDelete(activeMenu.menu_id)}
                                className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Internal ID</label>
                                    <input 
                                        type="text" 
                                        value={menuId} 
                                        onChange={(e) => setMenuId(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-zinc-950 transition-all outline-none focus:bg-white"
                                        placeholder="panel_unique_id"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Command Trigger</label>
                                    <div className="relative">
                                        <Terminal size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={triggerCommand} 
                                            onChange={(e) => setTriggerCommand(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-zinc-950 transition-all outline-none focus:bg-white"
                                            placeholder="support"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DiscordSelect 
                                label="Network Relay Channel"
                                type="channel"
                                value={channelId}
                                onChange={setChannelId}
                                placeholder="Select target route..."
                            />

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Headline Content</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-zinc-950 transition-all outline-none focus:bg-white"
                                    placeholder="Enter structural title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Payload Description</label>
                                <textarea 
                                    rows={3}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-800 leading-relaxed transition-all outline-none focus:bg-white resize-none"
                                    placeholder="Detailed payload data..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Asset URL (Embed Cover)</label>
                                <div className="relative">
                                    <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input 
                                        type="text" 
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-500 text-xs transition-all outline-none focus:bg-white"
                                        placeholder="https://assets.hc.agency/img.png"
                                    />
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-6 rounded-3xl text-white relative overflow-hidden group border border-white/5 transition-all hover:border-white/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Activity size={80} /></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-black text-[10px] italic tracking-widest flex items-center gap-2 uppercase">
                                        <Bot size={12} className="text-zinc-400" /> Action Nodes
                                    </h4>
                                    <button className="px-3 py-1.5 bg-white text-zinc-950 text-[8px] font-black rounded-lg hover:scale-105 transition-all uppercase tracking-widest">
                                        ADD_LOGIC
                                    </button>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group-hover:bg-white/10 transition-all cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-black text-[9px]">1</div>
                                        <span className="text-[10px] font-bold italic tracking-tight">Support Ticket Handshake</span>
                                    </div>
                                    <Trash2 size={12} className="opacity-20 hover:text-red-400 hover:opacity-100 transition-all cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-50/50 border-t border-zinc-50">
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-4 py-5 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 italic uppercase tracking-[0.4em]"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                                DEPLOY TO NETWORK
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-50/50 rounded-[2.5rem] text-center border-2 border-dashed border-zinc-200 opacity-20">
                        <Terminal size={60} className="mb-10 text-zinc-400" />
                        <h3 className="text-xl font-black text-zinc-950 tracking-tighter uppercase italic">Select node to initiate architect suite</h3>
                    </div>
                )}
            </AnimatePresence>
        </div>

        {/* Column 3: Live Mirror (Preview) */}
        <div className="xl:col-span-4 flex flex-col min-h-0 overflow-hidden">
             {/* Device Switcher */}
             <div className="bg-white p-2 rounded-2xl border border-zinc-100 mb-6 flex justify-center gap-2 shrink-0">
                 <button onClick={() => setIsPreviewMobile(false)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-[10px] font-black tracking-widest ${!isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-300 hover:text-zinc-950'}`}>
                    <Monitor size={14} /> DESKTOP
                 </button>
                 <button onClick={() => setIsPreviewMobile(true)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-[10px] font-black tracking-widest ${isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-300 hover:text-zinc-950'}`}>
                    <Smartphone size={14} /> MOBILE
                 </button>
             </div>

             <div className="flex-1 overflow-hidden relative group">
                <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreviewMobile ? 'max-w-[340px] mx-auto' : 'w-full'}`}>
                    <div className="h-full bg-[#2b2d31] rounded-[2.5rem] shadow-2xl flex flex-col border border-white/5 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-8 border-l-[6px] border-zinc-400 custom-scrollbar-discord space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-white font-black text-2xl tracking-tighter leading-tight">{title || "Structural Headline"}</h4>
                                <p className="text-[#dbdee1] text-sm leading-relaxed font-medium font-sans pr-4 opacity-90">
                                    {content || "Payload description will materialize here after network sync. Calibrate the editor logic to populate this view."}
                                </p>
                            </div>
                            
                            {imageUrl && (
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/5 transition-transform hover:scale-[1.02]">
                                    <img src={imageUrl} alt="Panel" className="w-full h-auto object-cover max-h-56" />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-4">
                                <button className="px-5 py-2.5 bg-[#4e5058] text-white text-[10px] font-black rounded-lg shadow-lg hover:bg-[#6d6f78] transition-all italic border-b-2 border-black/20">Open Ticket Handshake</button>
                            </div>
                        </div>
                        
                        <div className="px-8 py-4 bg-black/20 flex items-center justify-between border-t border-white/5 shrink-0">
                            <div className="flex items-center gap-3 opacity-30">
                                <Bot size={14} className="text-zinc-400" />
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em] italic leading-none">HC-PROTOCOL v2</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="mt-6 p-5 bg-zinc-950 text-white rounded-[2rem] text-[9px] font-black text-center uppercase tracking-[0.4em] shadow-2xl relative overflow-hidden group italic cursor-default shrink-0">
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="flex items-center justify-center gap-3"><Eye size={12} className="animate-pulse" /> DISCORD_CLOUD_SYNC_ACTIVE</span>
            </div>
        </div>
      </div>
    </div>
  );
}
