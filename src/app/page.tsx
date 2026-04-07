"use client";

import { motion, Variants } from "framer-motion";
import { LogIn, Shield, Bot, Terminal, Cpu, Zap } from "lucide-react";
import { signIn } from "next-auth/react"; 

export default function Home() {
  const handleLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] overflow-y-auto p-6 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.1)_0%,transparent_100%)] h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg z-10 space-y-8"
      >
        {/* Agency Branding */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)] mb-4">
            <Cpu className="text-emerald-500 w-10 h-10 crt-glow animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white uppercase italic drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            Highcore <span className="text-emerald-500">Agency</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-emerald-500/60 font-mono text-sm uppercase tracking-widest leading-none bg-emerald-500/5 py-2 px-4 rounded-full border border-emerald-500/10 w-fit mx-auto">
             <Terminal size={14} /> Highcore Agency // Authorized Access
          </div>
        </motion.div>

        {/* Secure Authorization Card */}
        <motion.div variants={itemVariants} className="terminal-card rounded-3xl p-8 border-emerald-500/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={120} />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] font-mono">Agency Login</h3>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                  Establish a secure connection with the Highcore Agency Management Suite to oversee operations.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex flex-col gap-2">
                    <Zap size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase">Live Activity</span>
                </div>
                <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex flex-col gap-2">
                    <Shield size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase">Secure Link</span>
                </div>
            </div>

            <button 
                onClick={handleLogin}
                className="w-full relative group"
            >
                <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-black font-black text-lg uppercase tracking-tighter hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98]">
                    <LogIn size={22} />
                    <span>Authorize Access</span>
                </div>
            </button>

            <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                    Connection Stable
                </div>
                <span>Authorized Only</span>
            </div>
          </div>
        </motion.div>

        <motion.p variants={itemVariants} className="text-[10px] text-zinc-500/60 text-center font-mono uppercase tracking-[0.2em] max-w-xs mx-auto">
          Authorization required. Identity validation performed via Discord Secure Access. 
        </motion.p>
      </motion.div>
    </div>
  );
}
