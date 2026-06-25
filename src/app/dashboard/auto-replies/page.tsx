"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, Trash2, Plus, Edit } from "lucide-react";
import { ConfirmModal, PromptModal } from "@/components/CustomModals";

export default function AutoRepliesPage() {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => void }>({
    isOpen: false, title: "", message: "", action: () => {}
  });

  const [promptState, setPromptState] = useState<{ isOpen: boolean; title: string; fields: any[]; onSubmit: (vals: any) => void }>({
    isOpen: false, title: "", fields: [], onSubmit: () => {}
  });

  useEffect(() => {
    fetchReplies();
  }, []);

  async function fetchReplies() {
    setLoading(true);
    const { data } = await supabase.from("dc_auto_responses").select("*").order("keyword", { ascending: true });
    if (data) setReplies(data);
    setLoading(false);
  }

  function createReply() {
    setPromptState({
      isOpen: true,
      title: "Add Auto Reply",
      fields: [
        { name: "keyword", label: "Word / Keyword", placeholder: "e.g. Hello" },
        { name: "responseText", label: "Bot Response", placeholder: "e.g. Hi there! How can I help?" }
      ],
      onSubmit: async (values) => {
        await supabase.from("dc_auto_responses").upsert([{
          keyword: values.keyword.toLowerCase(),
          response_text: values.responseText,
          created_by: "Admin Dashboard"
        }], { onConflict: "keyword" });
        fetchReplies();
      }
    });
  }

  function editReply(keyword: string, currentResponse: string) {
    setPromptState({
      isOpen: true,
      title: "Edit Auto Reply",
      fields: [
        { name: "keyword", label: "Word / Keyword (Cannot change)", placeholder: keyword, type: "text" },
        { name: "responseText", label: "Bot Response", placeholder: "New response...", type: "text" }
      ],
      onSubmit: async (values) => {
        const keyToUse = values.keyword ? values.keyword.toLowerCase() : keyword;
        await supabase.from("dc_auto_responses").upsert([{
          keyword: keyToUse,
          response_text: values.responseText,
          created_by: "Admin Dashboard"
        }], { onConflict: "keyword" });
        fetchReplies();
      }
    });
  }

  function deleteReply(keyword: string) {
    setConfirmState({
      isOpen: true,
      title: "Delete Auto Reply",
      message: `Are you sure you want to delete the auto reply for the word "${keyword}"?`,
      action: async () => {
        await supabase.from("dc_auto_responses").delete().eq("keyword", keyword);
        fetchReplies();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sunset-900">Auto Replies</h1>
        <button onClick={createReply} className="flex items-center gap-2 px-4 py-2 bg-sunset-600 text-white rounded-xl font-medium hover:bg-sunset-500 transition shadow-lg shadow-sunset-500/30">
          <Plus size={20} /> Add Auto Reply
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl">
        {loading ? (
          <p className="text-center text-sunset-500 py-10">Loading...</p>
        ) : replies.length === 0 ? (
          <p className="text-center text-sunset-500 py-10">No auto replies found. Click add to create one.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {replies.map(r => (
              <div key={r.keyword} className="p-4 bg-white/50 border border-sunset-100 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle size={18} className="text-sunset-500" />
                    <h3 className="font-bold text-lg text-sunset-900">Word: {r.keyword}</h3>
                  </div>
                  <p className="text-sm text-sunset-700 whitespace-pre-wrap bg-sunset-50 p-3 rounded-xl border border-sunset-100/50">
                    {r.response_text}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => editReply(r.keyword, r.response_text)} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition font-medium">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => deleteReply(r.keyword)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition font-medium">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
