import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Bell,
  User,
  LogOutIcon,
  Settings,
  MenuIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationDrawer from "../../pages/NotificationDrawer";
interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Load was canceled by the driver",
      description:
        "Driver Ahmad Ekstrom Bothman has canceled CELINA's load associated with Job ID #12790.",
    },
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="p-5 pb-0 sticky top-0 z-10">
      <div className="sm:h-[71px] h-14 bg-white border-b rounded-full border-gray-200 flex items-center justify-between sm:px-6 px-3 flex-shrink-0 shadow-[0px_4px_15.4px_0px_#0000001C]">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <MenuIcon size={20} />
          </button>
          <div className="relative hidden sm:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 bg-gray-50 border border-[#BFC5D1] rounded-lg text-sm text-gray-700 outline-none transition-colors w-64"
            />
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
            <Settings size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors sm:hidden">
            <Settings size={24} />
          </button>
          <div className="relative">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <MessageCircle size={24} />
            </button>
            <span className="bg-[#1B84FF] absolute top-0 right-1 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px]">
              5
            </span>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Mail size={24} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={24} />
              <span className="bg-red-500 absolute top-0 right-1 rounded-full w-3.5 h-3.5 flex items-center text-white justify-center text-[8px]">
                2
              </span>
            </button>

            <NotificationDrawer
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>

          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-9 h-9 rounded-full relative bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm transition-all"
            >
              {user?.name?.[0] ?? "A"}
              <span className="bg-green-500 absolute bottom-0 right-1 rounded-full w-2 h-2 border border-white flex items-center text-white justify-center"></span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="p-1">
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
