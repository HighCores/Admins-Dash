"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, Send, Command, MessageSquare, 
    PanelsTopLeft, Ticket, Settings, ShieldCheck, 
    TrendingUp, Coins 
} from "lucide-react";

const MainTabs = [
    { name: "\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0639\u0627\u0645", icon: LayoutDashboard, href: "/dashboard" },
    { name: "\u0627\u0644\u0645\u0631\u0633\u0644 \u0648\u0627\u0644\u0628\u0631\u0648\u062f\u0643\u0627\u0633\u062a", icon: Send, href: "/dashboard/discord/messenger" },
    { name: "\u0627\u0644\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0645\u062e\u0635\u0635\u0629", icon: Command, href: "/dashboard/discord/commands" },
    { name: "\u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u0631\u0633\u0627\u0626\u0644", icon: PanelsTopLeft, href: "/dashboard/discord/panels" },
    { name: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062a\u0630\u0627\u0643\u0631", icon: Ticket, href: "/dashboard/discord/tickets" },
    { name: "\u0627\u0644\u062d\u0645\u0627\u064a\u0629", icon: ShieldCheck, href: "/dashboard/discord/moderation" },
];

export default function DashboardTabs() {
    const pathname = usePathname();

    return (
        <div className="w-full flex items-center gap-2 p-1.5 bg-white border border-zinc-100 rounded-2xl mb-8 overflow-x-auto custom-scrollbar shadow-sm shrink-0">
            {MainTabs.map((tab) => {
                const isActive = pathname === tab.href;
                
                return (
                    <Link key={tab.href} href={tab.href} className="flex-1 min-w-fit">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                                isActive 
                                ? "bg-zinc-950 text-white shadow-xl italic tracking-tighter" 
                                : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50"
                            }`}
                        >
                            <tab.icon size={16} className={isActive ? "text-white" : "text-zinc-400"} />
                            {tab.name}
                            {isActive && (
                                <motion.div 
                                    layoutId="tab-pill" 
                                    className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 bg-zinc-950 rounded-full"
                                />
                            )}
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
}
