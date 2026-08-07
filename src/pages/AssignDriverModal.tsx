import { X, ChevronDown, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { hasInvalidOrExpiredTokenError } from "../utils/api";

interface AssignDriverModalProps {
  open: boolean;
  onClose: () => void;
  truckId?: string | null;
  onAssign?: (data: { driver: string; assignDate: string }) => void;
}

export const AssignDriverModal = ({
  open,
  onClose,
  truckId,
  onAssign,
}: AssignDriverModalProps) => {
  const { token, logout } = useAuth();
  const [driver, setDriver] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [drivers, setDrivers] = useState<Array<{ value: string; label: string }>>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState<"start" | "end" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    const controller = new AbortController();

    const loadDrivers = async () => {
      try {
        const res = await fetch("https://65.1.152.16/api/drivers", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (await hasInvalidOrExpiredTokenError(res)) {
          logout();
          return;
        }

        const payload = await res.json().catch(() => null);
        if (res.ok && Array.isArray(payload?.data)) {
          setDrivers(
            payload.data
              .filter((d: any) => d?._id)
              .map((d: any) => ({ value: d._id, label: d.name || "N/A" })),
          );
        } else {
          setDrivers([]);
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setDrivers([]);
        }
      }
    };

    void loadDrivers();
    return () => controller.abort();
  }, [open, token, logout]);

  useEffect(() => {
    if (!dateRange?.from) return;
    setAssignDate(format(dateRange.from, "yyyy-MM-dd"));
  }, [dateRange]);

  if (!open) return null;

  const handleAssign = async () => {
    if (!truckId || !token || !driver) return;
    setLoading(true);

    try {
      const body = {
        driverId: driver,
        assignedFromDate: assignDate || (dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined),
      };

      const response = await fetch(
        `https://65.1.152.16/api/trucks/${encodeURIComponent(truckId)}/assign-driver`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) return;

      onAssign?.({ driver, assignDate: body.assignedFromDate || "" });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[648px] rounded-xl overflow-hidden text-[#1F2020]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-[20px] font-semibold">Assign Driver</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=300"
                alt="truck"
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <h3 className="text-sm font-medium">Unit No : {truckId ?? "N/A"}</h3>

                <p className="text-base text-gray-500">Plate: N/A</p>
              </div>
            </div>

            <span className="bg-green-600 text-white px-5 py-2 rounded-md font-medium text-xs">
              Active
            </span>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">Select Driver</label>

            <div className="relative w-full">
              <select
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 appearance-none text-sm outline-none"
              >
                <option value="">Select one</option>
                {drivers.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={24}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">Assign From Date</label>

            <button
              onClick={() => setDatePickerOpen("start")}
              className="flex items-center justify-between border border-[#D1D5DB] rounded-lg px-4 py-2.5 w-full"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-[#6B7280]" />

                <span className={`text-sm ${dateRange?.from ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                  {dateRange?.from ? format(dateRange.from, "MM/dd/yyyy") : "mm/dd/yyyy"}
                </span>
              </div>
            </button>

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
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-[#1F3B77] hover:bg-[#18305f] text-white px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Assigning..." : "Assign Driver"}
          </button>
        </div>
      </div>
    </div>
  );
};
