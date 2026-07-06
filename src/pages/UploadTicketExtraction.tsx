import { ArrowLeft, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#E5E7EB] bg-white p-3">
      <label className="text-sm font-semibold text-[#111827]">
        {label}
      </label>

      <div className="flex items-center text-[#1D3461] font-medium">
        {value}
      </div>
    </div>
  );
}

export default function UploadTicketExtraction() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const ticket = {
    ticketNo: "TKT-10245",
    ticketDate: "17 Mar 2025",
    driverAlias: "John Doe",
    pickupLocation: "Houston, TX",
    deliveryLocation: "Dallas, TX",
    materialType: "Gravel",
    netTons: "25.50",
    fsc: "$125",
    estimatedPayCycle: "Weekly",
  };

  const handleReupload = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
     setShowSuccessModal(true)
  };

  useEffect(() => {
  if (!showSuccessModal) return;

  const timer = setTimeout(() => {
    setShowSuccessModal(false);
    navigate(-1);
  }, 3000);

  return () => clearTimeout(timer);
}, [showSuccessModal, navigate]);

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start gap-5 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="h-[46px] px-5 rounded-lg bg-[#1D3461] text-white font-semibold flex items-center gap-2 hover:bg-[#172C52]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">
            Ticket Extraction
          </h1>

          <p className="text-[#6B7280] mt-1">
            Review the extracted ticket information before submitting.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-[22px] font-semibold text-[#111827] mb-6">
          Extracted Ticket Details
        </h2>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <DetailField label="Ticket No" value={ticket.ticketNo} />
          <DetailField label="Ticket Date" value={ticket.ticketDate} />
          <DetailField label="Driver Alias" value={ticket.driverAlias} />
          <DetailField label="Pickup Location" value={ticket.pickupLocation} />
          <DetailField
            label="Delivery Location"
            value={ticket.deliveryLocation}
          />
          <DetailField label="Material Type" value={ticket.materialType} />
          <DetailField label="Net Tons" value={ticket.netTons} />
          <DetailField label="FSC" value={ticket.fsc} />
          <DetailField
            label="Estimated Pay Cycle"
            value={ticket.estimatedPayCycle}
          />
        </div>

        <div className="flex justify-start gap-4 mt-10">
          <button
            onClick={handleReupload}
            className="h-[48px] px-8 rounded-lg border border-[#D1D5DB] bg-white text-[#374151] font-semibold hover:bg-[#F9FAFB] flex items-center gap-2"
          >
            Reupload
          </button>

          <button
            onClick={handleSubmit}
            className="h-[48px] px-8 rounded-lg bg-[#1D3461] text-white font-semibold hover:bg-[#16284C]"
          >
            Submit
          </button>
        </div>
           {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-14 flex items-center justify-center flex-col relative">
            <X
              size={20}
              className="text-[#000] cursor-pointer absolute top-4 right-4"
              onClick={() => {setShowSuccessModal(false);navigate(-1);}}
            />
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={50} className="text-white stroke-[4]" />
            </div>

            <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
              Ticket Successfully Submitted
            </h2>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}