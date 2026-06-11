import { X } from "lucide-react";

export function NotDeliveredModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[568px] rounded-lg max-h-[90vh] scroll-hide overflow-auto text-[#181818]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00000066]">
          <h2 className="text-[20px] text-[#181818] font-semibold">
            Reason for Not Delivered
          </h2>

          <button onClick={onClose}>
            <X size={24} className="text-[#181818]" />
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-base text-[#0A0A0A] mb-1">Reason</h3>

          <div className="border border-[#E5E7EB] rounded-lg p-4 h-[87px] overflow-auto scroll-hide text-sm text-[#1E1E1ECC]">
            Delivery was not completed due to an incorrect or
            incomplete address.
          </div>

          <h3 className="text-base text-[#0A0A0A] mt-3 mb-1">Proof Image</h3>

          <img
            src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1400"
            alt=""
            className="w-full h-[150px] rounded-lg object-cover"
          />

          <div className="flex items-center justify-between mt-5">
            <p className="text-[10px] text-[#1C3B73]">
              *Requesting admin to create a ticket to resolve the
              delivery issue.
            </p>

            <button onClick={onClose} className="bg-[#1F4A92] text-white px-3 py-3 rounded-lg">
              Request Admin For Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}