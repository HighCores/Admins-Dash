"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Hash, Shield, Search, Loader2, ChevronDown, Layout, AlertCircle, Terminal, Cpu } from "lucide-react";

interface DiscordSelectProps {
  label: string;
  type: "channel" | "role" | "category";
  value: string;
  excludeIds?: string[];
  onChange: (value: string, color?: string) => void;
  placeholder?: string;
}

export default function DiscordSelect({ label, type, value, excludeIds = [], onChange, placeholder }: DiscordSelectProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const cacheKey = `discord_${type}`;
      
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setItems(data);
          setLoading(false);
          return;
        }
      }

      try {
        const endpoint = type === "channel" ? "channels" : type === "role" ? "roles" : "categories";
        const response = await fetch(`/api/discord/${endpoint}`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
            setItems(data);
            sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
            setError(data.error || `Failed to fetch ${type}s`);
            setItems([]);
        }
      } catch (err: any) {
        setError("Network Connection Failed");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  const updateCoords = useCallback(() => {
    if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
            top: rect.bottom,
            left: rect.left,
            width: rect.width
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
        updateCoords();
        window.addEventListener('scroll', updateCoords, true);
        window.addEventListener('resize', updateCoords);
    }
    return () => {
        window.removeEventListener('scroll', updateCoords, true);
        window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen, updateCoords]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedItem = items.find((i) => i.id === value);
  const filteredItems = items.filter((i) => {
    const name = i?.name || i?.label || "Unknown Node";
    if (excludeIds.includes(i.id)) return false;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-2 relative font-mono">
      <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest px-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className={`w-full h-12 flex items-center justify-between px-4 bg-black/40 border rounded-2xl font-black transition-all hover:bg-zinc-950 focus:border-emerald-500/30 outline-none ${
            error ? "border-red-500/30 bg-red-500/5 text-red-500" : "border-white/5 text-zinc-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {loading ? (
                <Loader2 size={14} className="animate-spin text-emerald-500" />
            ) : error ? (
                <AlertCircle size={14} className="text-red-500 animate-pulse" />
            ) : type === "channel" ? (
                <Hash size={14} className={selectedItem ? "text-emerald-500" : "text-zinc-700"} />
            ) : type === "role" ? (
                <Shield size={14} className={selectedItem ? "text-emerald-500" : "text-zinc-700"} />
            ) : (
                <Cpu size={14} className={selectedItem ? "text-emerald-500" : "text-zinc-700"} />
            )}
            <span className={`text-[10px] uppercase tracking-widest truncate max-w-[180px] ${error ? "text-red-500 italic" : selectedItem ? "text-white" : "text-zinc-700"}`}>
              {error ? `NODE_ERR: ${error}` : selectedItem ? (selectedItem.name || selectedItem.label) : placeholder || `ID_REQUIRED: ${type}`}
            </span>
          </div>
          <ChevronDown size={14} className={`text-zinc-700 transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-500" : ""}`} />
        </button>

        {isOpen && typeof document !== "undefined" && createPortal(
          <div 
            style={{ 
                position: 'fixed',
                top: coords.top + 8,
                left: coords.left,
                width: coords.width,
                zIndex: 9999999
            }}
            className="bg-[#0f0f12] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {error ? (
                <div className="p-8 text-center bg-red-500/5">
                    <AlertCircle size={24} className="mx-auto text-red-500 mb-3" />
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 font-mono">Transmission Failure</div>
                    <div className="text-[9px] font-bold text-red-500/60 leading-relaxed uppercase font-mono">{error}</div>
                </div>
            ) : (
                <>
                    <div className="p-4 border-b border-white/5 bg-black/40">
                        <div className="relative group">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                autoFocus
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0c] border border-white/5 rounded-xl text-[10px] uppercase font-black tracking-widest text-white outline-none focus:border-emerald-500/20 transition-all placeholder:text-zinc-800"
                                placeholder="Search Cluster..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar space-y-1 font-mono">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-[10px] font-black text-zinc-800 uppercase tracking-widest italic font-mono">No nodes identified</div>
                    ) : (
                        filteredItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onChange(item.id, item.color);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left text-[10px] font-black uppercase tracking-widest ${
                                value === item.id 
                                ? "bg-emerald-500 text-black shadow-lg" 
                                : "hover:bg-white/5 text-zinc-500 hover:text-white"
                            }`}
                        >
                            {type === "channel" ? <Hash size={12} className="opacity-40 shrink-0" /> : type === "role" ? <Shield size={12} className="opacity-40 shrink-0" /> : <Terminal size={12} className="opacity-40 shrink-0" />}
                            <span className="truncate">{item.name || item.label}</span>
                            {item.color && type === "role" && (
                                <div className="w-2 h-2 rounded-full ml-auto shadow-sm" style={{ backgroundColor: item.color }}></div>
                            )}
                        </button>
                        ))
                    )}
                    </div>
                </>
            )}
          </div>,
          document.body
        )}
      </div>
      
      {/* Backdrop for closing */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999998] bg-black/20" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
