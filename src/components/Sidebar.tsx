"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Ticket, PanelsTopLeft, Command, 
  TrendingUp, Coins, Crown, Palette, Settings, 
  LogOut, Send, Bot, MessageSquare, ShieldCheck, 
  Activity, ShieldAlert, Sparkles, History, Users,
  ChevronDown, ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

// Categorized Navigation based on Vetox/ProBot architecture
const NavigationGroups = [
  {
    category: "CORE",
    items: [
      { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    ]
  },
  {
    category: "ENGAGEMENT",
    items: [
      { name: "Welcome & Leave", icon: Users, href: "/dashboard/discord/welcome" },
      { name: "Leveling System", icon: TrendingUp, href: "/dashboard/discord/levels" },
      { name: "Points & Economy", icon: Coins, href: "/dashboard/discord/points" },
      { name: "High Admin Points", icon: Crown, href: "/dashboard/discord/admin-points" },
    ]
  },
  {
    category: "AUTOMATION",
    items: [
      { name: "Custom Commands", icon: Command, href: "/dashboard/discord/commands" },
      { name: "Auto Responder", icon: MessageSquare, href: "/dashboard/discord/auto-replies" },
      { name: "Embed Builder", icon: PanelsTopLeft, href: "/dashboard/discord/panels" },
      { name: "Ticket System", icon: Ticket, href: "/dashboard/discord/tickets" },
      { name: "Color Roles", icon: Palette, href: "/dashboard/discord/colors" },
    ]
  },
  {
    category: "PROTECTION",
    items: [
      { name: "Moderation", icon: ShieldCheck, href: "/dashboard/discord/moderation" },
      { name: "Auto Mod", icon: ShieldAlert, href: "/dashboard/discord/auto-mod" },
      { name: "Server Logs", icon: History, href: "/dashboard/discord/logs" },
    ]
  },
  {
    category: "SETTINGS",
    items: [
      { name: "Bot Config", icon: Settings, href: "/dashboard/discord/setup" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<"discord" | "telegram">("discord");
  // Keep track of collapsed categories
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.includes("/telegram")) {
        setPlatform("telegram");
    } else {
        setPlatform("discord");
    }
  }, [pathname]);

  const toggleCategory = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 border-r border-zinc-100 p-4 md:p-6 overflow-hidden shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-black text-black tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-zinc-950 rounded-xl">
                <Bot className="text-white" size={20} />
            </div>
            <span>High Core<span className="text-zinc-300 ml-2">Agency</span></span>
        </h2>
      </div>

      {/* Platform Switcher - High Contrast */}
      <div className="mb-8 mx-2 p-1 bg-zinc-100 rounded-2xl flex relative h-14 items-center shrink-0">
        <motion.div
            layoutId="platform-bg"
            className={`absolute h-[80%] rounded-xl shadow-lg z-0 ${platform === 'discord' ? 'bg-zinc-950' : 'bg-blue-600'}`}
            initial={false}
            animate={{ 
                left: platform === "discord" ? "4px" : "50%",
                right: platform === "discord" ? "50%" : "4px"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button 
            onClick={() => setPlatform("discord")}
            className={`flex-1 z-10 flex items-center justify-center gap-3 text-[10px] font-black transition-all ${platform === 'discord' ? 'text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
            <ShieldCheck size={14} /> DISCORD
        </button>
        <button 
            onClick={() => setPlatform("telegram")}
            className={`flex-1 z-10 flex items-center justify-center gap-3 text-[10px] font-black transition-all ${platform === 'telegram' ? 'text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
            <Send size={14} /> TELEGRAM
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 custom-scrollbar overflow-y-auto px-2 space-y-6 pb-6">
        
        {NavigationGroups.map((group) => {
            // Hide some groups for Telegram if needed, for now we will adapt URLs
            if (platform === 'telegram' && (group.category === 'AUTOMATION' || group.category === 'PROTECTION')) {
                // Return null or filter later, keeping simple for now
            }

            const isCollapsed = collapsed[group.category];

            return (
              <div key={group.category} className="space-y-1">
                <button 
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-2 px-4 hover:text-zinc-500 transition-colors"
                >
                  {group.category}
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
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
                                  <motion.div 
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`group flex items-center justify-between p-3.5 rounded-xl transition-all ${
                                          isActive 
                                          ? "bg-zinc-50 text-black border border-zinc-100 shadow-sm" 
                                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
                                      }`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <item.icon size={18} className={isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-600"} />
                                          <span className={`text-sm tracking-tight ${isActive ? "font-black text-zinc-950" : "font-semibold"}`}>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-4 pt-6 border-t border-zinc-100 px-2 shrink-0">
        <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-zinc-300 transition-all cursor-default">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 flex items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-transform">AD</div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-zinc-950 truncate">Administrator</span>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 w-fit px-2 rounded-md mt-0.5">HC_ROOT_ADMIN</span>
            </div>
        </div>

        <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-between p-4 bg-zinc-950 text-white font-black text-[9px] rounded-xl hover:bg-black transition-all hover:scale-[1.02] shadow-2xl tracking-[0.3em] uppercase"
        >
            TERMINATE SESSION <LogOut size={12} className="opacity-40" />
        </button>
      </div>
    </div>
  );
}
