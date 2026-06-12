import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  statementId: string|number | null;
}

export default function StatementDetailsModal({
  open,
  onClose,
  statementId,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[580px] rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto text-[#111827]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-xl font-semibold">Statement Details</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="inline-flex rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white">
            Paid
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-sm text-gray-500">Statement ID</p>
              <p className="text-[20px] font-semibold">
                ST-{statementId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-[20px] font-medium">04/20/2026</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-[20px] font-bold text-[#223B70]">
                $12,705
              </p>
            </div>
          </div>

          <h3 className="mt-5 text-[16px] font-semibold">
            Truck Breakdown
          </h3>

          {[4354, 4532].map((truckId) => (
            <div
              key={truckId}
              className="mt-3 overflow-hidden rounded-lg border"
            >
              <div className="bg-gray-100 px-3 py-2 font-medium">
                Truck ID: {truckId}
              </div>

              <div className="grid grid-cols-5 gap-3 p-3">
                <div>
                  <p className="text-sm text-gray-500">Tickets</p>
                  <p className="text-base font-semibold">8</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Gross</p>
                  <p className="text-base font-semibold">$2,780</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">FSC</p>
                  <p className="text-base font-semibold">$170</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Deductions</p>
                  <p className="text-base font-semibold">$100</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Net Pay</p>
                  <p className="text-base font-semibold">$2,602</p>
                </div>
              </div>
            </div>
          ))}

          <h3 className="mt-5 text-base font-semibold">
            Statement Summary
          </h3>

          <div className="mt-1 rounded-lg bg-gray-50 p-3">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Gross</span>
                <span className="font-semibold">$14,200</span>
              </div>

              <div className="flex justify-between">
                <span>Total FSC</span>
                <span className="font-semibold">$850</span>
              </div>

              <div className="flex justify-between">
                <span>Total Bonus</span>
                <span className="font-semibold">$320</span>
              </div>

              <div className="flex justify-between">
                <span>Total Deductions</span>
                <span className="font-semibold">$1,245</span>
              </div>

              <div className="flex justify-between text-base font-bold">
                <span>Final Paid Amount</span>
                <span>$12,705</span>
              </div>
            </div>
          </div>

          <button className="mt-4 rounded-lg bg-[#223B70] px-6 py-3 text-white">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}