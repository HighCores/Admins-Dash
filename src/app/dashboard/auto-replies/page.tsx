"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AutoRepliesPage() {
  const [replies, setReplies] = useState([
    { id: 1, trigger: "مرحبا", response: "أهلاً بك في وكالة High Core! كيف يمكننا خدمتك اليوم؟" },
    { id: 2, trigger: "اسعاركم", response: "يرجى فتح تذكرة لمعرفة الأسعار التفصيلية." },
    { id: 3, trigger: "ping", response: "Pong! 🏓" },
  ]);

  return (
    <div className="w-full space-y-6 z-10">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Auto Replies</h1>
          <p className="text-sunset-800/70 font-medium">Configure keywords and automated responses for your bots.</p>
        </div>
        <button className="px-5 py-3 bg-sunset-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-sunset-500 shadow-[0_4px_15px_rgba(255,106,26,0.3)] hover:-translate-y-0.5 transition-all">
          <Plus size={20} /> Add Reply
        </button>
      </header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sunset-100/50 text-sunset-900 border-b border-sunset-400/20">
              <th className="p-5 font-semibold w-1/4">Keyword Trigger</th>
              <th className="p-5 font-semibold">Automated Response</th>
              <th className="p-5 font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {replies.map((reply) => (
              <tr key={reply.id} className="border-b border-sunset-400/10 hover:bg-white/30 transition-colors">
                <td className="p-5">
                  <span className="font-bold text-sunset-900 bg-white/50 px-3 py-1 rounded-lg border border-sunset-200">
                    {reply.trigger}
                  </span>
                </td>
                <td className="p-5 text-sunset-800">{reply.response}</td>
                <td className="p-5">
                  <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {replies.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-sunset-800/60">
                  No auto replies configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
