import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Truck,
  Users,
  FileText,
  ChevronDown,
  Ticket,
  Package,
  ChevronUp,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Assign Loads",
    path: "/dashboard/assign-loads",
  },
  {
    label: "My Drivers",
    children: [
      {
        label: "Drivers",
        icon: <Users size={34} />,
        path: "/dashboard/drivers",
      },
      {
        label: "Active Loads",
        icon: <Package size={34} />,
        path: "/dashboard/active-loads",
      },
      {
        label: "Truck Details",
        icon: <Truck size={34} />,
        path: "/dashboard/trucks",
      },
    ],
  },
  {
    label: "Ticket Management",
    children: [
      {
        label: "Upload Tickets",
        icon: <Ticket size={34} />,
        path: "/dashboard/upload-tickets",
      },
      {
        label: "Ticket Status",
        icon: <FileText size={34} />,
        path: "/dashboard/tickets",
      },
    ],
  },
  {
    label: "Upcoming Payment",
    path: "/dashboard/payments",
  },
  {
    label: "Statement",
    path: "/dashboard/statement",
  },
  {
    label: "Deductions",
    path: "/dashboard/deductions",
  },
  {
    label: "Permissions",
    path: "/dashboard/permissions",
  },
];
interface SidebarProps {
  setSidebarOpen?: (value: boolean) => void;
}

export const Sidebar = ({
  setSidebarOpen,
}: SidebarProps) => {
  const [expanded, setExpanded] = useState(["My Drivers", "Ticket Management"]);

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleNavClick = () => {
  setSidebarOpen?.(false);
};

  return (
    <aside className="p-5 pr-0">
      <div className="w-[270px] h-[calc(100vh-40px)] overflow-auto scroll-hide flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-[#1E3A5F]/50 rounded-xl bg-[#1D3461]">
          <div
            className={`font-bold tracking-wide text-[20px] flex items-center justify-center`}
          >
            <span className="text-[#38BDF8]">TICKET</span>
            <span className="text-white">TRAXX</span>
          </div>
        </div>

        <nav className="bg-[#1D3461] rounded-xl p-4 space-y-3 mt-4 h-[calc(100vh-100px)] overflow-auto scroll-hide">
          {navItems.map((item) => {
            const isExpanded = expanded.includes(item.label);

            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggle(item.label)}
                    className="w-full h-[48px] px-3 rounded-lg bg-white flex items-center justify-between text-[#222222] text-[14px] font-medium shadow-[0px_2px_6px_rgba(0,0,0,0.08)]"
                  >
                    <span>{item.label}</span>

                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `
                            rounded-lg
                            text-sm
                            bg-white
                            flex
                            flex-col
                            items-center
                            justify-start
                            gap-3
                            text-center
                            px-3
                            py-3
                            border
                            ${isActive ? "!bg-[#3A3A3A] text-white border-[#FFFFFF80]" : "text-[#181818] border-transparent"}
                          `
                          }
                        >
                          <div>{child.icon}</div>

                          <span>
                            {child.label}
                          </span>
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
                onClick={handleNavClick}
                end
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    h-[48px]
                    px-3
                    rounded-lg
                    text-[14px]
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-[#3A3A3A] text-white border border-[#6F6F6F]"
                        : "bg-white text-[#222222]"
                    }
                  `
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
