import { CheckCircle, XCircle, X, CheckCheckIcon, CheckCircle2 } from "lucide-react";

export function TicketApprovalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[800px] rounded-lg overflow-auto scroll-hide max-h-[96vh] text-[#181818]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#00000066]">
          <h2 className="text-[20px] font-semibold">Ticket to Approve</h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-5 gap-3 mb-6">
            <Info title="Date" value="13/01/2026" />
            <Info title="Number ticket" value="1975244685" />
            <Info title="Unit" value="900" />
            <Info title="Material" value='1" Rock' />
            <Info title="Tonage" value="27.70" />

            <Info title="Rate" value="$11.00" />
            <Info title="Total" value="$304.70" />
            <Info title="Pickup" value="Hanson Lake" />
            <Info title="Deliver" value="LMC-Coppell 4956" />
            <Info title="Submission date" value="01/09/2026" />
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-6">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200"
              alt=""
              className="w-full min-h-[500px] h-full rounded-lg object-cover"
            />

            <div className="space-y-3">
              <div className="bg-[#CDFFCD] rounded-lg p-5 flex flex-col items-center justify-center h-[270px]">
                <CheckCircle
                  size={100}
                  className="text-[#34C759] mb-10"
                />

                <button className="bg-[#34C759] text-white h-12 px-10 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} />
                  Approve
                </button>
              </div>

              <div className="bg-[#F4DBDC] rounded-lg p-4">
                <h3 className="text-[#FF383C] text-base font-semibold mb-1">
                  Add Comment
                </h3>

                <div className="rounded-lg bg-white py-3">
                    <textarea
                  maxLength={200}
                  className="w-full h-[120px] px-3 rounded-lg resize-none outline-none"
                  placeholder="Add comment"
                />

                <div className="text-xs px-3 text-right">0 / 200</div>
                </div>

                <button className="mt-5 px-10 mx-auto bg-[#FF3B3B] text-white h-12 rounded-lg flex items-center justify-center gap-2">
                  <XCircle size={18} />
                  Denied
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[#757272] text-sm">{title}</p>
      <p className="font-medium text-sm text-[#1D3461]">{value}</p>
    </div>
  );
}