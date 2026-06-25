"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, User, Bot, AlertCircle } from "lucide-react";

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  platform: "discord" | "telegram";
}

export function TranscriptModal({ isOpen, onClose, ticketId, platform }: TranscriptModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchMessages();
    }
  }, [isOpen, ticketId, platform]);

  async function fetchMessages() {
    setLoading(true);
    const table = platform === "discord" ? "dc_ticket_messages" : "tg_ticket_messages";
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
      
    if (data) {
      setMessages(data);
    } else {
      setMessages([]);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl h-[80vh] bg-[#fff8f5] rounded-3xl shadow-2xl flex flex-col border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sunset-200 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-sunset-900">Transcript: {ticketId}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-sunset-50/30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-sunset-400 border-t-transparent animate-spin" />
                <p className="text-sunset-600 font-medium">Loading Transcript...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-sunset-500 opacity-60">
              <AlertCircle size={48} className="mb-2" />
              <p>No messages found in this transcript.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              // Very simple heuristic to detect if a message is from the bot/staff
              const isBotOrStaff = msg.user_name?.toLowerCase().includes("bot") || msg.user_id === "BOT" || msg.user_id === "SYSTEM";

              return (
                <div key={idx} className={`flex gap-4 max-w-[85%] ${isBotOrStaff ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    isBotOrStaff ? "bg-sunset-600 text-white shadow-md shadow-sunset-500/20" : "bg-sunset-200 text-sunset-700"
                  }`}>
                    {isBotOrStaff ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={`flex flex-col ${isBotOrStaff ? "items-end" : "items-start"}`}>
                    <span className="text-xs font-semibold text-sunset-600/70 mb-1 mx-1">
                      {msg.user_name || msg.user_id} • {new Date(msg.created_at).toLocaleString()}
                    </span>
                    <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                      isBotOrStaff 
                        ? "bg-sunset-600 text-white rounded-tr-none shadow-sm" 
                        : "bg-white text-sunset-900 rounded-tl-none shadow-sm border border-sunset-100"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
