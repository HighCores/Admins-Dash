import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-sunset-50/30 overflow-x-hidden">
      {/* Sidebar - Fixed width to prevent shrinking */}
      <div className="w-80 shrink-0">
         <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
