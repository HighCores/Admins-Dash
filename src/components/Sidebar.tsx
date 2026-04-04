"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Ticket, PanelsTopLeft, Command, 
  TrendingUp, Coins, Crown, Palette, Settings, 
  LogOut, Send, Bot, MessageSquare, ShieldCheck, 
  Activity, Zap, Sparkles
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const Navigation = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Tickets", icon: Ticket, href: "/dashboard/tickets" },
  { name: "Panels", icon: PanelsTopLeft, href: "/dashboard/panels" },
  { name: "Commands", icon: Command, href: "/dashboard/commands" },
  { name: "Auto Replies", icon: MessageSquare, href: "/dashboard/auto-replies" },
  { name: "Levels & Roles", icon: TrendingUp, href: "/dashboard/levels" },
  { name: "General Points", icon: Coins, href: "/dashboard/points" },
  { name: "Admin Points", icon: Crown, href: "/dashboard/admin-points" },
  { name: "Color Roles", icon: Palette, href: "/dashboard/colors" },
  { name: "Bot Config", icon: Settings, href: "/dashboard/setup" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<"discord" | "telegram">(
    pathname.includes("telegram") ? "telegram" : "discord"
  );

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 border-r border-zinc-100 p-6">
      {/* Brand Header */}
      <div className="mb-10 px-4">
        <h2 className="text-2xl font-black text-black tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-zinc-950 rounded-xl">
                <Bot className="text-white" size={20} />
            </div>
            <span>High Core<span className="text-zinc-300 ml-2">Agency</span></span>
        </h2>
      </div>

      {/* Platform Switcher - High Contrast */}
      <div className="mb-10 mx-2 p-1 bg-zinc-100 rounded-2xl flex relative h-14 items-center">
        <motion.div
            layoutId="platform-bg"
            className={`absolute h-[80%] rounded-xl shadow-lg z-0 ${platform === 'discord' ? 'bg-zinc-950 text-white' : 'bg-blue-600 text-white'}`}
            initial={false}
            animate={{ 
                left: platform === "discord" ? "4px" : "50%",
                right: platform === "discord" ? "50%" : "4px"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button 
            onClick={() => setPlatform("discord")}
            className={`flex-1 z-10 flex items-center justify-center gap-3 text-xs font-black transition-all ${platform === 'discord' ? 'text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
            <ShieldCheck size={16} /> DISCORD
        </button>
        <button 
            onClick={() => setPlatform("telegram")}
            className={`flex-1 z-10 flex items-center justify-center gap-3 text-xs font-black transition-all ${platform === 'telegram' ? 'text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
            <Send size={16} /> TELEGRAM
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-2 custom-scrollbar overflow-y-auto px-2">
        <div className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-4 pl-4 font-mono">Operations Fleet</div>
        
        {Navigation.map((item) => {
            const platformHref = pathname.includes("telegram") 
                ? item.href.replace("/discord/", "/telegram/").replace("/dashboard/", "/dashboard/telegram/")
                : item.href;
            
            // Temporary fix for dual routing
            const finalHref = platform === 'telegram' 
                ? item.href.replace("/dashboard/discord", "/dashboard/telegram").replace("/dashboard/", "/dashboard/telegram/")
                : item.href.replace("/dashboard/telegram", "/dashboard/discord");

            const isActive = pathname === finalHref || (item.href === '/dashboard' && pathname === '/dashboard');

            return (
                <Link key={item.name} href={finalHref}>
                    <motion.div 
                        whileHover={{ x: 5 }}
                        className={`group flex items-center justify-between p-4 rounded-xl transition-all mb-1 ${
                            isActive 
                            ? "bg-zinc-50 text-black border border-zinc-100 shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-600"} />
                            <span className={`text-sm font-bold tracking-tight ${isActive ? "font-black" : "font-semibold"}`}>
                                {item.name}
                            </span>
                        </div>
                        {isActive && (
                            <div className={`w-1.5 h-1.5 rounded-full ${platform === 'discord' ? 'bg-zinc-950 shadow-[0_0_8px_rgba(0,0,0,0.2)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}></div>
                        )}
                    </motion.div>
                </Link>
            )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-8 pt-8 border-t border-zinc-100 px-4">
        <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 flex items-center justify-center text-white font-black shadow-lg">AD</div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-zinc-950 truncate">Administrator</span>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 w-fit px-2 rounded-md mt-0.5">HC_ROOT_ADMIN</span>
            </div>
        </div>

        <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-between p-4 bg-zinc-950 text-white font-black text-[10px] rounded-xl hover:bg-black transition-all hover:scale-[1.02] shadow-2xl tracking-[0.3em]"
        >
            TERMINATE SESSION <LogOut size={14} className="opacity-40" />
        </button>
      </div>
    </div>
  );
}
