"use client";

import { Check, Download, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Bill from "../assets/images/bill.png";

export interface UploadedFile {
  id: number;
  name: string;
  uploadedFor: string;
  url: string;
  ext: string;
  date?: string;
  ticketNumber?: string;
  unit?: string;
  material?: string;
  tonage?: string;
  rate?: string;
  total?: string;
  pickup?: string;
  deliver?: string;
  invoiceNumber?: string;
  submissionDate?: string;
}


function TicketPreviewModal({
  file,
  onClose,
}: {
  file: UploadedFile;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const fields = [
    { label: "Date:",            value: file.date           || "04/02/2026"    },
    { label: "Ticket Number:",   value: file.ticketNumber   || "1231234"       },
    { label: "Unit:",            value: file.unit           || "906"           },
    { label: "Material:",        value: file.material       || '1/4" Rock'     },
    { label: "Tonage:",          value: file.tonage         || "27.56"         },
    { label: "Rate:",            value: file.rate           || "$11.00"        },
    { label: "Total:",           value: file.total          || "$303.60"       },
    { label: "Pickup:",          value: file.pickup         || "Chicago"       },
    { label: "Deliver:",         value: file.deliver        || "LMC-Prosper-4957" },
    { label: "Invoice Number:",  value: file.invoiceNumber  || "1247854369"    },
    { label: "Submission Date:", value: file.submissionDate || "04/01/2026"    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-[700px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#111827]">Ticket</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors text-[#374151]"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M17 5L5 17M5 5l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-4 pb-4 grid grid-cols-4 gap-x-4 gap-y-3">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm font-bold text-[#111827] leading-snug">{label}</p>
              <p className="text-sm text-[#6B7280] mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <p className="text-sm font-bold text-[#111827] mb-3">Ticket Image:</p>
          <div className="rounded-lg overflow-hidden border border-[#E5E7EB] w-fit">
            <img
              src={Bill}
              alt=""
              className="w-full max-w-[320px] min-h-[389px] h-full rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => window.open(file.url, "_blank")}
            className="w-fit px-5 py-3 bg-[#1D3461] text-white text-base rounded-lg hover:bg-[#16213a] transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}


function DeleteSuccessModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex items-center justify-center flex-col">
        <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
          <Check size={50} className="text-white stroke-[4]" />
        </div>
        <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
          File Deleted
        </h2>
      </div>
    </div>
  );
}


interface UploadedFilesSectionProps {
  files: UploadedFile[];
  onDelete: (id: number) => void;
}

export default function UploadedFilesSection({
  files,
  onDelete,
}: UploadedFilesSectionProps) {
  const [previewFile, setPreviewFile]       = useState<UploadedFile | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  function handleDelete(id: number) {
    onDelete(id);
    setShowDeleteSuccess(true);
  }

  if (files.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">Uploaded Files</h2>
        </div>

        <div className="divide-y divide-[#F3F4F6] px-4 py-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-xl bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <span className="text-[#1D3461] text-sm font-bold tracking-wide">
                  {file.ext}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111827] truncate">{file.name}</p>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  Uploaded for :{" "}
                  <span className="font-semibold text-[#111827]">{file.uploadedFor}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setPreviewFile(file)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye size={15} className="text-[#3B82F6]" />
                  Preview
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors group"
                >
                  <Trash2 size={15} className="text-[#EF4444]" />
                  <span className="group-hover:text-red-600 transition-colors">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewFile && (
        <TicketPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      {showDeleteSuccess && (
        <DeleteSuccessModal onClose={() => setShowDeleteSuccess(false)} />
      )}
    </>
  );
}