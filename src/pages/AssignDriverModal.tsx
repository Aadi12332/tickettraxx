import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AssignDriverModalProps {
  open: boolean;
  onClose: () => void;
  onAssign?: (data: {
    driver: string;
    assignDate: string;
  }) => void;
}

export const AssignDriverModal = ({
  open,
  onClose,
  onAssign,
}: AssignDriverModalProps) => {
  const [driver, setDriver] = useState("");
  const [assignDate, setAssignDate] = useState("");

  if (!open) return null;

  const handleAssign = () => {
    onAssign?.({
      driver,
      assignDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[648px] rounded-xl overflow-hidden text-[#1F2020]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-[20px] font-semibold">
            Assign Driver
          </h2>

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
                <h3 className="text-sm font-medium">
                  Unit No : 215
                </h3>

                <p className="text-base text-gray-500">
                  Plate: TX-78A23
                </p>
              </div>
            </div>

            <span className="bg-green-600 text-white px-5 py-2 rounded-md font-medium text-xs">
              Active
            </span>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Select Driver
            </label>

            <div className="relative w-full">
              <select
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 appearance-none text-sm"
              >
                <option value="">Select one</option>
                <option value="John Miller">
                  John Miller
                </option>
                <option value="Robert Davies">
                  Robert Davies
                </option>
                <option value="Maria Gomez">
                  Maria Gomez
                </option>
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={24}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Assign From Date
            </label>

            <div className="relative w-full">

              <input
                type="date"
                value={assignDate}
                onChange={(e) =>
                  setAssignDate(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <button
            onClick={handleAssign}
            className="bg-[#1F3B77] hover:bg-[#18305f] text-white px-5 py-3 rounded-lg text-sm font-medium"
          >
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  );
};