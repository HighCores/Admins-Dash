"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, MessageSquare, Search, 
  ExternalLink, Clock, User, Filter, 
  Loader2, BadgeInfo, Zap, Sparkles, CheckCircle2, XCircle,
  AlertCircle, History, ArrowRight, ShieldCheck, Ticket as TicketIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase.from("dc_tickets").select("*").eq("platform", "telegram").order("created_at", { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  };

  const filteredTickets = tickets.filter(t => 
    (t.ticket_id?.toLowerCase().includes(search.toLowerCase())) ||
    (t.user_name?.toLowerCase().includes(search.toLowerCase())) ||
    (t.subject?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full space-y-12 mb-20 animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl animate-bounce">
                <TicketIcon size={24} />
            </div>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest leading-none font-mono italic">Support Proxy Stream</span>
          </div>
          <h1 className="text-5xl font-black text-blue-950 tracking-tighter glow-text-blue">
            Telegram <span className="opacity-30">Inquiries</span>
          </h1>
          <p className="text-lg font-medium text-blue-900/60 max-w-2xl italic leading-relaxed">
            Direct bridge to Telegram user inquiries. Monitor, manage, and resolve tickets with a real-time N8N handshake protocol.
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="relative group">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 group-hover:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Telegram ledger..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-14 pr-8 py-5 rounded-[2.5rem] bg-white border border-blue-50 shadow-xl w-80 font-black text-blue-950 focus:ring-8 ring-blue-500/5 outline-none transition-all placeholder:italic"
                />
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Ticket Grid with Breathing Space */}
        <div className="xl:col-span-8 flex flex-col gap-6">
            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
            ) : filteredTickets.length === 0 ? (
                <div className="p-32 text-center glass-card rounded-[4rem] border-dashed border-4 border-blue-100/50 bg-white/20">
                    <Zap size={60} className="text-blue-200 mb-6 mx-auto" />
                    <h3 className="text-2xl font-black text-blue-900 opacity-20 tracking-tighter uppercase italic">The Telegram stream is silent. No active cases.</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredTickets.map((ticket, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="glass-card p-10 rounded-[3.5rem] border border-white/60 shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group relative overflow-hidden bg-white/40 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner group-hover:rotate-12 transition-transform">
                                        <TicketIcon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-blue-950 text-xl tracking-tighter italic leading-none mb-1">#{ticket.ticket_id}</h4>
                                        <span className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest italic">{ticket.subject || "NO_SUBJECT_NODE"}</span>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm ${
                                    ticket.status === 'open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'
                                }`}>{ticket.status}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-8 border-t border-blue-50/50 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-black italic shadow-sm">TG</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-blue-900 leading-none mb-1 italic">{ticket.user_name || "Unknown_Entity"}</span>
                                        <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="p-3 bg-blue-50 text-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

        {/* Analytics Hub */}
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[3.5rem] bg-gradient-to-br from-blue-950 to-blue-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Send size={240} /></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3 subrayado-glow tracking-tighter italic font-mono">
                    <History size={24} className="text-sky-300" /> Agency Throughput
                </h3>
                <div className="space-y-8">
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest">Global Incoming</span>
                        <span className="text-3xl font-black italic tracking-tighter">0.4 <span className="text-[10px] opacity-30">REQ/HR</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <span className="text-xs font-black opacity-40 uppercase italic tracking-widest">System Load</span>
                        <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full shadow-lg italic">OPTIMAL</span>
                    </div>
                    <div className="pt-6">
                        <button className="w-full py-5 bg-white text-blue-950 font-black text-xs rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] italic">
                            SYNC ANALYTICS CORE
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 rounded-[4rem] border border-blue-100 bg-white/80 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-1000"><AlertCircle size={100} /></div>
                <h4 className="font-black text-xl text-blue-950 mb-4 flex items-center gap-3 italic tracking-tighter subrayado-glow cursor-default">
                    <BadgeInfo size={22} className="text-blue-500" /> Relay Logic Notice
                </h4>
                <p className="text-xs font-bold text-blue-900 opacity-40 leading-relaxed mb-8 italic">
                   Integration with Telegram Cloud Shard is fully operational. Each inquiry generated via the Python bot node is reflected here instantly via the N8N master relay.
                </p>
                <div className="p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between group cursor-help">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-blue-600 animate-pulse" size={20} />
                        <span className="text-[10px] font-black text-blue-950 uppercase tracking-widest italic">N8N Handshake</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">SECURE</span>
                </div>
            </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-blue-950/40 backdrop-blur-2xl animate-in fade-in duration-300">
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white rounded-[4rem] w-full max-w-2xl p-14 shadow-2xl border border-blue-100 flex flex-col gap-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12"><TicketIcon size={240} /></div>
                
                <div className="flex justify-between items-center border-b border-blue-50 pb-8">
                    <h3 className="text-3xl font-black text-blue-950 tracking-tighter italic uppercase underline decoration-blue-200 underline-offset-8">
                        Inspect: #{selectedTicket.ticket_id}
                    </h3>
                    <button onClick={() => setSelectedTicket(null)} className="p-4 text-slate-300 hover:text-red-500 bg-slate-50 rounded-[1.5rem] transition-all focus:rotate-90 transition-transform"><XCircle size={24} /></button>
                </div>
                
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                            <span className="text-[10px] font-black text-blue-900/30 uppercase italic mb-1 block">Origin Node</span>
                            <span className="text-xl font-black text-blue-950 italic">Telegram Proxy</span>
                        </div>
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                            <span className="text-[10px] font-black text-blue-900/30 uppercase italic mb-1 block">Beneficiary Entity</span>
                            <span className="text-xl font-black text-blue-950 italic">{selectedTicket.user_name || "Unknown"}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                         <label className="text-[10px] font-black text-blue-950/40 uppercase tracking-[0.3em] px-4 italic font-mono">Incident Payload</label>
                         <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                            <p className="text-lg font-bold text-slate-800 leading-relaxed italic border-l-4 border-blue-400 pl-6">
                                "{selectedTicket.subject || "No additional subject headers available for this transmission."}"
                            </p>
                         </div>
                    </div>
                </div>

                <div className="flex gap-6 pt-6">
                    <button className="flex-1 py-6 bg-blue-600 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic group">
                        <CheckCircle2 size={24} /> RESOLVE NODE
                    </button>
                    <button className="flex-1 py-6 bg-slate-900 text-white font-black text-sm rounded-[2.5rem] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic">
                        <ExternalLink size={20} /> DEEP ANALYSIS
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
