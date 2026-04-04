"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, MessageSquare, Search, 
  ExternalLink, Clock, User, Filter, 
  Loader2, BadgeInfo, Zap, History, X,
  Archive, ShieldCheck, Ticket as TicketIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Transcript Modal State
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase
        .from("dc_tickets")
        .select("*")
        .eq("platform", "telegram")
        .order("created_at", { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  };

  const openTranscript = async (ticket: any) => {
    setSelectedTicket(ticket);
    setLoadingMessages(true);
    const { data } = await supabase
      .from("dc_ticket_messages")
      .select("*")
      .eq("ticket_id", ticket.ticket_id)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
    setLoadingMessages(false);
  };

  const closeTranscript = () => {
    setSelectedTicket(null);
    setMessages([]);
  };

  const cleanId = (id: string) => {
    if (!id) return "TG_NODE_UNKNOWN";
    return id.replace(/^Node_/i, "").replace(/^panel_/i, "").toUpperCase();
  };

  const filteredTickets = tickets.filter(t => 
    (t.ticket_id?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (t.user_name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg">
                <Send size={20} />
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Telegram Proxy Relay</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-950 tracking-tighter">
            Telegram <span className="text-zinc-300">Inquiries</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 max-w-2xl">
            Real-time monitoring of Telegram bot inquiries and N8N webhook handshakes with absolute precision.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Telegram ledger..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white border border-zinc-100 font-bold text-zinc-950 shadow-sm focus:ring-4 ring-blue-500/5 outline-none transition-all placeholder:opacity-30"
          />
        </div>
      </header>

      <div className="flex-1 min-h-0 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-5 p-6 border-b border-zinc-50 bg-zinc-50/20 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <div className="pl-4">Reference</div>
            <div>Creator</div>
            <div>Status</div>
            <div>Origin Node</div>
            <div className="text-right pr-4">Metrics</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
            ) : filteredTickets.length === 0 ? (
                <div className="p-32 text-center opacity-20">
                    <Zap size={60} className="mx-auto mb-6" />
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">The Telegram stream is silent. No data nodes found.</h3>
                </div>
            ) : (
                filteredTickets.map((ticket, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={ticket.ticket_id} 
                        className="grid grid-cols-5 items-center p-6 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group cursor-default"
                    >
                        <div className="pl-4">
                            <span className="font-black text-zinc-950 text-sm italic tracking-tighter underline underline-offset-4 decoration-zinc-100 group-hover:decoration-zinc-300 transition-all">#{cleanId(ticket.ticket_id)}</span>
                            <span className="text-[9px] font-bold text-zinc-300 block mt-1 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">TG</div>
                            <span className="font-bold text-sm text-zinc-950 truncate max-w-[120px]">{ticket.user_name || "Unknown"}</span>
                        </div>
                        <div className="flex">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2 ${
                                ticket.status === 'open' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400'
                            }`}>
                                <div className={`w-1 h-1 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' : 'bg-current shadow-glow-small'}`}></div>
                                {ticket.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center text-zinc-300 border border-zinc-100"><TicketIcon size={12} /></div>
                             <span className="text-xs font-bold text-zinc-500">N8N_RELAY_SYNC</span>
                        </div>
                        <div className="text-right pr-4">
                            <button 
                                onClick={() => openTranscript(ticket)}
                                className="inline-flex items-center gap-3 px-6 py-2.5 bg-zinc-950 text-white font-black text-[9px] rounded-xl hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95 italic tracking-widest group/btn"
                            >
                                <MessageSquare size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" /> INSPECT
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-zinc-100 overflow-hidden"
             >
                <div className="p-10 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/20 px-12">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl">
                             <Archive size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-zinc-950 tracking-tighter italic uppercase flex items-center gap-3">
                                #{cleanId(selectedTicket.ticket_id)} <span className="opacity-10">/</span> <span className="text-zinc-300">TG_Transcript</span>
                            </h2>
                            <div className="flex items-center gap-4 mt-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><User size={12} /> {selectedTicket.user_name}</span>
                                <span className="flex items-center gap-2"><BadgeInfo size={12} /> {selectedTicket.subject || "GENERAL_QUERY"}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={closeTranscript} className="p-5 text-zinc-300 hover:text-red-500 bg-white rounded-2xl border border-zinc-100 shadow-sm transition-all hover:rotate-90"><X size={24} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white space-y-8">
                    {loadingMessages ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={60} /></div>
                    ) : messages.length === 0 ? (
                        <div className="p-20 text-center opacity-10">
                            <MessageSquare size={80} className="mx-auto" />
                            <p className="text-xl font-black uppercase italic tracking-tighter mt-4">No neural activity recorded for this session.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.user_id === selectedTicket.user_id ? "items-start" : "items-end"}`}>
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">{msg.user_name}</span>
                                    <span className="text-[8px] font-black text-zinc-200 uppercase">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                </div>
                                <div className={`px-8 py-5 rounded-[2rem] max-w-[70%] shadow-sm border ${
                                    msg.user_id === selectedTicket.user_id 
                                        ? "bg-zinc-50 text-zinc-900 border-zinc-100 rounded-tl-sm"
                                        : "bg-blue-600 text-white border-blue-500 rounded-tr-sm shadow-xl"
                                }`}>
                                    <p className="font-bold text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-10 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between px-12">
                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic">High Core Secure Archive</span>
                     <button className="flex items-center gap-3 px-6 py-3 bg-white text-zinc-950 font-black text-[10px] rounded-xl shadow-sm border border-zinc-100 hover:scale-105 transition-all italic tracking-widest">
                         <ExternalLink size={14} /> EXPORT_DATA_NODE
                     </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
