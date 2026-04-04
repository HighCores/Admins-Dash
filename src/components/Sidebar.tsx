"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, Settings, Bot, ShieldAlert, LogOut } from "lucide-react";
// import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bots", label: "Bot Controls", icon: Bot },
  { href: "/dashboard/auto-replies", label: "Auto Replies", icon: MessageSquareText },
  { href: "/dashboard/logs", label: "Access Logs", icon: ShieldAlert },
  { href: "/dashboard/settings", label: "System Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-card m-4 rounded-3xl flex flex-col items-center py-8">
      <div className="flex items-center gap-3 px-6 w-full mb-10 text-sunset-700">
        <Bot size={28} className="text-sunset-500" />
        <h2 className="text-xl font-bold tracking-tight">High Core</h2>
      </div>

      <nav className="flex-1 w-full px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-sunset-500 text-white shadow-lg shadow-sunset-500/20"
                  : "text-sunset-800 hover:bg-sunset-100/50 hover:text-sunset-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="w-full px-4 mt-auto">
        <button 
          onClick={() => { /* signOut({ callbackUrl: '/' }) */ console.log("Sign Out") }}
          className="flex w-full items-center gap-3 px-4 py-3 text-sunset-800 hover:bg-red-50 hover:text-red-500 transition-colors rounded-2xl font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
