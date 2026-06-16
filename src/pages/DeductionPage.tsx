"use client";

import {
  Calendar,
  ChevronDown,
  Download,
  FileCheck,
  Filter,
  Notebook,
  ReceiptText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type DeductionType = "Loan" | "Insurance" | "Fuel Card" | "GPS/Dashcam";
type Status = "Pending" | "Schedule";
interface DeductionRow {
  id: number;
  driver: string;
  deductionType: DeductionType;
  totalAmount: number;
  applied: number;
  remaining: number;
  settlementDate: string;
  status: Status;
}

type SortKey = keyof Omit<DeductionRow, "id">;
type SortDir = "asc" | "desc" | null;

const INITIAL_DATA: DeductionRow[] = [
  {
    id: 1,
    driver: "Henry Tom",
    deductionType: "Loan",
    totalAmount: 3000,
    applied: 200,
    remaining: 2800,
    settlementDate: "20/02/2025",
    status: "Pending",
  },
  {
    id: 2,
    driver: "John Abraham",
    deductionType: "Insurance",
    totalAmount: 3450,
    applied: 100,
    remaining: 3350,
    settlementDate: "16/03/2025",
    status: "Schedule",
  },
  {
    id: 3,
    driver: "Peter Parker",
    deductionType: "Fuel Card",
    totalAmount: 2500,
    applied: 300,
    remaining: 2200,
    settlementDate: "20/03/2025",
    status: "Pending",
  },
  {
    id: 4,
    driver: "Peter Parker",
    deductionType: "Loan",
    totalAmount: 3250,
    applied: 150,
    remaining: 3100,
    settlementDate: "30/03/2025",
    status: "Schedule",
  },
  {
    id: 5,
    driver: "Jacob Robert",
    deductionType: "Insurance",
    totalAmount: 1800,
    applied: 200,
    remaining: 1600,
    settlementDate: "17/02/2025",
    status: "Pending",
  },
  {
    id: 6,
    driver: "Jacob Robert",
    deductionType: "Fuel Card",
    totalAmount: 1500,
    applied: 100,
    remaining: 1400,
    settlementDate: "19/05/2025",
    status: "Schedule",
  },
  {
    id: 7,
    driver: "Jacob Robert",
    deductionType: "Fuel Card",
    totalAmount: 1350,
    applied: 200,
    remaining: 1150,
    settlementDate: "16/05/2025",
    status: "Pending",
  },
  {
    id: 8,
    driver: "David Beckham",
    deductionType: "Loan",
    totalAmount: 1600,
    applied: 150,
    remaining: 1550,
    settlementDate: "16/04/2025",
    status: "Schedule",
  },
  {
    id: 9,
    driver: "David Beckham",
    deductionType: "Fuel Card",
    totalAmount: 3000,
    applied: 200,
    remaining: 2800,
    settlementDate: "15/03/2025",
    status: "Schedule",
  },
  {
    id: 10,
    driver: "Andrew Frank",
    deductionType: "Insurance",
    totalAmount: 1770,
    applied: 100,
    remaining: 1670,
    settlementDate: "19/05/2025",
    status: "Schedule",
  },
  {
    id: 11,
    driver: "Emma Rivers",
    deductionType: "Loan",
    totalAmount: 2100,
    applied: 250,
    remaining: 1850,
    settlementDate: "10/06/2025",
    status: "Pending",
  },
  {
    id: 12,
    driver: "Liam Carter",
    deductionType: "Insurance",
    totalAmount: 4200,
    applied: 300,
    remaining: 3900,
    settlementDate: "22/06/2025",
    status: "Schedule",
  },
  {
    id: 13,
    driver: "Noah Johnson",
    deductionType: "Fuel Card",
    totalAmount: 980,
    applied: 80,
    remaining: 900,
    settlementDate: "05/07/2025",
    status: "Pending",
  },
  {
    id: 14,
    driver: "Mia Scott",
    deductionType: "Loan",
    totalAmount: 5500,
    applied: 500,
    remaining: 5000,
    settlementDate: "11/07/2025",
    status: "Schedule",
  },
  {
    id: 15,
    driver: "Ella Parker",
    deductionType: "Insurance",
    totalAmount: 2250,
    applied: 125,
    remaining: 2125,
    settlementDate: "28/07/2025",
    status: "Pending",
  },
];

const SHOW_OPTIONS = [5, 10, 20, 50];
const DEDUCTION_TYPES: DeductionType[] = [
  "Loan",
  "Insurance",
  "GPS/Dashcam",
  "Fuel Card",
];

const DEDUCTION_TYPE_COLORS: Record<DeductionType, string> = {
  Loan: "text-[#1D3461]",
  Insurance: "text-[#8B5CF6]",
  "GPS/Dashcam": "text-[#2BB7DC]",
  "Fuel Card": "text-[#F59E0B]",
};

const STATUS_STYLES: Record<Status, string> = {
  Pending: "bg-[#1D3461] text-white",
  Schedule: "bg-[#22C55E] text-white",
};

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="flex-1 bg-white rounded-lg border border-[#E5E7EB] px-4 py-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-[#B9D1FF73] border border-[#1D3461] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[#6B7280] leading-tight">{label}</p>
          <span className="text-xs font-medium text-[#F59E0B] whitespace-nowrap flex items-center gap-0.5">
            ↗ {trend}
          </span>
        </div>
        <p className="text-[18px] font-bold text-[#111827] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="inline ml-1 flex-shrink-0"
    >
      <path d="M7 2L4 6H10L7 2Z" fill={dir === "asc" ? "#111827" : "#9CA3AF"} />
      <path
        d="M7 12L10 8H4L7 12Z"
        fill={dir === "desc" ? "#111827" : "#9CA3AF"}
      />
    </svg>
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
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  }

  const pages = getPages();
  const btn =
    "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors select-none";

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-[#E5E7EB] bg-white ${currentPage === 1 ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btn} ${p === currentPage ? "bg-[#1E2A4A] text-white" : "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white"}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} border border-[#E5E7EB] bg-white ${currentPage === totalPages ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "driver", label: "Driver" },
  { key: "deductionType", label: "Deduction Type" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "applied", label: "Applied" },
  { key: "remaining", label: "Remaining" },
  { key: "settlementDate", label: "Settlement Date" },
  { key: "status", label: "Status" },
];

const SORT_OPTIONS = [
  "Date (Earliest)",
  "Date (Latest)",
  "Amount (Highest First)",
  "Amount (Lowest First)",
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

type Props = {
  selected?: SortOption;
  onChange: (value: SortOption) => void;
};

function SortDropdown({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-10 px-4 bg-white border border-[#E5E7EB] rounded-lg min-w-max flex items-center gap-2 text-[#1D3461]"
      >
        <Filter size={16} />
        <span className="text-sm">{selected || "Sort By"}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full w-[180px] bg-white rounded-lg border border-[#E5E7EB] shadow-[0px_4px_15px_0px_#0000001C] py-2 z-50">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[14px] transition-colors text-[#1D3461] hover:bg-gray-200`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeductionPage() {
  const [data] = useState<DeductionRow[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [sortBy, setSortBy] = useState<SortOption>();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [deductionType, setDeductionType] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState<"start" | "end" | null>(
    null,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showEntries, deductionType, dateRange]);

  const filtered = data
    .filter((r) => {
      const matchSearch =
        search.trim() === "" ||
        r.driver.toLowerCase().includes(search.toLowerCase());
      const matchType =
        deductionType === "" || r.deductionType === deductionType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * showEntries,
    safePage * showEntries,
  );

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const allSelected =
    paginated.length > 0 && paginated.every((r) => selectedRows.includes(r.id));
  const someSelected =
    paginated.some((r) => selectedRows.includes(r.id)) && !allSelected;

  function toggleAll() {
    if (allSelected)
      setSelectedRows((p) =>
        p.filter((id) => !paginated.find((r) => r.id === id)),
      );
    else
      setSelectedRows((p) => [
        ...new Set([...p, ...paginated.map((r) => r.id)]),
      ]);
  }
  function toggleRow(id: number) {
    setSelectedRows((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  }

  const totalActiveDeductions = data.length;
  const totalRemainingBalance = data.reduce((s, r) => s + r.remaining, 0);
  const appliedThisWeek = data.reduce((s, r) => s + r.applied, 0);
  const scheduledNextWeek = data
    .filter((r) => r.status === "Schedule")
    .reduce((s, r) => s + r.applied, 0);

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-[#111827]">Deduction</h1>
          <p className="text-base text-[#707070] mt-0.5">
            Lorem Ipsum is simply dummy text.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDownloadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#111827] border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Download
          </button>
          <button className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors text-[#6B7280]">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {downloadOpen && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="w-[417px] bg-white rounded-lg border border-[#D9D9D9] overflow-hidden">
            <div className="px-10 py-7 border-b border-[#E5E5E5] flex justify-between items-center">
              <h2 className="text-[20px] font-semibold text-[#111827]">
                Download as
              </h2>
              <X
                size={20}
                className="text-[#111827] cursor-pointer"
                onClick={() => {
                  setDownloadOpen(false);
                }}
              />
            </div>

            <div className="p-10 space-y-6">
              <button
                onClick={() => {
                  console.log("Download PDF");
                  setDownloadOpen(false);
                }}
                className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="pdf"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-[16px] font-medium text-[#444444]">
                  Download as PDF
                </span>
              </button>

              <button
                onClick={() => {
                  console.log("Download Excel");
                  setDownloadOpen(false);
                }}
                className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="excel"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-[16px] font-medium text-[#444444]">
                  Download as Excel
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mb-5">
        <StatCard
          label="Total Active Deductions"
          value={String(totalActiveDeductions)}
          trend="+19.01%"
          icon={<ReceiptText size={15} className="text-[#1D3461]" />}
        />
        <StatCard
          label="Total Remaining Balance"
          value={fmt(totalRemainingBalance)}
          trend="+19.01%"
          icon={<Notebook size={15} className="text-[#1D3461]" />}
        />
        <StatCard
          label="Applied this week"
          value={fmt(appliedThisWeek)}
          trend="+19.01%"
          icon={<FileCheck size={15} className="text-[#1D3461]" />}
        />
        <StatCard
          label="Scheduled Next week"
          value={fmt(scheduledNextWeek)}
          trend="+19.01%"
          icon={<Calendar size={15} className="text-[#1D3461]" />}
        />
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] px-5 py-4 mb-5 xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 grid items-end gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Deduction type</label>
          <div className="relative">
            <select
              value={deductionType}
              onChange={(e) => setDeductionType(e.target.value)}
              className="w-full appearance-none border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#111827] outline-none cursor-pointer bg-white pr-8"
            >
              <option value="">Select one</option>
              {DEDUCTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 5l4 4 4-4"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Start date</label>
          <button
            onClick={() => setDatePickerOpen("start")}
            className="flex items-center justify-between w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm bg-white text-left"
          >
            <span
              className={dateRange?.from ? "text-[#111827]" : "text-[#9CA3AF]"}
            >
              {dateRange?.from
                ? format(dateRange.from, "MM/dd/yyyy")
                : "mm/dd/yyyy"}
            </span>
            <Calendar className="text-[#6B7280]" size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">End date</label>
          <button
            onClick={() => setDatePickerOpen("end")}
            className="flex items-center justify-between w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm bg-white text-left"
          >
            <span
              className={dateRange?.to ? "text-[#111827]" : "text-[#9CA3AF]"}
            >
              {dateRange?.to
                ? format(dateRange.to, "MM/dd/yyyy")
                : "mm/dd/yyyy"}
            </span>
            <Calendar className="text-[#6B7280]" size={14} />
          </button>
        </div>

        <button className="px-8 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap">
          Search
        </button>
      </div>

      {datePickerOpen && (
        <DateRangeModal
          open={!!datePickerOpen}
          onClose={() => setDatePickerOpen(null)}
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            setDatePickerOpen(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-4 border-b border-[#E5E7EB]">
          <div className="relative w-64">
            <Search
              size={16}
              className="text-[#1D3461] absolute left-3 top-[11px]"
            />
            <input
              type="text"
              placeholder="Search Driver"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg outline-none text-[#1D3461] placeholder-[#9CA3AF]"
            />
          </div>
          <SortDropdown selected={sortBy} onChange={setSortBy} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="pl-5 pr-3 py-3 w-10">
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
                    className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] select-none cursor-pointer whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      <SortIcon dir={sortKey === key ? sortDir : null} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-[#9CA3AF]"
                  >
                    No records match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-gray-50/60 ${selectedRows.includes(row.id) ? "bg-gray-50" : ""}`}
                  >
                    <td className="pl-5 pr-3 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] font-medium whitespace-nowrap">
                      {row.driver}
                    </td>
                    <td
                      className={`px-3 py-3.5 font-medium whitespace-nowrap ${DEDUCTION_TYPE_COLORS[row.deductionType]}`}
                    >
                      {row.deductionType}
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">
                      $
                      {row.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">
                      $
                      {row.applied.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-3.5 text-[#1F2020] whitespace-nowrap">
                      $
                      {row.remaining.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-3.5 text-[#6B7280] whitespace-nowrap">
                      {row.settlementDate}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between md:px-5 px-2 py-4 border-t border-[#E5E7EB]">
          <div className="flex items-center sm:gap-2 gap-1 text-sm text-[#1D3461]">
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
