"use client";

import { Filter, GripHorizontal, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TicketApprovalModal } from "./TicketApprovalModal";
import { NotDeliveredModal } from "./NotDeliveredModal";


type Status = "Active" | "Delivered" | "Incomplete" | "Cancelled";

interface Load {
  id: number;
  driverName: string;
  clientName: string;
  date: string;
  material: string;
  pickup: string;
  deliver: string;
  loads: number;
  status: Status;
}

type SortKey = keyof Omit<Load, "id">;
type SortDir = "asc" | "desc" | null;


const INITIAL_DATA: Load[] = [
  { id: 1, driverName: "Marley Levin",   clientName: "CELINA",             date: "02/04/2026", material: "Y Rock",        pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Active"     },
  { id: 2, driverName: "Lydia Culhane",  clientName: "RESOLVE Ravenna #1", date: "02/04/2026", material: "MAN SAND",      pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Delivered"  },
  { id: 3, driverName: "Zaire Stanton",  clientName: "LMC-ROSSER",         date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Active"     },
  { id: 4, driverName: "Wilson Bothman", clientName: "ANNA",               date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Incomplete" },
  { id: 5, driverName: "Jaydon Geidt",   clientName: "LYDIA",              date: "02/04/2026", material: "Gravel",        pickup: "Hanson Lake", deliver: "LMC", loads: 1, status: "Active"     },
  { id: 6, driverName: "Jordyn Bator",   clientName: "LMC-ROSSER",         date: "02/04/2026", material: "Concrete Sand", pickup: "Hanson Lake", deliver: "LMC", loads: 2, status: "Delivered"  },
  { id: 7, driverName: "Giana Rosser",   clientName: "CELINA",             date: "02/04/2026", material: "MAN SAND",      pickup: "Hanson Lake", deliver: "LMC", loads: 3, status: "Cancelled"  },
];

const ALL_STATUSES: Status[] = ["Active", "Delivered", "Incomplete", "Cancelled"];


const STATUS_STYLES: Record<Status, string> = {
  Active:     "bg-[#34C759] text-white",
  Delivered:  "bg-[#007C34] text-white",
  Incomplete: "bg-[#F26522] text-white",
  Cancelled:  "bg-[#E70D0D] text-white",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}


function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline ml-1 flex-shrink-0">
      <path d="M7 2L4 6H10L7 2Z"  fill={dir === "asc"  ? "#111827" : "#9CA3AF"} />
      <path d="M7 12L10 8H4L7 12Z" fill={dir === "desc" ? "#111827" : "#9CA3AF"} />
    </svg>
  );
}


function FilterDropdown({
  selected,
  onChange,
}: {
  selected: Status[];
  onChange: (s: Status[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(status: Status) {
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  }

  const label =
    selected.length === 0 || selected.length === ALL_STATUSES.length
      ? "Filter By"
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#374151] border border-[#C8C8C8] rounded-lg bg-white"
      >
        <Filter size={14} />
        {label}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M3 5l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-20 py-1 overflow-hidden">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => toggle(status)}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                selected.includes(status)
                  ? "bg-gray-50 text-[#111827] font-medium"
                  : "text-[#374151] hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected.includes(status)
                    ? "bg-[#111827] border-[#111827]"
                    : "border-[#D1D5DB]"
                }`}
              >
                {selected.includes(status) && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function ActionsMenu({
  loadId,
  status,
}: {
  loadId: number;
  status: Status;
}) {
//   const [open, setOpen] = useState(false);
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


const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "driverName", label: "Driver's Name" },
  { key: "clientName", label: "Client's Name" },
  { key: "date",       label: "Date" },
  { key: "material",   label: "Material" },
  { key: "pickup",     label: "Pickup" },
  { key: "deliver",    label: "Deliver" },
  { key: "loads",      label: "Loads",  className: "text-center" },
  { key: "status",     label: "Status" },
];


export default function ActiveLoadsTable() {
  const [data] = useState<Load[]>(INITIAL_DATA);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<Status[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const navigate = useNavigate();

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortKey(null);
      setSortDir(null);
    }
  }

  function getSortDir(key: SortKey): SortDir {
    return sortKey === key ? sortDir : null;
  }

  const processed = [...data]
    .filter((row) =>
      filterStatuses.length === 0 ? true : filterStatuses.includes(row.status)
    )
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const allSelected = processed.length > 0 && processed.every((r) => selectedRows.includes(r.id));
  const someSelected = processed.some((r) => selectedRows.includes(r.id)) && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !processed.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...processed.map((r) => r.id)])]);
    }
  }

  function toggleRow(id: number) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }


  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden px-6">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-base font-semibold text-[#111827]">Active Loads</h2>
        <div className="flex items-center gap-3">
          <FilterDropdown selected={filterStatuses} onChange={setFilterStatuses} />
          <button onClick={()=>navigate("/dashboard/drivers")} className="px-4 py-2 text-sm font-medium text-[#111827] border border-[#C8C8C8] rounded-lg bg-white hover:bg-gray-50 transition-colors">
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[200px] scroll-hide">
        <table className="w-full text-[13px] min-w-[900px]">
          <thead className="bg-[#F7F8F9]">
            <tr className="border-b border-[#E8E8E8]">
              <th className="pl-3 pr-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-[#D1D5DB] accent-[#111827] cursor-pointer"
                />
              </th>

              {COLUMNS.map(({ key, label, className }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] select-none cursor-pointer whitespace-nowrap group ${className ?? ""}`}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {label}
                    <SortIcon dir={getSortDir(key)} />
                  </span>
                </th>
              ))}

              <th className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E7EB]">
            {processed.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-6 py-12 text-center text-[#9CA3AF]">
                  No loads match the current filter.
                </td>
              </tr>
            ) : (
              processed.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-gray-50/60 ${
                    selectedRows.includes(row.id) ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="pl-3 pr-3 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1F2020] cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3.5 text-[#1F2020] font-medium whitespace-nowrap">{row.driverName}</td>
                  <td className="px-3 py-3.5 text-[#1F2020] font-medium whitespace-nowrap">{row.clientName}</td>
                  <td className="px-3 py-3.5 text-[#707070] whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-3.5 text-[#707070] whitespace-nowrap">{row.material}</td>
                  <td className="px-3 py-3.5 text-[#707070] whitespace-nowrap">{row.pickup}</td>
                  <td className="px-3 py-3.5 text-[#707070] whitespace-nowrap">{row.deliver}</td>
                  <td className="px-3 py-3.5 text-[#707070] text-center">{row.loads}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3.5">
                    <ActionsMenu
  loadId={row.id}
  status={row.status}
/>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}