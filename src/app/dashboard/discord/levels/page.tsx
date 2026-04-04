"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Users, Trophy, 
  Crown, Star, ShieldAlert, Plus, Trash2, 
  Search, Loader2, Sparkles, Zap, Shield, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import DiscordSelect from "@/components/DiscordSelect";

export default function LevelsPage() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State for Rewards
  const [newLevel, setNewLevel] = useState("");
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Top Levels
    const { data: levels } = await supabase.from("dc_levels").select("*").order("xp", { ascending: false }).limit(6);
    // Fetch Rewards
    const { data: levelRewards } = await supabase.from("dc_level_rewards").select("*").order("level", { ascending: true });
    
    if (levels) setTopUsers(levels);
    if (levelRewards) setRewards(levelRewards);
    setLoading(false);
  };

  const handleSaveReward = async () => {
    if (!newLevel || !newRole) return alert("Please specify level and role.");
    setSaving(true);
    try {
        const { error } = await supabase.from("dc_level_rewards").upsert({
            level: parseInt(newLevel),
            role_id: newRole,
            guild_id: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "current_guild" 
        }, { onConflict: 'level' });

        if (error) throw error;
        
        await supabase.from("dc_stats").insert({
            event_type: "reward_updated",
            details: `Level ${newLevel} reward was updated.`
        });

        alert("Prestige reward linked! 🏅");
        setNewLevel("");
        setNewRole("");
        fetchData();
    } catch (err: any) {
        alert(err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleDeleteReward = async (level: number) => {
    if (!confirm("Remove this prestige requirement?")) return;
    await supabase.from("dc_level_rewards").delete().eq("level", level);
    fetchData();
  };

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl animate-bounce">
                <Trophy size={24} />
            </div>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-none italic font-mono">Competitive Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-sunset-900 tracking-tighter glow-text-sunset">
            Levels <span className="opacity-30">& Prestige</span>
          </h1>
          <p className="text-lg font-medium text-sunset-800/70 max-w-2xl italic leading-relaxed">
            Architect of the High Core elite. Design progression paths, automate role distribution, and monitor your top performers.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left: The Elite Dashboard (Scary Leaderboard) */}
        <div className="xl:col-span-8 space-y-8">
            <div className="glass-card rounded-[3.5rem] border border-white/60 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-10 border-b border-white/40 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-sunset-950 uppercase tracking-tighter flex items-center gap-4 italic subrayado-glow-green cursor-default">
                        <Crown className="text-orange-500 animate-pulse" /> The High Elite Node
                    </h3>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-white/80 px-4 py-2 rounded-2xl shadow-sm border border-emerald-50">
                        <TrendingUp size={14} className="animate-pulse" /> LIVE STREAM
                    </div>
                </div>

                <div className="p-4 overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-sunset-800/40 text-[10px] font-black uppercase tracking-[0.3em] leading-none italic">
                                <th className="px-8 py-2">Rank</th>
                                <th className="px-8 py-2">Identity</th>
                                <th className="px-8 py-2">Logic Lvl</th>
                                <th className="px-8 py-2">XP Capacity</th>
                                <th className="px-8 py-2 text-right">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={40} /></td></tr>
                            ) : topUsers.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-sunset-900 opacity-20 italic font-black text-xl">EMPTY VOID. INITIATE SERVER ACTIVITY.</td></tr>
                            ) : topUsers.map((user, idx) => (
                                <tr key={user.user_id} className="group hover:bg-white/60 transition-all cursor-crosshair">
                                    <td className="px-8 py-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black italic shadow-2xl text-xl rotate-3 group-hover:rotate-0 transition-transform ${
                                            idx === 0 ? 'bg-orange-500 text-white shadow-orange-500/40' :
                                            idx === 1 ? 'bg-slate-400 text-white shadow-slate-400/40' :
                                            idx === 2 ? 'bg-amber-700 text-white shadow-amber-700/40' :
                                            'bg-white text-sunset-950 border border-sunset-50'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-300 border-2 border-white shadow-inner">{user.user_name?.charAt(0) || 'H'}</div>
                                            <div>
                                                <div className="font-black text-sunset-950 text-base italic leading-tight">{user.user_name || "Cipher_User"}</div>
                                                <div className="text-[10px] text-sunset-800/30 font-mono tracking-tighter">UID: {user.user_id?.split('-')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2 text-emerald-600 font-black italic text-2xl tracking-tighter leading-none">
                                            <span className="opacity-20 text-sm italic">LVL</span> {user.level || 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="text-sm font-black text-sunset-950 italic opacity-80">{user.xp?.toLocaleString() || 0} <span className="text-[10px] opacity-30 tracking-widest font-mono uppercase">XP_NODES</span></div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="w-32 h-2 bg-slate-100 rounded-full ml-auto overflow-hidden shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card p-12 rounded-[4rem] border border-emerald-950 bg-emerald-950 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><TrendingUp size={300} /></div>
                <h3 className="text-3xl font-black mb-4 flex items-center gap-4 italic tracking-tighter subrayado-glow">
                    <Sparkles size={28} className="text-yellow-400" /> Neural Growth Accelerator
                </h3>
                <p className="text-emerald-100/60 mb-10 max-w-2xl font-medium italic leading-relaxed text-lg">
                    The High Core XP algorithm reward's meaningful engagement. Synchronize the system's neural speed below to accelerate rank distribution.
                </p>
                <div className="flex items-center gap-8">
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase tracking-[0.4em] opacity-50 font-mono italic">
                            <span>Base Neural Gain</span>
                            <span>2.5X TURBO SCAN</span>
                        </div>
                        <div className="relative h-2 bg-emerald-900 rounded-full">
                           <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-6 h-6 bg-emerald-400 rounded-full shadow-glow-green cursor-pointer"></div>
                           <div className="h-full bg-emerald-400 rounded-full w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Progression Map (Rewards Editor) */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] border border-white/60 bg-white/60 backdrop-blur-xl shadow-2xl">
                <h3 className="text-2xl font-black text-sunset-950 mb-10 border-b border-sunset-100 pb-6 flex items-center gap-3 italic tracking-tighter">
                    <Award className="text-emerald-500" /> Reward Logic Hub
                </h3>

                <div className="space-y-6">
                    {/* Add Reward Form */}
                    <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] space-y-4">
                        <div className="space-y-1">
                             <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest px-2 italic">Threshold Level</label>
                             <input 
                                type="number" 
                                value={newLevel}
                                onChange={(e) => setNewLevel(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-white border border-emerald-100 font-black text-emerald-900 outline-none"
                                placeholder="e.g. 10"
                             />
                        </div>
                        <DiscordSelect 
                            label="Unlock Identity (Role)"
                            type="role"
                            value={newRole}
                            onChange={setNewRole}
                            placeholder="Select role..."
                        />
                        <button 
                            onClick={handleSaveReward}
                            disabled={saving}
                            className="w-full py-4 bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-emerald-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Zap size={16} className="group-hover:animate-pulse" />} 
                            SYNC REWARD
                        </button>
                    </div>

                    <div className="space-y-4 pt-4">
                        {loading ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                        ) : rewards.length === 0 ? (
                            <p className="text-center italic opacity-30 font-bold p-10 text-sunset-900">No logical rewards mapped.</p>
                        ) : (
                            rewards.map((reward) => (
                                <div key={reward.id} className="p-5 bg-white rounded-3xl border border-emerald-50 flex items-center justify-between group hover:shadow-2xl transition-all border-l-[6px] border-l-emerald-500">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-black text-emerald-600 bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl shadow-inner italic leading-none">{reward.level}</div>
                                        <div>
                                            <div className="text-[10px] font-black text-sunset-800/30 uppercase tracking-[0.2em] mb-1 italic">Prestige Token</div>
                                            <div className="text-sm font-black text-sunset-950 flex items-center gap-2 italic">
                                                <Shield size={14} className="text-emerald-400" /> {reward.role_id?.split('-')[0] || "UNSET_ROLE"}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteReward(reward.level)}
                                        className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={20} /></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 bg-black rounded-[3rem] text-white shadow-2xl relative group cursor-pointer hover:scale-105 transition-all overflow-hidden text-center border border-white/5">
                <Zap className="absolute top-4 left-4 text-orange-500 animate-pulse" size={24} />
                <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-2 italic">Future Roadmap</div>
                <h4 className="text-lg font-black italic tracking-tighter">Prestige Level 100 Skins Unlock</h4>
            </div>
        </div>
      </div>
    </div>
  );
}
