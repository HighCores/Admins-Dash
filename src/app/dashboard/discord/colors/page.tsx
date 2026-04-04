"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Palette as ColorIcon, Shield, Sparkles, 
  Plus, Save, Trash2, Edit3, Loader2, Zap, Search, 
  ChevronRight, CheckCircle2, Monitor, Layout
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function ColorsPage() {
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#ffffff");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
     fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_color_roles").select("*").eq("guild_id", process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "current_guild").order("position", { ascending: true });
    if (data) setColors(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name || !roleId) return alert("Fill all fields.");
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_color_roles").upsert({
            guild_id: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "current_guild",
            color_name: name,
            color_hex: hex,
            role_id: roleId,
            position: colors.length + 1
        }, { onConflict: 'guild_id,color_name' });

        if (error) throw error;
        
        await supabase.from("dc_stats").insert({
            event_type: "color_updated",
            details: `Color role ${name} was calibrated in the canvas.`
        });

        alert("Color spectrum stabilized! 🎨");
        setEditingColor(null);
        setName("");
        setHex("#ffffff");
        setRoleId("");
        fetchColors();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (colorName: string) => {
    if (!confirm(`Delete ${colorName}?`)) return;
    await supabase.from("dc_color_roles").delete().eq("color_name", colorName);
    fetchColors();
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-pink-500/10 text-pink-600 rounded-2xl animate-spin-slow">
                <Palette size={24} />
            </div>
            <span className="text-xs font-black text-pink-500 uppercase tracking-widest leading-none font-mono italic">Chromatic Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Color <span className="opacity-30">Canvas</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            Personalize the agency with a curated spectrum of identity roles. Members will be able to self-assign these neural color signatures.
          </p>
        </div>
        
        <button 
            onClick={() => setEditingColor({ name: 'New Color', hex: '#ffffff' })}
            className="flex items-center gap-4 px-8 py-5 bg-pink-600 text-white font-black text-sm rounded-[2rem] shadow-2xl hover:bg-pink-700 transition-all hover:scale-105 active:scale-95 group"
        >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" />
            INITIALIZE SPECTRUM
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: The Spectrum Grid (Color Cards) */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                <div className="col-span-full flex justify-center p-20"><Loader2 className="animate-spin text-pink-500" size={40} /></div>
            ) : colors.length === 0 ? (
                <div className="col-span-full glass-card p-24 text-center border-dashed border-4 border-sunset-100/50 bg-white/20 rounded-[4rem]">
                    <Sparkles size={60} className="text-sunset-200 mb-6 mx-auto" />
                    <h3 className="text-2xl font-black text-sunset-900 opacity-20 tracking-tighter uppercase italic">The canvas is blank. No chromatic roles defined.</h3>
                </div>
            ) : colors.map((color, idx) => (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={color.color_name}
                    className="glass-card rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden group hover:scale-[1.05] transition-all bg-white/40 backdrop-blur-xl group cursor-pointer"
                >
                    <div className="h-40 relative flex items-center justify-center p-12 transition-all duration-700 overflow-hidden" style={{ backgroundColor: `${color.color_hex}10` }}>
                        <div className="absolute inset-0 opacity-10 group-hover:scale-150 transition-transform duration-1000" style={{ backgroundColor: color.color_hex }}></div>
                        <div className="w-16 h-16 rounded-[1.5rem] shadow-2xl border-4 border-white transition-all transform group-hover:rotate-45" style={{ backgroundColor: color.color_hex }}></div>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-xl font-black text-sunset-950 italic tracking-tighter ">{color.color_name}</h4>
                                <span className="text-[10px] font-black text-sunset-800/40 uppercase font-mono tracking-widest">{color.color_hex}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingColor(color); setName(color.color_name); setHex(color.color_hex); setRoleId(color.role_id); }}
                                    className="p-3 bg-white text-sunset-900 rounded-xl hover:shadow-xl transition-all"><Edit3 size={16} /></button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(color.color_name); }}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-sunset-50">
                            <Shield size={14} className="text-pink-500" />
                            <span className="text-[10px] font-black text-sunset-800/40 uppercase tracking-[0.2em] italic">ROLE_ID: {color.role_id?.split('-')[0]}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Right: Preview Console */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl bg-white/40 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-8 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Monitor size={240} /></div>
                <h3 className="text-2xl font-black text-sunset-950 mb-10 flex items-center gap-4 italic tracking-tighter subrayado-glow cursor-default">
                    <CheckCircle2 className="text-pink-500" /> Identity Mirror
                </h3>
                
                <div className="space-y-6">
                    <div className="bg-[#2b2d31] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-8 relative group/inner">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-[#1e1f22]"></div>
                            <div className="space-y-1">
                                <span className="text-white text-base font-black italic block leading-none">Global_Admin_Node</span>
                                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">High Core Protocol</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] italic mb-3">Roles</div>
                            <div className="flex flex-wrap gap-2">
                                <div className="px-3 py-1 bg-[#1e1f22] text-[#dbdee1] text-[10px] font-black border border-indigo-400/50 rounded-md">Senior Admin</div>
                                <div className="px-3 py-1 bg-[#1e1f22] text-[#dbdee1] text-[10px] font-black border border-sunset-400/50 rounded-md italic">Developer</div>
                                {colors.slice(0, 3).map(c => (
                                    <div key={c.color_name} className="px-3 py-1 bg-[#1e1f22] text-[10px] font-black rounded-md flex items-center gap-2" style={{ borderColor: `${c.color_hex}40`, borderStyle: 'solid', borderWidth: '1px', color: c.color_hex }}>
                                        <div className="w-2 h-2 rounded-full shadow-glow-small" style={{ backgroundColor: c.color_hex }}></div>
                                        {c.color_name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-5 bg-gradient-to-r from-pink-900 to-black text-white rounded-[2rem] text-[10px] font-black text-center uppercase tracking-[0.4em] shadow-2xl group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 font-black">SCAN_SYMMETRY</div>
                    <span className="flex items-center justify-center gap-3"><Zap size={14} className="animate-pulse" /> LIVE COLOR STREAM ACTIVE</span>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[3.5rem] bg-pink-950 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-4 opacity-10"><ColorIcon size={120} /></div>
                <h4 className="font-black text-xl italic mb-4 tracking-tighter subrayado-glow">
                    Auto Spectrum Sync
                </h4>
                <p className="text-xs font-bold text-pink-100/40 leading-relaxed mb-8 italic">
                   Ensures that color roles are synchronized across all agency shards and correctly sorted by hex intensity values. 
                </p>
                <button className="w-full py-4 bg-white text-pink-950 font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">RECALIBRATE FREQUENCIES</button>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal (Scary/Chromatic Overlay) */}
      <AnimatePresence>
        {editingColor && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-pink-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl border border-pink-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-45"><Palette size={200} /></div>
                
                <div className="flex justify-between items-center border-b border-pink-50 pb-8">
                    <h3 className="text-3xl font-black text-pink-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Palette className="text-pink-500" /> Chromatic Influx
                    </h3>
                    <button onClick={() => setEditingColor(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all"><Plus className="rotate-45" size={24} /></button>
                </div>
                
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-pink-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Spectrum Label</label>
                        <input 
                            type="text" 
                            className="w-full p-5 rounded-3xl bg-pink-50/50 border border-pink-100 font-black text-xl text-pink-950 outline-none" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Vibrant_Sunset"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-pink-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Hex Code Trace</label>
                            <div className="flex gap-3">
                                <input 
                                    type="color" 
                                    className="w-20 h-16 rounded-2xl cursor-pointer bg-transparent border-0" 
                                    value={hex}
                                    onChange={(e) => setHex(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="flex-1 p-5 rounded-3xl bg-pink-50/50 border border-pink-100 font-black font-mono text-center text-pink-950"
                                    value={hex}
                                    onChange={(e) => setHex(e.target.value)}
                                />
                            </div>
                        </div>
                        <DiscordSelect 
                            label="Linked Network Role"
                            type="role"
                            value={roleId}
                            onChange={setRoleId}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-pink-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-pink-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic group disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={22} className="group-hover:scale-125 transition-transform" />} 
                        SYNCHRONIZE FREQUENCIES
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
