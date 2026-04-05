"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Hash, Shield, Search, Loader2, ChevronDown, Layout, AlertCircle } from "lucide-react";

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
        // Use fixed positioning relative to viewport to escape all parents
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
        // Add listeners to parent scroll containers to ensure position stays sticky
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
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className={`w-full h-11 flex items-center justify-between px-4 bg-zinc-50 border rounded-xl font-bold transition-all hover:bg-white focus:ring-2 ring-zinc-950/5 outline-none ${
            error ? "border-red-200 bg-red-50/30" : "border-zinc-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {loading ? (
                <Loader2 size={14} className="animate-spin text-zinc-400" />
            ) : error ? (
                <AlertCircle size={14} className="text-red-400" />
            ) : type === "channel" ? (
                <Hash size={14} className="text-zinc-400" />
            ) : type === "role" ? (
                <Shield size={14} className="text-zinc-400" />
            ) : (
                <Layout size={14} className="text-zinc-400" />
            )}
            <span className={`text-sm truncate max-w-[180px] ${error ? "text-red-400 font-black italic" : selectedItem ? "text-zinc-900" : "text-zinc-400 opacity-60"}`}>
              {error ? `SYSTEM_ERR: ${error}` : selectedItem ? (selectedItem.name || selectedItem.label) : placeholder || `Select ${type}...`}
            </span>
          </div>
          <ChevronDown size={14} className={`text-zinc-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && typeof document !== "undefined" && createPortal(
          <div 
            style={{ 
                position: 'fixed',
                top: coords.top + 8,
                left: coords.left,
                width: coords.width,
                zIndex: 9999999 // Ultimate priority
            }}
            className="bg-white border border-zinc-100 rounded-2xl shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200"
          >
            {error ? (
                <div className="p-8 text-center bg-red-50/50">
                    <AlertCircle size={24} className="mx-auto text-red-400 mb-3" />
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Connection Error</div>
                    <div className="text-[9px] font-bold text-red-400/60 leading-relaxed uppercase">{error}</div>
                    <div className="mt-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest italic pt-4 border-t border-red-100">Check Bot API Status</div>
                </div>
            ) : (
                <>
                    <div className="p-3 border-b border-zinc-50 bg-zinc-50/50">
                    <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-xs font-bold focus:outline-none border border-zinc-100"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                    {filteredItems.length === 0 ? (
                        <div className="p-6 text-center text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">No results found</div>
                    ) : (
                        filteredItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onChange(item.id, item.color);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left text-sm font-bold ${
                                value === item.id ? "bg-zinc-950 text-white" : "hover:bg-zinc-50 text-zinc-900"
                            }`}
                        >
                            {type === "channel" ? <Hash size={12} className="opacity-40" /> : type === "role" ? <Shield size={12} className="opacity-40" /> : <Layout size={12} className="opacity-40" />}
                            <span className="truncate">{item.name || item.label}</span>
                            {item.color && type === "role" && (
                                <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: item.color }}></div>
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
          className="fixed inset-0 z-[9999998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
