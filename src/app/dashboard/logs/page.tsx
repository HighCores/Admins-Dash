"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Activity, Clock, Search, Filter, ChevronDown } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "discord" | "telegram" | "system">("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchLogs();
    
    // Setup realtime subscription
    const channel = supabase.channel('audit_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, payload => {
        setLogs(prev => [payload.new, ...prev].slice(0, 1000));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(1000);
    if (data) {
      setLogs(data);
    }
    setLoading(false);
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        log.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesPlatform = platformFilter === "all" || log.platform === platformFilter;
      
      return matchesSearch && matchesPlatform;
    });
  }, [logs, searchQuery, platformFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight flex items-center gap-3">
          <Activity className="text-sunset-600" />
          System Logs
        </h1>
        <button onClick={fetchLogs} className="px-4 py-2 bg-sunset-100 text-sunset-700 rounded-xl font-medium hover:bg-sunset-200 transition">
          Refresh Logs
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl flex flex-col gap-6">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40 p-4 rounded-2xl border border-sunset-100">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by user, action, or details..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-sunset-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/20 text-sunset-900 placeholder:text-sunset-400 font-medium transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto relative" ref={dropdownRef}>
              <Filter size={18} className="text-sunset-500" />
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white border border-sunset-200 text-sunset-800 font-bold py-3 px-4 rounded-xl flex items-center gap-3 hover:bg-sunset-50 transition-colors"
              >
                {platformFilter === "all" ? "All Platforms" : platformFilter.charAt(0).toUpperCase() + platformFilter.slice(1)}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-sunset-100 rounded-xl shadow-xl overflow-hidden z-20 py-2">
                  <button
                    onClick={() => { setPlatformFilter("all"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-medium transition-colors ${platformFilter === "all" ? "bg-sunset-500 text-white" : "text-sunset-800 hover:bg-sunset-50"}`}
                  >
                    All Platforms
                  </button>
                  <button
                    onClick={() => { setPlatformFilter("discord"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-medium transition-colors ${platformFilter === "discord" ? "bg-sunset-500 text-white" : "text-sunset-800 hover:bg-sunset-50"}`}
                  >
                    Discord
                  </button>
                  <button
                    onClick={() => { setPlatformFilter("telegram"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-medium transition-colors ${platformFilter === "telegram" ? "bg-sunset-500 text-white" : "text-sunset-800 hover:bg-sunset-50"}`}
                  >
                    Telegram
                  </button>
                  <button
                    onClick={() => { setPlatformFilter("system"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-medium transition-colors ${platformFilter === "system" ? "bg-sunset-500 text-white" : "text-sunset-800 hover:bg-sunset-50"}`}
                  >
                    System
                  </button>
                </div>
              )}
            </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <p className="text-center text-sunset-500 py-10">Loading logs...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-sunset-500 py-10">No logs found matching your filters.</p>
        ) : (
          <div className="overflow-x-auto max-h-[60vh] custom-scrollbar pr-2">
            <div className="flex flex-col gap-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/40 hover:bg-white/70 transition-colors border border-sunset-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sunset-900 text-lg">{log.user_name}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        log.platform === 'discord' ? 'bg-indigo-100 text-indigo-700' :
                        log.platform === 'telegram' ? 'bg-blue-100 text-blue-700' :
                        'bg-sunset-100 text-sunset-700'
                      }`}>
                        {log.platform.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-sunset-800 mt-1">{log.action}</p>
                    {log.details && <p className="text-sm text-sunset-600 font-medium">{log.details}</p>}
                  </div>
                  <div className="flex items-start text-xs text-sunset-500 sm:text-right gap-1.5 pt-1 whitespace-nowrap bg-white/50 px-3 py-2 rounded-xl self-start sm:self-center border border-sunset-50" dir="ltr">
                    <Clock size={14} className="mt-0.5 text-sunset-400" />
                    <span className="font-semibold">
                      {new Date(log.created_at).toLocaleDateString('en-GB')} <span className="text-sunset-400 mx-1">•</span> {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
