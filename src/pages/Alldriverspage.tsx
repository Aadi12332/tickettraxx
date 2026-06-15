"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  RefreshCw,
  Users,
  Filter,
  ChevronDown,
  Plus,
  Search,
  Eye,
  EyeOff,
  MoreVertical,
  X,
  Check,
  Truck,
  CircleDollarSignIcon,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssignTruckModal from "./AssignTruckModal";
import ChangePayModal from "./ChangePayModal";

interface Driver {
  id: number;
  name: string;
  truckId: string;
  payPercent: number;
  tickets: number;
  appAccess: boolean;
  fscAccess: boolean;
  earningAccess: boolean;
  status: "Active" | "Inactive";
}

type SortKey = keyof Driver;
type SortDir = "asc" | "desc" | null;

const SORT_OPTIONS = [
  "Name (A-Z)",
  "Name (Z-A)",
  "Pay % (Highest First)",
  "Pay % (Lowest First)",
  "Tickets (Highest First)",
  "Tickets (Lowest First)",
] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const INITIAL_DRIVERS: Driver[] = [
  { id: 1,  name: "Joseph Martin",  truckId: "TX4582", payPercent: 90, tickets: 20, appAccess: true,  fscAccess: true,  earningAccess: false, status: "Active" },
  { id: 2,  name: "David Hudson",   truckId: "TX4583", payPercent: 65, tickets: 12, appAccess: true,  fscAccess: true,  earningAccess: false, status: "Active" },
  { id: 3,  name: "Steve John",     truckId: "TX4584", payPercent: 80, tickets: 20, appAccess: true,  fscAccess: true,  earningAccess: true,  status: "Active" },
  { id: 4,  name: "James harry",    truckId: "TX4528", payPercent: 88, tickets: 25, appAccess: true,  fscAccess: true,  earningAccess: true,  status: "Active" },
  { id: 5,  name: "Alex Raymond",   truckId: "TX4235", payPercent: 90, tickets: 20, appAccess: true,  fscAccess: true,  earningAccess: false, status: "Active" },
  { id: 6,  name: "Johnny mathew",  truckId: "TX3356", payPercent: 50, tickets: 12, appAccess: true,  fscAccess: true,  earningAccess: false, status: "Active" },
  { id: 7,  name: "Kim Henry",      truckId: "TX9875", payPercent: 78, tickets: 17, appAccess: true,  fscAccess: true,  earningAccess: false, status: "Active" },
  { id: 8,  name: "Charles Wright", truckId: "TX2457", payPercent: 88, tickets: 17, appAccess: true,  fscAccess: true,  earningAccess: true,  status: "Active" },
  { id: 9,  name: "Richard James",  truckId: "TX4593", payPercent: 67, tickets: 25, appAccess: true,  fscAccess: true,  earningAccess: true,  status: "Active" },
  { id: 10, name: "Maria Chen",     truckId: "TX1122", payPercent: 72, tickets: 18, appAccess: false, fscAccess: true,  earningAccess: false, status: "Inactive" },
  { id: 11, name: "Tom Baker",      truckId: "TX3344", payPercent: 55, tickets: 8,  appAccess: true,  fscAccess: false, earningAccess: false, status: "Inactive" },
  { id: 12, name: "Sarah Lee",      truckId: "TX5566", payPercent: 91, tickets: 30, appAccess: true,  fscAccess: true,  earningAccess: true,  status: "Active" },
];

const SHOW_OPTIONS = [5, 10, 20, 50];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name",       label: "Driver"  },
  { key: "truckId",    label: "Truck ID"},
  { key: "payPercent", label: "Pay %"   },
  { key: "tickets",    label: "Tickets" },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendColor?: string;
}
function StatCard({ icon, label, value, trend, trendColor = "#F97316" }: StatCardProps) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] px-4 py-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-[#B9D1FF73] border border-[#1D3461] flex items-center justify-center flex-shrink-0">
        {icon}
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

function EarningAccessBadge({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
        enabled
          ? "bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]"
          : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
      }`}
    >
      {enabled ? <Eye size={12} /> : <EyeOff size={12} />}
      {enabled ? "Enabled" : "Disabled"}
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

function SortDropdown({ selected, onChange }: { selected?: SortOption; onChange: (v: SortOption) => void }) {
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

function BulkActionsDropdown({ selectedCount }: { selectedCount: number }) {
  const [open, setOpen] = useState(false);
  const [bulkOption, setBulkOption] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const actions = [
    { label: "Change Pay%", onClick: () => { setBulkOption("Change Pay%"); setOpen(false); } },
    { label: "Disable App Login", onClick: () => { setBulkOption("Disable App Login"); setOpen(false); } },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={selectedCount === 0}
        className={`px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg flex items-center gap-2 transition-colors ${
          selectedCount === 0
            ? "text-[#9CA3AF] cursor-not-allowed opacity-50"
            : "text-[#1D3461] hover:bg-gray-50"
        }`}
      >
        <Filter size={13} /> {bulkOption ? bulkOption : "Bulk Actions"}  <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1 z-50">
          {actions.map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-gray-50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionsMenu({ rowId }: { rowId: number }) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [assignTruck, setAssignTruck] = useState(false);
  const [changePay, setChangePay] = useState(false);
  const [payPercentage, setPayPercentage] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const navigate = useNavigate();
  console.log(rowId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const actions: { label: string; icon: React.ElementType; onClick: () => void }[] = [
    { label: "View Profile",    icon: Eye,          onClick: () => { navigate("/dashboard/drivers/details"); setOpen(false); } },
    { label: "Assign Truck",     icon: Truck,          onClick: () => { setAssignTruck(true); setOpen(false); } },
    { label: "Change Pay%",    icon: CircleDollarSignIcon, onClick: () => { setChangePay(true); setOpen(false); } },
    { label: "Disable App Login",  icon: Ban, onClick: () => { setSuccessTitle("App Login Disabled"); setOpen(false); setShowSuccess(true); } },
  ];

  return (
    <>
      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#374151] hover:bg-gray-100 border border-[#E8E8E8] transition-colors"
        >
          <MoreVertical size={16} />
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-20 py-1 overflow-hidden">
            {actions.map(({ label, icon: Icon, onClick }, index) => (
              <button
                key={label}
                onClick={onClick}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#374151] transition-colors hover:bg-gray-50 ${
                  index !== actions.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <Icon size={18} className="text-[#3157B7]" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AssignTruckModal
  open={assignTruck}
  onClose={() => setAssignTruck(false)}
  onAssign={() => {
    console.log("assigned");
    setAssignTruck(false);
  }}
/>

<ChangePayModal
  open={changePay}
  onClose={() => setChangePay(false)}
  value={payPercentage}
  onChange={setPayPercentage}
  onSave={() => {
    console.log(payPercentage);
    setChangePay(false);
  }}
/>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex items-center justify-center flex-col relative">
            <X
              size={20}
              className="text-[#000] cursor-pointer absolute top-4 right-4"
              onClick={() => setShowSuccess(false)}
            />
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={50} className="text-white stroke-[4]" />
            </div>
            <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">
              {successTitle}
            </h2>
          </div>
        </div>
      )}
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
          <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">
            {successTitle} Downloaded
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
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

export default function AllDriversPage() {
  const [drivers, setDrivers]         = useState<Driver[]>(INITIAL_DRIVERS);
  const [search, setSearch]           = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey]         = useState<SortKey | null>(null);
  const [sortDir, setSortDir]         = useState<SortDir>(null);
  const [sortBy, setSortBy]           = useState<SortOption | undefined>(undefined);
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => { setCurrentPage(1); }, [search, showEntries, sortBy]);

  function applySortOption(opt: SortOption) {
    setSortBy(opt);
    if (opt === "Name (A-Z)")               { setSortKey("name");       setSortDir("asc");  }
    else if (opt === "Name (Z-A)")          { setSortKey("name");       setSortDir("desc"); }
    else if (opt === "Pay % (Highest First)"){ setSortKey("payPercent"); setSortDir("desc"); }
    else if (opt === "Pay % (Lowest First)"){ setSortKey("payPercent"); setSortDir("asc");  }
    else if (opt === "Tickets (Highest First)"){ setSortKey("tickets"); setSortDir("desc"); }
    else if (opt === "Tickets (Lowest First)") { setSortKey("tickets"); setSortDir("asc");  }
  }

  const filtered = [...drivers]
    .filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.truckId.toLowerCase().includes(search.toLowerCase())
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
  const navigate = useNavigate();
  const total    = drivers.length;
  const active   = drivers.filter((d) => d.status === "Active").length;
  const inactive = drivers.filter((d) => d.status === "Inactive").length;

  function handleSort(key: SortKey) {
    setSortBy(undefined);
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
  }

  function updateDriver(id: number, field: keyof Driver, value: boolean) {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  const allSelected  = paginated.length > 0 && paginated.every((r) => selectedRows.includes(r.id));
  const someSelected = paginated.some((r) => selectedRows.includes(r.id)) && !allSelected;

  function toggleAll() {
    if (allSelected) setSelectedRows((prev) => prev.filter((id) => !paginated.find((r) => r.id === id)));
    else setSelectedRows((prev) => [...new Set([...prev, ...paginated.map((r) => r.id)])]);
  }
  function toggleRow(id: number) {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div className="bg-[#F3F4F6]">

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">All Drivers</h1>
          <p className="text-sm text-[#707070] mt-0.5">Manage your drivers</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/dashboard/drivers/add-driver")} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors">
            <Plus size={15} /> Add Driver
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
        <StatCard icon={<Users size={15} className="text-[#1D3461]" />} label="Total Drivers"    value={String(total)}    trend="+19.01%" trendColor="#F97316" />
        <StatCard icon={<Users size={15} className="text-[#1D3461]" />} label="Active Drivers"   value={String(active)}   trend="+19.01%" trendColor="#F97316" />
        <StatCard icon={<Users size={15} className="text-[#1D3461]" />} label="Inactive Drivers" value={String(inactive)} trend="+19.01%" trendColor="#F97316" />
        <StatCard icon={<Users size={15} className="text-[#1D3461]" />} label="New Drivers"      value="30"               trend="+19.01%" trendColor="#3B82F6" />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827]">Drivers list</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search Driver"
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
              <label htmlFor="selectall" className="text-sm text-[#374151] cursor-pointer">Select All</label>
            </div>
            <BulkActionsDropdown selectedCount={selectedRows.length} />
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
                      {label} <SortIcon dir={sortKey === key ? sortDir : null} />
                    </span>
                  </th>
                ))}
                {(["App Access", "FSC Access", "Earning Access", "Status", "Actions"] as const).map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-[#9CA3AF]">
                    No records match your search.
                  </td>
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
                    <td className="px-3 py-3.5 font-semibold text-[#1F2020] whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.truckId}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.payPercent}</td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">{row.tickets}</td>
                    <td className="px-3 py-3.5">
                      <Toggle enabled={row.appAccess} onChange={(v) => updateDriver(row.id, "appAccess", v)} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Toggle enabled={row.fscAccess} onChange={(v) => updateDriver(row.id, "fscAccess", v)} />
                    </td>
                    <td className="px-3 py-3.5">
                      <EarningAccessBadge enabled={row.earningAccess} onChange={(v) => updateDriver(row.id, "earningAccess", v)} />
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                          row.status === "Active" ? "bg-[#1E8449] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                        }`}
                      >
                        {row.status}
                      </span>
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