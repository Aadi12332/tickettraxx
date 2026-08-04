import { useEffect, useState } from "react";
import { Package, DollarSign, Ticket, CalendarDays } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Load, Alert } from "../types";
import DashIcon1 from "../assets/images/dash-icon-1.png";
import DashIcon2 from "../assets/images/dash-icon-2.png";
import DashIcon3 from "../assets/images/dash-icon-3.png";
import GraphIcon from "../assets/images/graph-icon.svg";
import AlertCircle from "../assets/images/alert-circle.svg";
import ActiveLoadsTable, { ActiveLoad } from "./Activeloadstable";
import { LiveTrackingModal } from "./LiveTrackingModal";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { endOfDay, format, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { hasInvalidOrExpiredTokenError } from "../utils/api";

const statCards = [
  {
    icon: <Package size={18} className="text-[#fff]" />,
    badge: { label: "+19.01%", positive: true },
    value: "$88,650",
    description: "Total Earnings (Year to Date)",
  },
  {
    icon: <DollarSign size={18} className="text-[#fff]" />,
    badge: { label: "-16%", positive: false },
    value: "$28,930",
    description: "Pending Payment",
  },
  {
    icon: <Ticket size={18} className="text-[#fff]" />,
    badge: { label: "+6%", positive: true },
    value: "142",
    description: "Upcoming Tickets Due This Friday",
  },
];

const recentLoads: Load[] = [
  {
    id: "1",
    ticketId: "SH-10452",
    driver: "Ajay S",
    driverAvatar: "https://i.pravatar.cc/40?img=11",
    pickup: "JDT Trucking",
    dropoff: "",
    status: "In Transit",
    deliveryDate: "24 Feb",
  },
  {
    id: "2",
    ticketId: "SH-10452",
    driver: "Vikram P",
    driverAvatar: "https://i.pravatar.cc/40?img=52",
    pickup: "Goodram Concrete",
    dropoff: "",
    status: "Delivered",
    deliveryDate: "23 Feb",
  },
  {
    id: "3",
    ticketId: "SH-10452",
    driver: "Imran K",
    driverAvatar: "https://i.pravatar.cc/40?img=33",
    pickup: "Eagib Augestca",
    dropoff: "",
    status: "Delayed",
    deliveryDate: "23 Feb",
  },
  {
    id: "4",
    ticketId: "SH-10452",
    driver: "Ajay S",
    driverAvatar: "https://i.pravatar.cc/40?img=11",
    pickup: "Eagib Augestca",
    dropoff: "",
    status: "In Transit",
    deliveryDate: "24 Feb",
  },
  {
    id: "5",
    ticketId: "SH-10452",
    driver: "Vikram P",
    driverAvatar: "https://i.pravatar.cc/40?img=52",
    pickup: "Goodram Concrete",
    dropoff: "",
    status: "Delivered",
    deliveryDate: "23 Feb",
  },
];

const alerts: Alert[] = [
  {
    id: "1",
    message: "5 Shipments Delayed > 24 hours",
    type: "error",
    time: "09:25 PM",
  },
  {
    id: "2",
    message: "2 Subcontractors Low Rating (< 3.5)",
    type: "warning",
    time: "09:25 PM",
  },
  {
    id: "3",
    message: "3 Trucks Maintenance Overdue",
    type: "error",
    time: "09:25 PM",
  },
  {
    id: "4",
    message: "12 Pending Payments",
    type: "warning",
    time: "09:25 PM",
  },
  {
    id: "5",
    message: "5 Shipments Delayed > 24 hours",
    type: "error",
    time: "09:25 PM",
  },
];

type DashboardRecentLoad = {
  ticketId: string;
  ticketNo: string;
  driver: { name: string } | null;
  pickup: { name: string } | null;
  dropoff: { name: string } | null;
  status: Load["status"];
  deliveryDate: string;
};

type DashboardAlert = {
  _id?: string;
  id?: string;
  message: string;
  type?: Alert["type"];
  severity?: "error" | "warning";
  createdAt?: string;
  date?: string;
  time?: string;
};

type ContractorDashboardData = {
  totalEarningsYTD: number;
  pendingPayment: number;
  upcomingTicketsDue: number;
  recentLoads: DashboardRecentLoad[];
  alerts: DashboardAlert[];
  ticketStatusBreakdown: {
    pendingUpload: number;
    rejectedTickets: number;
    incompleteLoads: number;
    approvedTickets: number;
  };
  settlementOverview: {
    dueThisFriday: number;
    unsettledTickets: number;
    invoicedAmount: number;
  };
  contractorDrivers: {
    activeDrivers: number;
    topPerformingDriver: { name: string } | null;
    averageDriverPay: number;
  };
  activeLoads: Array<{
    assignmentId: string;
    driverName: string;
    clientName: string;
    date: string;
    loads: number;
    status: ActiveLoad["status"];
  }>;
};

type ContractorDashboardResponse = {
  data: ContractorDashboardData;
};

const formatCurrency = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [dashboardData, setDashboardData] = useState<ContractorDashboardData | null>(null);
  const navigate = useNavigate();
  const startDate = range?.from ? format(range.from, "yyyy-MM-dd") : undefined;
  const endDate = range?.to ? format(range.to, "yyyy-MM-dd") : undefined;

  const isInSelectedDateRange = (dateValue?: string) => {
    if (!range?.from && !range?.to) return true;
    if (!dateValue) return false;

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return false;

    return (
      (!range.from || date >= startOfDay(range.from)) &&
      (!range.to || date <= endOfDay(range.to))
    );
  };

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const url = new URL("https://65.1.152.16/api/dashboard/contractor");
        if (startDate) url.searchParams.set("startDate", startDate);
        if (endDate) url.searchParams.set("endDate", endDate);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (await hasInvalidOrExpiredTokenError(response)) {
          logout();
          return;
        }

        const payload = (await response.json().catch(() => null)) as ContractorDashboardResponse | null;

        if (response.ok && payload?.data) {
          setDashboardData(payload.data);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          // The existing dashboard values remain visible if the request fails.
        }
      }
    };

    void loadDashboard();
    return () => controller.abort();
  }, [token, startDate, endDate, logout]);

  const liveRecentLoads: Load[] = dashboardData
    ? dashboardData.recentLoads
        .filter((load) => isInSelectedDateRange(load.deliveryDate))
        .map((load) => ({
        id: load.ticketId,
        ticketId: load.ticketNo,
        driver: load.driver?.name ?? "-",
        pickup: [load.pickup?.name, load.dropoff?.name].filter(Boolean).join(" - "),
        dropoff: load.dropoff?.name ?? "",
        status: load.status,
        deliveryDate: format(new Date(load.deliveryDate), "dd MMM"),
        }))
    : recentLoads;
  const liveAlerts: Alert[] = dashboardData
    ? dashboardData.alerts
        .filter((alert) => isInSelectedDateRange(alert.createdAt ?? alert.date))
        .map((alert, index) => ({
        id: alert._id ?? alert.id ?? String(index),
        message: alert.message,
        type: alert.type ?? alert.severity ?? "warning",
        time: alert.time ?? (alert.createdAt ? format(new Date(alert.createdAt), "hh:mm a") : ""),
        }))
    : alerts;
  const liveActiveLoads: ActiveLoad[] | undefined = dashboardData?.activeLoads
    .filter((load) => isInSelectedDateRange(load.date))
    .map((load) => ({
      id: load.assignmentId,
      driverName: load.driverName,
      clientName: load.clientName,
      date: format(new Date(load.date), "dd/MM/yyyy"),
      material: "-",
      pickup: "-",
      deliver: "-",
      loads: load.loads,
      status: load.status,
    }));

  const liveStatCards = dashboardData
    ? [
        { ...statCards[0], value: formatCurrency(dashboardData.totalEarningsYTD) },
        { ...statCards[1], value: formatCurrency(dashboardData.pendingPayment) },
        { ...statCards[2], value: String(dashboardData.upcomingTicketsDue) },
      ]
    : statCards;

  const rows = dashboardData ? [
    {
      label: "Due This Friday:",
      value: formatCurrency(dashboardData.settlementOverview.dueThisFriday, 2),
      valueClass: "text-[#111827] font-bold text-lg",
      onClick: () => navigate("/dashboard/payments"),
    },
    {
      label: "Unsettled Tickets",
      value: String(dashboardData.settlementOverview.unsettledTickets),
      suffix: "active",
      valueClass: "font-bold text-[#111827] text-base",
      onClick: () => navigate("/dashboard/tickets"),
    },
    {
      label: "Invoiced Amount",
      value: formatCurrency(dashboardData.settlementOverview.invoicedAmount, 2),
      valueClass: "font-bold text-[#1D3461] text-lg",
      onClick: () => {},
    },
  ] : [
    {
      label: "Due This Friday:",
      value: "$148,320.75",
      valueClass: "text-[#111827] font-bold text-lg",
      onClick: () => navigate("/dashboard/payments"),
    },
    {
      label: "Unsettled Tickets",
      value: "134",
      suffix: "active",
      valueClass: "font-bold text-[#111827] text-base",
      onClick: () => navigate("/dashboard/tickets"),
    },
    {
      label: "Invoiced Amount",
      value: "$76,523.00",
      valueClass: "font-bold text-[#1D3461] text-lg",
      onClick: () => {},
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <h1 className="text-[24px] font-bold text-[#111827]">
          Contractor Dashboard
        </h1>
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

      <div className="relative z-0 flex flex-col justify-center items-start overflow-hidden rounded-lg bg-gradient-to-r from-[#2C54A4] to-[#0C224C] min-h-[136px] lg:p-10 p-5 text-white">
        <div className="relative z-10">
          <h2 className="text-[24px] font-bold">
            Welcome Back, {user?.name ?? "Adrian"}
          </h2>
          <p className="text-[#F8F9FA] mt-1 text-sm">
            14 New Shipments Today !!!
          </p>
        </div>
        <img src={DashIcon1} alt="" className="absolute top-0 left-0" />
        <img src={DashIcon2} alt="" className="absolute right-0 bottom-0" />
        <img src={DashIcon3} alt="" className="absolute top-0 right-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {liveStatCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 bg-[#1D3461] rounded-lg flex items-center justify-center">
                {card.icon}
              </div>
              <span
                className={`text-xs text-white px-2.5 py-1 rounded-md ${
                  card.badge.positive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {card.badge.label}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[24px] font-bold text-[#111827]">
                  {card.value}
                </p>
                <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                  {card.description}
                </p>
              </div>
              <img src={GraphIcon} alt="" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-[#111827]">Recent Loads</h3>
          </div>

          <div className="max-h-[330px] overflow-auto scroll-hide">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-[#E5E7EB]">
                  {[
                    "Ticket ID",
                    "Driver",
                    "Pickup - Drop-off",
                    "Status",
                    "Delivery Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-left text-sm font-semibold text-[#111827] ${
                        h === "Status" ? "min-w-[110px]" : h === "Delivery Date" ? "min-w-[140px]" : "min-w-[100px]"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {liveRecentLoads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#9CA3AF]">
                      No Data Found
                    </td>
                  </tr>
                ) : liveRecentLoads.map((load) => (
                  <tr
                    key={load.id}
                    onClick={() => setSelectedLoad(load)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-[#111827] font-medium">
                      {load.ticketId}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {/* <img
                          src={load.driverAvatar}
                          alt={load.driver}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        /> */}
                        <span className="text-[#111827] font-medium">
                          {load.driver}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#111827]">
                      {load.pickup}
                    </td>
                    <td className="px-5 py-3 min-w-[110px]">
                      <span className={`text-[#6B7280]`}>{load.status}</span>
                    </td>
                    <td className="px-5 py-3 text-[#6B7280] min-w-[140px]">
                      {load.deliveryDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <LiveTrackingModal
          load={selectedLoad}
          onClose={() => setSelectedLoad(null)}
        />

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-[#111827]">Alerts & Issues</h3>
          </div>

          <div className="max-h-[330px] overflow-auto scroll-hide flex-1">
            {liveAlerts.length === 0 ? (
              <div className="px-5 py-5 text-center text-sm text-[#9CA3AF] h-full flex items-center justify-center">
                No Data Found
              </div>
            ) : liveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white ${
                    alert.type === "error" ? "bg-red-500" : "bg-yellow-400"
                  }`}
                >
                  <img src={AlertCircle} alt="alert circle" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111827] font-medium flex items-center gap-1.5">
                    <span>{alert.type === "error" ? "🔴" : "🟡"}</span>
                    {alert.message}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-[#111827] mb-4">
              Ticket Status Breakdown
            </h3>
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-3">
              {(dashboardData
                ? [
                    { count: dashboardData.ticketStatusBreakdown.pendingUpload, label: "Pending\nUpload", bg: "bg-yellow-50" },
                    { count: dashboardData.ticketStatusBreakdown.rejectedTickets, label: "Rejected\nTickets", bg: "bg-blue-50" },
                    { count: dashboardData.ticketStatusBreakdown.incompleteLoads, label: "Incomplete\nLoads", bg: "bg-red-50" },
                    { count: dashboardData.ticketStatusBreakdown.approvedTickets, label: "Approved\nTickets", bg: "bg-green-50" },
                  ]
                : [
                    { count: 32, label: "Pending\nUpload", bg: "bg-yellow-50" },
                    { count: 24, label: "Rejected\nTickets", bg: "bg-blue-50" },
                    { count: 10, label: "Incomplete\nLoads", bg: "bg-red-50" },
                    { count: 42, label: "Approved\nTickets", bg: "bg-green-50" },
                  ]).map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-lg p-4 flex flex-col items-center text-center`}
                >
                  <span className="text-[30px] font-semibold text-[#111827]">
                    {s.count}
                  </span>
                  <span className="text-xs text-[#4C4C4C] mt-1 whitespace-pre-line">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111827]">
                Settlement Overview
              </h3>
              <button className="text-xs bg-[#F8F9FA] text-[#111827] rounded-lg px-3 py-2">
                View All
              </button>
            </div>
            <div className="divide-y divide-[#B3B3B3] px-5">
              {rows.map((row) => (
                <div
                  key={row.label}
                  onClick={row.onClick}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[#111827]">
                    {row.label}
                  </span>

                  <span className={`text-[20px] ${row.valueClass}`}>
                    {row.value}

                    {row.suffix && (
                      <span className="text-gray-400 text-sm font-normal ml-1">
                        {row.suffix}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-[#111827] mb-4">
            Contractor Drivers
          </h3>
          <div className="flex flex-col gap-3 h-[calc(100%-2rem)]">
            <div className="bg-[#0088FF0F] rounded-lg p-6 flex flex-col items-center justify-center flex-1">
              <span className="text-[30px] font-semibold text-[#111827]">
                {dashboardData?.contractorDrivers.activeDrivers ?? 52}
              </span>
              <span className="text-sm text-[#757272] mt-2">
                Active Drivers
              </span>
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <div className="bg-[#0088FF0F] rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-[30px] font-semibold text-[#111827]">
                  {dashboardData?.contractorDrivers.topPerformingDriver?.name ?? "N/A"}
                </span>
                <span className="text-sm text-[#757272] mt-1">
                  Top Performing
                </span>
              </div>
              <div className="bg-[#0088FF0F] rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-[30px] font-semibold text-[#111827]">
                  {dashboardData ? formatCurrency(dashboardData.contractorDrivers.averageDriverPay, 2) : "$27.00"}
                </span>
                <span className="text-sm text-[#757272] mt-1">
                  Average Driver Pay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActiveLoadsTable loads={liveActiveLoads} />
    </div>
  );
};
