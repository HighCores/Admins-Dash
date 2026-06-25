"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldAlert, Trash2, Plus, AlertOctagon, Info } from "lucide-react";
import { ConfirmModal, PromptModal } from "@/components/CustomModals";

export default function WarningWordsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => void }>({
    isOpen: false, title: "", message: "", action: () => {}
  });

  const [promptState, setPromptState] = useState<{ isOpen: boolean; title: string; fields: any[]; onSubmit: (vals: any) => void }>({
    isOpen: false, title: "", fields: [], onSubmit: () => {}
  });

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    setLoading(true);
    const { data } = await supabase.from("dc_word_filter").select("*").order("word", { ascending: true });
    if (data) setWords(data);
    setLoading(false);
  }

  function addWord() {
    setPromptState({
      isOpen: true,
      title: "Add Blocked Word",
      fields: [
        { name: "word", label: "Word to block", placeholder: "Enter bad word here..." }
      ],
      onSubmit: async (values) => {
        if (!values.word) return;
        await supabase.from("dc_word_filter").upsert([{
          word: values.word.toLowerCase()
        }], { onConflict: "word" });
        fetchWords();
      }
    });
  }

  function deleteWord(word: string) {
    setConfirmState({
      isOpen: true,
      title: "Remove Word",
      message: `Are you sure you want to allow the word "${word}" in your server?`,
      action: async () => {
        await supabase.from("dc_word_filter").delete().eq("word", word);
        fetchWords();
      }
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-sunset-900 tracking-tight mb-2">Warning Words Filter</h1>
          <p className="text-sunset-600 font-medium text-lg">Manage restricted vocabulary to keep your community safe.</p>
        </div>
        <button 
          onClick={addWord} 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-red-500/30"
        >
          <Plus size={22} strokeWidth={3} /> Add New Word
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-3">How it works</h3>
            <p className="text-red-800/80 leading-relaxed font-medium">
              When a user sends any of the words listed here, the bot will immediately 
              <strong> delete their message</strong> and issue an automated warning.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-white/50 border border-sunset-200">
            <div className="flex items-center gap-3 text-sunset-800 mb-4">
              <Info size={24} className="text-sunset-500" />
              <h3 className="font-bold text-lg">System Status</h3>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-sunset-100">
              <span className="text-sunset-600 font-medium">Filter Module</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sunset-600 font-medium">Total Blocked</span>
              <span className="text-xl font-black text-sunset-900">{words.length}</span>
            </div>
          </div>
        </div>

        {/* Words Grid */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-10 h-10 border-4 border-sunset-200 border-t-red-500 rounded-full animate-spin"></div>
              <p className="text-sunset-500 font-bold">Loading secure database...</p>
            </div>
          ) : words.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-70">
              <AlertOctagon size={80} className="text-sunset-300 mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-bold text-sunset-800 mb-2">No Words Blocked</h3>
              <p className="text-sunset-600 max-w-md mx-auto">Your community chat is currently fully open. Add words to start filtering toxic messages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {words.map(w => (
                <div key={w.word} className="group relative bg-white border-2 border-sunset-100 hover:border-red-300 rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1">
                  <span className="font-extrabold text-lg text-sunset-900 truncate pr-2">{w.word}</span>
                  
                  <button 
                    onClick={() => deleteWord(w.word)} 
                    className="p-2 text-sunset-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Remove restriction"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  {/* Subtle red indicator dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen} 
        title={confirmState.title} 
        message={confirmState.message} 
        onConfirm={confirmState.action} 
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })} 
      />
      <PromptModal 
        isOpen={promptState.isOpen} 
        title={promptState.title} 
        fields={promptState.fields} 
        onSubmit={promptState.onSubmit} 
        onCancel={() => setPromptState({ ...promptState, isOpen: false })} 
      />
    </div>
  );
}
