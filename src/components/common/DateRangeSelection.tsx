import React, { FC, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangeSelectionProps {
  dateRange: DateRange;
  setDateRange: (val: DateRange | undefined) => void;
  preSelect?: boolean;
}

const DateRangeSelection: FC<DateRangeSelectionProps> = ({
  dateRange,
  setDateRange,
  preSelect = true,
}) => {
  useEffect(() => {
    if (!preSelect) return;
    if (dateRange.from === undefined && dateRange.to === undefined) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const latestRange = { from: startOfMonth, to: today };
      setDateRange(latestRange);
    }
  }, [dateRange, preSelect, setDateRange]);

  return (
    <div className="h-full w-full">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex h-full w-full items-center justify-start gap-3 rounded-lg border border-gray-300 bg-white px-2 text-gray-400 shadow-sm transition-all hover:border-green-500 focus:border-2 focus:border-warehub-green">
            <CalendarIcon size={20} />
            {dateRange.from ? (
              <span className="line-clamp-1 text-sm text-gray-600">
                {format(dateRange.from, "dd MMM yyyy")} -{" "}
                {dateRange.to ? format(dateRange.to, "dd MMM yyyy") : "..."}
              </span>
            ) : (
              <span className="line-clamp-1 text-sm text-gray-600">
                Select dates
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="flex w-[340px] flex-col rounded-xl border bg-white p-4 shadow-lg md:w-full md:flex-row">
          <DayPicker
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => setDateRange(range)}
            numberOfMonths={1}
            classNames={{
              today: "font-bold text-green-500",
              button_next: "font-bold text-green-500",
              button_previous: "font-bold text-green-500",
              selected:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62]",
              range_middle:
                "!bg-[#62AA62]/20 text-[#62AA62]/90 hover:!bg-[#62AA62]/30 hover:text-[#62AA62] focus:!bg-[#62AA62]/30",
              range_end:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62] rounded-r-2xl",
              range_start:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62] rounded-l-2xl",
            }}
            styles={{
              month_caption: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                fontWeight: "semibold",
              },
            }}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelection;
