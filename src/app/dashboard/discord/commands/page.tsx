"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Command, Power, Edit3, ShieldCheck, Zap,
    Search, Plus, Save, Trash2, Loader2, Sparkles, AlertCircle, X, Terminal,
    History, BarChart3, Settings, Shield, ArrowRight, RefreshCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function CommandsPage() {
    const [commands, setCommands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingCommand, setEditingCommand] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [response, setResponse] = useState("");
    const [permission, setPermission] = useState("everyone");
    const [isActive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState("text"); // text, panel, ticket, colors, levels
    const [actionValue, setActionValue] = useState("");
    const [availableMenus, setAvailableMenus] = useState<any[]>([]);

    useEffect(() => {
        fetchCommands();
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        const { data } = await supabase.from("dc_menus").select("menu_id, title").eq("is_active", true);
        if (data) setAvailableMenus(data);
    };

    const fetchCommands = async () => {
        setLoading(true);
        // Legacy support: Include records where platform is NULL as they were likely Discord commands.
        const { data } = await supabase
            .from("dc_commands")
            .select("*")
            .or('platform.eq.discord,platform.is.null')
            .order("name", { ascending: true });

        if (data) setCommands(data);
        setLoading(false);
    };

    const handleEdit = (cmd: any) => {
        setEditingCommand(cmd);
        setName(cmd.name || "");
        setResponse(cmd.response_text || "");
        setPermission(cmd.permission || "everyone");
        setIsActive(cmd.is_active !== false);
        setActionType(cmd.action_type || "text");
        setActionValue(cmd.action_value || "");
    };
};

const handleSave = async () => {
    if (!name || !response) return showToast("All logic nodes must be populated.", true);
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_commands").upsert({
            id: editingCommand?.id,
            name: name.replace(/\//g, ''),
            response_text: response,
            permission: permission,
            is_active: isActive,
            action_type: actionType,
            action_value: actionValue,
            platform: "discord",
            updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

        if (error) throw error;

        await supabase.from("dc_stats").insert({
            event_type: "command_updated",
            details: `Logic node /${name} was recalibrated.`
        });

        showToast("Logic node stabilized! /" + name + " is live. ⚡");
        setEditingCommand(null);
        fetchCommands();
    } catch (err: any) {
        showToast(`ERR_LOGIC: ${err.message}`, true);
    } finally {
        setSaving(false);
    }
};

const handleDelete = async (id: any) => {
    if (!confirm(`Are you sure you want to delete this logic node?`)) return;
    await supabase.from("dc_commands").delete().eq("id", id);
    fetchCommands();
};

const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible">

        {/* Header - Compact */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
            <div className="space-y-1">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                        <Terminal size={16} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Neural Logic Overlord</span>
                </div>
                <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
                    Logic <span className="text-zinc-300">Nodes</span>
                </h1>
                <p className="text-sm font-bold text-zinc-500 max-w-2xl">
                    Calibrating the agency's command distribution and neural pathways for Discord.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan neural paths..."
                        className="pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm outline-none focus:ring-8 ring-zinc-500/5 transition-all font-bold text-sm w-72 italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchCommands}
                    className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
                >
                    <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                    onClick={() => handleEdit({ name: 'new_cmd', response_text: '', is_active: true })}
                    className="flex items-center gap-4 px-8 py-4 bg-zinc-950 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group italic tracking-widest uppercase"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Inject Path
                </button>
            </div>
        </header>

        {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">

            {/* Left: Logic Grid (Col: 8) */}
            <div className="xl:col-span-8 flex flex-col min-h-0">
                <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-12 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                        <div className="col-span-3 pl-4">Neural Path</div>
                        <div className="col-span-4">Automated Payload</div>
                        <div className="col-span-3">Auth Permission</div>
                        <div className="col-span-2 text-right pr-4">Metrics</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
                        {loading ? (
                            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                        ) : filteredCommands.length === 0 ? (
                            <div className="p-32 text-center opacity-10 italic uppercase font-black tracking-[0.2em] font-mono">Logic Void Detected</div>
                        ) : (
                            filteredCommands.map((cmd, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={cmd.id}
                                    className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group"
                                >
                                    <div className="col-span-3 pl-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm">
                                            <Command size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="font-black text-zinc-950 text-sm italic tracking-tighter uppercase truncate block underline underline-offset-4 decoration-zinc-100">/{cmd.name}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${cmd.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">CORE_RELAY</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs font-bold text-zinc-500 leading-relaxed pr-10 truncate italic opacity-60">
                                            "{cmd.response_text || 'Static response payload...'}"
                                        </p>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2 text-zinc-950 font-black text-[10px] uppercase tracking-widest italic opacity-30">
                                            <Shield size={12} className="text-zinc-300" /> {cmd.permission?.toUpperCase() || 'EVERYONE'}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right pr-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleEdit(cmd)}
                                            className="p-3 bg-white text-zinc-950 rounded-xl hover:shadow-xl transition-all border border-zinc-100 shadow-sm"><Edit3 size={16} /></button>
                                        <button
                                            onClick={() => handleDelete(cmd.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Controller Hub (Col: 4) */}
            <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
                <div className="bg-zinc-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group shrink-0">
                    <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><Terminal size={200} /></div>
                    <h3 className="text-xl font-black mb-6 flex items-center gap-4 italic tracking-tighter">
                        <Sparkles className="text-zinc-400" /> Neural Pulse
                    </h3>

                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Active Flows</span>
                            <span className="text-2xl font-black italic tracking-tighter leading-none">{commands.length}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black opacity-30 uppercase italic tracking-widest leading-none">Status</span>
                            <span className="text-[9px] font-black bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg shadow-lg italic leading-none">STABLE</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden flex-1 flex flex-col min-h-0 group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><ShieldCheck size={120} /></div>
                    <h4 className="font-black text-xl text-zinc-950 mb-8 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-100 uppercase shrink-0">
                        <History size={18} className="text-zinc-400" /> Activity Trace
                    </h4>

                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 relative overflow-hidden">
                        <div className="flex flex-col items-center gap-6 text-center relative z-10 opacity-20">
                            <Terminal size={48} className="text-zinc-400 animate-pulse" />
                            <h5 className="text-sm font-black uppercase tracking-[0.2em] italic">Real-time Telemetry Active</h5>
                        </div>
                    </div>

                    <div className="mt-8 text-center shrink-0">
                        <button className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors flex items-center justify-center gap-3 mx-auto group italic">
                            Access Performance Ledger <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Logic Editor Modal - High Density */}
        <AnimatePresence>
            {editingCommand && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/10 animate-in fade-in duration-300">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white flex flex-col gap-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-45"><Zap size={240} /></div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-zinc-950 italic tracking-tighter uppercase flex items-center gap-4 py-2 border-b-2 border-zinc-950">
                                <Zap className="text-zinc-950" size={24} /> Neural Calibrator
                            </h3>
                            <button onClick={() => setEditingCommand(null)} className="p-4 text-zinc-300 hover:text-zinc-950 bg-zinc-50 rounded-2xl transition-all"><X size={20} /></button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Path Trigger</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-2xl text-zinc-950 focus:bg-white outline-none italic transition-all truncate"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="status_check"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Relay Status</label>
                                    <button
                                        onClick={() => setIsActive(!isActive)}
                                        className={`w-full h-[66px] rounded-xl transition-all border flex items-center justify-between px-6 ${isActive ? 'bg-zinc-950 border-zinc-950 text-white shadow-xl' : 'bg-red-50 border-red-200 text-red-500'}`}
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-widest">{isActive ? 'ONLINE' : 'SEVERED'}</span>
                                        <Power size={20} className={isActive ? 'text-emerald-400 animate-pulse shadow-glow-emerald' : ''} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Automated Payload</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-6 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white font-bold text-zinc-900 leading-relaxed italic transition-all outline-none resize-none shadow-inner"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    placeholder="Enter command response payload..."
                                />
                            </div>

                            <DiscordSelect
                                label="Authorization Node"
                                type="role"
                                value={permission}
                                onChange={setPermission}
                                placeholder="Select required role..."
                            />

                            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Neural Action Type</label>
                                    <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        {[
                                            { id: 'text', label: 'Payload Message', icon: Terminal },
                                            { id: 'panel', label: 'Open Neural Panel', icon: Sparkles },
                                            { id: 'ticket', label: 'Open Ticket', icon: Edit3 },
                                            { id: 'colors', label: 'Color Matrix', icon: Zap }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setActionType(type.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${actionType === type.id ? 'bg-zinc-950 text-white shadow-lg' : 'hover:bg-white text-zinc-400'}`}
                                            >
                                                <type.icon size={14} className={actionType === type.id ? 'text-zinc-400' : ''} />
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {actionType === 'panel' && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Select Panel ID</label>
                                        <select
                                            className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-bold text-zinc-950 text-sm outline-none appearance-none"
                                            value={actionValue}
                                            onChange={(e) => setActionValue(e.target.value)}
                                        >
                                            <option value="">No Panel Selected</option>
                                            {availableMenus.map(m => (
                                                <option key={m.menu_id} value={m.menu_id}>{m.title} ({m.menu_id})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-6 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] italic disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={20} />}
                                Broadcast Neural Sync
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
);
}
