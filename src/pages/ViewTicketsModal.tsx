import {
  Search,
  X,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SortDropdown } from "./StatementPage";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  statementId: string|number | null;
}

const SORT_OPTIONS = [
  "Date (Earliest)",
  "Date (Latest)",
  "Amount (Highest First)",
  "Amount (Lowest First)",
] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export default function ViewTicketsModal({ open, onClose }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const tickets = Array.from({ length: 10 }).map((_, i) => ({
    id: 653783 + i,
  }));
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(tickets.map((ticket) => ticket.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 p-4 flex items-center justify-center">
      <div className="max-h-[95vh] max-w-[1280px] w-full rounded-lg bg-white shadow-xl flex flex-col text-[#111827]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-[24px] font-semibold">Tickets</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-8 font-semibold text-[#1F3B72]">
            Total Tickets: 10
          </div>

          <div className="mb-2 flex items-center justify-between">
            <button className="flex items-center gap-2 rounded-lg border px-4 py-2">
              <Filter size={18} />
              Filter
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  placeholder="Search"
                  className="h-9 w-[320px] rounded-lg border pl-10 pr-4 outline-none"
                />
              </div>

              <SortDropdown selected={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-[1800px] w-full">
              <thead>
                <tr className="bg-[#F3F4F6]">
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tickets.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="accent-[#1F3B72] cursor-pointer relative top-[2px]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Ticket No.</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Alias/Unit</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-left">Pickup</th>
                  <th className="px-4 py-3 text-left">Drop-off</th>
                  <th className="px-4 py-3 text-left">Material</th>
                  <th className="px-4 py-3 text-left">Tonage</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">FSC</th>
                  <th className="px-4 py-3 text-left">Gross</th>
                  <th className="px-4 py-3 text-left">Ticket Status</th>
                  <th className="px-4 py-3 text-left">Invoice Status</th>
                  <th className="px-4 py-3 text-left">Settlement Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t">
                    <td className="px-4 py-2 w-8">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(ticket.id)}
                        onChange={(e) =>
                          handleRowSelect(ticket.id, e.target.checked)
                        }
                        className="accent-[#1F3B72] cursor-pointer relative top-[2px]"
                      />
                    </td>

                    <td className="px-4 py-1 font-semibold">#{ticket.id}</td>
                    <td className="px-4 py-1">06/01/2026</td>
                    <td className="px-4 py-1">0952</td>
                    <td className="px-4 py-1">Terry Bothman</td>
                    <td className="px-4 py-1">Hanson Lake</td>
                    <td className="px-4 py-1">LMC</td>
                    <td className="px-4 py-1">Fine Sand</td>
                    <td className="px-4 py-1">27.69</td>
                    <td className="px-4 py-1">$304.59</td>
                    <td className="px-4 py-1">5%</td>
                    <td className="px-4 py-1">$1522</td>

                    <td className="px-4 py-1">
                      <span className="rounded bg-green-500 px-3 py-1 text-white">
                        Approved
                      </span>
                    </td>

                    <td className="px-4 py-1">
                      <span className="rounded bg-green-500 px-3 py-1 text-white">
                        Approved
                      </span>
                    </td>

                    <td className="px-4 py-1">
                      <span className="rounded bg-green-500 px-3 py-1 text-white">
                        Approved
                      </span>
                    </td>

                    <td className="px-4 py-1">
                      <button className="rounded border p-2">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Show</span>

              <select className="rounded border px-3 py-2">
                <option>10</option>
              </select>

              <span>Entries</span>
            </div>

            <div className="flex gap-2">
              <button className="rounded border p-2">
                <ChevronLeft size={18} />
              </button>

              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`h-10 w-10 rounded border ${
                    page === 3 ? "bg-[#1F3B72] text-white" : ""
                  }`}
                >
                  {page}
                </button>
              ))}

              <button className="rounded border p-2">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
