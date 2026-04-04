"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, MessageSquare, Search, 
  ExternalLink, Clock, User, Filter, 
  Loader2, BadgeInfo, Zap, History, X,
  Archive, ShieldCheck, Ticket as TicketIcon, RefreshCcw,
  ArrowRight, Shield, Terminal, ChevronRight
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
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    let query = supabase.from("dc_tickets").select("*").eq("platform", "telegram").order("created_at", { ascending: false });
    
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
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header - Compact */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Send size={16} className="text-white" />
             </div>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none font-mono">Telegram Relay Vault</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">
            Cloud <span className="text-blue-500">Tickets</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
             Auditing interaction sessions across the Telegram High Core relay.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by ID, User or Name..."
                    className="pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm outline-none focus:ring-8 ring-blue-500/5 transition-all font-bold text-sm w-80 italic"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchTickets}
                className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group active:scale-95"
            >
                <RefreshCcw size={20} className={`text-blue-400 group-hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </header>

      {/* Grid Layout - SIDE-BY-SIDE (NO SCROLL) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0 overflow-hidden text-zinc-950">
        
        {/* Left: Ticket Stream (Col: 5) */}
        <div className="xl:col-span-5 flex flex-col min-h-0">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-zinc-50 bg-zinc-50/20 flex items-center justify-between">
                     <div className="flex gap-2">
                        {['all', 'open', 'closed'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-950'}`}
                            >
                                {f}
                            </button>
                        ))}
                     </div>
                     <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{filteredTickets.length} RECORDS</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                     {loading ? (
                         <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
                     ) : filteredTickets.length === 0 ? (
                         <div className="p-20 text-center opacity-20 italic">No tickets manifest.</div>
                     ) : (
                         filteredTickets.map((ticket) => (
                             <motion.button 
                                 key={ticket.id}
                                 whileHover={{ x: 5 }}
                                 onClick={() => setActiveTicket(ticket)}
                                 className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                                    activeTicket?.id === ticket.id 
                                    ? "bg-zinc-950 text-white shadow-xl border-transparent" 
                                    : "bg-white border-zinc-100 hover:bg-zinc-50 text-zinc-950"
                                 }`}
                             >
                                 <div className="flex items-center gap-4">
                                     <div className={`p-3 rounded-xl ${activeTicket?.id === ticket.id ? 'bg-white/10' : 'bg-zinc-50 text-zinc-400'}`}>
                                         {ticket.status === 'open' ? <Zap size={16} className="text-blue-400" /> : <Archive size={16} />}
                                     </div>
                                     <div className="min-w-0">
                                         <div className="font-black text-sm italic tracking-tight">{ticket.ticket_id}</div>
                                         <div className={`text-[10px] font-black uppercase tracking-widest truncate ${activeTicket?.id === ticket.id ? 'text-zinc-400' : 'text-zinc-300'}`}>
                                             {ticket.user_name || `ID: ${ticket.user_id}`}
                                         </div>
                                     </div>
                                 </div>
                                 <ChevronRight size={16} className={activeTicket?.id === ticket.id ? "opacity-100" : "opacity-20"} />
                             </motion.button>
                         ))
                     )}
                  </div>
             </div>
        </div>

        {/* Right: Transcript Inspector (Col: 7) */}
        <div className="xl:col-span-7 flex flex-col min-h-0">
             <AnimatePresence mode="wait">
                {activeTicket ? (
                    <motion.div 
                        key={activeTicket.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col overflow-hidden"
                    >
                         <div className="p-8 border-b border-zinc-50 bg-zinc-50/20 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-zinc-950 italic tracking-tighter uppercase">{activeTicket.ticket_id}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'open' ? 'bg-blue-500 animate-pulse' : 'bg-zinc-100'}`}></div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{activeTicket.status} SESSION</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveTicket(null)}
                                    className="p-3 text-zinc-300 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl transition-all"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                                    <User size={16} className="text-blue-400" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none mb-1">Subject Node</div>
                                        <div className="text-sm font-black text-zinc-950 truncate tracking-tight">{activeTicket.user_name || activeTicket.user_id}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                                    <Clock size={16} className="text-zinc-400" />
                                    <div>
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none mb-1">Created At</div>
                                        <div className="text-sm font-black text-zinc-950 truncate tracking-tight">{new Date(activeTicket.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                         </div>

                         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-6 bg-zinc-50/30">
                            {messagesLoading ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-20">
                                    <Loader2 size={40} className="animate-spin mb-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Decrypting Logs...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-10">
                                    <Terminal size={80} className="mb-6" />
                                    <h4 className="text-2xl font-black tracking-tighter uppercase italic">No Logs Decoded</h4>
                                    <p className="text-sm font-black uppercase tracking-[0.2em]">Secure Session Registry Empty</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={msg.id} className="flex gap-4 group">
                                         <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-blue-400 font-black text-[10px] italic">
                                            {msg.user_name?.charAt(0) || 'U'}
                                         </div>
                                         <div className="flex flex-col min-w-0">
                                             <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-black text-zinc-950 uppercase italic">{msg.user_name || "Node_Unknown"}</span>
                                                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest italic">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                             </div>
                                             <div className="p-4 bg-white border border-zinc-100 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium text-zinc-700 leading-relaxed max-w-lg group-hover:shadow-md transition-all">
                                                 {msg.content}
                                             </div>
                                         </div>
                                    </div>
                                ))
                            )}
                         </div>

                         <div className="p-8 border-t border-zinc-50 bg-white shrink-0">
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-zinc-50 text-zinc-950 font-black text-[10px] rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-all uppercase tracking-widest italic underline decoration-zinc-300 underline-offset-4">DOWNLOAD_TRANSCRIPT</button>
                                <button className="flex-1 py-4 bg-blue-600 text-white font-black text-[10px] rounded-xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-3 italic">
                                    <ExternalLink size={14} /> VIEW ON TELEGRAM
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 bg-zinc-50/50 rounded-[2.5rem] text-center border-2 border-dashed border-zinc-200 opacity-20">
                        <ShieldCheck size={60} className="mb-10 text-blue-500" />
                        <h3 className="text-2xl font-black text-zinc-950 tracking-tighter uppercase italic pr-4">Select an active node to inspect operational logs</h3>
                    </div>
                )}
             </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
