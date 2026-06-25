"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { telegramApi } from "@/lib/telegram";
import { usePlatform } from "@/context/PlatformContext";
import { Lock, Eye } from "lucide-react";
import { TranscriptModal } from "@/components/TranscriptModal";
import { useSession } from "next-auth/react";

export default function TicketsPage() {
  const { platform } = usePlatform();
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [platform]);

  async function fetchTickets() {
    setLoading(true);
    const table = platform === "discord" ? "dc_tickets" : "tg_tickets";
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (data) {
      setTickets(data);
    }
    setLoading(false);
  }

  async function closeTicket(ticketId: string, userId: string) {
    if (!confirm(`Are you sure you want to close this ticket on ${platform}?`)) return;
    
    const table = platform === "discord" ? "dc_tickets" : "tg_tickets";
    await supabase.from(table).update({ status: "closed" }).eq("ticket_id", ticketId);
    
    if (platform === "telegram") {
      await telegramApi.closeTicket(userId).catch(console.error);
    }
    // Note: If Discord has an endpoint to close, call it here.

    // Log it
    try {
      await supabase.from("audit_logs").insert([{
        user_name: session?.user?.name || "Dashboard User",
        action: "Ticket Closed",
        details: `Closed ticket #${ticketId}`,
        platform
      }]);
    } catch (e) {}
    
    fetchTickets();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sunset-900 capitalize">{platform} Tickets</h1>
        <button onClick={fetchTickets} className="px-4 py-2 bg-sunset-100 text-sunset-700 rounded-xl font-medium hover:bg-sunset-200 transition">
          Refresh List
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl">
        {loading ? (
          <p className="text-center text-sunset-500 py-10">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-sunset-500 py-10">No {platform} tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sunset-200/50">
                  <th className="pb-4 font-semibold text-sunset-800">ID</th>
                  <th className="pb-4 font-semibold text-sunset-800">User</th>
                  <th className="pb-4 font-semibold text-sunset-800">Subject</th>
                  <th className="pb-4 font-semibold text-sunset-800">Date</th>
                  <th className="pb-4 font-semibold text-sunset-800">Status</th>
                  <th className="pb-4 font-semibold text-sunset-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sunset-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 text-sunset-700 font-medium">{t.ticket_id}</td>
                    <td className="py-4 font-medium text-sunset-900">{t.user_name || t.user_id}</td>
                    <td className="py-4 text-sunset-700">{t.subject || "No Subject"}</td>
                    <td className="py-4 text-sm text-sunset-600">
                      <span dir="ltr" className="inline-block" style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}>
                        {new Date(t.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedTicket(t.ticket_id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition" 
                        title="View Transcript"
                      >
                        <Eye size={18} />
                      </button>
                      {t.status !== "closed" && (
                        <button 
                          onClick={() => closeTicket(t.ticket_id, t.user_id)}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition" 
                          title="Close Ticket"
                        >
                          <Lock size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TranscriptModal 
        isOpen={!!selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        ticketId={selectedTicket || ""} 
        platform={platform} 
      />
    </div>
  );
}
