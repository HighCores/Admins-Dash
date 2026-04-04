"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot, Hash, Shield, Share2,
  RefreshCcw, Terminal, Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramPanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [buttons, setButtons] = useState<any[]>([]);
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
    const { data } = await supabase.from("dc_menus").select("*").eq("platform", "telegram").order("created_at", { ascending: false });
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
    setImageUrl(menu.image_url || "");
    fetchButtons(menu.menu_id);
  };

  const createNewMenu = () => {
    const newId = `tele_panel_${Date.now()}`;
    const newMenu = { menu_id: newId, title: "New Telegram Panel", description: "Default description", platform: "telegram" };
    setActiveMenu(newMenu);
    setMenuId(newId);
    setTitle(newMenu.title);
    setContent(newMenu.description);
    setImageUrl("");
    setButtons([]);
  };

  const handleSave = async () => {
    if (!menuId || !title) return alert("ID and Title are mandatory nodes.");
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

        // Save buttons
        for (let i = 0; i < buttons.length; i++) {
            await supabase.from("dc_buttons").upsert({
                id: buttons[i].id,
                menu_id: menuId,
                label: buttons[i].label,
                action_id: buttons[i].action_id,
                button_style: buttons[i].button_style || 'PRIMARY',
                position: i
            });
        }

        await supabase.from("dc_stats").insert({
            event_type: "tg_panel_updated",
            details: `Telegram Panel ${title} was updated.`
        });

        alert("Telegram Logic Synchronized! ✈️");
        fetchMenus();
    } catch (err: any) {
        alert(`ERR_LOGIC: ${err.message}`);
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

  const addButton = () => {
    setButtons([...buttons, { label: 'New Action', action_id: 'trigger_webhook', button_style: 'PRIMARY' }]);
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
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Send size={16} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Telegram Architect Console</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Cloud <span className="text-blue-600">Panels</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Visual interface design suite for N8N-powered Telegram transmissions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={fetchMenus}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-blue-400 group-hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={createNewMenu}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group italic tracking-widest uppercase"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                INITIATE NEW NODE
            </button>
        </div>
      </header>

      {/* Main Workspace - 3 Column Layout (SIDE-BY-SIDE, NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Column 1: Proxy Rack */}
        <div className="xl:col-span-3 flex flex-col min-h-0">
          <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">Live Proxies</h3>
                <span className="bg-blue-600 text-white text-[9px] px-2.5 py-1 rounded-lg font-black tracking-widest leading-none shrink-0">{menus.length} ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-full p-10"><Loader2 className="animate-spin text-blue-500" /></div>
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
                                : "hover:bg-zinc-50 text-zinc-950 border-zinc-100 bg-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Share2 size={16} className={activeMenu?.menu_id === menu.menu_id ? "text-blue-400" : "text-zinc-300"} />
                                <div className="min-w-0">
                                    <span className="font-black italic text-sm leading-none block mb-1 truncate">{menu.title || "Untitled"}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest truncate block ${activeMenu?.menu_id === menu.menu_id ? "text-zinc-500" : "text-zinc-300"}`}>
                                        {menu.menu_id.replace("tele_panel_", "")}
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
                                <Sparkles className="text-blue-500" size={18} /> Architect: <span className="text-blue-500 truncate max-w-[200px]">{title}</span>
                            </h3>
                            <button 
                                onClick={() => handleDelete(activeMenu.menu_id)}
                                className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Internal ID</label>
                                <input 
                                    type="text" 
                                    value={menuId} 
                                    onChange={(e) => setMenuId(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-zinc-950 transition-all outline-none focus:bg-white shadow-inner"
                                    placeholder="tele_panel_id"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Panel Headline</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-zinc-950 transition-all outline-none focus:bg-white shadow-inner"
                                    placeholder="Enter Headline..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">The Message Payload</label>
                                <textarea 
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-800 leading-relaxed transition-all outline-none focus:bg-white resize-none shadow-inner"
                                    placeholder="Detailed payload data..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Asset Mirror Link</label>
                                <div className="relative">
                                    <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input 
                                        type="text" 
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-blue-600 text-xs transition-all outline-none focus:bg-white shadow-inner"
                                        placeholder="https://t.me/i/asset.png"
                                    />
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-6 rounded-3xl text-white relative overflow-hidden group border border-white/5 transition-all hover:border-white/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Activity size={80} /></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-black text-[10px] italic tracking-widest flex items-center gap-2 uppercase">
                                        <Bot size={12} className="text-blue-400" /> Action Nodes
                                    </h4>
                                    <button 
                                        onClick={addButton}
                                        className="px-3 py-1.5 bg-white text-zinc-950 text-[8px] font-black rounded-lg hover:scale-105 transition-all uppercase tracking-widest">
                                        ADD_LOGIC
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {buttons.map((btn, idx) => (
                                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3 group/btn hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center font-black text-[9px] text-blue-400">{idx + 1}</div>
                                                    <input 
                                                        type="text"
                                                        value={btn.label}
                                                        onChange={(e) => {
                                                            const nb = [...buttons];
                                                            nb[idx].label = e.target.value;
                                                            setButtons(nb);
                                                        }}
                                                        className="bg-transparent border-none outline-none text-[10px] font-bold italic tracking-tight text-white placeholder:opacity-20"
                                                        placeholder="Button Label..."
                                                    />
                                                </div>
                                                <button onClick={() => removeButton(idx, btn.id)} className="p-1 hover:text-red-400 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input 
                                                    type="text"
                                                    value={btn.action_id}
                                                    onChange={(e) => {
                                                        const nb = [...buttons];
                                                        nb[idx].action_id = e.target.value;
                                                        setButtons(nb);
                                                    }}
                                                    className="bg-black/40 px-3 py-1.5 rounded-lg text-[8px] font-mono text-zinc-400 border border-white/5 outline-none"
                                                    placeholder="action_id..."
                                                />
                                                <select 
                                                    value={btn.button_style}
                                                    onChange={(e) => {
                                                        const nb = [...buttons];
                                                        nb[idx].button_style = e.target.value;
                                                        setButtons(nb);
                                                    }}
                                                    className="bg-black/40 px-3 py-1.5 rounded-lg text-[8px] font-mono text-zinc-400 border border-white/5 outline-none"
                                                >
                                                    <option value="PRIMARY">PRIMARY</option>
                                                    <option value="SECONDARY">SECONDARY</option>
                                                    <option value="SUCCESS">SUCCESS</option>
                                                    <option value="DANGER">DANGER</option>
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
                                className="w-full flex items-center justify-center gap-4 py-5 bg-blue-600 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 italic uppercase tracking-[0.4em]"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                                DEPLOY TO NETWORK
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-50 rounded-[2.5rem] text-center border-2 border-dashed border-zinc-200 opacity-20">
                        <Terminal size={60} className="mb-10 text-zinc-400" />
                        <h3 className="text-xl font-black text-zinc-950 tracking-tighter uppercase italic">Select node to initiate architect suite</h3>
                    </div>
                )}
            </AnimatePresence>
        </div>

        {/* Column 3: Live Mirror (Preview) */}
        <div className="xl:col-span-4 flex flex-col min-h-0 overflow-hidden">
             
             <div className="bg-[#1c242d] rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Send size={200} /></div>
                
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <Monitor size={14} className="text-blue-400" /> Real-time Cloud Sync
                </h3>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                     {imageUrl ? (
                        <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                            <img src={imageUrl} alt="Panel" className="w-full h-auto object-cover max-h-48" />
                        </div>
                    ) : (
                        <div className="aspect-video rounded-3xl bg-white/5 flex items-center justify-center opacity-10 border border-dashed border-white/20 shrink-0">
                            <ImageIcon size={40} className="text-white" />
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <h4 className="text-blue-400 font-black text-2xl italic tracking-tighter leading-none pr-6">{title || "Telegram_Node_Title"}</h4>
                        <p className="text-[#dbdee1] text-sm leading-relaxed font-medium whitespace-pre-wrap opacity-90 font-sans pr-4">
                           {content || "Craft your message logic here... High Core delivery pipelines will process this transmission."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5">
                        {buttons.length === 0 ? (
                            <button className="w-full py-4 bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black rounded-xl opacity-20 italic">No Action Nodes</button>
                        ) : buttons.map((btn, idx) => (
                            <button 
                                key={idx}
                                className={`w-full py-4 text-white text-[10px] font-black rounded-xl shadow-xl hover:scale-[1.02] transition-transform italic uppercase tracking-widest ${
                                    btn.button_style === 'SUCCESS' ? 'bg-[#248046]' :
                                    btn.button_style === 'DANGER' ? 'bg-[#da373c]' :
                                    btn.button_style === 'SECONDARY' ? 'bg-[#4e5058]' :
                                    'bg-[#3390ec]'
                                }`}
                            >
                                {btn.label || "Action Label"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 opacity-30">
                        <Bot size={14} className="text-blue-400" />
                        <span className="text-[9px] text-white font-black uppercase tracking-[0.2em] font-mono italic">Proxy Handshake</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                        <span className="text-[10px] text-emerald-400 font-black italic">CONNECTED</span>
                    </div>
                </div>
            </div>

             <div className="mt-6 p-5 bg-blue-600 text-white rounded-[2rem] text-[9px] font-black text-center uppercase tracking-[0.4em] shadow-xl relative overflow-hidden group italic cursor-default shrink-0">
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="flex items-center justify-center gap-3"><Eye size={12} className="animate-pulse" /> TELEGRAM_CLOUD_SYNC_ACTIVE</span>
            </div>
        </div>
      </div>
    </div>
  );
}
