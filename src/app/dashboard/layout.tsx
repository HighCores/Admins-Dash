import Sidebar from "@/components/Sidebar";
import CustomToaster from "@/components/CustomToaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sidebar - Fixed width to prevent shrinking, hidden on very small screens or flexible */}
      <aside className="hidden md:block w-72 shrink-0 h-full bg-white z-50 relative border-r border-zinc-100">
         <Sidebar />
      </aside>
      
      {/* Main Content Area - Full fluid scrolling */}
      <main className="flex-1 h-full overflow-y-auto bg-zinc-50/30 relative custom-scrollbar">
        <div className="min-h-full w-full p-4 lg:p-8 flex flex-col">
          {children}
        </div>
        <CustomToaster />
        
        {/* Subtle decorative elements for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}
