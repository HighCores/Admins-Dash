"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Users, Trophy, 
  Crown, Star, ShieldAlert, Plus, Trash2, 
  Search, Loader2, Sparkles, Zap, Shield, 
  ChevronRight, History, Activity, BarChart3,
  User as UserIcon, Settings2
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
            guild_id: "global" 
        }, { onConflict: 'level' });

        if (error) throw error;
        
        await supabase.from("dc_stats").insert({
            event_type: "reward_updated",
            details: `Level ${newLevel} requirement was recalibrated.`
        });

        alert("Prestige logic synchronized! 🏅");
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
    if (!confirm("Terminate this prestige node?")) return;
    await supabase.from("dc_level_rewards").delete().eq("level", level);
    fetchData();
  };

  const cleanId = (id: string) => {
    if (!id) return "NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase();
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg">
                <Trophy size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Competitive Merit Registry</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Levels <span className="text-zinc-300">& Prestige</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Architect of the High Core elite. Design progression metrics and calibrate role distribution logic across the network.
          </p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: The Elite Leaderboard */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between px-10">
                    <h3 className="text-xl font-black text-zinc-950 flex items-center gap-4 tracking-tighter italic">
                        <Crown className="text-zinc-400" /> Neural Elite Registry
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-950 font-black text-[9px] uppercase bg-white px-4 py-2 rounded-xl shadow-sm border border-zinc-100 italic">
                        <TrendingUp size={14} className="text-emerald-500" /> LIVE_SYNC_ACTIVE
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-5 p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50">
                        <div className="pl-4">Rank</div>
                        <div className="col-span-2">Identity</div>
                        <div>Logic Lvl</div>
                        <div className="text-right pr-4">Metrics</div>
                    </div>
                    
                    <div className="p-2">
                        {loading ? (
                            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" size={40} /></div>
                        ) : topUsers.length === 0 ? (
                            <div className="p-32 text-center opacity-10">
                                <History size={60} className="mx-auto" />
                                <p className="text-xl font-black uppercase italic tracking-tighter mt-4">Merit void. No data nodes detected.</p>
                            </div>
                        ) : topUsers.map((user, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={user.user_id} 
                                className="grid grid-cols-5 items-center p-4 rounded-2xl hover:bg-zinc-50 transition-all group"
                            >
                                <div className="pl-4">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black shadow-sm text-sm border ${
                                        idx === 0 ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-400 border-zinc-100'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-black text-xs uppercase tracking-tighter">{user.user_name?.charAt(0) || 'H'}</div>
                                     <div>
                                         <div className="font-black text-zinc-950 text-sm italic tracking-tighter leading-none mb-1 group-hover:underline underline-offset-4 decoration-zinc-100">{user.user_name || "Cipher_User"}</div>
                                         <div className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest leading-none">NODE_{cleanId(user.user_id).slice(0, 8)}</div>
                                     </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-950 tracking-tighter italic"><span className="text-[10px] opacity-20 mr-1 italic">LVL</span>{user.level || 1}</span>
                                </div>
                                <div className="text-right pr-4">
                                    <div className="text-[10px] font-black text-zinc-500 italic tracking-widest">{user.xp?.toLocaleString() || 0} <span className="opacity-20">XP</span></div>
                                    <div className="w-16 h-1 bg-zinc-50 rounded-full ml-auto mt-2 overflow-hidden shadow-inner border border-zinc-100">
                                         <div className="h-full bg-zinc-950" style={{ width: `${(user.xp % 1000) / 10}%` }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Progression Map (Rewards Editor) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col min-h-0">
                <h3 className="text-xl font-black text-zinc-950 mb-8 flex items-center gap-3 italic tracking-tighter underline underline-offset-8 decoration-zinc-50">
                    <Award className="text-zinc-400" /> Reward Logic Hub
                </h3>

                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                    {/* Add Reward Form */}
                    <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 space-y-6 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Sparkles size={100} /></div>
                        
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2 italic">Threshold Level</label>
                             <input 
                                type="number" 
                                value={newLevel}
                                onChange={(e) => setNewLevel(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-zinc-100 font-black text-zinc-950 outline-none focus:ring-4 ring-zinc-950/5 transition-all"
                                placeholder="e.g. 10"
                             />
                        </div>
                        
                        <DiscordSelect 
                            label="Unlock Identity (Role)"
                            type="role"
                            value={newRole}
                            onChange={setNewRole}
                            placeholder="Select merit tier..."
                        />
                        
                        <button 
                            onClick={handleSaveReward}
                            disabled={saving}
                            className="w-full py-5 bg-zinc-950 text-white font-black text-[10px] rounded-xl shadow-xl hover:bg-black transition-all uppercase tracking-[0.4em] italic flex items-center justify-center gap-4 group"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Zap size={16} className="text-orange-400 shadow-glow-small" />} 
                            SYNC REWARD NODE
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
                        {loading ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-zinc-300" /></div>
                        ) : rewards.length === 0 ? (
                            <div className="p-20 text-center opacity-10">
                                <History size={40} className="mx-auto" />
                                <p className="text-xs font-black uppercase tracking-widest mt-4">Logic void.</p>
                            </div>
                        ) : (
                            rewards.map((reward) => (
                                <div key={reward.id} className="p-4 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between group hover:shadow-xl transition-all h-20">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xl font-black text-zinc-950 bg-zinc-50 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner border border-zinc-100 italic">
                                            {reward.level}
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Merit Token</div>
                                            <div className="text-xs font-black text-zinc-950 flex items-center gap-2 italic uppercase">
                                                <Shield size={12} className="text-zinc-300" /> {cleanId(reward.role_id).slice(0, 10)}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteReward(reward.level)}
                                        className="opacity-0 group-hover:opacity-100 p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-red-50"><Trash2 size={16} /></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-zinc-950 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group border border-zinc-900">
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Star size={100} /></div>
                <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-2 italic">Neural Roadmap</div>
                <h4 className="text-sm font-black italic tracking-tighter">Level 100 Skins Unlock <span className="text-emerald-400 ml-2">ACTIVAED</span></h4>
            </div>
        </div>
      </div>
    </div>
  );
}
