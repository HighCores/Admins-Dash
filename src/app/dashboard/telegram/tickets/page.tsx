"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, MessageSquare, Search, 
  ExternalLink, Clock, User, Filter, 
  Loader2, BadgeInfo, Zap, History, X,
  Archive, ShieldCheck, Ticket as TicketIcon, RefreshCcw,
  ArrowRight, Shield, Terminal, ChevronRight, Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTicket, setActiveTicket] = useState<any | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    let query = supabase
        .from("dc_tickets")
        .select("*")
        .eq("platform", "telegram")
        .order("created_at", { ascending: false });
    
    if (filter !== "all") {
        query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setTickets(data);
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
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Area - Terminal Navigation */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1 font-mono">
             <div className="p-2 bg-emerald-500/10 rounded-xl shadow-lg border border-emerald-500/20">
                <TicketIcon size={16} className="text-emerald-500 crt-glow" />
             </div>
             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none">Subsystem // Proxy Transcript Vault</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Relay <span className="text-emerald-500 crt-glow">Transcripts</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl font-mono">
             Auditing interaction logs and neural handshakes across the Telegram Highcore relay.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="relative group font-mono">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="SCAN_ID_OR_USER..."
                    className="pl-12 pr-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl outline-none focus:border-emerald-500/30 transition-all font-black text-[10px] w-80 uppercase tracking-widest placeholder:text-zinc-800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchTickets}
                className="p-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-zinc-500 group-hover:text-emerald-500 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden">
        
        {/* Left: Ticket Stream (Col: 5) */}
        <div className="xl:col-span-4 flex flex-col min-h-0 h-full overflow-hidden">
             <div className="terminal-card flex-1 flex flex-col overflow-hidden bg-zinc-950/40 rounded-[2rem]">
                  <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between font-mono">
                     <div className="flex gap-2">
                        {['all', 'open', 'closed'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-zinc-500 border-white/5 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                     </div>
                     <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">{filteredTickets.length} NODES</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                     ) : filteredTickets.length === 0 ? (
                         <div className="p-20 text-center opacity-20 italic font-mono text-[10px] uppercase tracking-widest">No matching manifests.</div>
                     ) : (
                         filteredTickets.map((ticket) => (
                             <motion.button 
                                 key={ticket.id}
                                 whileHover={{ x: 5 }}
                                 onClick={() => setActiveTicket(ticket)}
                                 className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                                    activeTicket?.id === ticket.id 
                                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-[inset_0_0_20px_rgba(34,197,94,0.02)]" 
                                    : "bg-transparent border-white/5 hover:bg-white/5 text-zinc-400"
                                 }`}
                             >
                                 <div className="flex items-center gap-4">
                                     <div className={`p-3 rounded-xl ${activeTicket?.id === ticket.id ? 'bg-emerald-500/10 text-emerald-500' : 'bg-black/20 text-zinc-600 border border-white/5'}`}>
                                         {ticket.status === 'open' ? <Zap size={16} className="crt-glow" /> : <Archive size={16} />}
                                     </div>
                                     <div className="min-w-0">
                                         <div className={`font-black text-sm italic tracking-tight font-mono ${activeTicket?.id === ticket.id ? 'text-white' : ''}`}>{ticket.ticket_id}</div>
                                         <div className={`text-[9px] font-black uppercase tracking-widest truncate ${activeTicket?.id === ticket.id ? 'text-emerald-500/60' : 'text-zinc-600'}`}>
                                             {ticket.user_name || `NID: ${ticket.user_id}`}
                                         </div>
                                     </div>
                                 </div>
                                 <ChevronRight size={16} className={activeTicket?.id === ticket.id ? "opacity-100 text-emerald-500" : "opacity-20"} />
                             </motion.button>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Transcript Inspector (Col: 7) */}
        <div className="xl:col-span-8 flex flex-col min-h-0 h-full overflow-hidden">
             <AnimatePresence mode="wait">
                {activeTicket ? (
                    <motion.div 
                        key={activeTicket.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="terminal-card rounded-[2.5rem] flex-1 flex flex-col overflow-hidden bg-zinc-950/40 border-white/10"
                    >
                         <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase font-mono">{activeTicket.ticket_id}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'open' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-zinc-800'}`}></div>
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">{activeTicket.status} SESSION_ACTIVE</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveTicket(null)}
                                    className="p-3 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center gap-4 hover:border-emerald-500/20 transition-all group/info">
                                    <User size={16} className="text-emerald-500 opacity-50 group-hover/info:opacity-100 transition-opacity" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Subject Node</div>
                                        <div className="text-sm font-black text-zinc-300 truncate tracking-tight font-mono">{activeTicket.user_name || activeTicket.user_id}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center gap-4 hover:border-emerald-500/20 transition-all group/info">
                                    <Clock size={16} className="text-zinc-600" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Created At</div>
                                        <div className="text-sm font-black text-zinc-300 truncate tracking-tight font-mono">{new Date(activeTicket.created_at).toLocaleString([], { hour12: false })}</div>
                                    </div>
                                </div>
                            </div>
                         </div>

                         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-6 bg-black/20">
                            {messagesLoading ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-20 font-mono">
                                    <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Decrypting Operational Logs...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-10 font-mono">
                                    <Terminal size={80} className="mb-6 text-emerald-500" />
                                    <h4 className="text-2xl font-black tracking-tighter uppercase italic">No Logs Decoded</h4>
                                    <p className="text-sm font-black uppercase tracking-[0.2em]">Secure Session Registry Empty</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={msg.id} className="flex gap-4 group">
                                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 shrink-0 border border-emerald-500/20 shadow-sm flex items-center justify-center text-emerald-500 font-black text-xs uppercase font-mono crt-glow">
                                            {msg.user_name?.charAt(0) || 'U'}
                                         </div>
                                         <div className="flex flex-col min-w-0">
                                             <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-black text-white uppercase italic tracking-tight">{msg.user_name || "Node_Unknown"}</span>
                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic font-mono">[{new Date(msg.created_at).toLocaleTimeString([], { hour12: false })}]</span>
                                             </div>
                                             <div className="p-5 bg-white/[0.04] border border-white/5 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium text-zinc-400 font-sans leading-relaxed max-w-2xl group-hover:text-zinc-200 transition-all border-l-2 border-l-emerald-500/30">
                                                 {msg.content}
                                             </div>
                                         </div>
                                    </div>
                                ))
                            )}
                         </div>

                         <div className="p-8 border-t border-white/5 bg-white/[0.02] shrink-0 font-mono">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="py-4 bg-zinc-900 text-zinc-400 font-black text-[10px] rounded-xl border border-white/5 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest italic underline decoration-white/10 underline-offset-4">DOWNLOAD_TRANSCRIPT</button>
                                <button className="py-4 bg-emerald-500 text-black font-black text-[10px] rounded-xl shadow-[0_0_20px_#10b981] hover:scale-[1.02] hover:shadow-[0_0_30px_#10b981] transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                                    <ExternalLink size={14} /> VIEW_ON_TELEGRAM
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-950/20 rounded-[2.5rem] text-center border border-dashed border-white/5 opacity-40">
                        <Terminal size={60} className="mb-10 text-emerald-500 crt-glow animate-pulse" />
                        <h3 className="text-2xl font-black text-white tracking-widest uppercase italic font-mono max-w-sm">Select an active node to inspect operational logs</h3>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-4">Authorization Confirmed // Highcore Relay</p>
                    </div>
                )}
             </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

