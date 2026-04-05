"use client";

import Sidebar from "@/components/Sidebar";
import DashboardTabs from "@/components/DashboardTabs";
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
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-950">
      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white border-b border-zinc-100 z-50 h-16">
         <div className="font-black tracking-widest uppercase text-zinc-950">High Core</div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-zinc-100 rounded-xl text-zinc-950">
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar - Fixed permanently on left */}
      <aside className={`fixed top-0 left-0 h-full bg-white z-[100] border-r border-zinc-100 transition-transform duration-300 w-72 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
         <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-zinc-100 rounded-xl text-zinc-950 shadow-sm mt-2 mr-2">
                 <X size={20} />
             </button>
         </div>
         <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      
      {/* Main Content Area - Shifted past the 72 (288px) sidebar on desktop */}
      <main className="flex-1 h-full overflow-y-auto bg-zinc-50/30 relative custom-scrollbar flex flex-col min-w-0 md:ml-72 mt-16 md:mt-0">
        <div className="min-h-full w-full p-4 lg:p-8 flex flex-col relative z-10 flex-1">
          <DashboardTabs />
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
