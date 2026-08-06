"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  FolderOpen,
  Eye,
  CalendarDays,
  MessageSquare,
  MicOff,
  Mic,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { hasInvalidOrExpiredTokenError } from "../utils/api";
interface TicketRow {
  id: number;
  ticketNo: string;
  date: string;
  aliasUnit: string;
  driver: string;
  pickup: string;
  dropoff: string;
  material: string;
  tonage: number;
  rate: string;
  fsc: string;
  gross: string;
  ticketStatus: "Approved" | "Pending" | "Rejected";
  invoiceStatus: "Approved" | "Pending" | "Rejected";
  settlementStatus: "Approved" | "Pending" | "Rejected";
}

type Tab = "Tickets" | "Statement";
type SortDir = "asc" | "desc" | null;

interface ContractorInfo {
  isSelfContractor?: boolean;
  ownerDriverId?: string | null;
  _id?: string;
  companyName?: string;
  contractorCode?: string;
  phone?: string;
  email?: string;
}

interface DriverDetail {
  access?: {
    app?: boolean;
    fsc?: boolean;
    earning?: boolean;
  };
  paymentType?: string;
  _id: string;
  name?: string;
  userId?: string | null;
  contractorId?: ContractorInfo | null;
  type?: string;
  dob?: string | null;
  payPercent?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  address?: string;
  email?: string;
}

const TICKET_ROWS: TicketRow[] = [
  {
    id: 1,
    ticketNo: "#653783",
    date: "06/01/2026",
    aliasUnit: "0952",
    driver: "Terry Bothman",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Fine Sand",
    tonage: 27.69,
    rate: "$304.59",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 2,
    ticketNo: "#682497",
    date: "15/01/2026",
    aliasUnit: "0650",
    driver: "Emery Workman",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Crushed Granite",
    tonage: 28.32,
    rate: "$311.52",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Pending",
    invoiceStatus: "Pending",
    settlementStatus: "Pending",
  },
  {
    id: 3,
    ticketNo: "#598246",
    date: "25/01/2026",
    aliasUnit: "0658",
    driver: "Roger Dokidis",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "River Pebbles",
    tonage: 27.45,
    rate: "$301.95",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 4,
    ticketNo: "#546892",
    date: "02/02/2026",
    aliasUnit: "0485",
    driver: "Mira Dorwart",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Limestone",
    tonage: 26.43,
    rate: "$290.73",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 5,
    ticketNo: "#598246",
    date: "04/02/2026",
    aliasUnit: "0125",
    driver: "James Bergson",
    pickup: "Hanson Lake",
    dropoff: "Hanson BP",
    material: "Basalt Chips",
    tonage: 25.51,
    rate: "$186.50",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 6,
    ticketNo: "#516498",
    date: "08/02/2026",
    aliasUnit: "0478",
    driver: "Hanna Mango",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Slate Shingles",
    tonage: 26.59,
    rate: "$220.30",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 7,
    ticketNo: "#112546",
    date: "20/02/2026",
    aliasUnit: "0178",
    driver: "Erin Carder",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Coarse Sand",
    tonage: 20.5,
    rate: "$165.50",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 8,
    ticketNo: "#112546",
    date: "20/02/2026",
    aliasUnit: "0597",
    driver: "Jordyn Korsgaard",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Concrete",
    tonage: 20.5,
    rate: "$165.50",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 9,
    ticketNo: "#112546",
    date: "21/02/2026",
    aliasUnit: "0312",
    driver: "Alex Mercer",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Gravel Mix",
    tonage: 22.1,
    rate: "$188.00",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
  {
    id: 10,
    ticketNo: "#112546",
    date: "21/02/2026",
    aliasUnit: "0417",
    driver: "Nina Ross",
    pickup: "Hanson Lake",
    dropoff: "LMC",
    material: "Sand Mix",
    tonage: 19.8,
    rate: "$162.30",
    fsc: "5.00%",
    gross: "5.00%",
    ticketStatus: "Approved",
    invoiceStatus: "Approved",
    settlementStatus: "Approved",
  },
];

function StatusBadge({ status }: { status: TicketRow["ticketStatus"] }) {
  const styles: Record<string, string> = {
    Approved: "bg-[#22C55E] text-white",
    Pending: "bg-[#D4A017] text-white",
    Rejected: "bg-[#EF4444] text-white",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[12px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const SHOW_OPTIONS = [5, 10, 20, 50];

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
    "w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors select-none";
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-[#E5E7EB] bg-white ${currentPage === 1 ? "text-[#D1D5DB] cursor-not-allowed" : "text-[#374151] hover:bg-gray-50"}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 11L5 7l4-4"
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
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] text-sm"
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M5 3l4 4-4 4"
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

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp
        size={10}
        className={dir === "asc" ? "text-[#111827]" : "text-[#9CA3AF]"}
      />
      <ChevronDown
        size={10}
        className={dir === "desc" ? "text-[#111827]" : "text-[#9CA3AF]"}
      />
    </span>
  );
}

function TicketsTab() {
  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<keyof TicketRow | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const filtered = [...TICKET_ROWS]
    .filter(
      (r) =>
        r.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
        r.driver.toLowerCase().includes(search.toLowerCase()) ||
        r.material.toLowerCase().includes(search.toLowerCase()),
    )
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

  function handleSort(key: keyof TicketRow) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  const cols: { key: keyof TicketRow; label: string }[] = [
    { key: "ticketNo", label: "Ticket No." },
    { key: "date", label: "Date" },
    { key: "aliasUnit", label: "Alias/Unit" },
    { key: "driver", label: "Driver" },
    { key: "pickup", label: "Pickup" },
    { key: "dropoff", label: "Drop-off" },
    { key: "material", label: "Material" },
    { key: "tonage", label: "Tonage" },
    { key: "rate", label: "Rate" },
    { key: "fsc", label: "FSC" },
    { key: "gross", label: "Gross" },
    { key: "ticketStatus", label: "Ticket Status" },
    { key: "invoiceStatus", label: "Invoice Status" },
    { key: "settlementStatus", label: "Settlement Status" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Tickets</h3>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Total Tickets: {filtered.length}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />
            <input
              type="text"
              placeholder="Search ticket"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] outline-none w-48"
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
        </div>
      </div>

      <DateRangeModal
        open={openDateModal}
        onClose={() => setOpenDateModal(false)}
        value={range}
        onChange={setRange}
      />

      {/* Sort By */}
      <div className="flex justify-end mb-3">
        <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] bg-white hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 4h10M4 7h6M6 10h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Sort By
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] lg:w-[calc(100vw-372px)] w-[calc(100vw-84px)]">
        <table className="w-full text-[13px] ">
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
              {cols.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-3 py-3 text-left text-[12px] font-semibold text-[#374151] whitespace-nowrap cursor-pointer select-none"
                >
                  <span className="inline-flex items-center">
                    {label} <SortIcon dir={sortKey === key ? sortDir : null} />
                  </span>
                </th>
              ))}
              <th className="px-3 py-3 text-left text-[12px] font-semibold text-[#374151] whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-10 text-center text-[#9CA3AF]"
                >
                  No tickets found.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50/60 transition-colors ${selectedRows.includes(row.id) ? "bg-gray-50" : ""}`}
                >
                  <td className="pl-4 pr-2 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1E2A4A] cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-[#1D3461] whitespace-nowrap">
                    {row.ticketNo}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.aliasUnit}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.driver}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.pickup}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.dropoff}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.material}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.tonage}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.rate}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.fsc}
                  </td>
                  <td className="px-3 py-3.5 text-[#374151] whitespace-nowrap">
                    {row.gross}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={row.ticketStatus} />
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={row.invoiceStatus} />
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={row.settlementStatus} />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
                        <Eye size={16} className="text-[#6B7280]" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center border border-[#E5E7EB] justify-center">
                        <Check size={16} className="text-[#6B7280]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Show</span>
          <select
            value={showEntries}
            onChange={(e) => {
              setShowEntries(Number(e.target.value));
              setCurrentPage(1);
            }}
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
  );
}

function StatementTab() {
  const [fromDate, setFromDate] = useState("01/12/2024");
  const [toDate, setToDate] = useState("30/12/2024");
  const [showStatementModal, setShowStatementModal] = useState(false);

  return (
    <div>
      <div className="overflow-hidden">
        <div className="pb-3 border-b border-[#E5E7EB]">
          <h3 className="text-base font-bold text-[#111827]">
            Settlement Statement
          </h3>
        </div>
        <div className="py-6">
          <p className="text-sm font-semibold text-[#374151] mb-4">
            Filter here
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">From</span>
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] outline-none w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">To</span>
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] outline-none w-36"
              />
            </div>
            <button
              onClick={() => setShowStatementModal(true)}
              className="ml-auto px-5 py-2 bg-[#1D3461] text-white text-sm font-semibold rounded-lg hover:bg-[#16213a] transition-colors"
            >
              Generate Statement
            </button>
          </div>
        </div>
      </div>
      {showStatementModal && (
        <div className="text-[#111827] w-full overflow-hidden mt-5">
          <div className=" flex items-center justify-between">
            <h2 className="text-base font-bold text-[#333] mb-4">
              Hudson Freight LLC - Settlement Statement- 01/12/2024-30/12/2024
            </h2>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4">
            <div className="overflow-hidden">
              <div className="flex-1 bg-white border border-[#D9D9D9] rounded-lg text-[13px] overflow-hidden">
                <div className="overflow-auto scroll-hide lg:w-[calc(100vw-672px)] max-w-[calc(100vw-84px)]">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-[#1D3461] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Pickup</th>
                        <th className="px-4 py-2 text-left">Deliver</th>
                        <th className="px-4 py-2 text-left">Ticket No.</th>
                        <th className="px-4 py-2 text-left">Rate</th>
                        <th className="px-4 py-2 text-left">Tonnage</th>
                        <th className="px-4 py-2 text-left">Concrete Rate%</th>
                        <th className="px-4 py-2 text-left">Driver Pay</th>
                        <th className="px-4 py-2 text-left">Gross Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[1, 2, 3, 4].map((item) => (
                        <tr key={item} className="border-b last:border-b-0">
                          <td className="px-4 py-2">16/02/2025</td>
                          <td className="px-4 py-2 font-medium">
                            Ashlynn Press
                          </td>
                          <td className="px-4 py-2">Hanson Lake</td>
                          <td className="px-4 py-2">LMC- Coppell</td>
                          <td className="px-4 py-2">1234534</td>
                          <td className="px-4 py-2">$11.50</td>
                          <td className="px-4 py-2">7</td>
                          <td className="px-4 py-2">90%</td>
                          <td className="px-4 py-2">$27.00</td>
                          <td className="px-4 py-2">$100.00</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-3 border border-[#D9D9D9] rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b">
                  <h3 className="text-base font-bold text-[#333]">
                    Payment Breakdown
                  </h3>
                </div>

                <div className="px-4 py-3 flex justify-between border-b">
                  <span className="font-semibold text-sm">
                    Contactor Total (Sum of Driver Pay)
                  </span>
                  <span className="font-bold text-sm">$108.00</span>
                </div>

                <div className="px-4 py-3 flex justify-between border-b">
                  <span className="font-semibold text-sm">
                    Total Fuel deductions
                  </span>
                  <span className="font-bold text-sm">$0.00</span>
                </div>

                <div className="m-4 bg-[#DDE9DB] rounded-lg px-5 py-3 flex justify-between">
                  <span className="text-[#4D8A4F] font-semibold text-base">
                    Total Payment to Driver
                  </span>
                  <span className="text-[#4D8A4F] font-semibold text-base">
                    $135.30
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-[280px] min-w-[280px] bg-white border border-[#D9D9D9] rounded-lg py-4 px-3">
              <h3 className="text-base font-bold text-[#333] leading-none mb-6">
                Statement Summary
              </h3>

              <div className="space-y-3 !text-[13px]">
                <div className="flex justify-between border-b pb-4">
                  <span>Total Gross Tickets</span>
                  <span className="font-bold">$400.00</span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span>Total to ConcreteRedi (90%)</span>
                  <span className="font-bold">$360.00</span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span>Total to driver (30%)</span>
                  <span className="font-bold">$180.00</span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span>Total Fuel Deductions</span>
                  <span className="font-bold">$00.00</span>
                </div>

                <div className="bg-[#DDE9DB] rounded-lg px-4 py-3 text-xs flex justify-between">
                  <span className="font-semibold text-[#4D8A4F]">
                    Total Payment to Driver
                  </span>
                  <span className="font-bold text-[#4D8A4F]">$135.00</span>
                </div>

                <div className="pt-3 text-[13px]">
                  <span className="font-bold">Note:</span> Driver % is
                  calculated on the amount after ConcreteRedi (or Tickettraxx
                  User) share is deducted from Gross Ticket.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DriverDetailPage() {
  const { token, logout } = useAuth();
  const { driverId } = useParams<{ driverId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Tickets");
  const [isActive, setIsActive] = useState(true);
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [openCallModal, setOpenCallModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formValues, setFormValues] = useState({
    phone: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  const fetchDriver = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://65.1.152.16/api/drivers/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // signal: controller.signal,
        },
      );

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        data?: DriverDetail;
      } | null;

      if (response.ok && payload?.data) {
        setDriver(payload.data);
        setFormValues({
          phone: payload.data.phone ?? "",
          email: payload.data.email ?? "",
          address: payload.data.address ?? "",
        });
        setIsActive(payload.data.status !== "inactive");
      } else {
        setError("Unable to load driver details.");
      }
    } catch (fetchError) {
      if (
        !(
          fetchError instanceof DOMException && fetchError.name === "AbortError"
        )
      ) {
        setError("Unable to load driver details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [driverId, token]);

  const handleDriverStatus = async () => {
    if (!token || !driverId) return;

    setProcessing(true);

    try {
      const endpoint = isActive
        ? `https://65.1.152.16/api/drivers/${driverId}/deactivate`
        : `https://65.1.152.16/api/drivers/${driverId}/reactivate`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update status");
      }

      setOpenDeactivateModal(false);

      await fetchDriver();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveDriverDetails = async () => {
    if (!token || !driverId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://65.1.152.16/api/drivers/${driverId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone: formValues.phone,
            address: formValues.address,
            email: formValues.email,
          }),
        },
      );

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to save driver details.");
      }

      if (driver) {
        setDriver({
          ...driver,
          phone: formValues.phone,
          address: formValues.address,
          email: formValues.email,
        });
      }
      setEditMode(false);
    } catch {
      setError("Unable to save driver details.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async () => {
    if (!token || !driverId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://65.1.152.16/api/drivers/${driverId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to delete driver.");
      }

      navigate("/dashboard/drivers");
    } catch {
      setError("Unable to delete driver.");
    } finally {
      setLoading(false);
    }
  };

    const handleSendMail = () => {
    const subject = encodeURIComponent(`Hello ${driverName}`);
    const body = encodeURIComponent(`Hi,`);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${driver?.email ?? ""}&su=${subject}&body=${body}`,
      "_blank",
    );
  };

  const driverName = driver?.name ?? "Driver Name";
  const contractorLabel = driver?.contractorId?.companyName ?? "New Jersey";

  if (loading && !driver) {
    return (
      <div className="p-6 text-sm text-[#374151]">
        Loading driver details...
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-6 text-sm text-[#EF4444]">
        {error ?? "Unable to load driver details."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#F3F4F6] rounded-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-[#111827]">
              Driver Details
            </h1>
            <p className="text-sm text-[#6B7280]">{contractorLabel}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-6 py-5 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#E5E7EB] flex-shrink-0 border-4 border-[#F3F4F6] shadow">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    driverName,
                  )}&background=1D3461&color=fff&size=128`}
                  alt={driverName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#1D3461]">
                    {driverName}
                  </h2>
                  <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white stroke-[3]" />
                  </span>
                </div>
                <p className="text-sm text-[#374151] mt-2">{contractorLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setOpenCallModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1D3461] text-white text-sm font-semibold rounded-lg hover:bg-[#16213a] transition-colors">
                <Phone size={14} /> Call
              </button>
              <button onClick={handleSendMail} className="flex items-center gap-2 px-5 py-2.5 bg-[#1D3461] text-white text-sm font-semibold rounded-lg hover:bg-[#16213a] transition-colors">
                <MessageSquare size={14} /> Message
              </button>
               <div className="relative">
              <button
                onClick={() => setOpenDeactivateModal(true)}
                className={`flex justify-center items-center gap-2 ${
                  isActive ? "bg-[#C76363] hover:bg-[#a04e4e]" : "bg-[#03C95A]"
                } text-white text-sm font-medium h-9 sm:h-10 px-2 xl:w-[186px] rounded-[5px] transition-colors whitespace-nowrap cursor-pointer`}
              >
                {isActive ? "Deactivate Account" : "Activate Account"}
              </button>

              {openDeactivateModal && (
                <div className="absolute top-[calc(100%+12px)] right-0 md:w-[400px] w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50">
                  <h3 className="text-[15px] font-semibold text-center text-black mb-2">
                    Are you sure want to {isActive ? "deactivate" : "activate"}{" "}
                    the account
                  </h3>
                  <p className="text-[11px] text-center text-black leading-relaxed mb-4">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s
                  </p>
                  <div className="flex gap-3">
                    <button
                           disabled={processing}
                          onClick={handleDriverStatus}
                      className="flex-1 bg-[#03C95A] hover:bg-[#008f35] text-white py-2 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {processing ? "Please wait..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setOpenDeactivateModal(false)}
                      className="flex-1 bg-[#E30000] hover:bg-[#c20000] text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-2 right-[90px] w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
                </div>
              )}
            </div>
            </div>
          </div>

          <div className="pr-6 pl-44 -mt-12 py-6 bg-[#D9D9D9] border-t border-[#E5E7EB] flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <CreditCard size={16} className="text-[#1D3461]" />
              <span className="font-medium text-[#1D3461]">Driver ID :</span>
              <span>{driver._id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Calendar size={16} className="text-[#1D3461]" />
              <span className="font-medium text-[#1D3461]">Added on :</span>
              <span>
                {driver.createdAt
                  ? format(new Date(driver.createdAt), "dd MMM yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-3">
          <h3 className="text-base font-bold text-[#111827]">
            Basic Information
          </h3>
          {editMode ? (
            <>
              <button
                onClick={saveDriverDetails}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#1D3461] text-white text-sm font-semibold hover:bg-[#16213a] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormValues({
                    phone: driver.phone ?? "",
                    email: driver.email ?? "",
                    address: driver.address ?? "",
                  });
                }}
                className="px-4 py-2 rounded-lg bg-[#F3F4F6] text-[#374151] text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors text-[#6B7280]"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={deleteDriver}
                disabled={loading}
                className="p-1 rounded-md hover:bg-red-50 transition-colors text-[#EF4444]"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
        <div className="px-6 py-5 grid sm:grid-cols-2 gap-y-4 gap-x-12">
          <div className="flex items-start gap-3">
            <Phone size={15} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Phone</p>
              {editMode ? (
                <input
                  value={formValues.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full h-11 border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] outline-none"
                />
              ) : (
                <p className="text-sm text-[#111827] font-medium">
                  {driver.phone ?? "—"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={15} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Address</p>
              {editMode ? (
                <input
                  value={formValues.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full h-11 border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] outline-none"
                />
              ) : (
                <p className="text-sm text-[#111827] font-medium">
                  {driver.address ?? "—"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={15} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Email</p>
              {editMode ? (
                <input
                  value={formValues.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full h-11 border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] outline-none"
                />
              ) : (
                <p className="text-sm text-[#1D3461] font-medium">
                  {driver.email ?? "—"}
                </p>
              )}
            </div>
          </div>
        </div>
        {error && (
          <div className="px-6 py-4 text-sm text-[#EF4444]">{error}</div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden mb-5">
        <div className="flex border-b border-[#E5E7EB]">
          {(["Tickets", "Statement"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
            >
              {tab === "Tickets" ? (
                <FolderOpen size={14} />
              ) : (
                <Calendar size={14} />
              )}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "Tickets" ? <TicketsTab /> : <StatementTab />}
        </div>

           {openCallModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setOpenCallModal(false)}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="w-full max-w-[600px] rounded-xl bg-[#162341] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5">
                <h2 className="text-[#87C8E8] text-[20px] font-semibold">
                  TICKET<span className="text-[#fff]">TRAXX</span>
                </h2>

                <button
                  className="cursor-pointer"
                  onClick={() => setOpenCallModal(false)}
                >
                  <X size={28} className="text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col items-center pt-10 pb-5 px-5">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    driverName,
                  )}&background=1D3461&color=fff&size=128`}
                  alt={driverName}
                  className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
                />

                <h2 className="mt-5 text-white text-[24px] font-bold">
                  {driverName}
                </h2>

                <p className="text-white text-[16px] mt-2">{driver.phone ?? "—"}</p>

                <p className="text-white text-[16px] mt-2">Voice Call</p>

                {/* Mute */}
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="mt-10 w-[48px] h-[48px] cursor-pointer rounded-full bg-[#455271] flex items-center justify-center"
                >
                  {isMuted ? (
                    <MicOff size={22} color="white" />
                  ) : (
                    <Mic size={22} color="white" />
                  )}
                </button>

                {/* End Call */}
                <button
                  onClick={() => setOpenCallModal(false)}
                  className="mt-10 w-full h-[54px] cursor-pointer rounded-full bg-[#FF140A] flex items-center justify-center hover:bg-red-700 transition"
                >
                  <Phone size={24} color="white" className="rotate-[135deg]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
