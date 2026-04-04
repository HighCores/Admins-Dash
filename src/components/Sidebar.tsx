"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Ticket, PanelsTopLeft, Command, TrendingUp, Coins, Crown, Palette, Settings, LogOut, Send } from "lucide-react";
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
    <aside className="w-72 min-h-[calc(100vh-2rem)] flex flex-col p-4 z-20">
      <div className="glass-card flex-1 rounded-3xl p-6 flex flex-col items-start text-left">
        <div className="mb-6 w-full">
          <h2 className="text-2xl font-bold text-sunset-900 tracking-tight glow-text-sunset">
            High Core
          </h2>
          <p className="text-xs font-semibold text-sunset-800/60 uppercase tracking-widest mt-1">Agency</p>
        </div>

        {/* Platform Switcher */}
        <div className="flex w-full bg-sunset-100/50 p-1 rounded-xl mb-6">
          <Link
            href="/dashboard/discord"
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all text-center ${
              platform === "discord" ? "bg-white text-indigo-600 shadow-sm" : "text-sunset-800/60"
            }`}
          >
            Discord
          </Link>
          <Link
            href="/dashboard/telegram"
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-bold rounded-lg transition-all text-center ${
              platform === "telegram" ? "bg-white text-blue-500 shadow-sm" : "text-sunset-800/60"
            }`}
          >
            <Send size={14} /> Telegram
          </Link>
        </div>

        <nav className="flex-1 space-y-2 w-full flex flex-col items-start">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${platform}`);
            return (
              <Link key={link.href} href={link.href} className="w-full">
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center justify-start gap-3 p-3 rounded-2xl transition-all font-semibold text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-sunset-500 to-peach-400 text-white shadow-lg shadow-sunset-500/20"
                      : "text-sunset-800 hover:bg-white/40"
                  }`}
                >
                  <link.icon size={20} className={isActive ? "text-white" : "text-sunset-600"} />
                  <span>{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-start gap-3 p-3 mt-6 text-red-500 hover:bg-red-100 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
