"use client";

import { Pencil, X, RefreshCw, PlusCircleIcon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Permission = "Full Access" | "Read Only" | "No Access";
type Role = "Driver" | "Admin" | "Manager";

interface DriverRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  permission: Permission;
}

type SortKey = keyof Omit<DriverRow, "id">;
type SortDir = "asc" | "desc" | null;

const INITIAL_DATA: DriverRow[] = [
  {
    id: 1,
    name: "Emma Rivers",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 2,
    name: "Jake Mason",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 3,
    name: "Liam Carter",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 4,
    name: "Sophia Bennett",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 5,
    name: "Olivia Taylor",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 6,
    name: "Noah Johnson",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 7,
    name: "Liam Johnson",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 8,
    name: "Emma Williams",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 9,
    name: "Ryan Carder",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 10,
    name: "Desirae Donin",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 11,
    name: "Carlos Mendes",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 12,
    name: "Ava Thompson",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 13,
    name: "Mason Lee",
    email: "example@email.com",
    role: "Admin",
    permission: "Full Access",
  },
  {
    id: 14,
    name: "Isla Grant",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 15,
    name: "Ethan Brooks",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 16,
    name: "Nora Kim",
    email: "example@email.com",
    role: "Manager",
    permission: "Full Access",
  },
  {
    id: 17,
    name: "Lucas Hall",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 18,
    name: "Mia Scott",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 19,
    name: "James Turner",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
  {
    id: 20,
    name: "Ella Parker",
    email: "example@email.com",
    role: "Driver",
    permission: "Full Access",
  },
];

const SHOW_OPTIONS = [5, 10, 20, 50];

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

function PermissionBadge({ permission }: { permission: Permission }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#D1FAE5] text-[#065F46]">
      {permission}
    </span>
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
  // Build visible page numbers with ellipsis logic
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

  const btnBase =
    "w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors select-none";
  const active = "bg-[#1E2A4A] text-white";
  const inactive =
    "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white";
  const disabled =
    "border border-[#E5E7EB] text-[#D1D5DB] bg-white cursor-not-allowed";

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? disabled : inactive}`}
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
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btnBase} ${p === currentPage ? active : inactive}`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? disabled : inactive}`}
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
  { key: "name", label: "Driver" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "permission", label: "Permissions" },
];

export default function PermissionsPage() {
  const [data, setData] = useState<DriverRow[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const navigate = useNavigate();

  const filtered = data
    .filter((r) =>
      search.trim() === ""
        ? true
        : r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * showEntries,
    safePage * showEntries,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showEntries]);

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

  const [deleteId, setDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (deleteId === null) return;

    setData((p) => p.filter((r) => r.id !== deleteId));
    setSelectedRows((p) => p.filter((x) => x !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-[#111827]">Permissions</h1>
          <p className="text-base text-[#707070] mt-0.5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/permissions/create-role")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors"
          >
            <PlusCircleIcon fill="white" size={15} className="text-[#1D3461]" />
            Create A New Role
          </button>
          <button className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 transition-colors text-[#6B7280]">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
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

          <div className="flex items-center gap-2 text-sm text-[#1D3461]">
            <span>Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
              className="border border-[#E5E7EB] rounded-md px-3 py-1.5 text-sm text-[#111827] outline-none cursor-pointer"
            >
              {SHOW_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
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
                <th className="px-3 py-3 text-left text-[13px] font-semibold text-[#1F2020] whitespace-nowrap">
                  Details
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#9CA3AF]"
                  >
                    No drivers match your search.
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
                    <td className="px-3 py-3.5 text-[#1F2020] font-medium whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-3 py-3.5 text-[#6B7280] whitespace-nowrap">
                      {row.email}
                    </td>
                    <td className="px-3 py-3.5 text-[#6B7280] whitespace-nowrap">
                      {row.role}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <PermissionBadge permission={row.permission} />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate("/permissions/edit-role")}
                          className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-md text-[#6B7280] hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {deleteId !== null && (
          <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
            <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-12 flex flex-col items-center">
              <div className="w-[60px] h-[60px] rounded-full bg-[#DC2626] flex items-center justify-center">
                <X size={36} className="text-white stroke-[3]" />
              </div>

              <h2 className="mt-8 text-[20px] font-semibold text-[#111827]">
                Delete Record?
              </h2>

              <p className="mt-3 text-center text-[#6B7280]">
                Are you sure you want to delete this record?
              </p>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setDeleteId(null)}
                  className="h-11 px-8 rounded-lg border border-[#D1D5DB] text-[#6B7280]"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="h-11 px-8 rounded-lg bg-[#DC2626] text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end px-5 py-4 border-t border-[#E5E7EB]">
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
