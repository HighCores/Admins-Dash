"use client";

import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AutoRepliesPage() {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch replies from Supabase
  const fetchReplies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dc_auto_responses")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReplies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  const handleAdd = async () => {
    if (!trigger || !response) return;
    setAdding(true);
    const { error } = await supabase.from("dc_auto_responses").insert([
      { keyword: trigger, response_text: response, is_active: true, created_by: "DashboardAdmin" }
    ]);
    if (!error) {
      setTrigger("");
      setResponse("");
      fetchReplies();
    } else {
      alert("Error adding reply. It might already exist!");
    }
    setAdding(false);
  };

  const handleDelete = async (keyword: string) => {
    const { error } = await supabase.from("dc_auto_responses").delete().eq("keyword", keyword);
    if (!error) {
      fetchReplies();
    }
  };

  return (
    <div className="w-full space-y-6 z-10 lg:pl-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Auto Replies</h1>
        <p className="text-sunset-800/70 font-medium">Configure keywords and automated responses for your bots.</p>
      </header>

      {/* Add New Reply Form */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-sunset-800 mb-2">Keyword</label>
          <input value={trigger} onChange={(e) => setTrigger(e.target.value)} type="text" placeholder="e.g. ping" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-sunset-800 mb-2">Automated Response</label>
          <input value={response} onChange={(e) => setResponse(e.target.value)} type="text" placeholder="e.g. Pong!" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
        </div>
        <button onClick={handleAdd} disabled={adding || !trigger || !response} className="px-6 py-3 h-[52px] bg-sunset-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-sunset-500 shadow-[0_4px_15px_rgba(255,106,26,0.3)] disabled:opacity-50 transition-all">
          {adding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} Add
        </button>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sunset-100/50 text-sunset-900 border-b border-sunset-400/20">
              <th className="p-5 font-semibold w-1/4">Keyword Trigger</th>
              <th className="p-5 font-semibold">Response</th>
              <th className="p-5 font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-sunset-600" /></td></tr>
            ) : replies.map((reply) => (
              <tr key={reply.keyword} className="border-b border-sunset-400/10 hover:bg-white/30 transition-colors">
                <td className="p-5">
                  <span className="font-bold text-sunset-900 bg-white/50 px-3 py-1 rounded-lg border border-sunset-200">
                    {reply.keyword}
                  </span>
                </td>
                <td className="p-5 text-sunset-800">{reply.response_text}</td>
                <td className="p-5">
                  <button onClick={() => handleDelete(reply.keyword)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && replies.length === 0 && (
              <tr><td colSpan={3} className="p-10 text-center text-sunset-800/60">No auto replies configured yet.</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
