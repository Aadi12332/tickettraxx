"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  RefreshCw,
  Truck,
  Filter,
  ChevronDown,
  Plus,
  Search,
  X,
  Check,
  MoreVertical,
  Eye,
  Edit,
  Smile,
} from "lucide-react";


interface TruckRow {
  id: number;
  truckId: string;
  assignedTo: string;
  jobs: number;
  load: number;
  lastInspection: string;
  active: boolean;
}

type SortKey = keyof TruckRow;
type SortDir = "asc" | "desc" | null;

type SortOption =
  | "Truck ID (A-Z)"
  | "Truck ID (Z-A)"
  | "Name (A-Z)"
  | "Name (Z-A)"
  | "Jobs (Most First)"
  | "Jobs (Least First)";

const SORT_OPTIONS: SortOption[] = [
  "Truck ID (A-Z)",
  "Truck ID (Z-A)",
  "Name (A-Z)",
  "Name (Z-A)",
  "Jobs (Most First)",
  "Jobs (Least First)",
];


const INITIAL_TRUCKS: TruckRow[] = [
  { id: 1,  truckId: "TX4578", assignedTo: "Joseph Martin",  jobs: 10, load: 220, lastInspection: "10/07/2025", active: true  },
  { id: 2,  truckId: "TX5682", assignedTo: "James Mathew",   jobs: 8,  load: 200, lastInspection: "14/07/2025", active: true  },
  { id: 3,  truckId: "TX6820", assignedTo: "Alex Robert",    jobs: 5,  load: 180, lastInspection: "18/07/2025", active: false },
  { id: 4,  truckId: "TX5973", assignedTo: "Richard Henry",  jobs: 9,  load: 170, lastInspection: "20/07/2025", active: true  },
  { id: 5,  truckId: "TX6891", assignedTo: "Mike Kim",       jobs: 12, load: 190, lastInspection: "22/07/2025", active: false },
  { id: 6,  truckId: "TX5791", assignedTo: "Charles Wright", jobs: 15, load: 210, lastInspection: "25/07/2025", active: true  },
  { id: 7,  truckId: "TX4579", assignedTo: "James Harry",    jobs: 10, load: 230, lastInspection: "27/07/2025", active: true  },
  { id: 8,  truckId: "TX9836", assignedTo: "Joe Tim",        jobs: 6,  load: 220, lastInspection: "28/07/2025", active: true  },
  { id: 9,  truckId: "TX5762", assignedTo: "Michael George", jobs: 9,  load: 240, lastInspection: "30/07/2025", active: false },
  { id: 10, truckId: "TX1122", assignedTo: "Maria Chen",     jobs: 7,  load: 195, lastInspection: "02/08/2025", active: true  },
  { id: 11, truckId: "TX3344", assignedTo: "Tom Baker",      jobs: 4,  load: 150, lastInspection: "05/08/2025", active: false },
  { id: 12, truckId: "TX5566", assignedTo: "Sarah Lee",      jobs: 14, load: 260, lastInspection: "08/08/2025", active: true  },
];

const SHOW_OPTIONS = [5, 10, 20, 50];


interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendColor?: string;
}

function StatCard({ label, value, trend, trendColor = "#F97316" }: StatCardProps) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] px-4 py-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-[#B9D1FF73] border border-[#1D3461] flex items-center justify-center flex-shrink-0">
        <Truck size={16} className="text-[#1D3461]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-[#6B7280] leading-tight truncate">{label}</p>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: trendColor }}>
            ↗ {trend}
          </span>
        </div>
        <p className="text-[18px] font-bold text-[#111827] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline ml-1 flex-shrink-0">
      <path d="M7 2L4 6H10L7 2Z" fill={dir === "asc" ? "#111827" : "#9CA3AF"} />
      <path d="M7 12L10 8H4L7 12Z" fill={dir === "desc" ? "#111827" : "#9CA3AF"} />
    </svg>
  );
}


function SortDropdown({
  selected,
  onChange,
}: {
  selected?: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-9 px-4 bg-white border border-[#E5E7EB] rounded-lg flex items-center gap-2 text-sm text-[#1D3461]"
      >
        <Filter size={14} />
        {selected ?? "Sort By"}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1 z-50">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                selected === opt ? "text-[#1D3461] font-medium" : "text-[#374151]"
              }`}
            >
              {opt}
              {selected === opt && <Check size={14} className="text-[#1D3461]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function ActionsMenu({ rowId }: { rowId: number }) {
  const [open, setOpen] = useState(false);
  const [successType, setSuccessType] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { label: "View Details",   Icon: Eye,      onClick: () => { console.log("View", rowId); setOpen(false); } },
    { label: "Edit Truck",     Icon: Edit,     onClick: () => { console.log("Edit", rowId); setOpen(false); } },
    { label: "Download PDF",   Icon: Download, onClick: () => { setSuccessType("PDF");   setOpen(false); } },
    { label: "Download Excel", Icon: Download, onClick: () => { setSuccessType("Excel"); setOpen(false); } },
  ];

  return (
    <>
      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#374151] hover:bg-gray-100 border border-[#E8E8E8] transition-colors"
        >
          <Smile size={16} />
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-[180px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            {actions.map(({ label, Icon, onClick }, idx) => (
              <button
                key={label}
                onClick={onClick}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#374151] transition-colors hover:bg-gray-50 ${
                  idx !== actions.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <Icon size={16} className="text-[#3157B7]" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {successType && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex flex-col items-center relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setSuccessType(null)}
            >
              <X size={20} className="text-[#000]" />
            </button>
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={32} className="text-white stroke-[3]" />
            </div>
            <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">
              {successType} Downloaded
            </h2>
          </div>
        </div>
      )}
    </>
  );
}


function DownloadModal({ onClose }: { onClose: () => void }) {
  const [successType, setSuccessType] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (successType) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
        <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex flex-col items-center relative">
          <button className="absolute top-4 right-4" onClick={onClose}>
            <X size={20} className="text-[#000]" />
          </button>
          <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
            <Check size={32} className="text-white stroke-[3]" />
          </div>
          <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">
            {successType} Downloaded
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-[417px] bg-white rounded-xl border border-[#D9D9D9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111827]">Download as</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <X size={20} className="text-[#111827]" />
          </button>
        </div>
        <div className="p-8 space-y-4">
          <button
            onClick={() => setSuccessType("PDF")}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
              alt="pdf"
              className="w-8 h-8 object-contain"
            />
            <span className="text-base font-medium text-[#444444]">Download as PDF</span>
          </button>
          <button
            onClick={() => setSuccessType("Excel")}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
              alt="excel"
              className="w-8 h-8 object-contain"
            />
            <span className="text-base font-medium text-[#444444]">Download as Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}


interface AddTruckModalProps {
  onClose: () => void;
  onAdd: (truck: Omit<TruckRow, "id">) => void;
}

function AddTruckModal({ onClose, onAdd }: AddTruckModalProps) {
  const [form, setForm] = useState({
    truckId: "",
    assignedTo: "",
    jobs: "",
    load: "",
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit() {
    if (!form.truckId.trim() || !form.assignedTo.trim()) return;
    onAdd({
      truckId: form.truckId.trim(),
      assignedTo: form.assignedTo.trim(),
      jobs: parseInt(form.jobs) || 0,
      load: parseInt(form.load) || 0,
      lastInspection: new Date().toLocaleDateString("en-GB").replace(/\//g, "/"),
      active: true,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-[417px] bg-white rounded-xl border border-[#D9D9D9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111827]">Add Truck</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <X size={20} className="text-[#111827]" />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#6B7280] block mb-1.5">Truck ID</label>
            <input
              type="text"
              placeholder="e.g. TX9900"
              value={form.truckId}
              onChange={(e) => setForm((p) => ({ ...p, truckId: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B7280] block mb-1.5">Assigned To</label>
            <input
              type="text"
              placeholder="Driver name"
              value={form.assignedTo}
              onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1.5">Jobs</label>
              <input
                type="number"
                placeholder="0"
                value={form.jobs}
                onChange={(e) => setForm((p) => ({ ...p, jobs: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1.5">Load (Tons)</label>
              <input
                type="number"
                placeholder="0"
                value={form.load}
                onChange={(e) => setForm((p) => ({ ...p, load: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none placeholder-[#9CA3AF]"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-1 w-full py-2.5 bg-[#1D3461] text-white text-sm font-semibold rounded-lg hover:bg-[#16213a] transition-colors"
          >
            Add Truck
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

  const btn =
    "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors select-none";

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-[#E5E7EB] bg-white ${
          currentPage === 1 ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btn} ${
              p === currentPage
                ? "bg-[#1E2A4A] text-white"
                : "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} border border-[#E5E7EB] bg-white ${
          currentPage === totalPages ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}


const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "truckId",        label: "Truck ID"         },
  { key: "assignedTo",     label: "Assigned To"      },
  { key: "jobs",           label: "Jobs"             },
  { key: "load",           label: "Load This Month"  },
  { key: "lastInspection", label: "Last Inspection"  },
];


export default function TruckDetailsPage() {
  const [trucks, setTrucks]             = useState<TruckRow[]>(INITIAL_TRUCKS);
  const [search, setSearch]             = useState("");
  const [showEntries, setShowEntries]   = useState(10);
  const [currentPage, setCurrentPage]   = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey]           = useState<SortKey | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>(null);
  const [sortBy, setSortBy]             = useState<SortOption | undefined>(undefined);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [addOpen, setAddOpen]           = useState(false);
  const [bulkOpen, setBulkOpen]         = useState(false);
  const bulkRef                         = useRef<HTMLDivElement>(null);

  // Reset to page 1 on filter/sort change
  useEffect(() => { setCurrentPage(1); }, [search, showEntries, sortBy]);

  // Close bulk dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bulkRef.current && !bulkRef.current.contains(e.target as Node)) setBulkOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function applySortOption(opt: SortOption) {
    setSortBy(opt);
    const map: Record<SortOption, { key: SortKey; dir: SortDir }> = {
      "Truck ID (A-Z)":      { key: "truckId",    dir: "asc"  },
      "Truck ID (Z-A)":      { key: "truckId",    dir: "desc" },
      "Name (A-Z)":          { key: "assignedTo", dir: "asc"  },
      "Name (Z-A)":          { key: "assignedTo", dir: "desc" },
      "Jobs (Most First)":   { key: "jobs",       dir: "desc" },
      "Jobs (Least First)":  { key: "jobs",       dir: "asc"  },
    };
    setSortKey(map[opt].key);
    setSortDir(map[opt].dir);
  }

  function handleSort(key: SortKey) {
    setSortBy(undefined);
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
  }

  const filtered = [...trucks]
    .filter((t) =>
      t.truckId.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * showEntries, safePage * showEntries);

  const total    = trucks.length;
  const active   = trucks.filter((t) => t.active).length;
  const inactive = trucks.filter((t) => !t.active).length;

  function updateTruckStatus(id: number, value: boolean) {
    setTrucks((prev) => prev.map((t) => (t.id === id ? { ...t, active: value } : t)));
  }

  function addTruck(data: Omit<TruckRow, "id">) {
    const newId = Math.max(...trucks.map((t) => t.id)) + 1;
    setTrucks((prev) => [...prev, { id: newId, ...data }]);
  }

  const allSelected  = paginated.length > 0 && paginated.every((r) => selectedRows.includes(r.id));
  const someSelected = paginated.some((r) => selectedRows.includes(r.id)) && !allSelected;

  function toggleAll() {
    if (allSelected)
      setSelectedRows((prev) => prev.filter((id) => !paginated.find((r) => r.id === id)));
    else
      setSelectedRows((prev) => [...new Set([...prev, ...paginated.map((r) => r.id)])]);
  }

  function toggleRow(id: number) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }


  return (
    <div className="bg-[#F3F4F6]">

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Truck Details</h1>
          <p className="text-sm text-[#707070] mt-0.5">Manage your fleet of trucks and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors"
          >
            <Plus size={15} /> Add Truck
          </button>
          <button
            onClick={() => setDownloadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#111827] border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Download size={15} /> Download
          </button>
          <button className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors text-[#6B7280]">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <StatCard label="Total Trucks"    value={total}    trend="+19.01%" trendColor="#F97316" />
        <StatCard label="Active Trucks"   value={active}   trend="+19.01%" trendColor="#F97316" />
        <StatCard label="Inactive Trucks" value={inactive} trend="+19.01%" trendColor="#F97316" />
        <StatCard label="Assigned Aliases" value={20}      trend="+19.01%" trendColor="#3B82F6" />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">Truck list</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search Truck"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] outline-none w-56"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg">
              <input
                type="checkbox"
                id="selectall"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
              />
              <label htmlFor="selectall" className="text-sm text-[#374151] cursor-pointer">
                Select All
              </label>
            </div>

            <div ref={bulkRef} className="relative">
              <button
                onClick={() => setBulkOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E5E7EB] text-[#1D3461] rounded-lg bg-white hover:bg-gray-50"
              >
                <Filter size={13} /> Bulk Actions <ChevronDown size={13} />
              </button>
              {bulkOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1 z-50">
                  {["Activate Selected", "Deactivate Selected", "Delete Selected"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setBulkOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-gray-50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <SortDropdown selected={sortBy} onChange={applySortOption} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F9FAFB]">
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
                      {label}
                      <SortIcon dir={sortKey === key ? sortDir : null} />
                    </span>
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                  Details
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#9CA3AF]">
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
                    <td className="pl-5 pr-2 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-[#1F2020] whitespace-nowrap">
                      {row.truckId}
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.assignedTo}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {String(row.jobs).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.load} Tons</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.lastInspection}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <Toggle
                          enabled={row.active}
                          onChange={(v) => updateTruckStatus(row.id, v)}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            row.active ? "text-[#22C55E]" : "text-[#6B7280]"
                          }`}
                        >
                          {row.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <ActionsMenu rowId={row.id} />
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
              onChange={(e) => { setShowEntries(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-[#E5E7EB] rounded-md px-2 py-1 text-sm text-[#111827] outline-none cursor-pointer"
            >
              {SHOW_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
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

      {downloadOpen && <DownloadModal onClose={() => setDownloadOpen(false)} />}
      {addOpen      && <AddTruckModal onClose={() => setAddOpen(false)} onAdd={addTruck} />}
    </div>
  );
}