"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Eye,
  X,
} from "lucide-react";
import { format } from "date-fns";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { TicketPreviewModal, UploadedFile } from "./UploadedFilesSection";

type TabFilter = "All Tickets" | "Approved" | "Pending Approval";

type SortKey =
  | "ticketNo"
  | "date"
  | "uploadedFor"
  | "pickup"
  | "drop"
  | "tonage"
  | "rate"
  | "amount"
  | "status";

type SortDir = "asc" | "desc";

interface TicketRow {
  id: string;
  ticketNo: string;
  date: string;
  uploadedFor: string;
  pickup: string;
  drop: string;
  tonage: number;
  rate: number;
  amount: number;
  status: "Approved" | "Pending";
}

const STATUS_STYLES: Record<TicketRow["status"], string> = {
  Approved: "bg-[#1D3461] text-white",
  Pending: "bg-[#D9A33E] text-white",
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "ticketNo", label: "Ticket No." },
  { key: "date", label: "Date" },
  { key: "uploadedFor", label: "Uploaded for" },
  { key: "pickup", label: "Pickup" },
  { key: "drop", label: "Drop" },
  { key: "tonage", label: "Tonage" },
  { key: "rate", label: "Rate" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const SHOW_OPTIONS = [10, 25, 50, 100];

const MOCK_DATA: TicketRow[] = [
  {
    id: "1",
    ticketNo: "#653783",
    date: "06/01/2026",
    uploadedFor: "Max Louis",
    pickup: "Hanson Lake",
    drop: "LMC",
    tonage: 27.69,
    rate: 11.0,
    amount: 304.59,
    status: "Approved",
  },
  {
    id: "2",
    ticketNo: "#682497",
    date: "15/01/2026",
    uploadedFor: "Martin Joe",
    pickup: "Hanson Lake",
    drop: "LMC",
    tonage: 28.32,
    rate: 11.0,
    amount: 311.52,
    status: "Pending",
  },
  {
    id: "3",
    ticketNo: "#598246",
    date: "25/01/2026",
    uploadedFor: "John Louis",
    pickup: "Hanson Lake",
    drop: "LMC",
    tonage: 27.45,
    rate: 11.0,
    amount: 301.95,
    status: "Approved",
  },
  {
    id: "4",
    ticketNo: "#546892",
    date: "02/02/2026",
    uploadedFor: "Robert Henry",
    pickup: "Hanson Lake",
    drop: "LMC",
    tonage: 26.43,
    rate: 11.0,
    amount: 290.73,
    status: "Approved",
  },
  {
    id: "5",
    ticketNo: "#598246",
    date: "04/02/2026",
    uploadedFor: "Max Louis",
    pickup: "LMC",
    drop: "Hanson BP",
    tonage: 25.51,
    rate: 7.25,
    amount: 186.5,
    status: "Pending",
  },
  {
    id: "6",
    ticketNo: "#516498",
    date: "08/02/2026",
    uploadedFor: "Harry James",
    pickup: "Hanson Lake",
    drop: "LMC",
    tonage: 26.59,
    rate: 7.25,
    amount: 220.3,
    status: "Approved",
  },
  {
    id: "7",
    ticketNo: "#112546",
    date: "20/02/2026",
    uploadedFor: "Max Louis",
    pickup: "LMC",
    drop: "Hanson Lake",
    tonage: 20.5,
    rate: 7.25,
    amount: 165.5,
    status: "Approved",
  },
  {
    id: "8",
    ticketNo: "#112546",
    date: "20/02/2026",
    uploadedFor: "Max Louis",
    pickup: "LMC",
    drop: "Hanson Lake",
    tonage: 20.5,
    rate: 7.25,
    amount: 165.5,
    status: "Pending",
  },
];

function SortIcon({ dir }: { dir: SortDir | null }) {
  if (dir === "asc") return <ChevronUp size={13} className="text-[#1D3461]" />;
  if (dir === "desc")
    return <ChevronDown size={13} className="text-[#1D3461]" />;
  return <ChevronsUpDown size={13} className="text-[#9CA3AF]" />;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    const result: number[] = [];
    for (let i = 1; i <= totalPages; i++) result.push(i);
    return result;
  }, [totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-[#E5E7EB] rounded-lg text-[#6B7280] disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg border transition-colors ${
            p === currentPage
              ? "bg-[#1D3461] text-white border-[#1D3461]"
              : "border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-[#E5E7EB] rounded-lg text-[#6B7280] disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function DownloadSuccessModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex items-center justify-center flex-col relative">
        <button
              className="absolute top-4 right-4"
              onClick={() => onClose()}
            >
              <X size={20} className="text-[#000]" />
            </button>
        <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
          <Check size={50} className="text-white stroke-[4]" />
        </div>
        <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
          File Downloaded
        </h2>
      </div>
    </div>
  );
}

export default function TicketStatusTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDateModal, setOpenDateModal] = useState(false);
  const [tabFilter, setTabFilter] = useState<TabFilter>("All Tickets");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [range, setRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  
  function handleDownload(_id: string) {
    setShowDownloadSuccess(true);
  }

  function toggleModal(rowId: string) {
    setOpenModals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
    setMenuOpen(null);
  }

  function convertRowToFile(row: TicketRow): UploadedFile {
    return {
      id: parseInt(row.id),
      name: row.ticketNo,
      uploadedFor: row.uploadedFor,
      url: "#",
      ext: "PDF",
      date: row.date,
      ticketNumber: row.ticketNo,
      pickup: row.pickup,
      deliver: row.drop,
      tonage: row.tonage.toString(),
      rate: `$${row.rate.toFixed(2)}`,
      total: `$${row.amount.toFixed(2)}`,
    };
  }

  function ActionsMenu({ row }: { row: TicketRow }) {
    const isMenuOpen = menuOpen === row.id;
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(isMenuOpen ? null : row.id)}
          className="w-8 h-8 flex items-center relative justify-center border border-[#E5E7EB] rounded-md text-[#6B7280] hover:bg-gray-50"
        >
          <MoreVertical size={14} />
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-[180px] bg-white border border-[#E5E7EB] rounded-lg overflow-hidden py-2 z-10 text-sm">
              <button
                onClick={() => toggleModal(row.id)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-[#374151]"
              >
                <Eye size={18} className="text-[#3157B7]" /> View Ticket
              </button>
              <button
                onClick={() => {
                  handleDownload(row.id);
                  setMenuOpen(null);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-[#374151]"
              >
                <Download size={18} className="text-[#3157B7]" /> Download
                Ticket
              </button>
            </div>
          )}
        </button>
      </div>
    );
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let rows = [...MOCK_DATA];

    if (tabFilter === "Approved") {
      rows = rows.filter((r) => r.status === "Approved");
    } else if (tabFilter === "Pending Approval") {
      rows = rows.filter((r) => r.status === "Pending");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.ticketNo.toLowerCase().includes(term) ||
          r.uploadedFor.toLowerCase().includes(term) ||
          r.pickup.toLowerCase().includes(term) ||
          r.drop.toLowerCase().includes(term),
      );
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return rows;
  }, [tabFilter, searchTerm, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * showEntries;
    return filtered.slice(start, start + showEntries);
  }, [filtered, safePage, showEntries]);

  const allSelected =
    paginated.length > 0 && paginated.every((r) => selectedRows.includes(r.id));
  const someSelected =
    paginated.some((r) => selectedRows.includes(r.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !paginated.some((r) => r.id === id)),
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...paginated.filter((r) => !prev.includes(r.id)).map((r) => r.id),
      ]);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  return (
    <div className="bg-[#F3F4F6] mt-5 text-[#111827]">
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3 sm:px-5 px-2 py-3.5 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">
            Ticket Status
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket"
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg outline-none w-64 placeholder:text-[#9CA3AF]"
              />
            </div>

            <div
              onClick={() => setOpenDateModal(true)}
              className="flex items-center gap-2 text-sm text-[#111827] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 cursor-pointer"
            >
              <CalendarDays size={20} />
              <span>
                {range?.from ? format(range.from, "dd/MM/yyyy") : "Start Date"}
                {" - "}
                {range?.to ? format(range.to, "dd/MM/yyyy") : "End Date"}
              </span>
            </div>

            <DateRangeModal
              open={openDateModal}
              onClose={() => setOpenDateModal(false)}
              value={range}
              onChange={setRange}
            />

            {showDownloadSuccess && (
              <DownloadSuccessModal
                onClose={() => setShowDownloadSuccess(false)}
              />
            )}

            {Array.from(openModals).map((rowId) => {
              const row = paginated.find((r) => r.id === rowId);
              if (!row) return null;
              return (
                <TicketPreviewModal
                  key={rowId}
                  file={convertRowToFile(row)}
                  onClose={() => {
                    setOpenModals((prev) => {
                      const newSet = new Set(prev);
                      newSet.delete(rowId);
                      return newSet;
                    });
                  }}
                />
              );
            })}

            <div className="flex items-center bg-[#F3F4F6] rounded-lg p-1">
              {(
                ["All Tickets", "Approved", "Pending Approval"] as TabFilter[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTabFilter(tab)}
                  className={`sm:px-4 px-2 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                    tabFilter === tab
                      ? "bg-[#1D3461] text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#374151]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="pl-4 pr-2 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                  />
                </th>
                {COLUMNS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-2 py-3 text-left text-[13px] font-semibold text-[#1F2020] select-none cursor-pointer whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      <SortIcon dir={sortKey === key ? sortDir : null} />
                    </span>
                  </th>
                ))}
                <th className="px-2 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-12 text-center text-[#9CA3AF]"
                  >
                    No records match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-gray-50/60 ${
                      selectedRows.includes(row.id) ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="pl-5 pr-3 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                      />
                    </td>
                    <td className="px-2 py-3.5 font-bold text-[#1F2020] whitespace-nowrap">
                      {row.ticketNo}
                    </td>
                    <td className="px-2 py-3.5 text-[#6B7280] whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.uploadedFor}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.pickup}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.drop}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.tonage.toFixed(2)}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      ${row.rate.toFixed(2)}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      ${row.amount.toFixed(2)}
                    </td>
                    <td className="px-2 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">
                      <ActionsMenu row={row} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-sm text-[#1D3461]">
            <span>Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
              className="border border-[#E5E7EB] rounded-md px-2 py-1 text-sm text-[#111827] outline-none cursor-pointer"
            >
              {SHOW_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>Entries</span>
          </div>
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
