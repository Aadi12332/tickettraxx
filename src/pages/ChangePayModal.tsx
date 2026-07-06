import { X } from "lucide-react";

interface ChangePayModalProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export default function ChangePayModal({
  open,
  onClose,
  value,
  onChange,
  onSave,
}: ChangePayModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E7EB]">
          <h2 className="text-[20px] font-semibold text-[#111827]">
            Change Pay%
          </h2>

          <button
            onClick={onClose}
            className="text-[#111827] hover:opacity-70"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-10">
          <input
            type="number"
            placeholder="Enter here"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 border border-[#E5E7EB] text-[#111827] rounded-lg px-4 text-sm outline-none"
          />

          <div className="flex justify-center mt-10">
            <button
              onClick={onSave}
              className="bg-[#1D3F77] hover:bg-[#17325F] text-white px-10 py-2.5 rounded-lg text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}