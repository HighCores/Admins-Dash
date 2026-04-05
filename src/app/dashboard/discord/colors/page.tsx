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
    setHex(role.color_hex || "#3b82f6");
  };

    const handleSave = async () => {
    if (!name || !roleId) return showToast("Please provide a name and select a role.", true);
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_color_roles").upsert({
            guild_id: "global",
            role_id: roleId,
            color_name: name,
            color_hex: hex,
            updated_at: new Date().toISOString()
        }, { onConflict: 'role_id' });

        if (error) throw error;
        showToast("Color spectrum aligned! 🎨");
        setEditingRole(null);
        fetchRoles();
    } catch (err: any) {
        showToast("Failed to sync: " + err.message, true);
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (roleIdToDelete: string) => {
    showToast("Purging color node...", false);
    await supabase.from("dc_color_roles").delete().eq("role_id", roleIdToDelete);
    fetchRoles();
    showToast("Color node purged. 🗑️");
  };

  const usedRoleIds = roles.map(r => r.role_id);

  const cleanId = (id: string) => {
    if (!id) return "NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase().slice(0, 10);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible p-1">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Palette size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Identity Mirror Canvas</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">
            Color <span className="text-zinc-300">Roles</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Manage and preview identity colors for different server ranks.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchRoles}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => handleEdit({ color_name: '', role_id: '', color_hex: '#3b82f6' })}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-bold text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group tracking-widest uppercase"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Add Color
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Color Rack (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-hidden">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-12 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      <div className="col-span-4 pl-4">Color Preview</div>
                      <div className="col-span-3">Label</div>
                      <div className="col-span-3">Assigned Role</div>
                      <div className="col-span-2 text-right pr-4">Actions</div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                     ) : roles.length === 0 ? (
                         <div className="p-32 text-center opacity-10 italic uppercase font-black tracking-widest font-mono">Spectrum Void Detected</div>
                     ) : (
                         roles.map((role, idx) => (
                             <motion.div 
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 key={role.id}
                                 onClick={() => setPreviewColor(role.color_hex)}
                                 className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group cursor-pointer"
                             >
                                 <div className="col-span-4 pl-4 flex items-center gap-6">
                                     <div 
                                         className="w-11 h-11 rounded-xl shadow-2xl border-4 border-white transition-all group-hover:scale-110 rotate-3 group-hover:rotate-0" 
                                         style={{ backgroundColor: role.color_hex }}
                                     />
                                     <code className="text-[10px] font-black text-zinc-400 bg-white px-3 py-1.5 rounded-lg border border-zinc-100 shadow-inner">{role.color_hex}</code>
                                 </div>
                                 <div className="col-span-3">
                                     <span className="font-bold text-zinc-950 uppercase tracking-tighter text-lg leading-none">{role.color_name}</span>
                                 </div>
                                 <div className="col-span-3 flex items-center gap-2">
                                     <Shield size={14} className="text-zinc-300" />
                                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[140px]">ROLE: {cleanId(role.role_id)}</span>
                                 </div>
                                 <div className="col-span-2 text-right pr-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                         onClick={() => handleEdit(role)}
                                         className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={16} /></button>
                                     <button 
                                         onClick={() => handleDelete(role.role_id)}
                                         className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Preview Hub (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><Sparkles size={200} /></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-4 tracking-tighter uppercase">
                    <Palette className="text-zinc-400" /> Color Hub
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Active Nodes</span>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">{roles.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Status</span>
                        <span className="text-[9px] font-black bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg shadow-lg italic leading-none">VISUAL_SYNCED</span>
                    </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1 flex flex-col min-h-0 group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><Bot size={120} /></div>
                 <h4 className="font-bold text-xl text-zinc-950 mb-8 flex items-center gap-3 tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                    <History size={18} className="text-zinc-400" /> Identity Mirror
                </h4>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 relative overflow-hidden">
                     <div className="flex flex-col items-center gap-6 text-center relative z-10">
                        <div className="w-20 h-20 rounded-full bg-zinc-200 border-8 border-white shadow-2xl flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform"><Bot size={32} /></div>
                        <div className="space-y-1">
                            <div 
                                className="text-xl font-black tracking-tighter transition-colors duration-300"
                                style={{ color: previewColor || '#09090b' }}
                            >
                                Omar
                            </div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Role Visualizer</div>
                        </div>
                     </div>
                </div>

                <div className="mt-8 text-center shrink-0">
                    <button className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                        Preview Identity Stack <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
             </div>
        </div>
      </div>

      {/* Color Editor Modal */}
      <AnimatePresence>
        {editingRole && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/10 animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-8 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><Palette size={240} /></div>
                
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-3 py-2 border-b-2 border-zinc-950">
                        <Palette className="text-zinc-950" size={24} /> Spectrum Call
                    </h3>
                    <button onClick={() => setEditingRole(null)} className="p-4 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-2xl transition-all"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Spectrum Label</label>
                        <input 
                            type="text" 
                            className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 focus:bg-white outline-none italic transition-all truncate" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VIP_CORE"
                        />
                    </div>

                    <DiscordSelect 
                        label="Identity Anchor (Role)"
                        type="role"
                        value={roleId}
                        excludeIds={usedRoleIds.filter(id => id !== roleId)}
                        onChange={(val, color) => {
                            setRoleId(val);
                            if (color) setHex(color);
                        }}
                        placeholder="Select target tier..."
                    />

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Hexadecimal Pulse</label>
                        <div className="flex gap-4">
                            <input 
                                type="color" 
                                className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-xl bg-transparent"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                            />
                            <input 
                                type="text" 
                                className="flex-1 p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-xl text-zinc-950 outline-none uppercase tracking-widest italic"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-6 bg-zinc-950 text-white font-bold text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <RefreshCcw size={20} />} 
                        Save Color
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
