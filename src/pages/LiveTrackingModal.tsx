import {
  X,
  Truck,
  Clock3,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import MapImg from "../assets/images/map-img.png"

export function LiveTrackingModal({
  load,
  onClose,
}: {
  load: any;
  onClose: () => void;
}) {
  if (!load) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-white w-full lg:max-w-[1150px] max-w-[750px] rounded-lg p-3 text-[#111827]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold">
            Live Shipment Tracking
          </h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_330px] gap-3">
          <div>
            <div className="overflow-hidden rounded-2xl border border-[#373737]">
              <img
                src={MapImg}
                alt=""
                className="w-full object-cover"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-1 text-xs text-[#181818]">
              <span className="font-medium">
                Current Location :
              </span>

              <span className="text-[#0D6EFD]">
                Riverbend Terminal
              </span>

              <span>|</span>

              <span>24 hours speed: 80km/h</span>

              <span>|</span>

              <span>12 hours speed: 84km/h</span>

              <span>|</span>

              <span>Max speed: 104km/h</span>

              <span>|</span>

              <span>Avg speed: 82km/h</span>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <img
                src={load.driverAvatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold text-[14px]">
                  Driver: {load.driver}
                </p>

                <p className="text-[#374151] text-[14px]">
                  Subcontractor: Robert Cooper
                </p>

                <span className="inline-flex text-[12px] px-3 py-1 rounded-md bg-[#FFEDF6] text-[#FD3995] text-xs">
                  Truck ID: TRK-4582
                </span>
              </div>
            </div>

            <div className="border-t my-1" />

            <h3 className="font-semibold text-[14px] text-[#111827] mb-1">
              Load In Progress
            </h3>

            <div className="space-y-1">
              {[1, 2, 3].map((item) => (
                <LoadItem key={item} />
              ))}
            </div>

            <div className="border-t my-1" />

            <h3 className="font-semibold text-[14px] text-[#111827] mb-1">
              Remaining Loads (4)
            </h3>

            <div className="space-y-1">
              {[1, 2, 3, 4].map((item) => (
                <LoadItem key={item} />
              ))}
            </div>

            <div className="border-t my-3" />

            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Mail size={18} />
              </button>

              <button className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Phone size={18} />
              </button>

              <button className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadItem() {
  return (
    <div className="group flex items-center justify-between relative">
      <div className="flex items-center gap-2">
        <Truck size={16} className="text-[#6B7280]" />

        <span className="font-semibold text-[14px] text-[#111827]">
          Load ID:
        </span>

        <span className="text-[14px] text-[#111827]">56743</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock3 size={16} className="text-[#6B7280]" />

        <span className="font-semibold text-[14px] text-[#111827]">
          ETA: <span className="font-normal">2h 15m</span>
        </span>
      </div>

      <div className="absolute right-0 top-[-12px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
        <div className="relative bg-[#3D3D3D] text-white rounded-md px-3 py-2 min-w-[230px]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[#CFCFCF] text-xs">
                Pickup:
              </p>

              <p className="text-xs">
                Sunnyvale Park
              </p>
            </div>

            <div>
              <p className="text-[#CFCFCF] text-xs">
                Delivery:
              </p>

              <p className="text-xs">
                Greenwood Station
              </p>
            </div>
          </div>

          <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-[#3D3D3D]" />
        </div>
      </div>
    </div>
  );
}