import { useEffect, useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CustomSettlementSelect } from "./CustomSettlementSelect";
import { SettlementSelectOption } from "./CustomSettlementSelect";
import { useAuth } from "../context/AuthContext";
import { hasInvalidOrExpiredTokenError } from "../utils/api";

type ApiReference =
  | {
      _id?: string;
      name?: string;
      code?: string;
      jobNo?: string;
    }
  | string
  | null;

type AvailableLoadApiItem = {
  _id?: string;
  loadNo?: string;
  customerId?: ApiReference;
  jobId?: ApiReference;
  date?: string | null;
  numberOfTrips?: number | null;
  invoiceRate?: number | null;
  contractorRate?: number | null;
  fsc?: number | null;
  materialId?: ApiReference;
  pickupSiteId?: ApiReference;
  deliverySiteId?: ApiReference;
  eta?: string | null;
  status?: string | null;
  rejectedByContractorIds?: string[] | null;
};

type AvailableLoadsResponse = {
  data: AvailableLoadApiItem[];
};

type DriverApiItem = {
  _id?: string;
  name?: string;
};

type TruckApiItem = {
  _id?: string;
  unitNumber?: string;
  truckName?: string;
};

type ListApiResponse<T> = {
  data: T[];
};

type AvailableLoad = {
  id: string;
  customer: string;
  customerName: string;
  jobId: string;
  loads: string;
  rate: string;
  fsc: string;
  material: string;
  pickupLocation: string;
  pickupTime: string;
  deliveryLocation: string;
  deliveryTime: string;
  assignmentDate: string | null;
  status: string;
  isRejectedByCurrentContractor: boolean;
};

const valueOrNA = (value: unknown) =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : "N/A";

const referenceValue = (
  value: ApiReference,
  keys: Array<keyof Exclude<ApiReference, string | null>>,
) => {
  if (typeof value === "string") return value || "N/A";
  if (!value) return "N/A";

  for (const key of keys) {
    const fieldValue = value[key];
    if (typeof fieldValue === "string" && fieldValue) return fieldValue;
  }

  return "N/A";
};

const formatCurrency = (value: number | null | undefined) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value)
    : "N/A";

const formatApiDate = (value: string | null | undefined) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : format(date, "MM/dd/yyyy");
};

const mapAvailableLoad = (
  load: AvailableLoadApiItem,
  index: number,
  userId?: string,
  contractorId?: string | null,
): AvailableLoad => ({
  id: load._id ?? load.loadNo ?? `load-${index}`,
  customer: referenceValue(load.customerId ?? null, ["name"]),
  customerName: referenceValue(load.customerId ?? null, ["code"]),
  jobId: referenceValue(load.jobId ?? null, ["jobNo", "name", "_id"]),
  loads: valueOrNA(load.numberOfTrips),
  rate: formatCurrency(load.contractorRate ?? load.invoiceRate),
  fsc: typeof load.fsc === "number" ? `${load.fsc}%` : "N/A",
  material: referenceValue(load.materialId ?? null, ["name"]),
  pickupLocation: referenceValue(load.pickupSiteId ?? null, ["name"]),
  pickupTime: formatApiDate(load.date),
  deliveryLocation: referenceValue(load.deliverySiteId ?? null, ["name"]),
  deliveryTime: formatApiDate(load.eta),
  assignmentDate:
    load.date && !Number.isNaN(new Date(load.date).getTime())
      ? format(new Date(load.date), "yyyy-MM-dd")
      : null,
  status: load.status?.toLowerCase() ?? "",
  isRejectedByCurrentContractor: Boolean(
    load.rejectedByContractorIds?.some(
      (rejectedContractorId) =>
        rejectedContractorId === userId ||
        rejectedContractorId === contractorId,
    ),
  ),
});

export const AssignLoadPage = () => {
  const { token, user, logout } = useAuth();
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [availableLoads, setAvailableLoads] = useState<AvailableLoad[]>([]);
  const [acceptedLoads, setAcceptedLoads] = useState<string[]>([]);
  const [rejectedLoads, setRejectedLoads] = useState<string[]>([]);
  const [processingLoadId, setProcessingLoadId] = useState<string | null>(null);
  const [assigningLoadId, setAssigningLoadId] = useState<string | null>(null);
  const [driverOptions, setDriverOptions] = useState<SettlementSelectOption[]>(
    [],
  );
  const [truckOptions, setTruckOptions] = useState<SettlementSelectOption[]>(
    [],
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadFormData, setLoadFormData] = useState<
    Record<
      string,
      {
        driver: string;
        truck: string;
        quantity: string;
      }
    >
  >({});
  const from = range?.from ? format(range.from, "yyyy-MM-dd") : undefined;
  const to = range?.to ? format(range.to, "yyyy-MM-dd") : undefined;

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const loadAvailableLoads = async () => {
      try {
        const url = new URL("https://65.1.152.16/api/loads/available");
        if (from) url.searchParams.set("from", from);
        if (to) url.searchParams.set("to", to);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (await hasInvalidOrExpiredTokenError(response)) {
          logout();
          return;
        }

        const payload = (await response
          .json()
          .catch(() => null)) as AvailableLoadsResponse | null;
        setAvailableLoads(
          response.ok && Array.isArray(payload?.data)
            ? payload.data.map((load, index) =>
                mapAvailableLoad(load, index, user?._id, user?.contractorId),
              )
            : [],
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setAvailableLoads([]);
        }
      }
    };

    void loadAvailableLoads();
    return () => controller.abort();
  }, [from, logout, to, token, user?._id, user?.contractorId]);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const loadAssignmentOptions = async () => {
      try {
        const [driversResponse, trucksResponse] = await Promise.all([
          fetch("https://65.1.152.16/api/drivers", {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch("https://65.1.152.16/api/trucks", {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
        ]);

        if (
          (await hasInvalidOrExpiredTokenError(driversResponse)) ||
          (await hasInvalidOrExpiredTokenError(trucksResponse))
        ) {
          logout();
          return;
        }

        const [driversPayload, trucksPayload] = await Promise.all([
          driversResponse
            .json()
            .catch(
              () => null,
            ) as Promise<ListApiResponse<DriverApiItem> | null>,
          trucksResponse
            .json()
            .catch(() => null) as Promise<ListApiResponse<TruckApiItem> | null>,
        ]);

        setDriverOptions(
          driversResponse.ok && Array.isArray(driversPayload?.data)
            ? driversPayload.data
                .filter((driver): driver is DriverApiItem & { _id: string } =>
                  Boolean(driver._id),
                )
                .map((driver) => ({
                  value: driver._id,
                  label: driver.name || "N/A",
                }))
            : [],
        );
        setTruckOptions(
          trucksResponse.ok && Array.isArray(trucksPayload?.data)
            ? trucksPayload.data
                .filter((truck): truck is TruckApiItem & { _id: string } =>
                  Boolean(truck._id),
                )
                .map((truck) => ({
                  value: truck._id,
                  label: truck.unitNumber || truck.truckName || "N/A",
                }))
            : [],
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setDriverOptions([]);
          setTruckOptions([]);
        }
      }
    };

    void loadAssignmentOptions();
    return () => controller.abort();
  }, [logout, token]);

  const updateLoadForm = (
    loadId: string,
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

  const updateLoadDecision = async (
    loadId: string,
    decision: "accept" | "reject",
  ) => {
    if (!token || processingLoadId) return;

    setProcessingLoadId(loadId);

    try {
      const response = await fetch(
        `https://65.1.152.16/api/loads/${encodeURIComponent(loadId)}/${decision}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) return;

      if (decision === "accept") {
        setAcceptedLoads((prev) => [...prev, loadId]);

        setAvailableLoads((prev) =>
          prev.map((item) =>
            item.id === loadId
              ? {
                  ...item,
                  status: "accepted",
                }
              : item,
          ),
        );
      } else {
        setRejectedLoads((prev) => [...prev, loadId]);

        setAvailableLoads((prev) =>
          prev.map((item) =>
            item.id === loadId
              ? {
                  ...item,
                  status: "rejected",
                }
              : item,
          ),
        );
      }
    } finally {
      setProcessingLoadId(null);
    }
  };

  const assignLoad = async (
    load: AvailableLoad,
    formData: { driver: string; truck: string; quantity: string },
  ) => {
    const loadsCount = Number(formData.quantity);
    if (!token || assigningLoadId) {
      return;
    }

    setAssigningLoadId(load.id);

    try {
      const response = await fetch("https://65.1.152.16/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          loadId: load.id,
          driverId: formData.driver,
          truckId: formData.truck,
          date: load.assignmentDate,
          loadsCount,
        }),
      });

      if (await hasInvalidOrExpiredTokenError(response)) {
        logout();
        return;
      }

      if (!response.ok) return;

      setShowSuccessModal(true);
      window.setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setAssigningLoadId(null);
    }
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
        {availableLoads.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#9CA3AF]">
            No Data Found
          </div>
        ) : (
          availableLoads.map((load) => {
            const normalizedStatus = (load.status || "").toLowerCase();
            const hasAcceptedDecision = acceptedLoads.includes(load.id);
            const isRejected =
              normalizedStatus === "rejected" ||
              load.isRejectedByCurrentContractor ||
              rejectedLoads.includes(load.id);
            const isPending = normalizedStatus === "pending";

            const formData = loadFormData[load.id] || {
              driver: "",
              truck: "",
              quantity: "",
            };

            const isAssignDisabled =
              !(formData.driver && formData.truck && formData.quantity) ||
              assigningLoadId === load.id;

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

                    <p className="mt-4 text-[14px] text-[#666666]">
                      {load.rate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-[#3D3D3D]">
                      FSC
                    </p>

                    <p className="mt-4 text-[14px] text-[#666666]">
                      {load.fsc}
                    </p>
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
                      isDisabled={false}
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
                      isDisabled={false}
                    />
                  </div>

                  <div className="flex md:items-center lg:gap-3 gap-2 md:flex-row flex-col">
                    <label className="text-[14px] text-[#7B7B7B]">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) =>
                        updateLoadForm(load.id, "quantity", e.target.value)
                      }
                      placeholder="Enter..."
                      disabled={false}
                      className="h-12 w-full rounded-lg border border-[#A3A3A3] text-[#111827] outline-none px-3 text-sm disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
                    />
                  </div>

                  <button
                    disabled={isAssignDisabled}
                    className={`h-12 px-4 rounded-lg text-white text-[14px] font-semibold ${
                      isAssignDisabled || assigningLoadId === load.id
                        ? "bg-[#C3C9D7] cursor-not-allowed"
                        : "bg-[#315497]"
                    }`}
                    onClick={() => void assignLoad(load, formData)}
                  >
                    Assign Load
                  </button>
                </div>

                {isRejected ? (
                  <div className="mt-8 flex gap-3">
                    <span className="h-10 px-4 rounded-md text-sm bg-[#FF3B0A] text-white flex items-center">
                      Rejected
                    </span>
                  </div>
                ) : (
                  !hasAcceptedDecision &&
                  !isRejected &&
                  isPending && (
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() =>
                          void updateLoadDecision(load.id, "reject")
                        }
                        disabled={processingLoadId === load.id}
                        className="h-10 px-4 rounded-md text-sm bg-[#FF3B0A] text-white"
                      >
                        Reject Load
                      </button>

                      <button
                        onClick={() =>
                          void updateLoadDecision(load.id, "accept")
                        }
                        disabled={processingLoadId === load.id}
                        className="h-10 px-4 rounded-md text-sm bg-[#1EDB2F] text-white"
                      >
                        Accept Load
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })
        )}
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
