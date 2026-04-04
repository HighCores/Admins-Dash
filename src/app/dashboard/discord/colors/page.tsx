"use client";

import { motion } from "framer-motion";
import { 
  Palette, Plus, Trash2, Edit3, Save, 
  Search, Sliders, LayoutGrid, List,
  Zap, Sparkles, Loader2, Check, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ColorsPage() {
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_color_roles").select("*").order("position", { ascending: true });
    if (data) setColors(data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-500/10 text-pink-600 rounded-xl animate-pulse">
                <Palette size={20} />
            </div>
            <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Aesthetic Module</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Color <span className="text-pink-500/40">Canvas</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Customize the agency's visual identity. Manage self-assignable color roles for your members.
          </p>
        </div>
        
        <div className="flex gap-3">
             <div className="flex bg-sunset-50 p-1 rounded-xl">
                 <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-pink-600' : 'text-sunset-400'}`}><LayoutGrid size={18} /></button>
                 <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-pink-600' : 'text-sunset-400'}`}><List size={18} /></button>
             </div>
             <button className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:bg-pink-700 transition-all active:scale-95">
                <Plus size={20} /> New Color
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Color Palette (The Scary Spectrum) */}
        <div className="xl:col-span-8">
            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-pink-500" /></div>
            ) : colors.length === 0 ? (
                <div className="p-20 text-center glass-card rounded-[3rem] border-dashed border-2 border-pink-100 italic font-bold opacity-30 text-pink-900">
                    Your canvas is empty. Add the first role to start the spectrum.
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {colors.map((color, idx) => (
                        <motion.div 
                            key={color.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-card p-6 rounded-[2rem] border border-white/60 shadow-xl group hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-14 h-14 rounded-2xl shadow-inner border-2 border-white/40 flex items-center justify-center text-white"
                                    style={{ backgroundColor: color.color_hex || '#000000' }}
                                >
                                    <Sparkles size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sunset-900 leading-none">{color.color_name}</h4>
                                    <div className="text-xs font-mono text-sunset-800/40 uppercase mt-2">{color.color_hex}</div>
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'mt-6 pt-4 border-t border-sunset-50' : ''}`}>
                                <div className="text-[10px] font-black text-sunset-800/20 uppercase tracking-widest flex-1">ROLE: {color.role_id?.split('-')[0] || 'UNSET'}</div>
                                <button className="p-2 text-sunset-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"><Edit3 size={16} /></button>
                                <button className="p-2 text-sunset-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                            </div>

                            {/* Floating Rank Badge */}
                            <div className="absolute -right-2 -top-2 w-10 h-10 bg-sunset-50 rounded-full flex items-center justify-center text-[10px] font-black italic text-sunset-200">#{color.position}</div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

        {/* Right: Color Psychology/Tools (The Scary Palette) */}
        <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] bg-pink-950 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <Palette size={200} />
                 </div>
                 <h3 className="text-xl font-black mb-4 flex items-center gap-2 subrayado-glow">
                    <Zap size={24} className="text-pink-400" /> Instant Generation
                 </h3>
                 <p className="text-pink-100/60 text-sm mb-8 italic font-medium leading-relaxed">
                    Automatically generate a balanced agency palette using AI-selected hex codes for the elite aesthetic.
                 </p>
                 <button className="w-full py-4 bg-pink-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-pink-600/20 hover:bg-pink-500 transition-all uppercase tracking-[0.2rem]">
                    Generate Elite Spectrum
                 </button>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border border-sunset-200 bg-white/40 backdrop-blur-md">
                <h4 className="font-bold text-sunset-900 mb-6 flex items-center gap-2"><Sliders size={18} /> Global Controls</h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/80 border border-sunset-100 shadow-sm">
                        <span className="text-xs font-bold text-sunset-800">Multi-Select Enabled</span>
                        <div className="w-10 h-5 bg-pink-100 rounded-full flex items-center px-1"><div className="w-3 h-3 bg-pink-600 rounded-full translate-x-5"></div></div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/80 border border-sunset-100 shadow-sm">
                        <span className="text-xs font-bold text-sunset-800">Sync with Discord</span>
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px]"><Check size={12} /> ON</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
