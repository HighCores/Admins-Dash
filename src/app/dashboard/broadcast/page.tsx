"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePlatform } from "@/context/PlatformContext";
import { Send, Users, Hash } from "lucide-react";

export default function BroadcastPage() {
  const { platform } = usePlatform();
  const [targetType, setTargetType] = useState<"broadcast" | "channel">("broadcast");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (targetType === "channel" && !targetId) return;
    if (!message) return;

    setStatus({ loading: true, error: "", success: false });

      try {
        const res = await fetch("/api/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            targetType,
            targetId,
            message
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to broadcast");
        }
        
        setStatus({ loading: false, error: "", success: true });
      setMessage(""); // clear after sending
      if (targetType === "channel") setTargetId("");
    } catch (err: any) {
      setStatus({ loading: false, error: err.message || "Failed to send message", success: false });
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sunset-100 text-sunset-600 rounded-2xl shadow-inner">
          <Send size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-sunset-900 capitalize tracking-tight">{platform} Broadcast</h1>
          <p className="text-sunset-600 font-medium mt-1">
            Send massive announcements to everyone in private or specifically to a channel.
          </p>
        </div>
      </div>

      <form onSubmit={handleSend} className="glass-card p-8 rounded-3xl flex flex-col gap-6 border border-sunset-200">
        
        {/* Target Selection */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setTargetType("broadcast")}
            className={`flex-1 py-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
              targetType === "broadcast" ? "bg-sunset-600 text-white shadow-xl shadow-sunset-500/30 scale-105" : "bg-white/50 text-sunset-600 hover:bg-white border border-sunset-100 hover:scale-105"
            }`}
          >
            <Users size={24} />
            <span>Mass Broadcast (DM All)</span>
          </button>
          <button
            type="button"
            onClick={() => setTargetType("channel")}
            className={`flex-1 py-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
              targetType === "channel" ? "bg-sunset-600 text-white shadow-xl shadow-sunset-500/30 scale-105" : "bg-white/50 text-sunset-600 hover:bg-white border border-sunset-100 hover:scale-105"
            }`}
          >
            <Hash size={24} />
            <span>Send to Channel</span>
          </button>
        </div>

        <div className="p-6 bg-sunset-50/50 rounded-3xl border border-sunset-100 flex flex-col gap-5">
          {/* Only show target ID input if sending to a specific channel */}
          {targetType === "channel" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-sunset-800 mb-2">
                Channel ID (Required)
              </label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g. 10458392039485"
                className="w-full bg-white border border-sunset-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sunset-400 text-sunset-900 font-medium transition-shadow"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-sunset-800 mb-2">Message Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your official announcement here..."
              className="w-full bg-white border border-sunset-200 rounded-2xl px-4 py-3 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-sunset-400 text-sunset-900 font-medium transition-shadow resize-none"
              required
            />
          </div>
        </div>

        {status.error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {status.error}</div>}
        {status.success && <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Message has been successfully dispatched!</div>}

        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-4 mt-2 bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-sunset-500/20 hover:-translate-y-1"
        >
          {status.loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Dispatching...
            </span>
          ) : (
            <>
              <Send size={20} />
              Launch Broadcast
            </>
          )}
        </button>
      </form>
    </div>
  );
}
