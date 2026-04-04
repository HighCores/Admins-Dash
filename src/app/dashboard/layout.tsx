"use client";

import Sidebar from "@/components/Sidebar";
import CustomToaster from "@/components/CustomToaster";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-100 z-50">
         <div className="font-black italic tracking-widest uppercase text-zinc-950">High Core</div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-zinc-100 rounded-xl text-zinc-950">
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar - Desktop and Mobile sliding */}
      <aside className={`fixed md:relative shrink-0 h-full bg-white z-[100] border-r border-zinc-100 transition-all duration-300 w-72 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
         <div className="md:hidden flex justify-end p-4">
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-zinc-100 rounded-xl text-zinc-950">
                 <X size={20} />
             </button>
         </div>
         <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      
      {/* Main Content Area - Full fluid scrolling */}
      <main className="flex-1 w-full md:w-auto h-full overflow-y-auto bg-zinc-50/30 relative custom-scrollbar flex flex-col min-w-0">
        <div className="min-h-full w-full p-4 lg:p-8 flex flex-col relative z-10 flex-1">
          {children}
        </div>
        <CustomToaster />
        
        {/* Subtle decorative elements for premium feel */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-zinc-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] pointer-events-none"></div>
      </main>
    </div>
  );
}
