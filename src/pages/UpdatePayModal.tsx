import { X } from "lucide-react";

interface UpdatePayModalProps {
  open: boolean;
  onClose: () => void;
  statementId: string|number | null;
}

export default function UpdatePayModal({
  open,
  onClose,
  statementId,
}: UpdatePayModalProps) {
  const handleUpdate = () => {
    console.log("Update Pay", statementId);
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
              className="h-12 w-full rounded-lg border border-[#D1D5DB] px-4 outline-none"
            />
          </div>

          <div className="mt-8">
            <label className="mb-1 block text-[14px] font-medium text-[#111827]">
              Payment Date
            </label>

            <input
              type="date"
              className="h-12 w-full rounded-lg border border-[#D1D5DB] px-4 outline-none"
            />
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
    </div>
  );
}