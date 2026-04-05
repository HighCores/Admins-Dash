"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Plus, Trash2, Edit3, Save, 
  Loader2, Zap, Sparkles, X, Bot, 
  CheckCircle2, AlertCircle, RefreshCcw, 
  Layout, Monitor, Smartphone, Search,
  ChevronRight, Hash, Shield, History, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function ColorRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [hex, setHex] = useState("#ffffff");
  const [previewColor, setPreviewColor] = useState<string | null>(null);

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
    setHex(ensureHex(role.color_hex || "#3b82f6"));
  };

  const ensureHex = (c: string) => {
    if (!c) return "#ffffff";
    return c.startsWith("#") ? c : "#" + c;
  };

  const handleSave = async () => {
    if (!name || !roleId) return showToast("Please provide a name and select a role.", true);
    setSaving(true);
    try {
        const finalHex = ensureHex(hex);
        const { error } = await supabase.from("dc_color_roles").upsert({
            guild_id: "global",
            role_id: roleId,
            color_name: name,
            color_hex: finalHex,
            updated_at: new Date().toISOString()
        }, { onConflict: 'role_id' });

        if (error) throw error;
        showToast("Color profile saved! 🎨");
        setEditingRole(null);
        fetchRoles();
    } catch (err: any) {
        showToast("System error: " + err.message, true);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (roleIdToDelete: string) => {
    showToast("Deleting entry...", false);
    await supabase.from("dc_color_roles").delete().eq("role_id", roleIdToDelete);
    fetchRoles();
    showToast("Entry deleted! 🗑️");
  };

  const usedRoleIds = roles.map(r => r.role_id);

  const cleanId = (id: string) => {
    if (!id) return "UID_UNKNOWN";
    return id.toUpperCase().slice(0, 10);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible p-1">
      
      {/* Header - Minimalist */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg border border-zinc-800">
                <Palette size={18} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Agency Brand Identity</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tight">
            Role <span className="text-zinc-300">Colors</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-500 max-w-2xl">
             Customize and preview rank identity colors for your server members.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchRoles}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-300 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => handleEdit({ color_name: '', role_id: '', color_hex: '#3b82f6' })}
                className="flex items-center gap-4 px-8 py-5 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group tracking-widest uppercase italic"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                New Entry
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-10 min-h-0">
        
        {/* Left: Color List */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-visible">
             <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-visible">
                  <div className="grid grid-cols-12 p-8 border-b border-zinc-50 bg-zinc-50/20 text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none italic">
                      <div className="col-span-4 pl-4">Color Spectrum</div>
                      <div className="col-span-3">Label</div>
                      <div className="col-span-3">Role Node</div>
                      <div className="col-span-2 text-right pr-4">Edit</div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                     {loading ? (
                         <div className="flex justify-center p-24"><Loader2 className="animate-spin text-zinc-200" size={48} /></div>
                     ) : roles.length === 0 ? (
                         <div className="p-32 text-center opacity-10 italic uppercase font-black tracking-widest">No entries found.</div>
                     ) : (
                         roles.map((role, idx) => (
                             <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 key={role.id}
                                 onClick={() => setPreviewColor(ensureHex(role.color_hex))}
                                 className="grid grid-cols-12 items-center p-6 rounded-3xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group cursor-pointer"
                             >
                                 <div className="col-span-4 pl-4 flex items-center gap-6">
                                     <div 
                                         className="w-12 h-12 rounded-2xl shadow-2xl transition-all group-hover:scale-110 shadow-inner" 
                                         style={{ backgroundColor: ensureHex(role.color_hex) }}
                                     />
                                     <code className="text-xs font-black text-zinc-400 font-mono tracking-tighter italic">{ensureHex(role.color_hex)}</code>
                                 </div>
                                 <div className="col-span-3">
                                     <span className="font-black text-zinc-950 uppercase tracking-tighter text-xl italic">{role.color_name}</span>
                                 </div>
                                 <div className="col-span-3 flex items-center gap-3">
                                     <Shield size={16} className="text-zinc-200" />
                                     <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight truncate max-w-[140px] italic">ROLE_{cleanId(role.role_id)}</span>
                                 </div>
                                 <div className="col-span-2 text-right pr-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                         onClick={() => handleEdit(role)}
                                         className="p-4 bg-white text-zinc-950 rounded-2xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={18} /></button>
                                     <button 
                                         onClick={() => handleDelete(role.role_id)}
                                         className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Preview & Stats */}
        <div className="xl:col-span-4 flex flex-col gap-10 min-h-0 overflow-visible">
             <div className="bg-zinc-950 p-12 rounded-[3.5rem] text-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative overflow-visible shrink-0">
                <div className="absolute right-0 bottom-0 p-12 opacity-[0.05] pointer-events-none rotate-12"><Plus size={300} /></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-4 tracking-tighter uppercase italic py-2 border-b border-white/5">
                    Live Stats
                </h3>
                
                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] italic">Active Colors</span>
                        <span className="text-3xl font-black italic tracking-tighter">{roles.length}</span>
                    </div>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[3.5rem] border border-zinc-100 shadow-sm relative overflow-visible flex-1 flex flex-col min-h-0 shadow-inner">
                 <h4 className="font-black text-2xl text-zinc-950 mb-10 flex items-center gap-4 tracking-tighter uppercase italic shrink-0">
                    <History size={20} className="text-zinc-300" /> Live Preview
                </h4>
                
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-[3rem] border border-zinc-100 relative overflow-visible shadow-inner">
                     <div className="flex flex-col items-center gap-8 text-center relative z-10 group">
                        <div className="w-24 h-24 rounded-full bg-white border-8 border-white shadow-2xl flex items-center justify-center text-zinc-200 group-hover:scale-110 transition-transform"><Bot size={36} /></div>
                        <div className="space-y-2">
                            <div 
                                className="text-3xl font-black tracking-tighter transition-colors duration-500 italic uppercase"
                                style={{ color: ensureHex(previewColor || '#09090b') }}
                            >
                                Member Name
                            </div>
                            <div className="text-[11px] font-black text-zinc-300 uppercase tracking-widest italic tracking-[0.3em] font-mono leading-none">Rank Identity Pulse</div>
                        </div>
                     </div>
                </div>

                <div className="mt-10 text-center shrink-0">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic py-4">Colors are rendered through Discord API.</p>
                </div>
             </div>
        </div>
      </div>

      {/* Color Editor Modal */}
      <AnimatePresence>
        {editingRole && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/5 animate-in fade-in duration-500">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="bg-white rounded-[4rem] w-full max-w-2xl p-14 shadow-[0_50px_150px_rgba(0,0,0,0.15)] border border-white flex flex-col gap-10 relative overflow-visible"
             >
                <div className="flex justify-between items-center shrink-0">
                    <h3 className="text-4xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4 py-2">
                         Color Editor
                    </h3>
                    <button onClick={() => setEditingRole(null)} className="p-5 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-3xl transition-all hover:rotate-90"><X size={24} /></button>
                </div>
                
                <div className="space-y-8 flex-1 overflow-visible">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] px-6 font-mono italic">Role Label</label>
                        <input 
                            type="text" 
                            className="w-full p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 focus:bg-white outline-none italic transition-all shadow-inner uppercase" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ADMIN_TIER"
                        />
                    </div>

                    <div className="space-y-3 overflow-visible">
                        <DiscordSelect 
                            label="Target Rank"
                            type="role"
                            value={roleId}
                            excludeIds={usedRoleIds.filter(id => id !== roleId)}
                            onChange={(val, color) => {
                                setRoleId(val);
                                if (color) setHex(ensureHex(color));
                            }}
                            placeholder="Select rank node..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] px-6 font-mono italic">Hex Sync</label>
                        <div className="flex gap-6">
                            <input 
                                type="color" 
                                className="w-20 h-20 rounded-2xl cursor-pointer border-8 border-white shadow-xl bg-transparent"
                                value={ensureHex(hex)}
                                onChange={(e) => setHex(e.target.value)}
                            />
                            <input 
                                type="text" 
                                className="flex-1 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 outline-none uppercase italic shadow-inner font-mono tracking-tighter"
                                value={ensureHex(hex)}
                                onChange={(e) => setHex(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 shrink-0">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-8 bg-zinc-950 text-white font-black text-sm rounded-3xl shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-5 uppercase tracking-[0.5em] italic"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />} 
                        Apply Changes
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
