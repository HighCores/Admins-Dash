"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Plus, Trash2, Edit3, Save, 
  Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, 
  Layout, Monitor, Smartphone, Search,
  ChevronRight, Hash, Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function ColorRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [hex, setHex] = useState("#ffffff");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_color_roles").select("*").order("position", { ascending: true });
    if (data) setRoles(data);
    setLoading(false);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setName(role.color_name || "");
    setRoleId(role.role_id || "");
    setHex(role.color_hex || "#ffffff");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_color_roles").upsert({
            guild_id: "global", // or actual guild_id
            role_id: roleId,
            color_name: name,
            color_hex: hex,
            updated_at: new Date().toISOString()
        }, { onConflict: 'guild_id,color_name' });

        if (error) throw error;
        alert("Color spectrum aligned! 🎨");
        setEditingRole(null);
        fetchRoles();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this color node?")) return;
    await supabase.from("dc_color_roles").delete().eq("color_name", name);
    fetchRoles();
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <Palette size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Identity Mirror Canvas</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Color <span className="text-zinc-300">Spectrum</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Configure identity color nodes for administrative tiers. Each hue is synchronized across the High Core network.
          </p>
        </div>
        
        <button 
            onClick={() => handleEdit({ color_name: '', role_id: '', color_hex: '#3b82f6' })}
            className="flex items-center gap-4 px-8 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 italic tracking-widest"
        >
            <Plus size={18} /> INJECT COLOR NODE
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0 overflow-hidden">
        
        {/* Left: Interactive List Rack */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 text-[10px] font-black text-zinc-400 uppercase tracking-widest grid grid-cols-4">
                    <div className="pl-4">Visual Anchor</div>
                    <div>Logical Label</div>
                    <div>Role Mapping</div>
                    <div className="text-right pr-4">Logic Gear</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : roles.length === 0 ? (
                        <div className="p-32 text-center opacity-10">
                            <Sparkles size={60} className="mx-auto mb-6" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Spectrum Void. No active color nodes.</h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {roles.map((role) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={role.id}
                                    className="grid grid-cols-4 items-center p-5 rounded-3xl bg-zinc-50/30 border border-zinc-100 hover:bg-zinc-50 transition-all group"
                                >
                                    <div className="pl-4 flex items-center gap-6">
                                        <div 
                                            className="w-12 h-12 rounded-2xl shadow-2xl border-4 border-white transition-transform group-hover:scale-110" 
                                            style={{ backgroundColor: role.color_hex }}
                                        />
                                        <code className="text-xs font-black text-zinc-400 bg-white px-3 py-1 rounded-lg border border-zinc-100">{role.color_hex}</code>
                                    </div>
                                    <div className="font-black text-zinc-950 uppercase italic tracking-tighter text-lg">{role.color_name}</div>
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className="text-zinc-300" />
                                        <span className="text-xs font-bold text-zinc-500 truncate max-w-[150px]">{role.role_id}</span>
                                    </div>
                                    <div className="text-right pr-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(role)}
                                            className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100"><Edit3 size={16} /></button>
                                        <button 
                                            onClick={() => handleDelete(role.color_name)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Preview & Hub stats */}
        <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Bot size={180} /></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-4 italic tracking-tighter subrayado-glow">
                    <Sparkles className="text-yellow-400" /> Spectrum Hub
                </h3>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest leading-none">Active Tiers</span>
                        <span className="text-3xl font-black italic">{roles.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest leading-none">Visual Status</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full shadow-lg italic">OPTIMAL</span>
                    </div>
                    <div className="pt-6">
                        <button className="w-full py-5 bg-white text-zinc-950 font-black text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] italic">
                            SYNC NEURAL COLOR CORE
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1">
                <h4 className="font-black text-xl text-zinc-950 mb-6 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100">
                    <History size={20} className="text-zinc-400" /> Identity Mirror
                </h4>
                <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-center justify-center min-h-[200px]">
                     <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-200 border-4 border-white shadow-xl flex items-center justify-center text-zinc-400"><Bot size={24} /></div>
                        <div>
                            <div className="text-lg font-black text-zinc-950 tracking-tighter">HighCore_Agent_01</div>
                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Presence</div>
                        </div>
                        <div className="flex gap-2">
                             {roles.slice(0, 3).map(r => (
                                <div key={r.id} className="px-4 py-1.5 rounded-full text-[9px] font-black text-white shadow-lg uppercase tracking-widest" style={{ backgroundColor: r.color_hex }}>
                                    {r.color_name}
                                </div>
                             ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Logic Editor Modal */}
      <AnimatePresence>
        {editingRole && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-xl p-14 shadow-2xl border border-zinc-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><Palette size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-zinc-50 pb-8">
                    <h3 className="text-3xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4">
                        <Sparkles className="text-zinc-400" /> Identity Calibrator
                    </h3>
                    <button onClick={() => setEditingRole(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-2xl transition-all"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 pr-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Spectrum Label (Name)</label>
                        <input 
                            type="text" 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-3xl text-zinc-950 outline-none placeholder:opacity-10 italic" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. VIP_CORE"
                        />
                    </div>

                    <DiscordSelect 
                        label="Anchor Discord Role"
                        type="role"
                        value={roleId}
                        onChange={setRoleId}
                        placeholder="Select target tier..."
                    />

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none">Hexadecimal Pulse (Color)</label>
                        <div className="flex gap-4">
                            <input 
                                type="color" 
                                className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-zinc-50 shadow-xl"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                            />
                            <input 
                                type="text" 
                                className="flex-1 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 outline-none uppercase tracking-widest"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-7 bg-zinc-950 text-white font-black text-[10px] rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={22} />} 
                        RECALIBRATE SPECTRUM NODE
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
