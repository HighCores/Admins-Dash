"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Ticket, PanelsTopLeft, Command, 
  TrendingUp, Coins, Crown, Palette, Settings, 
  LogOut, Send, Bot, MessageSquare, ShieldCheck, 
  Activity, ShieldAlert, Sparkles, History, Users,
  ChevronDown, Cpu, Terminal, Monitor, BarChart, Zap
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const NavigationGroups = [
  {
    category: "MANAGEMENT",
    items: [
      { name: "OVERVIEW", icon: LayoutDashboard, href: "/dashboard" },
      { name: "WELCOME SYSTEM", icon: Users, href: "/dashboard/discord/welcome" },
      { name: "ADMIN LOGS", icon: ShieldAlert, href: "/dashboard/discord/points" },
      { name: "MESSENGER", icon: Send, href: "/dashboard/discord/messenger" },
    ]
  },
  {
    category: "OPERATIONS",
    items: [
      { name: "TICKETS", icon: Ticket, href: "/dashboard/discord/tickets" },
      { name: "COMMANDS", icon: Command, href: "/dashboard/discord/commands" },
      { name: "AUTO RESPONSES", icon: MessageSquare, href: "/dashboard/discord/auto-replies" },
      { name: "EMBED BUILDER", icon: Palette, href: "/dashboard/discord/embed-builder" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<"discord" | "telegram">("discord");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.includes("/telegram")) setPlatform("telegram");
    else setPlatform("discord");
  }, [pathname]);

  const toggleCategory = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f12] text-zinc-400 w-full overflow-hidden border-r border-white/5 font-mono">
      
      {/* Agency Branding */}
      <div className="p-8 shrink-0 border-b border-white/5 bg-black/20">
          <Link href="/dashboard" className="group">
            <h2 className="text-xl font-black text-white flex items-center gap-4 italic tracking-tighter uppercase">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform">
                    <Cpu size={20} className="text-emerald-500 crt-glow" />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="group-hover:text-emerald-500 transition-colors">Highcore</span>
                    <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase not-italic">Agency Dashboard</span>
                </div>
            </h2>
          </Link>
      </div>

      {/* Platform Selector */}
      <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 my-6 mx-6 shrink-0 font-sans">
          <button 
              onClick={() => setPlatform('discord')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest ${platform === 'discord' ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
              <Monitor size={14} /> Discord
          </button>
          <button 
              onClick={() => setPlatform('telegram')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest ${platform === 'telegram' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
              <Send size={14} /> Telegram
          </button>
      </div>

      <nav className="flex-1 custom-scrollbar overflow-y-auto px-6 space-y-8 pb-10 mt-2">
        {NavigationGroups.map((group) => {
            const isCollapsed = collapsed[group.category];

            return (
              <div key={group.category} className="space-y-4">
                <button 
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between text-[10px] font-black text-zinc-700 hover:text-emerald-500 transition-colors tracking-[0.3em] uppercase"
                >
                  <span className="flex items-center gap-2 underline underline-offset-4 decoration-emerald-500/10">{group.category}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180 opacity-20' : 'opacity-50'}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1"
                    >
                      {group.items.map((item) => {
                          let finalHref = item.href;
                          if (platform === 'telegram') {
                              finalHref = item.name === "Overview" 
                                  ? "/dashboard/telegram" 
                                  : item.href.replace("/dashboard/discord/", "/dashboard/telegram/");
                          }

                          const isActive = pathname === finalHref || (pathname === '/dashboard' && item.href === '/dashboard' && platform === 'discord');

                          return (
                              <Link key={item.name} href={finalHref}>
                                  <div className={`group flex items-center justify-between p-3 rounded-xl transition-all border ${
                                      isActive 
                                      ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-[inset_0_0_20px_rgba(34,197,94,0.02)]" 
                                      : "text-zinc-600 hover:text-white hover:bg-white/5 border-transparent"
                                  }`}>
                                      <div className="flex items-center gap-3">
                                          <item.icon size={16} className={isActive ? "text-emerald-500 crt-glow" : "text-zinc-700 group-hover:text-emerald-500 transition-colors"} />
                                          <span className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "text-white" : ""}`}>
                                              {item.name}
                                          </span>
                                      </div>
                                      {isActive && (
                                          <motion.div layoutId="active-dot" className="w-1 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                      )}
                                  </div>
                              </Link>
                          )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
        <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-between p-4 bg-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-transparent hover:border-emerald-500/30 group"
        >
            Authorize Access <LogOut size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
