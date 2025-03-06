"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC, useEffect } from "react";
import { useReport } from "@/store/reportStore";

interface DatePickerRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange: DateRange;
  setDateRange: (date: DateRange | undefined) => void;
}

const DatePickerRange: FC<DatePickerRangeProps> = ({
  dateRange,
  setDateRange,
  className,
}) => {
  const { dateRange: initialDateRange, setDateRange: setInitialDateRange } =
    useReport();

  useEffect(() => {
    if (
      initialDateRange.from === undefined &&
      initialDateRange.to === undefined
    ) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const latestRange = { from: startOfMonth, to: today };
      setInitialDateRange(latestRange);
    }
  }, [initialDateRange, setInitialDateRange]);

  return (
    <div className={cn("grid", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-full w-full justify-start text-left text-sm font-normal text-gray-700",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={{ after: new Date() }}
            classNames={{
              day_selected:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62]",
              day_range_middle:
                "!bg-[#62AA62]/20 text-[#62AA62]/90 hover:!bg-[#62AA62]/30 hover:text-[#62AA62] focus:!bg-[#62AA62]/30",
              day_range_end:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62]",
              day_range_start:
                "!bg-[#62AA62] text-white hover:!bg-[#62AA62]/90 hover:text-white focus:!bg-[#62AA62]",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerRange;
