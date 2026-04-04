"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Search, Clock, Archive, UserCircle, MessageCircle, X, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TicketsPage() {
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
    const { data, error } = await supabase
      .from("dc_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
    setLoading(false);
  };

  const openTranscript = async (ticket: any) => {
    setSelectedTicket(ticket);
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from("dc_ticket_messages")
      .select("*")
      .eq("ticket_id", ticket.ticket_id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoadingMessages(false);
  };

  const closeTranscript = () => {
    setSelectedTicket(null);
    setMessages([]);
  };

  const filteredTickets = tickets.filter(t => 
    t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
    t.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Support Tickets</h1>
          <p className="text-sunset-800/70 font-medium">Manage server tickets, view transcripts, and control settings.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-sunset-800/40" size={20} />
          <input 
            type="text" 
            placeholder="Search tickets by ID or Username..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sunset-900 font-semibold"
          />
        </div>
      </header>

      {/* Tickets List */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sunset-100/50 text-sunset-900 border-b border-sunset-400/20">
              <th className="p-5 font-semibold">Ticket ID</th>
              <th className="p-5 font-semibold">Creator</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold">Priority</th>
              <th className="p-5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-sunset-600" /></td></tr>
            ) : filteredTickets.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-sunset-800/60 font-semibold">No tickets found in the database.</td></tr>
            ) : filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="border-b border-sunset-400/10 hover:bg-white/30 transition-colors">
                <td className="p-5 font-bold text-sunset-900">#{ticket.ticket_id}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <UserCircle size={18} className="text-sunset-600" />
                    <span className="font-semibold text-sunset-800">{ticket.user_name}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    ticket.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                    ticket.status === 'claimed' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-5">
                  <span className="text-sm font-bold text-sunset-600/80 capitalize">{ticket.priority || "Normal"}</span>
                </td>
                <td className="p-5">
                  <button 
                    onClick={() => openTranscript(ticket)}
                    className="flex items-center gap-2 px-4 py-2 bg-sunset-100 hover:bg-sunset-200 text-sunset-800 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <MessageCircle size={16} /> Transcript
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sunset-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col border border-sunset-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-sunset-100">
                <div>
                  <h2 className="text-xl font-bold text-sunset-900 flex items-center gap-2">
                    <Archive className="text-sunset-500" /> Transcript for #{selectedTicket.ticket_id}
                  </h2>
                  <p className="text-sm font-medium text-sunset-600 mt-1">Claimed By: {selectedTicket.claimed_by || "No one"} • Subject: {selectedTicket.subject || "General Support"}</p>
                </div>
                <button onClick={closeTranscript} className="p-2 text-sunset-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sunset-500" /></div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sunset-600 italic">No messages were logged for this ticket.</p>
                ) : messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.user_name === selectedTicket.user_name ? "items-start" : "items-end"}`}>
                    <span className="text-xs font-bold text-sunset-400 mb-1 px-1">{msg.user_name}</span>
                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                      msg.user_name === selectedTicket.user_name 
                        ? "bg-slate-100 text-slate-800 rounded-tl-sm"
                        : "bg-sunset-500 text-white rounded-tr-sm shadow-md shadow-sunset-500/20"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
