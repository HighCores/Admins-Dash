"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, MessageSquare, Ticket, PanelsTopLeft, Command, TrendingUp, Coins, Crown, Palette, Settings, LogOut, Send, Bot } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const discordLinks = [
  { href: "/dashboard/discord", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/discord/tickets", label: "Tickets", icon: Ticket },
  { href: "/dashboard/discord/panels", label: "Panels", icon: PanelsTopLeft },
  { href: "/dashboard/discord/commands", label: "Commands", icon: Command },
  { href: "/dashboard/discord/auto-replies", label: "Auto Replies", icon: MessageSquare },
  { href: "/dashboard/discord/levels", label: "Levels & Roles", icon: TrendingUp },
  { href: "/dashboard/discord/points", label: "General Points", icon: Coins },
  { href: "/dashboard/discord/admin-points", label: "Admin Points", icon: Crown },
  { href: "/dashboard/discord/colors", label: "Color Roles", icon: Palette },
  { href: "/dashboard/discord/setup", label: "Room Setup", icon: Settings },
];

const telegramLinks = [
  { href: "/dashboard/telegram", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/telegram/tickets", label: "Tickets", icon: Ticket },
  { href: "/dashboard/telegram/panels", label: "Panels", icon: PanelsTopLeft },
  { href: "/dashboard/telegram/commands", label: "Commands", icon: Command },
];

export default function Sidebar() {
  const pathname = usePathname();
  const platform = pathname.includes("/telegram") ? "telegram" : "discord";

  const links = platform === "discord" ? discordLinks : telegramLinks;

  return (
    <aside className="w-80 h-screen sticky top-0 flex flex-col p-6 z-[100] animate-in slide-in-from-left duration-700">
      <div className="flex-1 rounded-[3rem] p-8 flex flex-col items-start bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl relative overflow-hidden group">
        
        {/* Subtle Background Glow */}
        <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[100px] transition-colors duration-1000 ${
            platform === 'discord' ? 'bg-sunset-500/20' : 'bg-blue-500/20'
        }`}></div>

        <div className="mb-12 w-full relative">
          <div className="flex items-center gap-3 mb-2">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 ${
                platform === 'discord' ? 'bg-sunset-900 rotate-3' : 'bg-blue-900 -rotate-3'
             }`}>
                <Bot size={20} className="animate-pulse" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-sunset-950 tracking-tighter leading-none italic group-hover:tracking-normal transition-all">
                    High <span className="opacity-30">Core</span>
                </h2>
                <p className="text-[10px] font-black text-sunset-800/40 uppercase tracking-[0.4em] italic leading-none mt-1">Agency Hub</p>
             </div>
          </div>
        </div>

        {/* Platform Switcher - Luxury Interaction */}
        <div className="flex w-full bg-sunset-50/50 p-1.5 rounded-[2rem] mb-10 border border-sunset-100/50 shadow-inner">
          <Link
            href="/dashboard/discord"
            className={`flex-1 py-3 text-[10px] font-black rounded-[1.5rem] transition-all text-center uppercase tracking-widest flex items-center justify-center gap-2 ${
              platform === "discord" 
              ? "bg-white text-sunset-950 shadow-xl border border-sunset-50" 
              : "text-sunset-800/30 hover:text-sunset-800"
            }`}
          >
            Discord
          </Link>
          <Link
            href="/dashboard/telegram"
            className={`flex-1 py-3 text-[10px] font-black rounded-[1.5rem] transition-all text-center uppercase tracking-widest flex items-center justify-center gap-2 ${
              platform === "telegram" 
              ? "bg-white text-blue-600 shadow-xl border border-blue-50" 
              : "text-sunset-800/30 hover:text-blue-500/50"
            }`}
          >
            <Send size={12} strokeWidth={3} /> Telegram
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 w-full flex flex-col items-start overflow-y-auto pr-2 custom-scrollbar">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${platform}`);
            const Icon = link.icon;
            
            return (
              <Link key={link.href} href={link.href} className="w-full">
                <motion.div
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-start gap-4 p-4 rounded-[1.8rem] transition-all relative group/item overflow-hidden ${
                    isActive
                      ? platform === 'discord' 
                        ? "bg-sunset-900 text-white shadow-2xl shadow-sunset-900/20" 
                        : "bg-blue-900 text-white shadow-2xl shadow-blue-900/20"
                      : "text-sunset-900/60 hover:bg-white hover:text-sunset-950 hover:shadow-lg border border-transparent hover:border-sunset-50"
                  }`}
                >
                  <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover/item:text-sunset-900'}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest italic transition-all ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {link.label}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                        layoutId="active-pill"
                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" 
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-start gap-4 p-5 mt-8 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white rounded-[2rem] transition-all font-black text-[10px] uppercase tracking-[0.3em] italic group/out shadow-sm overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/out:opacity-100 transition-opacity"></div>
          <LogOut size={16} strokeWidth={3} className="group-hover/out:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
