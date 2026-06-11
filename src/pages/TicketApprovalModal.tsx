import { CheckCircle, XCircle, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CustomSettlementSelect } from "./CustomSettlementSelect";
import Bill from "../assets/images/bill.png";

export function TicketApprovalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const approveRef = useRef<HTMLDivElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const wordCount = comment.trim().split(/\s+/).filter(Boolean).length;

  const handleDenied = () => {
    if (!comment.trim()) {
      setCommentError("Comment is required");
      return;
    }

    if (wordCount > 200) {
      setCommentError("Maximum 200 words allowed");
      return;
    }

    setCommentError("");
    onClose();
  };

  const settlementOptions = [
    "01/23/2026",
    "01/30/2026",
    "02/06/2026",
    "Manual Settlement",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        approveRef.current &&
        !approveRef.current.contains(event.target as Node)
      ) {
        setApproveOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[800px] z-[9999] rounded-lg overflow-auto scroll-hide max-h-[96vh] text-[#181818]">
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
              src={Bill}
              alt=""
              className="w-full min-h-[500px] h-full rounded-lg object-cover"
            />

            <div className="space-y-3">
              <div className="bg-[#CDFFCD] rounded-lg p-5 flex flex-col items-center justify-center h-[270px]">
                <CheckCircle size={100} className="text-[#34C759] mb-10" />

                <div className="relative" ref={approveRef}>
                  <button
                    onClick={() => setApproveOpen((v) => !v)}
                    className="bg-[#34C759] text-white h-12 px-10 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>

                  {approveOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
                      <div className="fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 p-8">
                        <label className="block text-[18px] text-[#111827] mb-3">
                          Select Date
                        </label>

                        <CustomSettlementSelect
                          value={selectedDate}
                          onChange={setSelectedDate}
                          options={settlementOptions}
                        />

                        <div className="flex justify-center mt-12">
                          <button
                            disabled={!selectedDate}
                            onClick={() => {
                              setApproveOpen(false);
                              setShowSuccessModal(true);

                              setTimeout(() => {
                                setShowSuccessModal(false);
                              }, 3000);
                            }}
                            className="bg-[#34C759] disabled:opacity-50 text-white h-12 min-w-[260px] rounded-lg flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                      <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-14 flex items-center justify-center flex-col">
                        <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
                          <Check size={50} className="text-white stroke-[4]" />
                        </div>

                        <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
                          Ticket has been Approved
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#F4DBDC] rounded-lg p-4">
                <h3 className="text-[#FF383C] text-base font-semibold mb-1">
                  Add Comment
                </h3>

                <div className="rounded-lg bg-white py-3">
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);

                      if (commentError) {
                        setCommentError("");
                      }
                    }}
                    className={`w-full h-[120px] px-3 rounded-lg resize-none outline-none`}
                    placeholder="Add comment"
                  />

                  <div className="flex items-center justify-between px-3">
                    <span className="text-xs text-red-500">{commentError}</span>

                    <span
                      className={`text-xs ${
                        wordCount > 200 ? "text-red-500" : "text-[#6B7280]"
                      }`}
                    >
                      {wordCount} / 200 words
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDenied}
                  className="mt-5 px-10 mx-auto bg-[#FF3B3B] text-white h-12 rounded-lg flex items-center justify-center gap-2"
                >
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

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-[#757272] text-sm">{title}</p>
      <p className="font-medium text-sm text-[#1D3461]">{value}</p>
    </div>
  );
}
