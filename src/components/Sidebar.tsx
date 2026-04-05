"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Ticket, PanelsTopLeft, Command, 
  TrendingUp, Coins, Crown, Palette, Settings, 
  LogOut, Send, Bot, MessageSquare, ShieldCheck, 
  Activity, ShieldAlert, Sparkles, History, Users,
  ChevronDown, ChevronRight, Monitor
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
    <div className="flex flex-col h-full bg-white text-zinc-900 w-full overflow-hidden">
      <div className="mb-10 px-4 mt-6 shrink-0">
          <h2 className="text-2xl font-black text-zinc-950 flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-950 rounded-[14px] flex items-center justify-center shadow-md">
                  <Bot size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                  <span>High</span>
                  <span className="text-sm text-zinc-500 font-bold">Core Agency</span>
              </div>
          </h2>
      </div>

      <div className="flex bg-zinc-50 p-1.5 rounded-xl border border-zinc-100 mb-6 mx-4 shrink-0">
          <button 
              onClick={() => setPlatform('discord')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${platform === 'discord' ? 'bg-zinc-950 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
              <Monitor size={14} /> Discord
          </button>
          <button 
              onClick={() => setPlatform('telegram')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${platform === 'telegram' ? 'bg-blue-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
              <Send size={14} /> Telegram
          </button>
      </div>

      <nav className="flex-1 custom-scrollbar overflow-y-auto px-4 space-y-6 pb-6">
        {NavigationGroups.map((group) => {
            const isCollapsed = collapsed[group.category];

            return (
              <div key={group.category} className="space-y-2">
                <button 
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
                >
                  <span className="uppercase">{group.category}</span>
                  <ChevronDown size={14} className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
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
                                          <span className={`text-sm ${isActive ? "font-bold text-zinc-950" : "font-semibold"}`}>
                                              {item.name}
                                          </span>
                                      </div>
                                      {isActive && (
                                          <div className={`w-1.5 h-1.5 rounded-full ${platform === 'discord' ? 'bg-zinc-950' : 'bg-blue-500'}`}></div>
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

      <div className="mt-4 pt-6 border-t border-zinc-100 px-2 shrink-0">
        <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">OM</div>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-zinc-950 truncate">Omar</span>
                <span className="text-xs text-zinc-500">Root Admin</span>
            </div>
        </div>

        <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-between p-4 bg-zinc-950 text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-all shadow-md"
        >
            Log Out <LogOut size={16} className="opacity-70" />
        </button>
      </div>
    </div>
  );
}
