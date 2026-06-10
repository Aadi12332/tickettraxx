import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  TicketIcon,
  CreditCard,
  FileText,
  MinusCircle,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    label: "Assign Loads",
    icon: <Truck size={18} />,
    path: "/dashboard/assign-loads",
  },
  {
    label: "My Drivers",
    icon: <Users size={18} />,
    children: [
      { label: "All Drivers", path: "/dashboard/drivers" },
      { label: "Add Driver", path: "/dashboard/drivers/add" },
    ],
  },
  {
    label: "Ticket Management",
    icon: <TicketIcon size={18} />,
    children: [
      { label: "All Tickets", path: "/dashboard/tickets" },
      { label: "Create Ticket", path: "/dashboard/tickets/create" },
    ],
  },
  {
    label: "Upcoming Payment",
    icon: <CreditCard size={18} />,
    path: "/dashboard/payments",
  },
  {
    label: "Statement",
    icon: <FileText size={18} />,
    path: "/dashboard/statement",
  },
  {
    label: "Deductions",
    icon: <MinusCircle size={18} />,
    path: "/dashboard/deductions",
  },
  {
    label: "Permissions",
    icon: <Shield size={18} />,
    path: "/dashboard/permissions",
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string[]>([
    "My Drivers",
    "Ticket Management",
  ]);

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <aside className="w-64 h-screen overflow-auto scroll-hide bg-[#0D1826] border-r border-[#1E3A5F]/50 flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-[#1E3A5F]/50">
        <div className={`font-bold tracking-wide text-[24px]`}>
          <span className="text-[#38BDF8]">TICKET</span>
          <span className="text-white">TRAXX</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isExpanded = expanded.includes(item.label);
          const isActive = item.path
            ? location.pathname === item.path
            : (item.children?.some((c) =>
                location.pathname.startsWith(c.path),
              ) ?? false);

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className={`sidebar-item w-full text-left ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#38BDF8]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "text-[#38BDF8] bg-[#1E3A5F]/30"
                              : "text-[#64748B] hover:text-white hover:bg-[#1E3A5F]/20"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path!}
              end
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-[#38BDF8]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
