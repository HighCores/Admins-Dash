"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex-1 min-h-screen flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-10 py-12 px-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-sunset-900 mb-4">Access Denied</h1>
        
        <p className="text-sunset-800/80 mb-8 font-medium">
          {error === "AccessDenied" 
            ? "You do not have the required Role ID (1488795130034000036) in the Discord Server." 
            : "An error occurred during authentication. Please check your credentials and try again."}
        </p>

        <p className="text-sm text-sunset-800/60 mt-6 text-center font-medium max-w-sm">
          Note: Ensure you are logging in with the correct Discord account that holds the founder role in the HighCores server.
        </p>

        <Link 
          href="/"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-sunset-600 text-white font-semibold text-lg hover:bg-sunset-500 transition-all shadow-lg shadow-sunset-600/30 active:scale-95 mt-8"
        >
          <Home size={22} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex-1 min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <ErrorContent />
    </Suspense>
  );
}
