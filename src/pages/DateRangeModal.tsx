import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import "react-day-picker/dist/style.css";

type Props = {
  open: boolean;
  onClose: () => void;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};

export default function DateRangeModal({
  open,
  onClose,
  value,
  onChange,
}: Props) {
  if (!open) return null;

  const today = new Date();

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 !mt-0">
      <div className="bg-white w-full max-w-[400px] z-[9999] rounded-xl p-5 text-[#111827] relative">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={onChange}
          showOutsideDays
          classNames={{
            months: "flex justify-center",
            month: "space-y-3",
            caption: "flex justify-between items-center mb-4 px-4",
            caption_label: "text-[24px] font-bold text-black flex text-center w-full justify-center gap-4",
            nav: "flex gap-4 absolute w-full justify-between top-0",
            nav_button: "h-12 w-12 border border-[#D9D9D9] rounded-full flex items-center justify-center",
            table: "w-full",
            head_row: "flex",
            head_cell: "w-12 h-12 text-[#9CA3AF] font-medium text-[14px]",
            row: "flex mt-2",
            cell: "w-12 h-12 text-center relative",
            day: "w-12 h-12 text-center rounded-full text-[14px]",
            day_selected:
              "bg-[#315497] text-white hover:bg-[#315497]",
            day_range_middle:
              "bg-[#E8EEFF] text-[#315497]",
            day_today:
              "border border-[#315497] text-[#315497]",
          } as any }
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft size={28} />
              ) : (
                <ChevronRight size={28} />
              ),
          }}
        />

        <div className="border-t mt-3 pt-3">
          <div className="flex gap-4 mb-5">
            <button
              onClick={() =>
                onChange({
                  from: today,
                  to: today,
                })
              }
              className="flex-1 h-12 rounded-lg bg-[#F5F5F5] text-sm"
            >
              Today
            </button>

            <button
              onClick={() =>
                onChange({
                  from: startOfWeek(today),
                  to: endOfWeek(today),
                })
              }
              className="flex-1 h-12 rounded-lg bg-[#F5F5F5] text-sm"
            >
              This Week
            </button>

            <button
              onClick={() =>
                onChange({
                  from: startOfMonth(today),
                  to: endOfMonth(today),
                })
              }
              className="flex-1 h-12 rounded-lg bg-[#F5F5F5] text-sm"
            >
              This Month
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="h-12 rounded-lg px-5 border border-[#D1D5DB] text-[#6B7280] text-sm"
            >
              Cancel
            </button>

            <button
              onClick={onClose}
              className="h-12 rounded-lg px-5 bg-[#315497] text-white text-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}