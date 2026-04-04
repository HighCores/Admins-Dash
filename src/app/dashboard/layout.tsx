import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar - Fixed width to prevent shrinking, high contrast */}
      <div className="w-80 shrink-0 h-full border-r border-zinc-200/50 bg-white">
         <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar bg-zinc-50/50">
        <div className="max-w-[1600px] mx-auto p-8 lg:p-12 min-h-full flex flex-col gap-10">
          {children}
        </div>
      </main>
    </div>
  );
}
