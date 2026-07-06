import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CustomSettlementSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-12 px-3 border border-[#A3A3A3] rounded-lg flex items-center justify-between text-left ${
          !value ? "text-[#6B7280]" : "text-[#111827]"
        }`}
      >
        <span className="text-sm">{value || "Select one..."}</span>

        {open ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-[#A3A3A3] rounded-lg mt-1 shadow-lg z-50 overflow-auto max-h-[200px] scroll-hide">
          <button
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm"
          >
            Select one...
          </button>

          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}