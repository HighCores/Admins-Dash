"use client";

import { motion } from "framer-motion";
import { LogIn, Shield, Bot, Zap } from "lucide-react";
import { signIn } from "next-auth/react"; 

export default function Home() {
  const handleLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-10">
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-orange-100 text-sunset-600 glass shadow-xl">
          <Bot size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-sunset-900 mb-4 drop-shadow-sm">
          High Core Agency
        </h1>
        <p className="text-xl text-sunset-800/80 max-w-2xl mx-auto font-medium">
          The Automated Control Center for your Telegram and Discord Bots.
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-md glass-card rounded-3xl p-8 flex flex-col items-center"
      >
        <div className="w-full space-y-6">
          <div className="flex items-center gap-4 text-sunset-800">
            <div className="w-10 h-10 rounded-full bg-sunset-200 flex items-center justify-center">
              <Shield size={20} className="text-sunset-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure Access</h3>
              <p className="text-sm opacity-80">RBAC validation via Discord Roles</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sunset-800">
            <div className="w-10 h-10 rounded-full bg-sunset-200 flex items-center justify-center">
              <Zap size={20} className="text-sunset-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Realtime Sync</h3>
              <p className="text-sm opacity-80">Connected to N8N & Java Webhooks</p>
            </div>
          </div>
        </div>

        <hr className="w-full border-t border-sunset-400/20 my-8" />

        <button 
          onClick={handleLogin}
          className="w-full group flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-sunset-600 text-white font-semibold text-lg hover:bg-sunset-500 transition-all duration-300 shadow-[0_8px_30px_rgba(255,106,26,0.3)] hover:shadow-[0_10px_40px_rgba(255,106,26,0.5)] active:scale-[0.98]"
        >
          <LogIn size={22} className="group-hover:-translate-y-0.5 transition-transform" />
          <span>Login with Discord</span>
        </button>

        <p className="text-sm text-sunset-800/60 mt-6 text-center">
          Only authorized guild members can access the dashboard.
        </p>
      </motion.div>
    </div>
  );
}
