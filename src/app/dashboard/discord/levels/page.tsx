"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Save, Monitor, Settings2, Shield, Plus,
  Hash, Bot, Power, Award, Palette, Upload, Loader2, Star
} from "lucide-react";
import { useState } from "react";
import DiscordSelect from "@/components/DiscordSelect";
import { showToast } from "@/components/CustomToaster";

export default function LevelsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "rewards" | "card">("settings");

  // Configuration State
  const [isActive, setIsActive] = useState(true);
  const [xpRate, setXpRate] = useState(1.0);
  const [announceChannel, setAnnounceChannel] = useState("");
  const [announceMessage, setAnnounceMessage] = useState("GG {user}, you just advanced to level {level}!");
  
  // Card Customization
  const [primaryColor, setPrimaryColor] = useState("#5865F2");
  const [bgImageUrl, setBgImageUrl] = useState("https://assets.hc.agency/rank-bg.png");

  const [rewards, setRewards] = useState([
     { id: 1, level: 5, role: "123456789" },
     { id: 2, level: 10, role: "987654321" }
  ]);

  const handleSave = async () => {
      setSaving(true);
      // Backend integration logic goes here
      setTimeout(() => {
          setSaving(false);
          showToast("Leveling rules updated in Core. ⚡");
      }, 1000);
  };

  const addReward = () => {
     setRewards([...rewards, { id: Date.now(), level: 0, role: "" }]);
  };

  const removeReward = (id: number) => {
     setRewards(rewards.filter(r => r.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar overflow-x-visible p-1">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <TrendingUp size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none font-mono">Engagement Module</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Leveling <span className="text-zinc-300">System</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Reward activity and automate roles based on chat engagement.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 px-6 py-4 font-black text-xs rounded-2xl shadow-xl transition-all group italic tracking-widest uppercase ${
                    isActive ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                }`}
            >
                <Power size={18} className={isActive ? "opacity-100" : "opacity-50"} />
                {isActive ? "SYSTEM ACTIVE" : "SYSTEM PAUSED"}
            </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-zinc-100 mb-6 shrink-0 shadow-sm w-fit">
          <button 
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}>
              <Settings2 size={14} /> Global Rules
          </button>
          <button 
              onClick={() => setActiveTab("rewards")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rewards' ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}>
              <Shield size={14} /> Role Rewards
          </button>
          <button 
              onClick={() => setActiveTab("card")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'card' ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}>
              <Palette size={14} /> Rank Card Design
          </button>
      </div>

      <div className={`bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden transition-all ${!isActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 overflow-x-visible">
              {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-3xl">
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">XP Multiplier Rate</label>
                          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between shadow-inner">
                              <span className="text-zinc-500 font-bold text-sm">Base XP gained per message: <span className="text-zinc-950">15-25 XP</span></span>
                              <div className="flex items-center gap-4">
                                  <input 
                                      type="range" 
                                      min="0.1" 
                                      max="3" 
                                      step="0.1" 
                                      value={xpRate}
                                      onChange={(e) => setXpRate(parseFloat(e.target.value))}
                                      className="accent-zinc-950 w-48"
                                  />
                                  <span className="w-16 text-right font-black text-xl italic tracking-tighter text-zinc-950">{xpRate}x</span>
                              </div>
                          </div>
                      </div>

                      <DiscordSelect 
                          label="Level Up Announcement Channel"
                          type="channel"
                          value={announceChannel}
                          onChange={setAnnounceChannel}
                          placeholder="Select channel (leave blank to announce in current channel)"
                      />

                      <div className="space-y-4">
                          <div className="flex items-center justify-between px-4">
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] font-mono leading-none italic">Announcement Message Body</label>
                          </div>
                          <textarea 
                              rows={3}
                              value={announceMessage}
                              onChange={(e) => setAnnounceMessage(e.target.value)}
                              className="w-full px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-zinc-800 leading-relaxed transition-all outline-none focus:bg-white resize-none shadow-inner"
                              placeholder="Write announcement..."
                          />
                          <div className="flex flex-wrap gap-2 pt-2 px-2">
                              {["{user}", "{level}", "{old_level}", "{server}"].map(v => (
                                  <button 
                                      key={v}
                                      onClick={() => setAnnounceMessage(prev => prev + " " + v)}
                                      className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-md hover:bg-black hover:text-white transition-all font-mono"
                                  >
                                      {v}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </motion.div>
              )}

              {activeTab === 'rewards' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
                      <div className="bg-amber-50 text-amber-900 p-6 rounded-2xl border border-amber-200">
                          <h4 className="font-bold flex items-center gap-2 mb-2"><Award size={18} className="text-amber-500" /> Automated Progression</h4>
                          <p className="text-sm font-medium opacity-80">Users will automatically receive these roles when they hit the designated level. Roles are removed recursively if they rank down.</p>
                      </div>

                      <div className="space-y-4">
                          {rewards.length === 0 ? (
                              <div className="p-12 border-2 border-dashed border-zinc-200 rounded-3xl text-center text-zinc-400 font-bold">No role rewards configured.</div>
                          ) : (
                              <div className="grid grid-cols-12 gap-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest px-4">
                                  <div className="col-span-3">Target Level</div>
                                  <div className="col-span-8">Role to Give</div>
                                  <div className="col-span-1"></div>
                              </div>
                          )}

                          {rewards.map((r, index) => (
                              <div key={r.id} className="grid grid-cols-12 gap-4 items-center bg-zinc-50 p-4 rounded-2xl border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                  <div className="col-span-3 relative">
                                      <Star size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                                      <input 
                                          type="number"
                                          value={r.level}
                                          onChange={(e) => {
                                              const nr = [...rewards];
                                              nr[index].level = parseInt(e.target.value) || 0;
                                              setRewards(nr);
                                          }}
                                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-200 font-black text-zinc-950 outline-none focus:border-zinc-400 transition-all"
                                          placeholder="e.g. 5"
                                      />
                                  </div>
                                  <div className="col-span-8">
                                      <DiscordSelect 
                                          type="role"
                                          value={r.role}
                                          onChange={(v) => {
                                              const nr = [...rewards];
                                              nr[index].role = v;
                                              setRewards(nr);
                                          }}
                                          placeholder="Select Discord Role"
                                      />
                                  </div>
                                  <div className="col-span-1 flex justify-end">
                                      <button onClick={() => removeReward(r.id)} className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                          X
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <button onClick={addReward} className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 font-black text-xs uppercase tracking-widest hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all flex items-center justify-center gap-2">
                          <Plus size={16} /> ADD REWARD
                      </button>
                  </motion.div>
              )}

              {activeTab === 'card' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6">
                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Primary Bar Color</label>
                                  <div className="flex gap-4">
                                      <input 
                                          type="color" 
                                          className="w-12 h-12 rounded-xl cursor-pointer border-4 border-zinc-50 shadow-sm bg-transparent"
                                          value={primaryColor}
                                          onChange={(e) => setPrimaryColor(e.target.value)}
                                      />
                                      <input 
                                          type="text" 
                                          className="flex-1 p-3 rounded-xl bg-zinc-50 border border-zinc-100 font-black text-xs text-zinc-950 outline-none uppercase tracking-widest shadow-inner"
                                          value={primaryColor}
                                          onChange={(e) => setPrimaryColor(e.target.value)}
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 font-mono leading-none italic">Custom Background URL</label>
                                  <div className="relative">
                                      <Upload size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                      <input 
                                          type="text" 
                                          className="w-full pl-12 pr-5 py-4 rounded-xl bg-zinc-50 border border-zinc-100 font-medium text-sm text-zinc-950 outline-none shadow-inner"
                                          value={bgImageUrl}
                                          onChange={(e) => setBgImageUrl(e.target.value)}
                                          placeholder="https://i.imgur.com/..."
                                      />
                                  </div>
                              </div>
                          </div>

                          <div className="bg-[#2f3136] p-12 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                              {/* Simulated Rank Card */}
                              <div className="w-[800px] max-w-full h-auto aspect-[3/1] bg-black rounded-xl overflow-hidden relative border-2 border-[#202225] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
                                  {bgImageUrl && <img src={bgImageUrl} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                  
                                  <div className="absolute inset-0 p-8 flex items-end">
                                      <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-[#2f3136] shadow-xl relative overflow-hidden z-10 shrink-0">
                                          <div className="w-full h-full bg-[#5865f2] flex items-center justify-center text-white text-3xl font-black">U</div>
                                          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black"></div>
                                      </div>
                                      <div className="ml-6 flex-1 flex flex-col justify-end relative z-10">
                                          <div className="flex justify-between items-end mb-2">
                                              <div className="flex items-center gap-2">
                                                  <h3 className="text-white font-black text-3xl tracking-tight">Username</h3>
                                                  <span className="text-zinc-400 font-bold text-sm">#1234</span>
                                              </div>
                                              <div className="flex items-baseline gap-2">
                                                  <span className="text-white font-bold text-sm uppercase tracking-widest text-[9px] opacity-80">Rank <span className="text-2xl font-black text-white px-1">1</span></span>
                                                  <span className="text-white font-bold text-sm uppercase tracking-widest text-[9px] opacity-80 ml-4">Level <span className="text-2xl font-black text-white px-1">42</span></span>
                                              </div>
                                          </div>
                                          <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                                              <div className="h-full rounded-full transition-all" style={{ width: '65%', backgroundColor: primaryColor }}>
                                                  <div className="w-full h-full bg-gradient-to-r from-transparent to-white/30 truncate"></div>
                                              </div>
                                          </div>
                                          <div className="flex justify-between mt-1.5">
                                              <span className="text-zinc-400 font-bold text-[10px] tracking-widest">EXP 6,500</span>
                                              <span className="text-zinc-400 font-bold text-[10px] tracking-widest">10,000 NEXT</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              )}
          </div>

          <div className="p-6 bg-zinc-50/50 border-t border-zinc-50 shrink-0">
              <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-zinc-950 text-white font-black text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 italic uppercase tracking-[0.4em]"
              >
                  {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                  COMMIT SYSTEM STATE
              </button>
          </div>

      </div>
    </div>
  );
}
