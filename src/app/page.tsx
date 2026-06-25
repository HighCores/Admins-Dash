"use client";

import { motion } from "framer-motion";
import { LogIn, Shield, Bot, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const handleLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
    // console.log("Discord Login Intent");
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-10 py-12">
      
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
          HighCores Agency
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
            <div className="w-10 h-10 rounded-full bg-sunset-200 flex items-center justify-center shadow-inner">
              <Shield size={20} className="text-sunset-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI-Powered Moderation</h3>
              <p className="text-sm font-medium opacity-80">Intelligent language filtering & real-time telemetry</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sunset-800">
            <div className="w-10 h-10 rounded-full bg-sunset-200 flex items-center justify-center shadow-inner">
              <Zap size={20} className="text-sunset-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Omnichannel Ecosystem</h3>
              <p className="text-sm font-medium opacity-80">Synchronized logic across Discord & Telegram</p>
            </div>
          </div>
        </div>

        <hr className="w-full border-t border-sunset-400/20 mt-8 mb-4" />

        <div className="w-full text-center mb-4 opacity-20 text-[10px] pointer-events-none select-none tracking-widest text-sunset-900">
          Author : Omar Ayman
        </div>

        <button 
          onClick={handleLogin}
          className="w-full group flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-sunset-600 text-white font-semibold text-lg hover:bg-sunset-500 transition-all duration-300 shadow-[0_8px_30px_rgba(255,106,26,0.3)] hover:shadow-[0_10px_40px_rgba(255,106,26,0.5)] active:scale-[0.98]"
        >
          <LogIn size={22} className="group-hover:-translate-y-0.5 transition-transform" />
          <span>Login with Discord</span>
        </button>

        <p className="text-sm text-sunset-800/60 mt-6 text-center font-medium">
          Only authorized personnel can access the dashboard.
        </p>
      </motion.div>
    </div>
  );
}
