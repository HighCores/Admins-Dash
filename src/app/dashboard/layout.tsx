import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sidebar - Fixed width to prevent shrinking, high contrast */}
      <aside className="w-72 shrink-0 h-full bg-white z-50 relative">
         <Sidebar />
      </aside>
      
      {/* Main Content Area - No-Scroll Shell */}
      <main className="flex-1 h-full overflow-hidden bg-zinc-50/30 relative">
        <div className="h-full w-full p-6 lg:p-8 flex flex-col min-h-0">
          {children}
        </div>
        
        {/* Subtle decorative elements for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}
