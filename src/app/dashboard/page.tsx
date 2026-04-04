import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-8 z-10 lg:pl-4">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-sunset-900 tracking-tight">
          High Core <span className="text-sunset-500">Agency</span>
        </h1>
        <p className="text-lg text-sunset-800/70 font-medium">Welcome to your Unified Control Center.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-[2rem] border border-white/50 shadow-xl hover:shadow-sunset-500/10 transition-all group">
          <h3 className="text-xl font-bold text-sunset-900 mb-2">Discord Bot</h3>
          <p className="text-sunset-800/60 mb-6">Fully connected to your Java bot. Manage tickets, levels, and points.</p>
          <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 w-fit px-4 py-1 rounded-full text-sm">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Active & Online
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] border border-white/50 shadow-xl hover:shadow-blue-500/10 transition-all group">
          <h3 className="text-xl font-bold text-sunset-900 mb-2">Telegram Bot</h3>
          <p className="text-sunset-800/60 mb-6">N8N Workflows are monitoring incoming messages and tickets.</p>
          <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 w-fit px-4 py-1 rounded-full text-sm">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             Active & Online
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] border border-white/50 shadow-xl bg-gradient-to-br from-sunset-500 to-orange-400 text-white group cursor-pointer hover:scale-[1.02] transition-all">
          <h3 className="text-xl font-bold mb-2">New Update</h3>
          <p className="opacity-90 mb-6">Added Real-time Ticket Transcripts. View them in the Tickets tab.</p>
          <span className="font-bold text-sm underline underline-offset-4">Learn More</span>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[2.5rem] border border-sunset-200 bg-white/40 backdrop-blur-md text-center max-w-4xl mx-auto shadow-2xl">
         <h2 className="text-3xl font-extrabold text-sunset-900 mb-4 tracking-tight">Select a module from the sidebar</h2>
         <p className="text-sunset-800/60 text-lg">Your dashboard is now fully synced with your databases. Click on any module to start managing your agency bots live.</p>
      </div>
    </div>
  );
}
