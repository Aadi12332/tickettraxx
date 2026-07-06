"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  ChevronDown,
  Calendar,
  MoreVertical,
  X,
  Check,
} from "lucide-react";
import { TicketApprovalModal } from "./TicketApprovalModal";
import { NotDeliveredModal } from "./NotDeliveredModal";
import { FilterDropdown } from "./Activeloadstable";

interface LoadRow {
  id: number;
  driverName: string;
  clientName: string;
  date: string;
  material: string;
  pickup: string;
  deliver: string;
  loads: number;
  status: "Active" | "Delivered" | "Incomplete" | "Cancelled";
}

type SortKey = keyof LoadRow;
type SortDir = "asc" | "desc" | null;

const STATUS_STYLES: Record<LoadRow["status"], string> = {
  Active:     "bg-[#22C55E] text-white",
  Delivered:  "bg-[#16A34A] text-white",
  Incomplete: "bg-[#F97316] text-white",
  Cancelled:  "bg-[#EF4444] text-white",
};

const INITIAL_DATA: LoadRow[] = [
  { id: 1,  driverName: "Marley Levin",    clientName: "CELINA",           date: "02/04/2026", material: "Y Rock",        pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Active"     },
  { id: 2,  driverName: "Lydia Culhane",   clientName: "RESOLVE Ravenna #1", date: "02/04/2026", material: "MAN SAND",    pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Delivered"  },
  { id: 3,  driverName: "Zaire Stanton",   clientName: "LMC-ROSSER",       date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Active"     },
  { id: 4,  driverName: "Wilson Bothman",  clientName: "ANNA",             date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Incomplete" },
  { id: 5,  driverName: "Jaydon Geidt",    clientName: "LYDIA",            date: "02/04/2026", material: "Gravel",        pickup: "Hanson Lake", deliver: "LMC", loads: 1, status: "Active"     },
  { id: 6,  driverName: "Ruben Bothman",   clientName: "SUMMIT",           date: "02/04/2026", material: "Gravel",        pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Active"     },
  { id: 7,  driverName: "Hanna Korsgaard", clientName: "ALFREDO",          date: "02/04/2026", material: "Y Rock",        pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Active"     },
  { id: 8,  driverName: "Angel Philips",   clientName: "RESOLVE Ravenna #2", date: "02/04/2026", material: "Y Rock",     pickup: "Hanson Lake", deliver: "LMC", loads: 1, status: "Active"     },
  { id: 9,  driverName: "Jordyn Bator",    clientName: "LMC-ROSSER",       date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Delivered"  },
  { id: 10, driverName: "Giana Rosser",    clientName: "CELINA",           date: "02/04/2026", material: "MAN SAND",      pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Cancelled"  },
  { id: 11, driverName: "Emma Rivers",     clientName: "SUMMIT",           date: "02/05/2026", material: "Gravel",        pickup: "Hanson Lake", deliver: "LMC", loads: 4, status: "Active"     },
  { id: 12, driverName: "Liam Carter",     clientName: "ANNA",             date: "02/05/2026", material: "Y Rock",        pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Incomplete" },
  { id: 13, driverName: "Noah Johnson",    clientName: "ALFREDO",          date: "02/05/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 1, status: "Active"     },
  { id: 14, driverName: "Mia Scott",       clientName: "CELINA",           date: "02/05/2026", material: "MAN SAND",      pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Delivered"  },
  { id: 15, driverName: "Ella Parker",     clientName: "LMC-ROSSER",       date: "02/05/2026", material: "Gravel",        pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Cancelled"  },
];

const PAY_PERIODS = ["Weekly", "Bi-Weekly", "Monthly"];
const DRIVERS = [...new Set(INITIAL_DATA.map((r) => r.driverName))];
const SHOW_OPTIONS = [5, 10, 20, 50];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "driverName", label: "Driver's Name" },
  { key: "clientName", label: "Client's Name" },
  { key: "date",       label: "Date"          },
  { key: "material",   label: "Materia"       },
  { key: "pickup",     label: "Pickup"        },
  { key: "deliver",    label: "Deliver"       },
  { key: "loads",      label: "Loads"         },
  { key: "status",     label: "Status"        },
];

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline ml-1 flex-shrink-0">
      <path d="M7 2L4 6H10L7 2Z" fill={dir === "asc" ? "#111827" : "#9CA3AF"} />
      <path d="M7 12L10 8H4L7 12Z" fill={dir === "desc" ? "#111827" : "#9CA3AF"} />
    </svg>
  );
}

type Status = "Active" | "Delivered" | "Incomplete" | "Cancelled";

function ActionsMenu({
  status,
}: {
  loadId: number;
  status: Status;
}) {
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleView = () => {
    if (status === "Delivered" || status === "Incomplete") {
      setShowDeliveredModal(true);
      return;
    }

    if (status === "Cancelled") {
      setShowCancelledModal(true);
      return;
    }
  };

  return (
    <>
      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => handleView()}
          className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#374151] hover:bg-gray-100 border border-[#E8E8E8]"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <TicketApprovalModal
        open={showDeliveredModal}
        onClose={() => setShowDeliveredModal(false)}
      />

      <NotDeliveredModal
        open={showCancelledModal}
        onClose={() => setShowCancelledModal(false)}
      />
    </>
  );
}

function DownloadModal({ onClose }: { onClose: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
        <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex items-center justify-center flex-col relative">
          <X size={20} className="text-[#000] cursor-pointer absolute top-4 right-4" onClick={onClose} />
          <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
            <Check size={50} className="text-white stroke-[4]" />
          </div>
          <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">{successTitle} Downloaded</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-[417px] bg-white rounded-xl border border-[#D9D9D9] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111827]">Download as</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <X size={20} className="text-[#111827]" />
          </button>
        </div>
        <div className="p-8 space-y-4">
          <button
            onClick={() => { setSuccessTitle("PDF"); setShowSuccess(true); }}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="pdf" className="w-8 h-8 object-contain" />
            <span className="text-base font-medium text-[#444444]">Download as PDF</span>
          </button>
          <button
            onClick={() => { setSuccessTitle("Excel"); setShowSuccess(true); }}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/732/732220.png" alt="excel" className="w-8 h-8 object-contain" />
            <span className="text-base font-medium text-[#444444]">Download as Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  function getPages(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }

  const btn = "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors select-none";
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-[#E5E7EB] bg-white ${currentPage === 1 ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btn} ${p === currentPage ? "bg-[#1E2A4A] text-white" : "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white"}`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} border border-[#E5E7EB] bg-white ${currentPage === totalPages ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function ActiveLoadsPage() {
  const [data]                        = useState<LoadRow[]>(INITIAL_DATA);
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey]         = useState<SortKey | null>(null);
  const [sortDir, setSortDir]         = useState<SortDir>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [filterStatuses, setFilterStatuses] = useState<Status[]>([]);

  const [payPeriod, setPayPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [driver, setDriver]       = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ payPeriod: "", startDate: "", endDate: "", driver: "" });

  useEffect(() => { setCurrentPage(1); }, [showEntries, sortKey, sortDir, appliedFilters]);

  const filtered = [...data]
    .filter((r) => {
      if (appliedFilters.driver && r.driverName !== appliedFilters.driver) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * showEntries, safePage * showEntries);

  function handleSort(key: SortKey) {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
  }

  const allSelected  = paginated.length > 0 && paginated.every((r) => selectedRows.includes(r.id));
  const someSelected = paginated.some((r) => selectedRows.includes(r.id)) && !allSelected;

  function toggleAll() {
    if (allSelected) setSelectedRows((p) => p.filter((id) => !paginated.find((r) => r.id === id)));
    else setSelectedRows((p) => [...new Set([...p, ...paginated.map((r) => r.id)])]);
  }
  function toggleRow(id: number) {
    setSelectedRows((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  return (
    <div className="bg-[#F3F4F6]">

      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Active Loads</h1>
          <p className="text-sm text-[#707070] mt-0.5">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
        <button
          onClick={() => setDownloadOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors"
        >
          <Download size={15} /> Download
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 mb-5 grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-end gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Pay Period</label>
          <div className="relative">
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="w-full appearance-none border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none cursor-pointer bg-white pr-8"
            >
              <option value="">Select one</option>
              {PAY_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]" />
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Start date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none bg-white pr-9"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">End date</label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none bg-white pr-9"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* Driver */}
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Driver</label>
          <div className="relative">
            <select
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className="w-full appearance-none border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none cursor-pointer bg-white pr-8"
            >
              <option value="">Select one</option>
              {DRIVERS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]" />
          </div>
        </div>

        <button
          onClick={() => setAppliedFilters({ payPeriod, startDate, endDate, driver })}
          className="px-10 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap h-[42px]"
        >
          Apply
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        {/* Table header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">Active Loads</h2>
          <FilterDropdown selected={filterStatuses} onChange={setFilterStatuses} />
        </div>

        <div className="overflow-x-auto lg:w-[calc(100vw-372px)] w-[calc(100vw-84px)] scroll-hide">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="pl-5 pr-2 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                  />
                </th>
                {COLUMNS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] select-none cursor-pointer whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {label} <SortIcon dir={sortKey === key ? sortDir : null} />
                    </span>
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5">Actions <SortIcon dir={null} /></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-[#9CA3AF]">No records found.</td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-gray-50/60 ${selectedRows.includes(row.id) ? "bg-gray-50" : ""}`}
                  >
                    <td className="pl-5 pr-2 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.driverName}</td>
                    <td className="px-3 py-3.5 font-semibold text-[#1F2020] whitespace-nowrap">{row.clientName}</td>
                    <td className="px-3 py-3.5 text-[#6B7280] whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.material}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.pickup}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.deliver}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.loads}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <ActionsMenu   loadId={row.id}
  status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-sm text-[#1D3461]">
            <span>Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
              className="border border-[#E5E7EB] rounded-md px-2 py-1 text-sm text-[#111827] outline-none cursor-pointer"
            >
              {SHOW_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>Entries</span>
          </div>
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {downloadOpen && <DownloadModal onClose={() => setDownloadOpen(false)} />}
    </div>
  );
}