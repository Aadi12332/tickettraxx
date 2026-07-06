import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import DateRangeModal from "./DateRangeModal"; // adjust path as per your project structure

interface UpdatePayModalProps {
  open: boolean;
  onClose: () => void;
  statementId: string | number | null;
}

export default function UpdatePayModal({
  open,
  onClose,
  statementId,
}: UpdatePayModalProps) {
  const [checkNumber, setCheckNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleUpdate = () => {
    console.log("Update Pay", statementId, {
      checkNumber,
      paymentDate,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[579px] rounded-lg bg-white text-[#111827]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-[20px] font-semibold text-[#111827]">
            Update Pay
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div>
            <label className="mb-1 block text-[14px] font-medium text-[#111827]">
              Check Number/ACH
            </label>

            <input
              type="text"
              placeholder="Enter..."
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              className="h-12 w-full rounded-lg border border-[#D1D5DB] px-4 outline-none"
            />
          </div>

          <div className="mt-8">
            <label className="mb-1 block text-[14px] font-medium text-[#111827]">
              Payment Date
            </label>

            <button
              type="button"
              onClick={() => setDatePickerOpen(true)}
              className="flex h-12 w-full items-center justify-between rounded-lg border border-[#D1D5DB] px-4 text-left outline-none"
            >
              <span className={paymentDate ? "text-[#111827]" : "text-[#9CA3AF]"}>
                {paymentDate ? format(paymentDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
              </span>
              <Calendar className="text-[#6B7280]" size={16} />
            </button>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="h-12 rounded-lg border border-[#D1D5DB] text-[14px] font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="h-12 rounded-lg bg-[#223B70] text-[14px] font-medium text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {datePickerOpen && (
        <DateRangeModal
          open={datePickerOpen}
          onClose={() => setDatePickerOpen(false)}
          value={paymentDate ? { from: paymentDate, to: paymentDate } : undefined}
          onChange={(range) => {
            setPaymentDate(range?.from);
            setDatePickerOpen(false);
          }}
        />
      )}
    </div>
  );
}