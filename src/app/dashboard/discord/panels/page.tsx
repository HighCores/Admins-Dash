"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelsTopLeft, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield, 
  Settings2, Activity, Terminal, RefreshCcw, CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function PanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [buttons, setButtons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topImageUrl, setTopImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [triggerCommand, setTriggerCommand] = useState("");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    // Legacy support: Include records where platform is NULL as they were likely Discord panels.
    const { data } = await supabase
        .from("dc_menus")
        .select("*")
        .or('platform.eq.discord,platform.is.null')
        .order("created_at", { ascending: false });
    
    if (data) setMenus(data);
    setLoading(false);
  };

  const fetchButtons = async (mId: string) => {
    const { data } = await supabase.from("dc_buttons").select("*").eq("menu_id", mId).order("position", { ascending: true });
    if (data) setButtons(data);
  };

  const handleEdit = (menu: any) => {
    setActiveMenu(menu);
    setMenuId(menu.menu_id || "");
    setTitle(menu.title || "");
    setContent(menu.description || "");
    setTopImageUrl(menu.top_image_url || "");
    setImageUrl(menu.image_url || "");
    setChannelId(menu.channel_id || "");
    setTriggerCommand(menu.trigger_command || "");
    setColor(menu.color_hex || "#ffffff");
    fetchButtons(menu.menu_id);
  };

  const createNewMenu = () => {
    const newId = `panel_${Date.now()}`;
    const newMenu = { menu_id: newId, title: "New Dynamic Panel", description: "Default payload description", platform: "discord" };
    setActiveMenu(newMenu);
    setMenuId(newId);
    setTitle(newMenu.title);
    setContent(newMenu.description);
    setTopImageUrl("");
    setImageUrl("");
    setChannelId("");
    setTriggerCommand("");
    setColor("#ffffff");
    setButtons([]);
  };

  const handleSave = async () => {
    if (!menuId || !title) return showToast("ID and Title are mandatory nodes.", true);
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_menus").upsert({
            menu_id: menuId,
            title: title,
            description: content,
            top_image_url: topImageUrl,
            image_url: imageUrl,
            channel_id: channelId,
            trigger_command: triggerCommand,
            color_hex: color,
            platform: "discord",
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'menu_id' });

        if (error) throw error;

        // Save buttons: Delete existing ones first to ensure clean state
        await supabase.from("dc_buttons").delete().eq("menu_id", menuId);
        
        if (buttons.length > 0) {
            const buttonsToInsert = buttons.map((b, i) => ({
                menu_id: menuId,
                label: b.label,
                emoji: b.emoji,
                action_id: b.action_id,
                button_style: b.button_style || 'PRIMARY',
                position: i
            }));
            await supabase.from("dc_buttons").insert(buttonsToInsert);
        }

        showToast("System Synchronized! ⚡");
        fetchMenus();
    } catch (err: any) {
        showToast(`ERR_LOGIC: ${err.message}`, true);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this Discord transmission?")) return;
    await supabase.from("dc_menus").delete().eq("menu_id", id);
    if (activeMenu?.menu_id === id) setActiveMenu(null);
    fetchMenus();
    showToast("Interface nexus purged.");
  };

  const addButton = () => {
    setButtons([...buttons, { label: 'New Action', action_id: 'open_ticket', button_style: 'PRIMARY', emoji: '' }]);
  };

  const removeButton = async (index: number, bId?: any) => {
    if (bId) {
        await supabase.from("dc_buttons").delete().eq("id", bId);
    }
    const nb = [...buttons];
    nb.splice(index, 1);
    setButtons(nb);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible p-1">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <Zap size={18} className="text-zinc-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Architect Domain Console</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">
            Bot <span className="text-zinc-500">Panels</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-md">
            Design and manage interactive messages for your community.
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
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-bold text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group tracking-widest uppercase"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                New Panel
            </button>
        </div>
      </header>

      {/* Main Workspace - 3 Column Layout (SIDE-BY-SIDE) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-y-auto xl:overflow-visible p-1">
        
        {/* Column 1: Interactive List Rack */}
        <div className="xl:col-span-3 flex flex-col min-h-0">
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
            <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">All Panels</h3>
                <span className="text-[9px] font-bold bg-zinc-950 text-white px-2.5 py-1 rounded-lg tracking-widest leading-none">{menus.length} ACTIVE</span>
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
                                    <span className="font-bold text-sm leading-none block mb-1 truncate">{menu.title || "Untitled"}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest truncate block ${activeMenu?.menu_id === menu.menu_id ? "text-zinc-500" : "text-zinc-300"}`}>
                                        ID: {menu.menu_id.replace("panel_", "")}
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
                        className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible"
                    >
                        <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-3 tracking-tighter uppercase">
                                <Sparkles size={18} className="text-zinc-400" /> Designer: <span className="text-zinc-400 truncate max-w-[200px]">{title}</span>
                            </h3>
                            <button 
                                onClick={() => handleDelete(activeMenu.menu_id)}
                                className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 overflow-x-visible">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Panel ID</label>
                                    <input 
                                        type="text" 
                                        value={menuId} 
                                        onChange={(e) => setMenuId(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 transition-all outline-none focus:bg-white shadow-inner"
                                        placeholder="panel_main"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Bot Command</label>
                                    <div className="relative">
                                        <Terminal size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={triggerCommand} 
                                            onChange={(e) => setTriggerCommand(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 transition-all outline-none focus:bg-white shadow-inner"
                                            placeholder="support"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DiscordSelect 
                                label="Send to Channel"
                                type="channel"
                                value={channelId}
                                onChange={setChannelId}
                                placeholder="Select channel..."
                            />

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Panel Tint (Hex)</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="color" 
                                        className="w-12 h-12 rounded-xl cursor-pointer border-4 border-white shadow-xl bg-transparent"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                    <input 
                                        type="text" 
                                        className="flex-1 p-3 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-xs text-zinc-950 outline-none uppercase tracking-widest italic"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Embed Title</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 transition-all outline-none focus:bg-white shadow-inner"
                                    placeholder="Enter title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Embed Message</label>
                                <textarea 
                                    rows={3}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-800 leading-relaxed transition-all outline-none focus:bg-white shadow-inner"
                                    placeholder="Type message..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Top Banner URL</label>
                                    <div className="relative">
                                        <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={topImageUrl}
                                            onChange={(e) => setTopImageUrl(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-500 text-xs transition-all outline-none focus:bg-white shadow-inner"
                                            placeholder="https://assets.hc.agency/top.png"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Bottom Banner URL</label>
                                    <div className="relative">
                                        <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-500 text-xs transition-all outline-none focus:bg-white shadow-inner"
                                            placeholder="https://assets.hc.agency/bottom.png"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-6 rounded-3xl text-white relative overflow-visible group border border-white/5 transition-all hover:border-white/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Activity size={80} /></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-[10px] tracking-widest flex items-center gap-2 uppercase">
                                        <Bot size={12} className="text-zinc-400" /> Buttons
                                    </h4>
                                    <button 
                                        onClick={addButton}
                                        className="px-3 py-1.5 bg-white text-zinc-950 text-[10px] font-bold rounded-lg hover:scale-105 transition-all">+ Add Button</button>
                                </div>
                                <div className="space-y-2">
                                    {buttons.map((btn, idx) => (
                                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3 group/btn hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[10px]">{idx + 1}</div>
                                                    <input 
                                                        type="text"
                                                        value={btn.emoji || ''}
                                                        onChange={(e) => {
                                                            const nb = [...buttons];
                                                            nb[idx].emoji = e.target.value;
                                                            setButtons(nb);
                                                        }}
                                                        className="w-8 text-center bg-black/20 rounded-md py-1 border-none outline-none text-[12px] placeholder:text-[8px] placeholder:opacity-50"
                                                        placeholder="🚀"
                                                    />
                                                    <input 
                                                        type="text"
                                                        value={btn.label}
                                                        onChange={(e) => {
                                                            const nb = [...buttons];
                                                            nb[idx].label = e.target.value;
                                                            setButtons(nb);
                                                        }}
                                                        className="bg-transparent border-none outline-none text-[12px] font-bold tracking-tight text-white placeholder:opacity-20 flex-1"
                                                        placeholder="Button Label..."
                                                    />
                                                </div>
                                                <button onClick={() => removeButton(idx, btn.id)} className="p-1 hover:text-red-400 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2">
                                                <input 
                                                    type="text"
                                                    value={btn.action_id}
                                                    onChange={(e) => {
                                                        const nb = [...buttons];
                                                        nb[idx].action_id = e.target.value;
                                                        setButtons(nb);
                                                    }}
                                                    className="col-span-4 bg-black/40 px-3 py-1.5 rounded-lg text-[8px] font-mono text-zinc-400 border border-white/5 outline-none"
                                                    placeholder="action_id..."
                                                />
                                                <input 
                                                    type="text"
                                                    value={btn.emoji || ""}
                                                    onChange={(e) => {
                                                        const nb = [...buttons];
                                                        nb[idx].emoji = e.target.value;
                                                        setButtons(nb);
                                                    }}
                                                    className="col-span-3 bg-black/40 px-3 py-1.5 rounded-lg text-[8px] font-mono text-zinc-400 border border-white/5 outline-none"
                                                    placeholder="Emoji..."
                                                />
                                                <select 
                                                    value={btn.button_style}
                                                    onChange={(e) => {
                                                        const nb = [...buttons];
                                                        nb[idx].button_style = e.target.value;
                                                        setButtons(nb);
                                                    }}
                                                    className="col-span-5 bg-black/40 px-3 py-1.5 rounded-lg text-[8px] font-mono text-zinc-400 border border-white/5 outline-none"
                                                >
                                                    <option value="PRIMARY">PRIMARY</option>
                                                    <option value="SECONDARY">SECONDARY</option>
                                                    <option value="SUCCESS">SUCCESS</option>
                                                    <option value="DANGER">DANGER</option>
                                                    <option value="LINK">LINK (URL)</option>
                                                </select>
                                            </div>
                                        </div>
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
                                Save Panel
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-50/50 rounded-[2.5rem] text-center border-2 border-dashed border-zinc-200 opacity-50">
                        <Layout size={60} className="mb-6 text-zinc-400" />
                        <h3 className="text-xl font-bold text-zinc-600">Select a panel to edit</h3>
                    </div>
                )}
            </AnimatePresence>
        </div>

        {/* Column 3: Live Mirror (Preview) */}
        <div className="xl:col-span-4 flex flex-col min-h-0 overflow-visible">
             {/* Device Switcher */}
             <div className="bg-white p-2 rounded-2xl border border-zinc-100 mb-6 flex justify-center gap-2 shrink-0">
                 <button onClick={() => setIsPreviewMobile(false)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs font-bold ${!isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}>
                    <Monitor size={14} /> Desktop
                 </button>
                 <button onClick={() => setIsPreviewMobile(true)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs font-bold ${isPreviewMobile ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-950'}`}>
                    <Smartphone size={14} /> Mobile
                 </button>
             </div>
 
             <div className="flex-1 overflow-visible relative group">
                <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreviewMobile ? 'max-w-[340px] mx-auto' : 'w-full'}`}>
                    {/* Realistic Discord UI background */}
                    <div className="h-full bg-[#313338] rounded-[2.5rem] shadow-2xl flex flex-col border border-[#1e1f22] overflow-visible !font-sans">
                        
                        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar flex flex-col gap-3">
                            {/* Discord Message Header Info */}
                            <div className="flex items-center gap-3 px-1 mb-1">
                                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white"><Bot size={24} /></div>
                                <div>
                                    <h4 className="flex items-center gap-1 font-semibold text-white/90 leading-tight">High Core <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded flex items-center font-bold">APP</span></h4>
                                    <span className="text-[#949ba4] text-[11px]">Today at 12:00 PM</span>
                                </div>
                            </div>

                            {/* Top Banner Embed */}
                            {topImageUrl && (
                                <div className="flex pl-12 pr-1">
                                    <div className="overflow-visible bg-[#2b2d31] rounded-xl flex max-w-[85%] border-l-4 border-transparent">
                                        <img src={topImageUrl} alt="Top Banner" className="w-[500px] h-auto object-cover max-h-[400px]" />
                                    </div>
                                </div>
                            )}

                            {/* Main Embed (Component v2 Styling) */}
                            <div className="flex pl-12 pr-1">
                                <div className="bg-[#2b2d31] rounded-[8px] flex flex-col max-w-full overflow-visible shrink-0 transition-colors relative" style={{ minWidth: '300px' }}>
                                    {/* Embed color pill (Modern v2 Style) */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 flex-shrink-0 rounded-l-[8px]" style={{ backgroundColor: color || '#202225' }}></div>
                                    <div className="p-4 pl-5 flex flex-col gap-2">
                                        {title && <h3 className="text-white font-bold text-[15px] leading-tight">{title}</h3>}
                                        {content && (
                                            <div className="text-[#dbdee1] text-[14px] leading-relaxed whitespace-pre-wrap font-medium">
                                                {(() => {
                                                    const formatted = (content || "")
                                                        .replace(/{user}/g, "@NewUser")
                                                        .replace(/{server}/g, "High Core Server")
                                                        .replace(/{member_count}/g, "1,452")
                                                        .replace(/\\n/g, '\n');
                                                    return formatted.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return part;
                                                    });
                                                })()}
                                            </div>
                                        )}
                                        {imageUrl && (
                                            <div className="mt-3 rounded-lg overflow-visible opacity-95 transition-transform max-w-[400px]">
                                                <img src={imageUrl} alt="Panel" className="object-cover w-full h-auto rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            {buttons.length > 0 && (
                                <div className="flex pl-12 pr-1 flex-wrap gap-2 pt-1 pb-4">
                                    {buttons.map((btn, idx) => (
                                        <button 
                                            key={idx}
                                            className={`px-[16px] h-[32px] text-[14px] font-medium rounded-[3px] transition-all flex items-center justify-center gap-1.5 ${
                                                btn.button_style === 'SUCCESS' ? 'bg-[#248046] hover:bg-[#1a6334] text-white' :
                                                btn.button_style === 'DANGER' ? 'bg-[#da373c] hover:bg-[#a12829] text-white' :
                                                btn.button_style === 'SECONDARY' ? 'bg-[#4e5058] hover:bg-[#6d6f78] text-white' :
                                                'bg-[#5865f2] hover:bg-[#4752c4] text-white'
                                            }`}
                                        >
                                            {btn.emoji && <span>{btn.emoji}</span>}
                                            {btn.label || "Action"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-4 bg-[#2b2d31] flex items-center gap-4 border-t border-[#1e1f22] shrink-0 pointer-events-none opacity-50">
                            <div className="w-8 h-8 rounded-full bg-[#383a40] flex items-center justify-center">
                                <Plus size={16} className="text-[#b5bac1]" />
                            </div>
                            <div className="flex-1 bg-[#383a40] rounded-full h-10 px-4 flex items-center text-[#949ba4] text-[14px]">
                                Message #general
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="mt-6 p-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold text-center shadow-lg relative overflow-visible group cursor-default shrink-0">
                <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Discord Sync Active</span>
            </div>
        </div>
      </div>
    </div>
  );
}
