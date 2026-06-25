"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Bot, 
  ShieldAlert, 
  LogOut,
  ShoppingCart,
  Tags,
  MessageCircle,
  Megaphone,
  Send
} from "lucide-react";
import { signOut } from "next-auth/react";
import { usePlatform } from "@/context/PlatformContext";

const discordNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "Tickets", icon: MessageSquareText },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/discounts", label: "Discounts & Vouchers", icon: Tags },
  { href: "/dashboard/auto-replies", label: "Auto Replies", icon: MessageCircle },
  { href: "/dashboard/moderation", label: "Warning Words", icon: ShieldAlert },
  { href: "/dashboard/broadcast", label: "Broadcast", icon: Megaphone },
];

const telegramNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "Tickets", icon: MessageSquareText },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/broadcast", label: "Send Message", icon: Send },
];

export function Sidebar() {
  const pathname = usePathname();
  const { platform, setPlatform } = usePlatform();

  const navItems = platform === "discord" ? discordNav : telegramNav;

  return (
    <aside className="w-64 glass-card m-4 rounded-3xl flex flex-col items-center py-8 z-50">
      <div className="flex flex-col items-center w-full px-6 mb-8">
        <div className="flex items-center gap-3 w-full mb-6 text-sunset-700 justify-center group cursor-default">
          <div className="p-2 bg-sunset-100 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Bot size={28} className="text-sunset-500" />
          </div>
          <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sunset-700 to-sunset-500">
            High Cores
          </h2>
        </div>

        {/* Platform Toggle */}
        <div className="w-full bg-sunset-100/50 p-1.5 rounded-2xl flex relative shadow-inner">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 ease-out z-0 ${
              platform === "discord" ? "left-1.5" : "left-[calc(50%+4px)]"
            }`}
          />
          <button
            onClick={() => setPlatform("discord")}
            className={`flex-1 py-2 text-sm font-black z-10 transition-colors duration-300 ${
              platform === "discord" ? "text-sunset-700" : "text-sunset-800/50 hover:text-sunset-700"
            }`}
          >
            Discord
          </button>
          <button
            onClick={() => setPlatform("telegram")}
            className={`flex-1 py-2 text-sm font-black z-10 transition-colors duration-300 ${
              platform === "telegram" ? "text-sunset-700" : "text-sunset-800/50 hover:text-sunset-700"
            }`}
          >
            Telegram
          </button>
        </div>
      </div>

      <nav className="flex-1 w-full px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold ${
                isActive
                  ? "bg-gradient-to-r from-sunset-500 to-sunset-600 text-white shadow-xl shadow-sunset-500/30 scale-105"
                  : "text-sunset-800 hover:bg-sunset-50 hover:text-sunset-600 hover:scale-[1.02]"
              }`}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"}`} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="w-full px-4 mt-auto pt-4 border-t border-sunset-400/20 space-y-2">
        <Link 
          href="/dashboard/logs"
          className="group flex w-full items-center gap-3 px-4 py-3.5 text-sunset-800 hover:bg-sunset-50 hover:text-sunset-600 transition-all duration-300 rounded-2xl font-bold"
        >
          <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
          System Logs
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="group flex w-full items-center gap-3 px-4 py-3.5 text-sunset-800 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-2xl font-bold hover:shadow-lg hover:shadow-red-500/10"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
