import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotiIcon from "../assets/images/noti-icon.svg"

type NotificationItem = {
  id: number;
  title: string;
  description: string;
};

type NotificationDrawerProps = {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationItem[]>
  >;
};

export default function NotificationDrawer({
  open,
  onClose,
  notifications,
  setNotifications,
}: NotificationDrawerProps) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[999]"
      />

      <div className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white z-[1000] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#315497]">
          <h2 className="text-[20px] font-semibold text-[#111827]">
            Notifications
          </h2>

          <button onClick={onClose}>
            <X size={24} className="text-[#111827]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {notifications.length ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg border border-[#E5E5E5] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-[#111827]">
                        {notification.title}
                      </h3>

                      <p className="mt-1 text-[14px] text-[#979797]">
                        {notification.description}
                      </p>

                      <button
                        onClick={() =>
                          {navigate("/dashboard/assign-loads");onClose();}
                        }
                        className="mt-4 h-8 px-4 rounded-md bg-[#1CDC30] text-white text-sm font-medium"
                      >
                        Assign to another driver
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.filter(
                            (item) =>
                              item.id !== notification.id
                          )
                        )
                      }
                      className="text-[#C40000] self-start"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <img
                src={NotiIcon}
                alt="No Notifications"
                className="w-[280px] h-[280px] object-contain"
              />

              <h3 className="mt-8 text-[20px] font-medium text-[#111827]">
                No Notifications
              </h3>

              <p className="text-[16px] text-[#979797]">
                Notification Inbox Empty
              </p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 flex justify-center">
            <button
              onClick={() => setNotifications([])}
              className="h-12 px-6 rounded-lg border border-[#FF5B73] text-[#FF5B73] text-sm font-medium"
            >
              Delete All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}