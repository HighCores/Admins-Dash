"use client";

import { motion } from "framer-motion";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6 z-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sunset-900 tracking-tight">System Settings</h1>
        <p className="text-sunset-800/70 font-medium">Global configurations for the platform.</p>
      </header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card rounded-3xl p-8 space-y-6"
      >
        <h3 className="text-xl font-bold text-sunset-900 border-b border-sunset-200 pb-3">Database Connection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-sunset-800 mb-2">Supabase URL</label>
            <input type="text" disabled defaultValue={process.env.NEXT_PUBLIC_SUPABASE_URL || "Hidden for security"} className="w-full p-3 rounded-xl glass-input text-sunset-900 opacity-70" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sunset-800 mb-2">Supabase Anon Key</label>
            <input type="password" disabled defaultValue={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "*************"} className="w-full p-3 rounded-xl glass-input text-sunset-900 opacity-70" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-sunset-900 border-b border-sunset-200 pb-3 mt-8">Java Bot Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-sunset-800 mb-2">Bot API Port</label>
            <input type="number" defaultValue="8080" placeholder="Example: 8080" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
            <p className="text-xs text-sunset-800/60 mt-1">The port configured in Java Javalin Server.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sunset-800 mb-2">Bot Server IP/Domain</label>
            <input type="text" defaultValue="http://localhost" placeholder="http://127.0.0.1" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-sunset-800 mb-2">API KEY (X-API-Key)</label>
            <input type="password" defaultValue="secret_key" placeholder="Key matching Config.API_KEY" className="w-full p-3 rounded-xl glass-input text-sunset-900" />
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t border-sunset-200">
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all">
            <Save size={20} /> Save Configurations
          </button>
        </div>
      </motion.div>
    </div>
  );
}
