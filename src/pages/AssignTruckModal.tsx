import { Calendar, ChevronDown, X } from "lucide-react";

interface AssignTruckModalProps {
  open: boolean;
  onClose: () => void;
  onAssign?: () => void;
}

export default function AssignTruckModal({
  open,
  onClose,
  onAssign,
}: AssignTruckModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[520px] rounded-lg overflow-hidden text-[#1F2020]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
          <h2 className="text-[20px] font-bold text-[#111827]">
            Assign Truck
          </h2>

          <button
            onClick={onClose}
            className="text-[#111827] hover:opacity-70"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-[#F8F8F8] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Driver"
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  Joseph Martin
                </h3>

                <p className="text-[#6B7280] text-[14px] mt-1">
                  Driver ID : 4582
                </p>
              </div>
            </div>

            <span className="bg-[#198754] text-white px-4 py-2 rounded-lg text-[14px] font-medium">
              Active
            </span>
          </div>

          <div className="mt-4">
            <label className="block text-[#6B7280] text-sm mb-2">
              Select Truck
            </label>

            <div className="relative w-full">
              <select className="w-full border border-[#D1D5DB] rounded-lg px-4 py-2.5 appearance-none outline-none text-[14px]">
                <option disabled>Select one</option>
                <option>Unit No : 215</option>
                <option>Unit No : 216</option>
                <option>Unit No : 217</option>
              </select>

              <ChevronDown
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300"
              alt="Truck"
              className="w-24 h-20 rounded-lg object-cover"
            />

            <div>
              <h4 className="text-[14px] font-medium text-[#111827]">
                Unit No : 215
              </h4>

              <p className="text-[#6B7280] text-[14px] mt-1">
                Plate: TX-78A23
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[14px] font-semibold text-[#111827] mb-1">
              Assign From Date
            </label>

            <button className="flex items-center gap-3 border border-[#D1D5DB] rounded-lg px-4 py-2.5 w-full text-[#6B7280]">
              <Calendar size={20} />
              <span>Select Date</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] px-4 py-3">
          <button
            onClick={onAssign}
            className="bg-[#1D428A] hover:bg-[#16366F] text-white px-8 py-3 rounded-lg text-[14px] font-medium"
          >
            Assign Truck
          </button>
        </div>
      </div>
    </div>
  );
}