"use client";

import React, { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { trxStatuses } from "@/constant/orderStatus";
import { useOrderStore } from "@/store/orderStore";
import { CalendarIcon, SearchIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import "react-day-picker/dist/style.css";
import SelectWarehouse from "./component/SelectWarehouse";
import { useSession } from "next-auth/react";

const Filters: FC = () => {
  const { data: session } = useSession();
  const [hasShadow, setHasShadow] = useState(false);

  const { search, statusId, startDate, endDate, setFilters, resetFilters } =
    useOrderStore();

  useEffect(() => {
    const handleScrollShadow = () => setHasShadow(window.scrollY > 100);
    window.addEventListener("scroll", handleScrollShadow);
    return () => window.removeEventListener("scroll", handleScrollShadow);
  }, []);

  console.log("StartDate : ", startDate, "endDate : ", endDate);

  return (
    <div
      className={cn(
        "md:sticky md:top-[70px] z-[40] flex flex-col items-center justify-between gap-8 w-full bg-white rounded-xl p-6 md:p-12",
        hasShadow ? "shadow-lg" : ""
      )}
    >
      <div className="flex md:flex-row flex-col w-full gap-4">
        <div className="relative w-full">
          {/* Search Icon (Left) */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
            <SearchIcon size={22} />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={search || ""}
            onChange={(e) =>
              setFilters({ search: e.target.value || undefined })
            }
            placeholder="Search transaction by invoice code..."
            className="w-full pl-12 pr-10 py-3 border border-gray-300 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />

          {/* Clear (X) Button (Right) */}
          {search && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-lg text-gray-500 hover:text-gray-700"
              onClick={() => setFilters({ search: undefined })}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search by date range */}
        <div className="w-full">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-start gap-3 border border-gray-300 bg-white text-lg text-gray-400 px-3 py-3 rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all w-full">
                <CalendarIcon size={20} />
                {startDate ? (
                  <span className="line-clamp-1 text-black">
                    {format(startDate, "dd MMM yyyy")} -{" "}
                    {endDate ? format(endDate, "dd MMM yyyy") : "..."}
                  </span>
                ) : (
                  <span className="line-clamp-1">Select transaction dates</span>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-4 w-[340px] md:w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg border ">
              <DayPicker
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) =>
                  setFilters({
                    startDate: range?.from || undefined,
                    endDate: range?.to || undefined,
                    page: 0,
                    limit: 10,
                  })
                }
                numberOfMonths={2}
                // className="w-full md:w-auto"
                classNames={{
                  selected: "bg-green-500 border-white text-white",
                  today: "font-bold text-green-500",
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

        {/* Warehouse Select Filter */}
        {session?.role === "ADMIN_SUPER" && (
          <div className="w-full">
            <SelectWarehouse />
          </div>
        )}

        {/* Reset Filters Button */}
        <Button
          variant={session?.role !== "ADMIN_SUPER" ? "default" : "green"}
          onClick={() => {
            resetFilters();
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Select Filter By Status */}
      <div className="w-full">
        <div className="flex items-center gap-3 w-full overflow-x-auto flex-nowrap whitespace-nowrap hide-scrollbar">
          <h3 className="hidden md:block font-bold text-lg">Status</h3>
          {trxStatuses.map((status) => (
            <button
              key={status.id}
              onClick={() =>
                setFilters({ statusId: status.id, page: 0, limit: 10 })
              }
              className={cn(
                "px-4 py-2 text-sm md:text-base font-nurmal border rounded-xl transition-all",
                statusId === status.id
                  ? "bg-green-50 text-green-600 border-green-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
              )}
            >
              {status.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
