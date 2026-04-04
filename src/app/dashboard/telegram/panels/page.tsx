"use client";

import { motion } from "framer-motion";
import { 
  Send, Layout, MousePointer2, Plus, 
  Trash2, Edit3, Save, Eye, Monitor, 
  Smartphone, Zap, Sparkles, Loader2,
  ChevronRight, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramPanelsPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    // Shared table dc_menus but with platform='telegram'
    const { data } = await supabase.from("dc_menus").select("*").eq("platform", "telegram").order("position", { ascending: true });
    if (data) setMenus(data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl animate-bounce">
                <Layout size={20} />
            </div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Telegram UI Architect</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Telegram <span className="text-blue-500/40">Visuals</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
             Update your Telegram bot's inline menus and interactive keyboards live from this dashboard.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
            <Plus size={20} /> New Menu
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Menu Navigator */}
        <div className="xl:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-[2rem] border border-blue-50 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-blue-950 italic">Available Menus</h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-black">{menus.length} SYNCED</span>
             </div>

             {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
             ) : menus.length === 0 ? (
                <div className="p-8 text-center text-blue-300 font-bold italic opacity-50">Empty.</div>
             ) : (
                <div className="space-y-3">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => setActiveMenu(menu)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                                activeMenu?.id === menu.id 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                : "hover:bg-blue-50 text-blue-900"
                            }`}
                        >
                            <span className="font-bold underline underline-offset-4 decoration-current">{menu.title}</span>
                            <ChevronRight size={16} />
                        </button>
                    ))}
                </div>
             )}
          </div>
        </div>

        {/* Editor & Mirror */}
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-[2.5rem] border border-blue-50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Smartphone size={100} /></div>
                <h3 className="text-xl font-black text-blue-950 mb-8 flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-500" /> Mirror Editor
                </h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-widest px-1 italic">Message Caption</label>
                        <textarea rows={6} className="w-full p-4 rounded-2xl bg-blue-50/30 border border-blue-100 font-medium text-blue-950 focus:outline-none focus:ring-2 ring-blue-500/10" placeholder="Type your bot message..." />
                    </div>
                    
                    <div className="p-4 bg-blue-950 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">Keyboard Buttons</span>
                            <button className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md hover:bg-white/20 transition-all">+ ADD</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 px-4 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-center">Support</div>
                            <div className="p-2 px-4 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-center">F.A.Q</div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <Save size={18} /> Update Telegram Bot
                    </button>
                </div>
            </div>

            {/* Telegram Mirror Preview */}
            <div className="hidden lg:block">
                <div className="w-[320px] mx-auto bg-[#1b1c1e] rounded-[3rem] p-4 border-[6px] border-slate-800 shadow-2xl relative">
                    <div className="bg-[#17212b] h-[550px] rounded-[2.2rem] p-4 relative overflow-hidden flex flex-col pt-10">
                        {/* Telegram Header */}
                        <div className="absolute top-0 left-0 w-full p-4 flex items-center gap-3 bg-[#17212b]/80 backdrop-blur-md">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black text-white italic shadow-lg">HC</div>
                            <div>
                                <div className="text-white text-xs font-bold leading-none">High Core Bot</div>
                                <div className="text-blue-400 text-[10px] font-medium leading-none mt-1">bot</div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-end gap-2 mb-4">
                            <div className="bg-[#182533] p-3 rounded-2xl rounded-bl-sm border border-white/5 relative group max-w-[85%] self-start">
                                <div className="text-white text-xs leading-relaxed">
                                   Welcome to the High Core Agency Support bot. Use the buttons below to interact.
                                </div>
                                <div className="text-[9px] text-white/30 text-right mt-1">11:11 PM</div>
                            </div>

                            <div className="grid grid-cols-2 gap-1 mt-4">
                                <div className="bg-[#242f3d] py-1.5 rounded-lg text-white text-[10px] font-bold text-center border border-white/5 hover:bg-[#2e3b4a] transition-all cursor-pointer shadow-sm">Support</div>
                                <div className="bg-[#242f3d] py-1.5 rounded-lg text-white text-[10px] font-bold text-center border border-white/5 hover:bg-[#2e3b4a] transition-all cursor-pointer shadow-sm">F.A.Q</div>
                                <div className="col-span-2 bg-[#242f3d] py-1.5 rounded-lg text-white text-[10px] font-bold text-center border border-white/5 hover:bg-[#2e3b4a] transition-all cursor-pointer shadow-sm italic">Agency Portal</div>
                            </div>
                        </div>

                        <div className="p-3 bg-[#17212b] border-t border-white/5 flex items-center gap-3">
                            <div className="flex-1 bg-[#242f3d] rounded-full h-8 px-4 text-white/30 text-[10px] flex items-center">Message...</div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-blue-900/90 text-white rounded-2xl text-[10px] font-black text-center uppercase tracking-[0.2em] animate-pulse">
                    <span className="flex items-center justify-center gap-2"><Eye size={12} /> Telegram Mirror Preview</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
