"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Ticket, MessageSquare, Search, 
  ExternalLink, Clock, User, Filter, 
  Loader2, BadgeInfo, Zap, Sparkles, CheckCircle2, XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    // Fetch from tg_tickets or dc_tickets with platform check
    const { data } = await supabase.from("dc_tickets").select("*").eq("platform", "telegram").order("created_at", { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4 mb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl animate-bounce">
                <Send size={20} />
            </div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Telegram Support Hub</span>
          </div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight glow-text-sunset">
            Telegram <span className="text-blue-500/40">Inquiries</span>
          </h1>
          <p className="text-sunset-800/70 font-medium max-w-xl">
            Monitor and resolve Telegram bot tickets in real-time. Synced with N8N logic.
          </p>
        </div>
        
        <div className="flex gap-3">
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    placeholder="Search Telegram tickets..."
                    className="pl-10 pr-4 py-3 rounded-2xl glass-input w-64 font-bold text-blue-900 border border-blue-100"
                />
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Ticket List */}
        <div className="xl:col-span-8 space-y-4">
            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : tickets.length === 0 ? (
                <div className="p-20 text-center glass-card rounded-[3rem] border-dashed border-2 border-blue-100 italic font-bold opacity-30 text-blue-900">
                    No active Telegram tickets found. All quiet in the bot.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets.map((ticket) => (
                        <motion.div 
                            key={ticket.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedTicket(ticket)}
                            className="glass-card p-6 rounded-3xl border border-blue-50 shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Ticket size={18} />
                                    </div>
                                    <h4 className="font-extrabold text-blue-950 uppercase tracking-tighter italic">#{ticket.ticket_id}</h4>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest ${
                                    ticket.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                }`}>{ticket.status}</span>
                            </div>
                            
                            <p className="text-sm font-bold text-sunset-900 mb-4 line-clamp-1">{ticket.subject || "No Subject Provided"}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-blue-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[8px] font-black italic">TG</div>
                                    <span className="text-xs font-bold text-blue-800 opacity-60 leading-none">{ticket.user_name || "Unknown"}</span>
                                </div>
                                <div className="text-[10px] font-mono opacity-30 italic">{new Date(ticket.created_at).toLocaleDateString()}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

        {/* Status Tracker */}
        <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><Send size={200} /></div>
                <h3 className="text-xl font-black mb-10 flex items-center gap-3 subrayado-glow">
                    <Sparkles size={24} className="text-blue-200" /> Agency Flux
                </h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-xs font-black opacity-60 uppercase">Incoming Rate</span>
                        <span className="text-xl font-black">2.4 / HR</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-xs font-black opacity-60 uppercase">Avg. Resolution</span>
                        <span className="text-xl font-black">1.2 HRS</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black opacity-60 uppercase">Load Balanced</span>
                        <span className="text-xs font-black bg-white text-blue-600 px-3 py-1 rounded-full">OPTIMIZED</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-[2rem] border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><BadgeInfo size={18} /> Integration Notice</h4>
                <p className="text-xs font-medium text-blue-800 opacity-60 leading-relaxed mb-6">
                    Telegram tickets are automatically bridged with your agency dashboard. Responses here are sent back to users via N8N webhooks.
                </p>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 animate-pulse">
                    <Zap className="text-blue-600" size={16} />
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">N8N Handshake: Active</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
