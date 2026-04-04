"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelsTopLeft, Plus, Image as ImageIcon, Link as LinkIcon, 
  MousePointer2, Save, Trash2, Eye, Layout, Monitor, Smartphone,
  Zap, Sparkles, Loader2, ChevronRight, X, Bot
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<"link" | "upload">("link");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_menus").select("*").order("position", { ascending: true });
    if (data) setMenus(data);
    setLoading(false);
  };

  const handleEdit = (menu: any) => {
    setActiveMenu(menu);
    setTitle(menu.title || "");
    setContent(menu.description || "");
    setImageUrl(menu.image_url || "");
  };

  const handleSave = async () => {
    // Save logic
    alert("Saving changes to database...");
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sunset-500/10 text-sunset-600 rounded-xl animate-pulse">
                <Zap size={20} />
            </div>
            <span className="text-xs font-bold text-sunset-500 uppercase tracking-widest">Advanced Module</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Panels <span className="text-sunset-500/40">Architect</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Design high-conversion Discord embeds and interactive buttons with absolute control.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sunset-600 to-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-sunset-500/20 hover:scale-105 active:scale-95 transition-all group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Create New Panel
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Menu List */}
        <div className="xl:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-[2rem] border border-white/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-sunset-900">Your Panels</h3>
                <span className="bg-sunset-100 text-sunset-600 text-xs px-2 py-1 rounded-lg font-bold">{menus.length} ACTIVE</span>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sunset-500" /></div>
            ) : (
                <div className="space-y-3">
                    {menus.map((menu) => (
                        <motion.button
                            key={menu.menu_id}
                            whileHover={{ x: 5 }}
                            onClick={() => handleEdit(menu)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                                activeMenu?.menu_id === menu.menu_id 
                                ? "bg-gradient-to-r from-sunset-500 to-orange-400 text-white shadow-lg" 
                                : "hover:bg-white/60 text-sunset-900 border border-transparent hover:border-sunset-100"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Layout size={18} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-30"} />
                                <span className="font-bold">{menu.title || "Untitled Panel"}</span>
                            </div>
                            <ChevronRight size={16} className={activeMenu?.menu_id === menu.menu_id ? "opacity-100" : "opacity-30"} />
                        </motion.button>
                    ))}
                </div>
            )}
          </div>
        </div>

        {/* Right: Editor & Preview */}
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Editor Phase */}
            <AnimatePresence mode="wait">
                {activeMenu ? (
                    <motion.div 
                        key={activeMenu.menu_id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-2xl space-y-6">
                            <div className="flex items-center justify-between border-b border-sunset-100 pb-4">
                                <h3 className="text-xl font-bold text-sunset-900 flex items-center gap-2">
                                    <Sparkles className="text-sunset-500" size={20} /> Editing: {activeMenu.title}
                                </h3>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-sunset-800/60 uppercase tracking-tighter px-1">Embed Title</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl glass-input font-bold text-sunset-900 placeholder:opacity-30"
                                        placeholder="Enter the main headline..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-sunset-800/60 uppercase tracking-tighter px-1">Embed Content (MD Supported)</label>
                                    <textarea 
                                        rows={4}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl glass-input font-medium text-sunset-800/80 leading-relaxed"
                                        placeholder="Craft your message here..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold text-sunset-800/60 uppercase tracking-tighter">Panel Image Asset</label>
                                        <div className="flex bg-sunset-50 p-0.5 rounded-lg">
                                            <button 
                                                onClick={() => setImageMode("link")}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${imageMode === 'link' ? 'bg-white text-sunset-600 shadow-sm' : 'text-sunset-400'}`}>LINK</button>
                                            <button 
                                                onClick={() => setImageMode("upload")}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${imageMode === 'upload' ? 'bg-white text-sunset-600 shadow-sm' : 'text-sunset-400'}`}>UPLOAD</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {imageMode === "link" ? (
                                            <div className="relative">
                                                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-400" />
                                                <input 
                                                    type="text" 
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="w-full pl-12 pr-5 py-3 rounded-2xl glass-input font-semibold text-sunset-800 text-sm"
                                                    placeholder="https://imgur.com/image.png"
                                                />
                                            </div>
                                        ) : (
                                            <label className="w-full flex flex-col items-center justify-center py-6 px-4 bg-sunset-50/50 border-2 border-dashed border-sunset-200 rounded-2xl cursor-pointer hover:bg-sunset-100/50 transition-colors group">
                                                <ImageIcon size={28} className="text-sunset-300 group-hover:text-sunset-500 mb-2 transition-colors" />
                                                <span className="text-sm font-bold text-sunset-500 underline">Upload SCARY PNG...</span>
                                                <input type="file" className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-sunset-900 text-white font-bold rounded-2xl shadow-xl shadow-sunset-900/10 hover:bg-black transition-all active:scale-95"
                                >
                                    <Save size={20} /> Deploy Changes
                                </button>
                            </div>
                        </div>

                        {/* Button Sub-Editor Card */}
                        <div className="glass-card p-6 rounded-[2rem] border border-white/60 shadow-xl bg-indigo-900/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-indigo-900 flex items-center gap-2"><MousePointer2 size={18} /> Interactive Buttons</h4>
                                <button className="p-1 px-3 bg-indigo-600 text-white text-[10px] font-black rounded-lg hover:bg-indigo-700 transition-colors">ADD BUTTON</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-bold text-indigo-900 leading-none">Order Service</span>
                                </div>
                                <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-bold text-indigo-900 leading-none">View Roles</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] text-center border-dashed border-2 border-sunset-200">
                        <Monitor size={60} className="text-sunset-200 mb-6" />
                        <h3 className="text-2xl font-bold text-sunset-900 opacity-30">Select a Panel to start the Architect</h3>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Phase */}
            <div className="hidden lg:block relative sticky top-6 self-start">
                <div className="flex items-center gap-2 mb-4 bg-sunset-50 w-fit p-1 rounded-xl mx-auto">
                    <button onClick={() => setIsPreviewMobile(false)} className={`p-2 rounded-lg transition-all ${!isPreviewMobile ? 'bg-white shadow-sm text-sunset-700' : 'text-sunset-400'}`}><Monitor size={16} /></button>
                    <button onClick={() => setIsPreviewMobile(true)} className={`p-2 rounded-lg transition-all ${isPreviewMobile ? 'bg-white shadow-sm text-sunset-700' : 'text-sunset-400'}`}><Smartphone size={16} /></button>
                </div>

                <div className={`${isPreviewMobile ? 'w-[320px]' : 'w-full'} mx-auto transition-all duration-500`}>
                    <div className="bg-[#2b2d31] rounded-lg p-6 shadow-2xl relative overflow-hidden group">
                        {/* Scary Glow Border */}
                        <div className="absolute inset-0 border-2 border-sunset-500/20 rounded-lg group-hover:border-sunset-500/50 transition-colors pointer-events-none"></div>
                        
                        <div className="flex gap-4">
                            <div className="w-[4px] bg-sunset-500 rounded-full h-auto"></div>
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-white font-bold text-lg leading-tight">{title || "Your Epic Embed Title"}</h4>
                                    <p className="text-[#dbdee1] text-sm whitespace-pre-wrap leading-relaxed whitespace-pre-wrap">{content || "This is where your magic content appears. It supports Discord Markdown and looks scary on the app!"}</p>
                                </div>
                                
                                {imageUrl && (
                                    <div className="rounded-lg overflow-hidden border border-white/5 border-sunset-500/10">
                                        <img src={imageUrl} alt="Panel" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-2">
                                    <button className="px-4 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded-sm transition-colors">Order Service</button>
                                    <button className="px-4 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium rounded-sm transition-colors italic">View Roles</button>
                                </div>
                            </div>
                        </div>

                        {/* Discord Branding Watermark */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                <Bot size={12} className="text-white" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest italic">High Core Security</span>
                            </div>
                            <span className="text-[10px] text-white/20 font-medium">Today at 4:20 PM</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-sunset-900/90 text-white rounded-2xl text-[10px] font-bold text-center uppercase tracking-[0.2em] animate-pulse">
                    <span className="flex items-center justify-center gap-2"><Eye size={12} /> Live Scary Preview</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
