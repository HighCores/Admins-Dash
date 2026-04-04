"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export const showToast = (message: string, isError = false) => {
  window.dispatchEvent(new CustomEvent("hc-toast", { detail: { message, isError } }));
};

export default function CustomToaster() {
  const [toasts, setToasts] = useState<{ id: number; message: string; isError: boolean }[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message: e.detail.message, isError: e.detail.isError }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };
    
    window.addEventListener("hc-toast", handleToast);
    return () => window.removeEventListener("hc-toast", handleToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.isError 
                ? "bg-red-500/90 text-white border-red-400" 
                : "bg-zinc-950 text-white border-zinc-800"
            }`}
          >
            {toast.isError ? <AlertCircle size={20} className="opacity-80" /> : <CheckCircle2 size={20} className="text-emerald-400" />}
            <span className="font-bold text-sm tracking-wide italic">{toast.message}</span>
            <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
