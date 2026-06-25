"use client";

import { X, AlertTriangle, ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Custom Select Component
function CustomSelect({ name, options, defaultValue }: { name: string, options: {label: string, value: string}[], defaultValue?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0].value);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === selected) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <input type="hidden" name={name} value={selected} />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-sunset-100 rounded-xl cursor-pointer hover:border-sunset-300 transition-colors shadow-sm"
      >
        <span className="text-sunset-900 font-bold">{selectedOption.label}</span>
        <ChevronDown size={20} className={`text-sunset-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-sunset-200 rounded-xl shadow-2xl shadow-sunset-500/30 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                setSelected(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer font-bold transition-colors ${
                selected === opt.value 
                  ? "bg-gradient-to-r from-sunset-500 to-sunset-600 text-white" 
                  : "text-sunset-800 hover:bg-sunset-50 hover:text-sunset-600"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Date Picker Component to entirely avoid native Chrome picker
function CustomDatePicker({ name, defaultValue }: { name: string, defaultValue?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialDate = defaultValue ? new Date(defaultValue) : null;
  const isValidDate = initialDate && !isNaN(initialDate.getTime());

  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidDate ? initialDate : null);
  const [currentMonth, setCurrentMonth] = useState<Date>(isValidDate ? initialDate : new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative" ref={pickerRef}>
      <input type="hidden" name={name} value={selectedDate ? formatDate(selectedDate) : ""} />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-sunset-100 rounded-xl cursor-pointer hover:border-sunset-300 transition-colors shadow-sm"
      >
        <CalendarIcon size={20} className="text-sunset-500" />
        <span className={`font-bold ${selectedDate ? "text-sunset-900" : "text-sunset-300"}`}>
          {selectedDate ? formatDate(selectedDate) : "YYYY-MM-DD"}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white/95 backdrop-blur-xl border border-sunset-200 rounded-2xl shadow-2xl shadow-sunset-500/30 z-[999] w-72 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-sunset-100 rounded-lg text-sunset-600 transition"><ChevronLeft size={20}/></button>
            <div className="font-extrabold text-sunset-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-sunset-100 rounded-lg text-sunset-600 transition"><ChevronRight size={20}/></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(d => <div key={d} className="text-center text-xs font-bold text-sunset-400">{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isSelected 
                      ? "bg-gradient-to-r from-sunset-500 to-sunset-600 text-white shadow-md" 
                      : "text-sunset-800 hover:bg-sunset-100 hover:text-sunset-600"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      {/* Removed overflow-hidden so child absolute elements are not clipped */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col border border-sunset-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-sunset-100 flex justify-between items-center bg-red-50/50 rounded-t-3xl">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <button onClick={onCancel} className="p-2 text-sunset-400 hover:text-sunset-600 hover:bg-red-100 rounded-xl transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sunset-800 font-medium">{message}</p>
        </div>
        <div className="px-6 py-4 bg-sunset-50/50 flex justify-end gap-3 border-t border-sunset-100 rounded-b-3xl">
          <button 
            onClick={onCancel}
            className="px-4 py-2 font-bold text-sunset-600 hover:bg-sunset-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onCancel(); }}
            className="px-4 py-2 font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  fields: { name: string; label: string; placeholder?: string; defaultValue?: string; type?: string; options?: {label: string, value: string}[] }[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export function PromptModal({ isOpen, title, fields, onSubmit, onCancel }: PromptModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fields.forEach(f => {
      values[f.name] = formData.get(f.name) as string;
    });
    onSubmit(values);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      {/* Removed overflow-hidden so child popups can extend outside */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col border border-sunset-200 animate-in fade-in zoom-in duration-300 my-auto relative">
        <div className="px-6 py-5 border-b border-sunset-100 flex justify-between items-center bg-gradient-to-r from-sunset-50 to-white rounded-t-3xl">
          <h2 className="text-xl font-black text-sunset-900 tracking-tight">{title}</h2>
          <button onClick={onCancel} className="p-2 text-sunset-400 hover:text-sunset-600 hover:bg-sunset-100 rounded-xl transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-extrabold text-sunset-800 tracking-wide">{field.label}</label>
                
                {field.type === "select" && field.options ? (
                  <CustomSelect 
                    name={field.name} 
                    options={field.options} 
                    defaultValue={field.defaultValue || field.options[0].value} 
                  />
                ) : field.type === "date" ? (
                  <CustomDatePicker 
                    name={field.name} 
                    defaultValue={field.defaultValue || undefined} 
                  />
                ) : (
                  <input 
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue || ""}
                    className="w-full px-4 py-3 bg-white border-2 border-sunset-100 rounded-xl focus:outline-none focus:border-sunset-400 focus:ring-4 focus:ring-sunset-400/20 text-sunset-900 font-bold transition-all shadow-sm placeholder:font-medium placeholder:text-sunset-300"
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <div className="px-6 py-5 bg-sunset-50/50 flex justify-end gap-3 border-t border-sunset-100 rounded-b-3xl">
            <button 
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 font-bold text-sunset-600 hover:bg-sunset-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 font-extrabold bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white rounded-xl shadow-lg shadow-sunset-500/30 hover:shadow-xl hover:shadow-sunset-500/40 hover:-translate-y-0.5 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
