import { useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CustomSettlementSelect } from "./CustomSettlementSelect";

const availableLoads = [
  {
    id: 1,
    customer: "RESOLVE",
    customerName: "Revenna #1",
    jobId: "#12790",
    loads: 1,
    rate: "$10.00",
    fsc: "5.00%",
    material: "Concrete Sand",
    pickupLocation: "Dallas, TX",
    pickupTime: "04/25/2026 6:00 AM",
    deliveryLocation: "Houston, TX",
    deliveryTime: "04/25/2026 02:00 PM",
  },
  {
    id: 2,
    customer: "CELINA",
    customerName: "",
    jobId: "#12790",
    loads: 2,
    rate: "$8.50",
    fsc: "5.00%",
    material: "Sand",
    pickupLocation: "Dallas, TX",
    pickupTime: "04/25/2026 6:00 AM",
    deliveryLocation: "Houston, TX",
    deliveryTime: "04/25/2026 02:00 PM",
  },
  {
    id: 3,
    customer: "CELINA",
    customerName: "",
    jobId: "#12790",
    loads: 3,
    rate: "$6.75",
    fsc: "5.00%",
    material: "1' Rock",
    pickupLocation: "Dallas, TX",
    pickupTime: "04/25/2026 6:00 AM",
    deliveryLocation: "Houston, TX",
    deliveryTime: "04/25/2026 02:00 PM",
  },
  {
    id: 4,
    customer: "RESOLVE",
    customerName: "Revenna #2",
    jobId: "#12790",
    loads: 2,
    rate: "$13.00",
    fsc: "5.00%",
    material: "Concrete Sand",
    pickupLocation: "Dallas, TX",
    pickupTime: "04/25/2026 6:00 AM",
    deliveryLocation: "Houston, TX",
    deliveryTime: "04/25/2026 02:00 PM",
  },
  {
    id: 5,
    customer: "LMC-ROSSER",
    customerName: "",
    jobId: "#12790",
    loads: 2,
    rate: "$12.50",
    fsc: "5.00%",
    material: "Concrete Sand",
    pickupLocation: "Dallas, TX",
    pickupTime: "04/25/2026 6:00 AM",
    deliveryLocation: "Houston, TX",
    deliveryTime: "04/25/2026 02:00 PM",
  },
];

const driverOptions = [
  "Ahmad Ekstrom Bothman",
  "Desirae Dorwart",
  "Phillip Lipshutz",
  "Alfonso Vetrovs",
  "Allison Rosser",
];

const truckOptions = ["TX4578", "TX5973", "TX4578", "TX6820", "TX9836"];

export const AssignLoadPage = () => {
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [acceptedLoads, setAcceptedLoads] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadFormData, setLoadFormData] = useState<
    Record<
      number,
      {
        driver: string;
        truck: string;
        quantity: string;
      }
    >
  >({});

  const updateLoadForm = (
    loadId: number,
    field: "driver" | "truck" | "quantity",
    value: string,
  ) => {
    setLoadFormData((prev) => ({
      ...prev,
      [loadId]: {
        driver: prev[loadId]?.driver || "",
        truck: prev[loadId]?.truck || "",
        quantity: prev[loadId]?.quantity || "",
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-[24px] font-bold text-[#111827]">Assign Loads</h1>
        <div
          onClick={() => setOpenDateModal(true)}
          className="flex items-center gap-2 text-sm text-[#111827] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 cursor-pointer"
        >
          <CalendarDays size={20} />
          <span>
            {range?.from ? format(range.from, "dd/MM/yyyy") : "Start Date"}
            {" - "}
            {range?.to ? format(range.to, "dd/MM/yyyy") : "End Date"}
          </span>
        </div>
      </div>

      <DateRangeModal
        open={openDateModal}
        onClose={() => setOpenDateModal(false)}
        value={range}
        onChange={setRange}
      />

      <div className="space-y-5 bg-white rounded-xl p-5">
        <p className="text-[#1F2020] font-semibold">Available Loads</p>
        {availableLoads.map((load) => {
          const isAccepted = acceptedLoads.includes(load.id);

          const formData = loadFormData[load.id] || {
            driver: "",
            truck: "",
            quantity: "",
          };

          const isAssignDisabled =
            !formData.driver || !formData.truck || !formData.quantity.trim();

          return (
            <div
              key={load.id}
              className="rounded-lg border border-[#D9D9D9] bg-white p-4"
            >
              <div className="grid lg:grid-cols-[1.2fr_1fr_.8fr_1fr_.8fr_1.2fr_2fr_2fr] md:grid-cols-3 grid-cols-2 gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Customer
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.customer}
                  </p>

                  {load.customerName && (
                    <p className="text-[14px] text-[#666666]">
                      {load.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Job ID
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.jobId}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Loads
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.loads}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Rate
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">{load.rate}</p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    FSC
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">{load.fsc}</p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Material
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.material}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Pickup Location & Time
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.pickupLocation}
                  </p>

                  <p className="text-[14px] text-[#666666]">
                    {load.pickupTime}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#3D3D3D]">
                    Delivery Location & Time
                  </p>

                  <p className="mt-4 text-[14px] text-[#666666]">
                    {load.deliveryLocation}
                  </p>

                  <p className="text-[14px] text-[#666666]">
                    {load.deliveryTime}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid xl:grid-cols-[1.5fr_1.2fr_1fr_0.7fr] md:grid-cols-2 grid-cols-1 xl:gap-6 gap-3 items-center">
                <div className="flex md:items-center lg:gap-3 gap-2 md:flex-row flex-col text-[#111827]">
                  <label className="text-[14px] text-[#7B7B7B] inline-block min-w-max">
                    Select Driver
                  </label>

                  <CustomSettlementSelect
                    value={formData.driver}
                    onChange={(value) =>
                      updateLoadForm(load.id, "driver", value)
                    }
                    options={driverOptions}
                  />
                </div>

                <div className="flex md:items-center lg:gap-3 gap-2 md:flex-row flex-col text-[#111827]">
                  <label className="text-[14px] text-[#7B7B7B]">Truck</label>

                  <CustomSettlementSelect
                    value={formData.truck}
                    onChange={(value) =>
                      updateLoadForm(load.id, "truck", value)
                    }
                    options={truckOptions}
                  />
                </div>

                <div className="flex md:items-center lg:gap-3 gap-2 md:flex-row flex-col">
                  <label className="text-[14px] text-[#7B7B7B]">Quantity</label>

                  <input
                    value={formData.quantity}
                    onChange={(e) =>
                      updateLoadForm(load.id, "quantity", e.target.value)
                    }
                    placeholder="Enter..."
                    className="h-12 w-full rounded-lg border border-[#A3A3A3] text-[#111827] outline-none px-3 text-sm"
                  />
                </div>

                <button
                  disabled={isAssignDisabled}
                  className={`h-12 px-4 rounded-lg text-white text-[14px] font-semibold ${
                    isAssignDisabled
                      ? "bg-[#C3C9D7] cursor-not-allowed"
                      : "bg-[#315497]"
                  }`}
                  onClick={() => {
                    setShowSuccessModal(true);
                    setTimeout(() => {
                      setShowSuccessModal(false);
                    }, 3000);
                  }}
                >
                  Assign Load
                </button>
              </div>

              {!isAccepted && (
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() =>
                      setAcceptedLoads((prev) => [...prev, load.id])
                    }
                    className="h-10 px-4 rounded-md text-sm bg-[#FF3B0A] text-white"
                  >
                    Reject Load
                  </button>

                  <button
                    onClick={() =>
                      setAcceptedLoads((prev) => [...prev, load.id])
                    }
                    className="h-10 px-4 rounded-md text-sm bg-[#1EDB2F] text-white"
                  >
                    Accept Load
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 !mt-0">
          <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-14 flex items-center justify-center flex-col">
            <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
              <Check size={50} className="text-white stroke-[4]" />
            </div>

            <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
              You Successfully Assigned the Load
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
