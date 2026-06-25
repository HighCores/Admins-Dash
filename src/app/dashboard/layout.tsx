import { Sidebar } from "@/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PlatformProvider } from "@/context/PlatformContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  return (
    <PlatformProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-sunset-100 via-[#fff8f5] to-sunset-200">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle animated background shapes for luxury feel */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sunset-300/20 blur-3xl mix-blend-multiply animate-blob pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-300/20 blur-3xl mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none"></div>
          
          <div className="relative w-full max-w-7xl mx-auto h-full flex flex-col gap-6 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {children}
          </div>
        </main>
      </div>
    </PlatformProvider>
  );
}
