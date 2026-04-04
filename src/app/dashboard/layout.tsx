import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-sunset-100 via-[#fff8f5] to-sunset-200">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
