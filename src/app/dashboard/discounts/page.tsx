"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tag, Ticket, Trash2, Plus, Edit } from "lucide-react";
import { ConfirmModal, PromptModal } from "@/components/CustomModals";

export default function DiscountsPage() {
  const [activeTab, setActiveTab] = useState<"discounts" | "vouchers">("discounts");
  
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => void }>({
    isOpen: false, title: "", message: "", action: () => {}
  });

  const [promptState, setPromptState] = useState<{ isOpen: boolean; title: string; fields: any[]; onSubmit: (vals: any) => void }>({
    isOpen: false, title: "", fields: [], onSubmit: () => {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: dData } = await supabase.from("dc_discounts").select("*").order("schedule_date", { ascending: true });
    const { data: vData } = await supabase.from("dc_vouchers").select("*").order("created_at", { ascending: false });
    
    if (dData) setDiscounts(dData);
    if (vData) setVouchers(vData);
    setLoading(false);
  }

  function deleteDiscount(id: number) {
    setConfirmState({
      isOpen: true,
      title: "Delete Discount",
      message: "Are you sure you want to delete this auto discount?",
      action: async () => {
        await supabase.from("dc_discounts").delete().eq("id", id);
        fetchData();
      }
    });
  }

  function deleteVoucher(code: string) {
    setConfirmState({
      isOpen: true,
      title: "Delete Voucher",
      message: `Are you sure you want to delete voucher "${code}"?`,
      action: async () => {
        await supabase.from("dc_vouchers").delete().eq("code", code);
        fetchData();
      }
    });
  }

  function createDiscount() {
    setPromptState({
      isOpen: true,
      title: "Create Auto Discount",
      fields: [
        { name: "name", label: "Discount Name", placeholder: "e.g. Eid Sale" },
        { name: "percentage", label: "Percentage %", placeholder: "e.g. 15", type: "number" },
        { name: "start_date", label: "Start Date", type: "date" },
        { name: "end_date", label: "End Date", type: "date" },
        { name: "interval", label: "Interval", type: "select", options: [
          { label: "None (One time)", value: "NONE" },
          { label: "Yearly", value: "YEARLY" },
          { label: "Monthly", value: "MONTHLY" }
        ]}
      ],
      onSubmit: async (values) => {
        const payload: any = {
          name: values.name,
          percentage: parseInt(values.percentage),
          schedule_date: values.start_date,
          type: "auto",
          repeat_interval: values.interval || "NONE"
        };
        // Safely add end_date, if the database schema rejects it we log it
        payload.end_date = values.end_date;

        await supabase.from("dc_discounts").insert([payload]);
        fetchData();
      }
    });
  }

  function editDiscount(discount: any) {
    setPromptState({
      isOpen: true,
      title: "Edit Auto Discount",
      fields: [
        { name: "name", label: "Discount Name", defaultValue: discount.name },
        { name: "percentage", label: "Percentage %", defaultValue: discount.percentage.toString(), type: "number" },
        { name: "start_date", label: "Start Date", defaultValue: discount.schedule_date, type: "date" },
        { name: "end_date", label: "End Date", defaultValue: discount.end_date, type: "date" },
        { name: "interval", label: "Interval", defaultValue: discount.repeat_interval || "NONE", type: "select", options: [
          { label: "None (One time)", value: "NONE" },
          { label: "Yearly", value: "YEARLY" },
          { label: "Monthly", value: "MONTHLY" }
        ]}
      ],
      onSubmit: async (values) => {
        const payload: any = {
          name: values.name || discount.name,
          percentage: values.percentage ? parseInt(values.percentage) : discount.percentage,
          schedule_date: values.start_date || discount.schedule_date,
          repeat_interval: values.interval || discount.repeat_interval
        };
        payload.end_date = values.end_date || discount.end_date;

        await supabase.from("dc_discounts").update(payload).eq("id", discount.id);
        fetchData();
      }
    });
  }

  function createVoucher() {
    setPromptState({
      isOpen: true,
      title: "Create Voucher",
      fields: [
        { name: "code", label: "Voucher Code", placeholder: "e.g. SUMMER20" },
        { name: "percentage", label: "Percentage %", placeholder: "e.g. 20", type: "number" }
      ],
      onSubmit: async (values) => {
        await supabase.from("dc_vouchers").insert([{
          code: values.code,
          percentage: parseInt(values.percentage),
          type: "general", // Always general as requested
          is_used: false
        }]);
        fetchData();
      }
    });
  }

  function editVoucher(voucher: any) {
    setPromptState({
      isOpen: true,
      title: "Edit Voucher",
      fields: [
        { name: "percentage", label: "Percentage %", defaultValue: voucher.percentage.toString(), type: "number" }
      ],
      onSubmit: async (values) => {
        await supabase.from("dc_vouchers").update({
          percentage: values.percentage ? parseInt(values.percentage) : voucher.percentage
        }).eq("code", voucher.code);
        fetchData();
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sunset-900">Discounts & Vouchers</h1>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab("discounts")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "discounts" ? "bg-sunset-600 text-white shadow-lg shadow-sunset-500/30" : "bg-white text-sunset-600 hover:bg-sunset-50"
          }`}
        >
          <Tag size={20} />
          Auto Discounts
        </button>
        <button 
          onClick={() => setActiveTab("vouchers")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "vouchers" ? "bg-sunset-600 text-white shadow-lg shadow-sunset-500/30" : "bg-white text-sunset-600 hover:bg-sunset-50"
          }`}
        >
          <Ticket size={20} />
          Vouchers
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl">
        {activeTab === "discounts" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button onClick={createDiscount} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium transition shadow-lg shadow-green-500/30">
                <Plus size={18} /> Add Discount
              </button>
            </div>
            {loading ? <p className="text-center py-4">Loading...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-sunset-200/50">
                      <th className="pb-4 pr-4 text-sunset-800">Name</th>
                      <th className="pb-4 pr-4 text-sunset-800">Discount %</th>
                      <th className="pb-4 pr-4 text-sunset-800">Start Date</th>
                      <th className="pb-4 pr-4 text-sunset-800">End Date</th>
                      <th className="pb-4 pr-4 text-sunset-800">Interval</th>
                      <th className="pb-4 text-sunset-800 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sunset-100">
                    {discounts.map(d => (
                      <tr key={d.id} className="hover:bg-white/40 transition-colors">
                        <td className="py-4 pr-4 font-bold text-sunset-900">{d.name || "N/A"}</td>
                        <td className="py-4 pr-4 text-green-600 font-bold">{d.percentage}%</td>
                        <td className="py-4 pr-4 text-sunset-700">{d.schedule_date}</td>
                        <td className="py-4 pr-4 text-sunset-700">{d.end_date || "N/A"}</td>
                        <td className="py-4 pr-4 text-sunset-700">{d.repeat_interval || "NONE"}</td>
                        <td className="py-4 flex justify-end gap-2">
                          <button onClick={() => editDiscount(d)} className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteDiscount(d.id)} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {discounts.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-sunset-500">No active discounts</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "vouchers" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button onClick={createVoucher} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium transition shadow-lg shadow-green-500/30">
                <Plus size={18} /> Create Voucher
              </button>
            </div>
            {loading ? <p className="text-center py-4">Loading...</p> : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-sunset-200/50">
                    <th className="pb-4 text-sunset-800">Code</th>
                    <th className="pb-4 text-sunset-800">Value %</th>
                    <th className="pb-4 text-sunset-800">Status</th>
                    <th className="pb-4 text-sunset-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sunset-100">
                  {vouchers.map(v => (
                    <tr key={v.code} className="hover:bg-white/40 transition-colors">
                      <td className="py-4 font-bold text-purple-700">{v.code}</td>
                      <td className="py-4 text-green-600 font-bold">{v.percentage}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${v.is_used ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {v.is_used ? "USED" : "ACTIVE"}
                        </span>
                      </td>
                      <td className="py-4 flex justify-end gap-2">
                        <button onClick={() => editVoucher(v)} className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteVoucher(v.code)} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vouchers.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-sunset-500">No vouchers available</td></tr>}
                </tbody>
              </table>
            )}
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
