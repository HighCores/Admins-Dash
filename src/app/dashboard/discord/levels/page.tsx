"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Users, Trophy, 
  Crown, Star, ShieldAlert, Plus, Trash2, 
  Search, Loader2, Sparkles, Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LevelsPage() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Top Levels
    const { data: levels } = await supabase.from("dc_levels").select("*").order("xp", { ascending: false }).limit(5);
    // Fetch Rewards
    const { data: levelRewards } = await supabase.from("dc_level_rewards").select("*").order("level", { ascending: true });
    
    if (levels) setTopUsers(levels);
    if (levelRewards) setRewards(levelRewards);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl animate-pulse">
                <Trophy size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Competitive Hub</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Levels <span className="text-emerald-500/40">& Prestige</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Track user activity, manage prestige ranks, and automate role rewards for active members.
          </p>
        </div>
        
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">
                <Plus size={20} /> Create Reward
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Global Leaderboard (The Scary Elite) */}
        <div className="xl:col-span-8 space-y-6">
            <div className="glass-card rounded-[2.5rem] border border-white/60 shadow-2xl relative overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-8 border-b border-white/40 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-sunset-900 uppercase tracking-tight flex items-center gap-3 italic">
                        <Crown className="text-orange-500" /> The High Elite
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xs uppercase bg-emerald-50 px-3 py-1 rounded-lg">
                        <TrendingUp size={14} /> LIVE UPDATE
                    </div>
                </div>

                <div className="p-2 overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-sunset-800/40 text-[10px] font-black uppercase tracking-widest leading-none">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">User Identity</th>
                                <th className="px-6 py-4">Logic Level</th>
                                <th className="px-6 py-4">XP Points</th>
                                <th className="px-6 py-4 text-right">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
                            ) : topUsers.map((user, idx) => (
                                <tr key={user.user_id} className="group hover:bg-white/40 transition-all cursor-crosshair">
                                    <td className="px-6 py-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-xl font-black italic shadow-lg ${
                                            idx === 0 ? 'bg-orange-500 text-white shadow-orange-500/20' :
                                            idx === 1 ? 'bg-slate-400 text-white shadow-slate-400/20' :
                                            idx === 2 ? 'bg-amber-700 text-white shadow-amber-700/20' :
                                            'bg-white text-sunset-900 border border-slate-100'
                                        }`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-300">HC</div>
                                            <div>
                                                <div className="font-bold text-sunset-900 text-sm">{user.user_name || "Unknown User"}</div>
                                                <div className="text-[10px] text-sunset-800/40 font-mono italic">{user.user_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-emerald-600 font-extrabold italic text-lg tracking-tighter">
                                            <span className="opacity-30 text-sm">LVL</span> {user.level || 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-black text-sunset-900">{user.xp || 0} <span className="text-[10px] opacity-30">XP</span></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full ml-auto overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border border-emerald-100 bg-emerald-950 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 rotate-12"><TrendingUp size={240} /></div>
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2 subrayado-glow">
                    <Sparkles size={24} /> Growth Accelerator
                </h3>
                <p className="text-white/60 mb-8 max-w-lg font-medium italic">
                    The High Core XP algorithm is designed to reward meaningful interaction. Update the multiplier below to boost server activity instantly.
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase opacity-60">
                            <span>Base XP Multiplier</span>
                            <span>2.5X ULTRA</span>
                        </div>
                        <input type="range" className="w-full accent-emerald-400" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Reward Map (The Scary Perks) */}
        <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] border border-white/60 bg-white/60 backdrop-blur-lg shadow-xl">
                <h3 className="text-xl font-black text-sunset-900 mb-6 flex items-center gap-2">
                    <Award className="text-emerald-500" /> Reward Logic
                </h3>

                <div className="space-y-3">
                    {loading ? (
                         <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : rewards.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-emerald-100 rounded-3xl opacity-40 italic font-bold">No automatic rewards yet.</div>
                    ) : rewards.map((reward) => (
                        <div key={reward.id} className="p-4 bg-white rounded-2xl border border-emerald-50 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-emerald-500">
                             <div className="flex items-center gap-3">
                                <div className="text-xl font-black text-emerald-600 bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-xl">{reward.level}</div>
                                <div>
                                    <div className="text-[10px] font-black text-sunset-800/40 uppercase leading-none mb-1">Prestige Role</div>
                                    <div className="text-sm font-bold text-sunset-900 flex items-center gap-1">
                                        <Crown size={12} className="text-orange-400" /> {reward.role_id || "Unset Role"}
                                    </div>
                                </div>
                             </div>
                             <button className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
                
                <hr className="my-6 border-emerald-100" />
                
                <div className="p-6 bg-emerald-950 rounded-[2rem] text-white shadow-xl relative group cursor-pointer hover:scale-105 transition-all overflow-hidden text-center">
                    <Zap className="absolute top-2 left-2 text-white/20 animate-pulse" size={24} />
                    <div className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Coming Updates</div>
                    <h4 className="text-sm font-bold">Prestige Level 10+ Skins</h4>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
