"use client";

import { motion } from "framer-motion";
import { Bot, RefreshCw, Power } from "lucide-react";

export default function BotsPage() {
  return (
    <div className="w-full space-y-6 z-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">Bot Controls</h1>
        <p className="text-sunset-800/70 font-medium">Manage High Core Agency bot identities and states.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Discord Bot Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl p-8 flex flex-col gap-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#5865F2]/10 text-[#5865F2] rounded-2xl">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-sunset-900">Discord Bot</h2>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Online
                </span>
              </div>
            </div>
            <button className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors" title="Stop Bot">
              <Power size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-sunset-800 mb-2">Bot Name</label>
              <input type="text" defaultValue="High Core Agency" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sunset-800 mb-2">Status Activity</label>
              <input type="text" defaultValue="Managing Tickets" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
            </div>
            <button className="w-full py-3 bg-sunset-600 text-white rounded-xl font-semibold hover:bg-sunset-500 transition-all flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Update Discord Identity
            </button>
          </div>
        </motion.div>


        {/* Telegram Bot Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 flex flex-col gap-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#229ED9]/10 text-[#229ED9] rounded-2xl">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-sunset-900">Telegram Bot</h2>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  N8N Webhook Linked
                </span>
              </div>
            </div>
            <button className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors" title="Stop Bot">
              <Power size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-sunset-800 mb-2">Bot Name</label>
              <input type="text" defaultValue="High Core" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sunset-800 mb-2">Welcome Message</label>
              <textarea defaultValue="Welcome to High Core Agency!" className="w-full p-3 rounded-xl glass-input text-sunset-900 resize-none h-24" />
            </div>
            <button className="w-full py-3 bg-[#229ED9] text-white rounded-xl font-semibold hover:bg-[#1C8CC0] transition-all flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Sync N8N Settings
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
