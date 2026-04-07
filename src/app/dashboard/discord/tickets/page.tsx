"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, Search, Clock, Archive, UserCircle, 
  MessageCircle, X, ExternalLink, Loader2, Filter, 
  ChevronRight, BadgeInfo, Zap, History, User, Bot,
  RefreshCcw, ArrowRight, Shield, Terminal, Download, Cpu
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    let query = supabase.from("dc_tickets").select("*").order("created_at", { ascending: false });
    
    if (filter !== "all") {
        query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) {
        setTickets(data);
    }
    setLoading(false);
  };

  const fetchMessages = async (ticketId: string) => {
    setMessagesLoading(true);
    const { data } = await supabase
        .from("dc_ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
    
    if (data) setMessages(data);
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (activeTicket) {
        fetchMessages(activeTicket.ticket_id);
    } else {
        setMessages([]);
    }
  }, [activeTicket]);

  const filteredTickets = tickets.filter(t => 
    t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
    t.user_id.toLowerCase().includes(search.toLowerCase()) ||
    (t.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300">
      
      {/* Header - Terminal Style */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 border-b border-white/5 pb-6">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <Ticket size={16} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Management // Support Logs</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Operational <span className="text-emerald-500 crt-glow">Tickets</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-2xl">
             Auditing interaction sessions and secure transcripts across the Highcore Support System.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="relative group font-mono">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Node, User or ID..."
                    className="pl-12 pr-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-zinc-950 transition-all font-black text-[10px] uppercase tracking-widest w-80 placeholder:text-zinc-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchTickets}
                className="p-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all active:scale-95 group"
            >
                <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-emerald-500 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </header>

      {/* Grid Layout - Dark Terminal */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Ticket Stream (Col: 5) */}
        <div className="xl:col-span-4 flex flex-col min-h-0">
             <div className="terminal-card rounded-[2rem] flex-1 flex flex-col overflow-hidden bg-zinc-950/40 relative">
                  <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                     <div className="flex gap-2 font-mono">
                        {['all', 'open', 'closed'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'text-zinc-600 hover:text-zinc-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                     </div>
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest font-mono">{filteredTickets.length} RECORDS</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 font-mono">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                     ) : filteredTickets.length === 0 ? (
                         <div className="p-20 text-center opacity-20 italic uppercase tracking-widest text-[10px]">No tickets found.</div>
                     ) : (
                         filteredTickets.map((ticket) => (
                             <motion.div 
                                 key={ticket.id}
                                 whileHover={{ scale: 1.01 }}
                                 onClick={() => setActiveTicket(ticket)}
                                 className={`w-full p-6 rounded-3xl border transition-all cursor-pointer flex flex-col gap-6 group relative overflow-hidden ${
                                    activeTicket?.id === ticket.id 
                                    ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.05)]" 
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                 }`}
                             >
                                 <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-4">
                                         <div className={`p-4 rounded-2xl ${activeTicket?.id === ticket.id ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/40 text-zinc-700 border border-white/5'}`}>
                                             {ticket.status === 'open' ? <Zap size={20} className="crt-glow animate-pulse" /> : <Archive size={20} />}
                                         </div>
                                         <div className="min-w-0">
                                             <div className={`font-black text-lg italic tracking-tighter leading-none mb-1 uppercase ${activeTicket?.id === ticket.id ? 'text-white' : 'text-zinc-400'}`}>#{ticket.ticket_id}</div>
                                             <div className={`text-[10px] font-black uppercase tracking-[0.2em] truncate ${activeTicket?.id === ticket.id ? 'text-emerald-500/60' : 'text-zinc-600'}`}>
                                                 {ticket.user_name || `User: ${ticket.user_id.substring(0,8)}...`}
                                             </div>
                                         </div>
                                     </div>
                                     <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-600 border border-white/5'}`}>
                                         {ticket.status}
                                     </div>
                                 </div>
                             </motion.div>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Transcript Inspector (Col: 8) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
             <AnimatePresence mode="wait">
                {activeTicket ? (
                    <motion.div 
                        key={activeTicket.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="terminal-card rounded-[2.5rem] flex-1 flex flex-col overflow-hidden bg-zinc-950/40 relative border-white/5"
                    >
                         <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col gap-6 relative z-10 font-mono">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                                        <History className="text-emerald-500" /> TICKET_#{activeTicket.ticket_id}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{activeTicket.status} SUPPORT_LOG</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveTicket(null)}
                                    className="p-3 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <User size={16} className="text-zinc-600" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] leading-none mb-1">User Identity</div>
                                        <div className="text-sm font-black text-zinc-300 truncate tracking-tight uppercase italic">{activeTicket.user_name || activeTicket.user_id}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <Cpu size={16} className="text-zinc-600" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] leading-none mb-1">Support Subject</div>
                                        <div className="text-sm font-black text-zinc-300 truncate tracking-tight uppercase italic">{activeTicket.subject || activeTicket.type || "Undefined"}</div>
                                    </div>
                                </div>
                            </div>
                         </div>

                         {/* Messages Feed */}
                         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-6 font-mono relative z-10">
                            {messagesLoading ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-20">
                                    <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Loading Support History...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-10">
                                    <Terminal size={80} className="mb-6 text-emerald-500" />
                                    <h4 className="text-2xl font-black tracking-tighter uppercase italic">No Messages</h4>
                                    <p className="text-sm font-black uppercase tracking-[0.2em]">The message history is empty</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={msg.id} className="flex gap-4 group/msg relative">
                                         <div className="w-10 h-10 rounded-xl bg-black/40 shrink-0 border border-white/5 shadow-sm flex items-center justify-center text-zinc-600 font-black text-[10px] italic uppercase group-hover/msg:border-emerald-500/20 group-hover/msg:text-emerald-500 transition-all">
                                            {msg.user_name?.charAt(0) || 'U'}
                                         </div>
                                         <div className="flex flex-col min-w-0">
                                             <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{msg.user_name || "Unknown_User"}</span>
                                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest font-mono">[{new Date(msg.created_at).toLocaleTimeString([], {hour12: false})}]</span>
                                                {msg.type === 'system' && (
                                                    <span className="text-[8px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20">SYSTEM_MSG</span>
                                                )}
                                             </div>
                                             <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none shadow-sm text-[13px] font-medium text-zinc-400 leading-relaxed max-w-2xl group-hover/msg:border-white/10 group-hover/msg:bg-white/[0.05] transition-all font-sans">
                                                 {msg.content}
                                             </div>
                                         </div>
                                    </div>
                                ))
                            )}
                         </div>

                         {/* Footer Actions */}
                         <div className="p-8 border-t border-white/5 bg-black/20 shrink-0 relative z-10 font-mono">
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-zinc-900 text-zinc-500 font-black text-[10px] rounded-2xl border border-white/10 hover:border-white/20 hover:text-white transition-all uppercase tracking-widest italic flex items-center justify-center gap-3">
                                    <Download size={14} /> DOWNLOAD_TRANSCRIPT
                                </button>
                                <button className="flex-1 py-4 bg-emerald-500 text-black font-black text-[10px] rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                                    <ExternalLink size={14} /> SYNC_WITH_DISCORD
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-950/20 rounded-[2.5rem] text-center border-2 border-dashed border-white/5 opacity-20 font-mono">
                        <Shield size={60} className="mb-10 text-emerald-500 animate-pulse" />
                        <h3 className="text-xl font-black text-white tracking-widest uppercase italic max-w-sm">Select a ticket to view the interaction history</h3>
                    </div>
                )}
             </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
