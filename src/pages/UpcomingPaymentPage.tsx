"use client";

import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
  Users,
  FileText,
  Eye,
  Ticket,
  AlertCircle,
  X,
  MoreVertical,
  DownloadIcon,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import StatementDetailsModal from "./StatementDetailsModal";
import ViewTicketsModal from "./ViewTicketsModal";

interface StatementRow {
  id: number;
  statementId: string;
  driverName: string;
  date: string;
  tickets: number;
  truckId: number;
  gross: number;
  payPercent: number;
  fsc: number;
  netPay: number;
  status: string;
}

type SortKey = keyof Omit<StatementRow, "id">;
type SortDir = "asc" | "desc" | null;

const INITIAL_DATA: StatementRow[] = [
  {
    id: 1,
    statementId: "ST-3423",
    driverName: "Marley Levin",
    date: "02/04/2026 - 03/05/2026",
    tickets: 3,
    truckId: 453,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 2,
    statementId: "ST-3423",
    driverName: "Lydia Culhane",
    date: "02/04/2026 - 03/05/2026",
    tickets: 4,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 3,
    statementId: "ST-3423",
    driverName: "Zaire Stanton",
    date: "02/04/2026 - 03/05/2026",
    tickets: 4,
    truckId: 453,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 4,
    statementId: "ST-3423",
    driverName: "Wilson Ekstrom",
    date: "02/04/2026 - 03/05/2026",
    tickets: 5,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 5,
    statementId: "ST-3423",
    driverName: "Jaydon Geidt",
    date: "02/04/2026 - 03/05/2026",
    tickets: 5,
    truckId: 453,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 6,
    statementId: "ST-3423",
    driverName: "Ruben Ekstrom",
    date: "02/04/2026 - 03/05/2026",
    tickets: 7,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 7,
    statementId: "ST-3423",
    driverName: "Hanna Korsgaard",
    date: "02/04/2026 - 03/05/2026",
    tickets: 7,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 8,
    statementId: "ST-3423",
    driverName: "Angel Philips",
    date: "02/04/2026 - 03/05/2026",
    tickets: 9,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 9,
    statementId: "ST-3423",
    driverName: "Jordyn Bator",
    date: "02/04/2026 - 03/05/2026",
    tickets: 4,
    truckId: 453,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 10,
    statementId: "ST-3423",
    driverName: "Giana Rosser",
    date: "02/04/2026 - 03/05/2026",
    tickets: 5,
    truckId: 987,
    gross: 1500,
    payPercent: 10,
    fsc: 150,
    netPay: 1650,
    status: "Upcoming",
  },
  {
    id: 11,
    statementId: "ST-3423",
    driverName: "Emma Rivers",
    date: "02/04/2026 - 03/05/2026",
    tickets: 3,
    truckId: 453,
    gross: 1800,
    payPercent: 10,
    fsc: 180,
    netPay: 1980,
    status: "Upcoming",
  },
  {
    id: 12,
    statementId: "ST-3423",
    driverName: "Liam Carter",
    date: "02/04/2026 - 03/05/2026",
    tickets: 6,
    truckId: 987,
    gross: 2100,
    payPercent: 10,
    fsc: 210,
    netPay: 2310,
    status: "Upcoming",
  },
  {
    id: 13,
    statementId: "ST-3423",
    driverName: "Noah Johnson",
    date: "02/04/2026 - 03/05/2026",
    tickets: 2,
    truckId: 453,
    gross: 1200,
    payPercent: 10,
    fsc: 120,
    netPay: 1320,
    status: "Upcoming",
  },
  {
    id: 14,
    statementId: "ST-3423",
    driverName: "Mia Scott",
    date: "02/04/2026 - 03/05/2026",
    tickets: 8,
    truckId: 987,
    gross: 2400,
    payPercent: 10,
    fsc: 240,
    netPay: 2640,
    status: "Upcoming",
  },
  {
    id: 15,
    statementId: "ST-3423",
    driverName: "Ella Parker",
    date: "02/04/2026 - 03/05/2026",
    tickets: 4,
    truckId: 453,
    gross: 1600,
    payPercent: 10,
    fsc: 160,
    netPay: 1760,
    status: "Upcoming",
  },
];

const SHOW_OPTIONS = [5, 10, 20, 50];

const SORT_OPTIONS = [
  "Date (Earliest)",
  "Date (Latest)",
  "Amount (Highest First)",
  "Amount (Lowest First)",
] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const DRIVERS = [...new Set(INITIAL_DATA.map((r) => r.driverName))];
const PAY_PERIODS = ["Weekly", "Bi-Weekly", "Monthly"];

function StatCard({
  icon,
  label,
  value,
  trend,
  trendColor = "#F97316",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendColor?: string;
}) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] px-4 py-4 flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-[#B9D1FF73] border border-[#1D3461] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-[#6B7280] leading-tight truncate">
            {label}
          </p>
          <span
            className="text-xs font-medium whitespace-nowrap flex items-center gap-0.5"
            style={{ color: trendColor }}
          >
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

export function SortDropdown({
  selected,
  onChange,
}: {
  selected?: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
        {selected || "Sort By"}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1 z-50">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#1D3461] hover:bg-gray-50 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
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
      {getPages().map((p, i) =>
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

function ActionsMenu({ rowId }: { rowId: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [viewTicketsModal, setViewTicketsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessTitle, setShowSuccessTitle] = useState("");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleDownloadPdf = () => {
    setShowSuccessTitle("PDF");
    setShowSuccessModal(true);
  };

  const handleDownloadExcel = () => {
    setShowSuccessTitle("Excel");
    setShowSuccessModal(true);
  };

  const actions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (id: string) => {
        setSelectedRow(id);
        setViewDetailsModal(true);
      },
    },
    {
      label: "View Tickets",
      icon: Ticket,
      onClick: (id: string) => {
        setSelectedRow(id);
        setViewTicketsModal(true);
      },
    },
    {
      label: "Download PDF",
      icon: DownloadIcon,
      onClick: () => handleDownloadPdf(),
    },
    {
      label: "Download Excel",
      icon: DownloadIcon,
      onClick: () => handleDownloadExcel(),
    },
  ];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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
          <div className="absolute right-0 mt-1 w-[180px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            {actions.map(({ label, icon: Icon, onClick }, index) => (
              <button
                key={label}
                onClick={() => {
                  onClick(rowId as any);
                  setOpen(false);
                }}
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
      <StatementDetailsModal
        open={viewDetailsModal}
        onClose={() => setViewDetailsModal(false)}
        statementId={selectedRow}
      />
      <ViewTicketsModal
        open={viewTicketsModal}
        onClose={() => setViewTicketsModal(false)}
        statementId={selectedRow}
      />
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-14 flex items-center justify-center flex-col relative">
            <X
              size={20}
              className="text-[#000] cursor-pointer absolute top-4 right-4"
              onClick={() => setShowSuccessModal(false)}
            />
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={50} className="text-white stroke-[4]" />
            </div>

            <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
              {showSuccessTitle} Downloaded
            </h2>
          </div>
        </div>
      )}
    </>
  );
}

function DownloadModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

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
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-[#111827]" />
          </button>
        </div>
        <div className="p-8 space-y-4">
          <button
            onClick={() => {
              console.log("Download PDF");
              onClose();
            }}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
              alt="pdf"
              className="w-8 h-8 object-contain"
            />
            <span className="text-base font-medium text-[#444444]">
              Download as PDF
            </span>
          </button>
          <button
            onClick={() => {
              console.log("Download Excel");
              onClose();
            }}
            className="w-full h-[80px] rounded-lg border border-[#D9D9D9] flex items-center justify-center gap-5 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
              alt="excel"
              className="w-8 h-8 object-contain"
            />
            <span className="text-base font-medium text-[#444444]">
              Download as Excel
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "driverName", label: "Driver's Name" },
  { key: "tickets", label: "Tickets" },
  { key: "truckId", label: "Truck ID" },
  { key: "gross", label: "Gross" },
  { key: "payPercent", label: "Pay %" },
  { key: "fsc", label: "FSC" },
  { key: "netPay", label: "Net Pay" },
  { key: "date", label: "Settlement Week" },
  { key: "status", label: "Status" },
];

export default function UpcomingPaymentPage() {
  const [data] = useState<StatementRow[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [sortBy, setSortBy] = useState<SortOption>();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [payPeriod, setPayPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [driver, setDriver] = useState("");

  console.log(setSearch);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showEntries]);

  const filtered = data
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey],
        bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
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

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Upcoming Payment</h1>
          <p className="text-sm text-[#707070] mt-0.5">
            Upcoming tickets of the driver
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

      <div className="flex gap-4 mb-5">
        <StatCard
          icon={<Users size={15} className="text-[#1D3461]" />}
          label="Expected this Friday"
          value={"$12,480"}
          trend="+19.01%"
          trendColor="#F97316"
        />
        <StatCard
          icon={<FileText size={15} className="text-[#1D3461]" />}
          label="Drivers Included"
          value={"245,870"}
          trend="+19.01%"
          trendColor="#F97316"
        />
        <StatCard
          icon={<Calendar size={15} className="text-[#1D3461]" />}
          label="Trucks Included"
          value={"58"}
          trend="+19.01%"
          trendColor="#3B82F6"
        />
        <StatCard
          icon={<AlertCircle size={15} className="text-[#1D3461]" />}
          label="Tickets Counted"
          value={"142"}
          trend="+19.01%"
          trendColor="#3B82F6"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 mb-5 flex items-end gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Pay Period</label>
          <div className="relative">
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="w-full appearance-none border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none cursor-pointer bg-white pr-8"
            >
              <option value="">Select one</option>
              {PAY_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]"
            />
          </div>
        </div>

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
            <Calendar
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
          </div>
        </div>

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
            <Calendar
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-[#6B7280]">Driver</label>
          <div className="relative">
            <select
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className="w-full appearance-none border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none cursor-pointer bg-white pr-8"
            >
              <option value="">Select one</option>
              {DRIVERS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]"
            />
          </div>
        </div>

        <button className="px-10 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap h-[42px]">
          Apply
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                id="selectall"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
              />
              <label
                htmlFor="selectall"
                className="text-sm text-[#374151] cursor-pointer"
              >
                Select All
              </label>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E5E7EB] text-[#1D3461] rounded-lg transition-colors">
              <Filter size={13} />
              Bulk Actions
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SortDropdown selected={sortBy} onChange={setSortBy} />
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
                    className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer relative top-[2px]"
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
                  Actions <SortIcon dir={null} />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
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
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer relative top-[2px]"
                      />
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.driverName}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.tickets}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.truckId}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      ${row.gross.toLocaleString()}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      {row.payPercent}%
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      ${row.fsc.toLocaleString()}
                    </td>
                    <td className="px-2 py-3.5 text-[#1F2020] whitespace-nowrap">
                      ${row.netPay.toLocaleString()}
                    </td>
                    <td className="px-2 py-3.5 text-[#6B7280] whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-2 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-[#E2B93B]`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">
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

      {downloadOpen && <DownloadModal onClose={() => setDownloadOpen(false)} />}
    </div>
  );
}
