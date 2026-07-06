"use client";

import { ChevronDown, RefreshCw, Upload, ImageIcon } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const UPLOAD_FOR_OPTIONS = [
  "Myself",
  "John Smith - 601",
  "Henry Cavil - 608",
  "Tom Holland - 603",
  "Peter Kevin - 607",
  "Andrew Brooks - 801",
];


function UploadForDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative w-[220px]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 pt-2 pb-2.5 text-left flex items-end justify-between gap-2 hover:border-[#D1D5DB] transition-colors"
      >
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-[#9CA3AF] leading-none mb-1">Upload for</span>
          <span className="text-[15px] font-medium text-[#111827] leading-tight truncate">
            {value || "Select one"}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#6B7280] transition-transform mb-0.5 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {UPLOAD_FOR_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt
                  ? "bg-gray-50 text-[#111827] font-medium"
                  : "text-[#374151] hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default function UploadTicketPage() {
  const [uploadFor, setUploadFor] = useState("");
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function handleExtract() {
    if (!previewUrl) return;
    navigate("/dashboard/tickets-extraction");
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Upload Tickets</h1>
          <p className="text-sm text-[#707070] mt-0.5">
            Upload tickets for yourself or on behalf of your drivers
          </p>
        </div>
        <button className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors text-[#6B7280]">
          <RefreshCw size={16} />
        </button>
      </div>
      <div className="mb-5">
        <UploadForDropdown value={uploadFor} onChange={setUploadFor} />
      </div>
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">Upload Ticket files</h2>
        </div>

        <div className="p-6 flex sm:flex-row flex-col gap-6">
          <div className="flex-1 min-w-0">
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`relative border-2 border-dashed rounded-lg transition-colors ${
                isDragging
                  ? "border-[#1D3461] bg-blue-50/40"
                  : "border-[#D1D5DB] bg-[#F9FAFB]"
              }`}
              style={{ minHeight: 280 }}
            >
              <div className="absolute inset-3 rounded-lg bg-[#F3F4F6] flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg width="64" height="54" viewBox="0 0 64 54" fill="none">
                    <rect x="2" y="2" width="60" height="50" rx="6" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
                    <circle cx="20" cy="18" r="6" fill="#9CA3AF"/>
                    <path d="M2 38L18 24L28 34L40 20L62 38" stroke="#9CA3AF" strokeWidth="2.5" strokeLinejoin="round"/>
                  </svg>
                </div>

                <p className="text-[15px] text-[#6B7280]">Drag the picture</p>
                <p className="text-sm text-[#9CA3AF] -mt-2">or</p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#374151] text-sm font-medium rounded-lg transition-colors border border-[#D1D5DB]"
                >
                  <Upload size={15} />
                  Upload Image
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            </div>

            <button
              onClick={handleExtract}
              disabled={!previewUrl}
              className={`mt-5 px-8 py-3 text-sm font-semibold rounded-lg sm:block hidden transition-colors ${
                previewUrl
                  ? "bg-[#1D3461] text-white hover:bg-[#16213a]"
                  : "bg-[#1D3461]/60 text-white/70 cursor-not-allowed"
              }`}
            >
              Extract
            </button>
          </div>

          <div className="sm:w-[290px] flex-shrink-0">
            <p className="text-base font-semibold text-[#111827] mb-3">Preview Ticket</p>
            <div className="rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6] h-[310px] flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Ticket preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#D1D5DB]">
                  <ImageIcon size={40} strokeWidth={1.2} />
                  <p className="text-sm text-[#9CA3AF]">No image uploaded</p>
                </div>
              )}
            </div>
          </div>
           <button
              onClick={handleExtract}
              disabled={!previewUrl}
              className={`mt-5 px-8 py-3 text-sm font-semibold rounded-lg sm:hidden transition-colors ${
                previewUrl
                  ? "bg-[#1D3461] text-white hover:bg-[#16213a]"
                  : "bg-[#1D3461]/60 text-white/70 cursor-not-allowed"
              }`}
            >
              Extract
            </button>
        </div>
      </div>
    </div>
  );
}