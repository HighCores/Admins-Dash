"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Users, Trophy, 
  Crown, Star, ShieldAlert, Plus, Trash2, 
  Search, Loader2, Sparkles, Zap, Shield, 
  ChevronRight, History, Activity, BarChart3,
  User as UserIcon, Settings2, RefreshCcw
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
    const { data: levels } = await supabase.from("dc_levels").select("*").order("xp", { ascending: false }).limit(10);
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
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-zinc-950 rounded-xl shadow-lg shadow-zinc-200">
                <Trophy size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Competitive Merit Registry</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Levels <span className="text-zinc-300">& Prestige</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Architecting the High Core elite. Progression metrics and merit node calibration.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={fetchData}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-400 group-hover:text-zinc-950 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-6 py-4 bg-zinc-950 text-white rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-900 group">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors cursor-default">Intelligence Synced</span>
            </div>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Leaderboard (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <Crown size={18} className="text-zinc-400" /> Neural Elite Registry
                     </h3>
                     <span className="bg-zinc-950 text-white text-[9px] px-3 py-1.5 rounded-lg font-black tracking-widest leading-none">TOP_INFLUENCERS</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-12 p-6 border-b border-zinc-50 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                          <div className="col-span-1 pl-4">Rank</div>
                          <div className="col-span-4">Identity</div>
                          <div className="col-span-3">Logic Level</div>
                          <div className="col-span-4 text-right pr-4">Metrics Registry</div>
                      </div>

                      <div className="p-2 space-y-1">
                         {loading ? (
                             <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" size={40} /></div>
                         ) : topUsers.length === 0 ? (
                             <div className="p-32 text-center opacity-10 italic uppercase font-black tracking-[0.2em]">Merit Void Detected</div>
                         ) : (
                             topUsers.map((user, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={user.user_id}
                                    className="grid grid-cols-12 items-center p-4 rounded-2xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-100 group"
                                >
                                    <div className="col-span-1 pl-4">
                                        <div className={`w-9 h-9 flex items-center justify-center rounded-xl font-black text-xs italic border ${
                                            idx === 0 ? 'bg-zinc-950 text-white shadow-xl rotate-3' : 
                                            idx === 1 ? 'bg-zinc-100 text-zinc-950 border-zinc-200' :
                                            idx === 2 ? 'bg-zinc-50 text-zinc-500 border-zinc-100' :
                                            'bg-white text-zinc-300 border-transparent group-hover:border-zinc-200'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="col-span-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 font-black text-[10px] uppercase shadow-inner italic">{user.user_name?.charAt(0) || 'H'}</div>
                                        <div className="min-w-0">
                                            <div className="font-black text-zinc-950 text-sm italic tracking-tighter truncate leading-none mb-1">{user.user_name || "Cipher_User"}</div>
                                            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest truncate leading-none">NODE_{cleanId(user.user_id).slice(0, 10)}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-end gap-1.5">
                                            <span className="text-3xl font-black text-zinc-950 tracking-tighter italic leading-none">{user.level || 1}</span>
                                            <span className="text-[10px] font-black text-zinc-300 mb-0.5 tracking-widest italic uppercase">LVL_STABLE</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-right pr-4">
                                        <div className="text-[10px] font-black text-zinc-600 italic tracking-widest mb-1">{user.xp?.toLocaleString() || 0} <span className="text-zinc-300">XP_ACCUMULATED</span></div>
                                        <div className="w-full h-1 bg-zinc-50 rounded-full overflow-hidden shadow-inner border border-zinc-100">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                                                className="h-full bg-zinc-950 shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                             ))
                         )}
                      </div>
                  </div>
             </div>
        </div>

        {/* Right: Reward Editor (Col: 4) */}
        <div className="xl:col-span-4 flex flex-col gap-8 min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-zinc-50 bg-zinc-50/20">
                    <h3 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter flex items-center gap-3">
                        <Award size={18} className="text-zinc-400" /> Reward Logic Hub
                    </h3>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                     {/* Add Reward Zone */}
                     <div className="p-8 bg-zinc-50/50 border-b border-zinc-100 space-y-6 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12 transition-transform group-hover:scale-125 duration-1000"><Zap size={140} /></div>
                        
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Threshold Level</label>
                             <input 
                                type="number" 
                                value={newLevel}
                                onChange={(e) => setNewLevel(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white border border-zinc-100 font-black text-zinc-950 outline-none focus:bg-white focus:ring-8 ring-zinc-950/5 transition-all italic"
                                placeholder="E.G. 10"
                             />
                        </div>
                        
                        <DiscordSelect 
                            label="Merit Tier Identity (Role)"
                            type="role"
                            value={newRole}
                            onChange={setNewRole}
                            placeholder="Select target role..."
                        />
                        
                        <button 
                            onClick={handleSaveReward}
                            disabled={saving}
                            className="w-full py-5 bg-zinc-950 text-white font-black text-[10px] rounded-xl shadow-xl hover:bg-black transition-all uppercase tracking-[0.4em] italic flex items-center justify-center gap-4 group"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Zap size={16} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />} 
                            Sync Reward Node
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                         {rewards.length === 0 ? (
                             <div className="p-10 text-center opacity-10 italic uppercase font-black text-[10px] tracking-[0.3em]">No logic manifesting</div>
                         ) : (
                             rewards.map((reward) => (
                                <div key={reward.id} className="p-4 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between group hover:shadow-xl transition-all h-20 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xl font-black text-zinc-950 bg-zinc-50 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner border border-zinc-100 italic">
                                            {reward.level}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic leading-none mb-1">Merit_Token_Role</div>
                                            <div className="text-xs font-black text-zinc-950 flex items-center gap-2 italic uppercase truncate pr-4">
                                                <Shield size={12} className="text-zinc-300" /> {cleanId(reward.role_id).slice(0, 12)}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteReward(reward.level)}
                                        className="opacity-0 group-hover:opacity-100 p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                                </div>
                             ))
                         )}
                    </div>
                </div>
             </div>

             <div className="p-6 bg-zinc-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-zinc-900 shrink-0">
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Star size={100} /></div>
                <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-2 italic">Neural Roadmap Status</div>
                <h4 className="text-sm font-black italic tracking-tighter flex items-center gap-3">
                    <History size={16} className="text-zinc-400" /> Prestige Cycle: <span className="text-emerald-400">OPTIMAL</span>
                </h4>
            </div>
        </div>
      </div>
    </div>
  );
}
