import { useState } from "react";
import { Package, DollarSign, Ticket, CalendarDays } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Load, Alert } from "../types";
import DashIcon1 from "../assets/images/dash-icon-1.png";
import DashIcon2 from "../assets/images/dash-icon-2.png";
import DashIcon3 from "../assets/images/dash-icon-3.png";
import GraphIcon from "../assets/images/graph-icon.svg";
import AlertCircle from "../assets/images/alert-circle.svg";
import ActiveLoadsTable from "./Activeloadstable";
import { LiveTrackingModal } from "./LiveTrackingModal";
import DateRangeModal from "./DateRangeModal";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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

export const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const navigate = useNavigate();

  const rows = [
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
        {statCards.map((card, i) => (
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
                      className="px-5 py-3 text-left text-sm font-semibold text-[#111827]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {recentLoads.map((load) => (
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
                        <img
                          src={load.driverAvatar}
                          alt={load.driver}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="text-[#111827] font-medium">
                          {load.driver}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#111827]">
                      {load.pickup}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[#6B7280]`}>{load.status}</span>
                    </td>
                    <td className="px-5 py-3 text-[#6B7280]">
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

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-[#111827]">Alerts & Issues</h3>
          </div>

          <div className="max-h-[330px] overflow-auto scroll-hide">
            {alerts.map((alert) => (
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
              {[
                { count: 32, label: "Pending\nUpload", bg: "bg-yellow-50" },
                { count: 24, label: "Rejected\nTickets", bg: "bg-blue-50" },
                { count: 10, label: "Incomplete\nLoads", bg: "bg-red-50" },
                { count: 42, label: "Approved\nTickets", bg: "bg-green-50" },
              ].map((s) => (
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
                52
              </span>
              <span className="text-sm text-[#757272] mt-2">
                Active Drivers
              </span>
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <div className="bg-[#0088FF0F] rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-[30px] font-semibold text-[#111827]">
                  Joseph Ken
                </span>
                <span className="text-sm text-[#757272] mt-1">
                  Top Performing
                </span>
              </div>
              <div className="bg-[#0088FF0F] rounded-lg p-5 flex flex-col items-center justify-center">
                <span className="text-[30px] font-semibold text-[#111827]">
                  $27.00
                </span>
                <span className="text-sm text-[#757272] mt-1">
                  Average Driver Pay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActiveLoadsTable />
    </div>
  );
};
