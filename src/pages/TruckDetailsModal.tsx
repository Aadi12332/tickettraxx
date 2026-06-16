import { Eye, Download, X, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onPreview: () => void;
}

export const TruckDetailsModal = ({
  open,
  onClose,
  onPreview,
}: Props) => {
      const [successType, setSuccessType] = useState<string | null>(null);
    
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[648px] rounded-xl max-h-[95vh] overflow-auto text-[#1F2020]">

        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] font-bold">TX4589</h2>

            <span className="bg-green-600 text-white px-4 py-1 rounded-lg font-medium text-xs">
              Active
            </span>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-5">

          {/* Truck Info */}
          <div className="bg-gray-100 rounded-xl p-3">
            <h3 className="font-semibold text-[18px] mb-6">
              Truck Information
            </h3>

            <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-3">
              <Info label="Truck ID" value="TX4589" />
              <Info label="Plate Number" value="TX4589" />
              <Info label="Truck Type" value="TX4589" />
              <Info label="Capacity" value="TX4589" />
            </div>
          </div>

          {/* Inspection */}
          <div className="bg-gray-100 rounded-xl p-3">
            <h3 className="font-semibold text-[18px] mb-6">
              Inspection & Compliance
            </h3>

            <div className="grid  lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-3">
              <Info label="Insurance Expiry" value="12/03/2026" />
              <Info label="DOT Inspection" value="VALUE" />
              <Info label="Last Inspection" value="04/19/2026" />
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-[18px] mb-5">
              Documents
            </h3>

            <DocumentRow
            setSuccessType={setSuccessType}
              title="Registration.pdf"
              onPreview={onPreview}
            />

            <DocumentRow
            setSuccessType={setSuccessType}
              title="Insurance.pdf"
              onPreview={onPreview}
            />

            <DocumentRow
            setSuccessType={setSuccessType}
              title="Inspection.pdf"
              onPreview={onPreview}
            />
          </div>

                {successType && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 !mt-0">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] px-8 py-14 flex flex-col items-center relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setSuccessType(null)}
            >
              <X size={20} className="text-[#000]" />
            </button>
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={32} className="text-white stroke-[3]" />
            </div>
            <h2 className="mt-10 text-[16px] text-center font-normal text-[#000]">
              File Downloaded
            </h2>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-bold text-base">{value}</p>
  </div>
);

const DocumentRow = ({
  title,
  onPreview,
  setSuccessType
}: {
  title: string;
  setSuccessType: any;
  onPreview: () => void;
}) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0">
    <p className="text-[#1E3A70] text-base">{title}</p>

    <div className="flex gap-10 px-5">
      <button onClick={onPreview}>
        <Eye
          size={24}
          className="text-[#0088FF]"
        />
      </button>

      <button onClick={()=>setSuccessType(true)}>
        <Download
          size={20}
          className="text-[#0088FF]"
        />
      </button>
    </div>
  </div>
);