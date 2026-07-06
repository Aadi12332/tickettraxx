"use client";

import { RefreshCw } from "lucide-react";
import UploadedFilesSection, { UploadedFile } from "./UploadedFilesSection";
import { useState } from "react";
import TicketStatusTable from "./TicketStatusTable";

const INITIAL_FILES: UploadedFile[] = [
  {
    id: 1,
    name: "ticket_0892_dallas.jpg",
    uploadedFor: "John Smith",
    url: "https://example.com/uploads/ticket_0892_dallas.jpg",
    ext: "JPG",
  },
  {
    id: 2,
    name: "ticket_1045_houston.png",
    uploadedFor: "Henry Cavil",
    url: "https://example.com/uploads/ticket_1045_houston.png",
    ext: "PNG",
  },
  {
    id: 3,
    name: "ticket_2231_austin.jpg",
    uploadedFor: "Myself",
    url: "https://example.com/uploads/ticket_2231_austin.jpg",
    ext: "JPG",
  },
];

export default function TicketStatusPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(INITIAL_FILES);

  function handleDelete(id: number) {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Ticket Status</h1>
          <p className="text-sm text-[#707070] mt-0.5">
            ticket status of all uploaded tickets
          </p>
        </div>
        <button className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors text-[#6B7280]">
          <RefreshCw size={16} />
        </button>
      </div>

      <UploadedFilesSection files={uploadedFiles} onDelete={handleDelete} />

      <TicketStatusTable />
    </div>
  );
}