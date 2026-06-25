import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HighCores Agency - Dashboard",
  description: "Automated Control Center for HighCores Agency Bots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <main className="flex-grow flex flex-col relative w-full h-full min-h-screen">
            <div className="absolute inset-0 bg-sunset-glow blur-[120px] rounded-full w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-pulse hidden md:block opacity-30"></div>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
