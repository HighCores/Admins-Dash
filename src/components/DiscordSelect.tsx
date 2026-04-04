"use client";

import { useState, useEffect } from "react";
import { Hash, Shield, Search, Loader2, ChevronDown } from "lucide-react";

interface DiscordSelectProps {
  label: string;
  type: "channel" | "role";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DiscordSelect({ label, type, value, onChange, placeholder }: DiscordSelectProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/discord/${type === "channel" ? "channels" : "roles"}`);
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(`Error loading ${type}s:`, err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  const selectedItem = items.find((i) => i.id === value);
  const filteredItems = items.filter((i) => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black text-sunset-800/40 uppercase tracking-widest px-1 italic">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/50 border border-sunset-100 rounded-2xl font-bold text-sunset-900 focus:ring-2 ring-sunset-500/10 outline-none transition-all hover:bg-white"
        >
          <div className="flex items-center gap-2">
            {loading ? (
                <Loader2 size={16} className="animate-spin text-sunset-400" />
            ) : type === "channel" ? (
                <Hash size={16} className="text-sunset-400" />
            ) : (
                <Shield size={16} className="text-sunset-400" />
            )}
            <span className={selectedItem ? "text-sunset-900" : "text-sunset-400"}>
              {selectedItem ? selectedItem.name : placeholder || `Select a ${type}...`}
            </span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-white/95 backdrop-blur-md border border-sunset-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-sunset-50">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sunset-400" />
                 <input 
                    autoFocus
                    type="text" 
                    className="w-full pl-9 pr-4 py-2 bg-sunset-50/50 rounded-xl text-sm font-medium focus:outline-none"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
               {filteredItems.length === 0 ? (
                 <div className="p-4 text-center text-xs font-bold text-sunset-300 italic">No {type}s found</div>
               ) : (
                 filteredItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => {
                        onChange(item.id);
                        setIsOpen(false);
                     }}
                     className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all text-left text-sm font-bold ${
                        value === item.id ? "bg-sunset-500 text-white" : "hover:bg-sunset-50 text-sunset-900"
                     }`}
                   >
                     {type === "channel" ? <Hash size={14} className="opacity-50" /> : <Shield size={14} className="opacity-50" />}
                     {item.name}
                     {item.color && type === "role" && (
                        <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: item.color }}></div>
                     )}
                   </button>
                 ))
               )}
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop for closing */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
