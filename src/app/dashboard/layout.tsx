"use client";

import Sidebar from "@/components/Sidebar";
import CustomToaster from "@/components/CustomToaster";
import { useState } from "react";
import { Menu, X, Cpu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0c] font-sans text-zinc-300 overflow-hidden relative">
      
      {/* Cinematic CRT Overlay */}
      <div className="scanline z-[200] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05)_0%,transparent_100%)] pointer-events-none" />

      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#0f0f12] border-b border-white/5 z-50 h-16">
         <div className="font-black tracking-tighter uppercase text-white italic flex items-center gap-2">
            <Cpu size={18} className="text-emerald-500" /> High Core
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/5 rounded-xl text-white">
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar - Fixed permanently on left */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0f0f12] z-[100] border-r border-white/5 transition-transform duration-300 w-72 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
         <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl text-white shadow-sm mt-2 mr-2">
                 <X size={20} />
             </button>
         </div>
         <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      
      {/* Main Content Area - Shifted past the sidebar on desktop */}
      <main className="flex-1 h-full overflow-y-auto bg-transparent relative custom-scrollbar flex flex-col min-w-0 md:ml-72 mt-16 md:mt-0">
        <div className="min-h-full w-full p-4 lg:p-8 pb-48 flex flex-col relative z-10 flex-1">
          {children}
        </div>
        <CustomToaster />
        
        {/* Subtle decorative elements for terminal feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
      </main>
    </div>
  );
}
