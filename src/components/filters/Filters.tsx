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
import { useDebounce } from "@/hooks/useDebounce";

const Filters: FC = () => {
  const { data: session } = useSession();
  const [hasShadow, setHasShadow] = useState(false);

  const { search, statusId, startDate, endDate, setFilters, resetFilters } =
    useOrderStore();
  const [searchQuery, setSearchQuery] = useState(search || "");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const handleScrollShadow = () => setHasShadow(window.scrollY > 100);
    window.addEventListener("scroll", handleScrollShadow);
    return () => window.removeEventListener("scroll", handleScrollShadow);
  }, []);

  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined });
  }, [debouncedSearch, setFilters]);

  return (
    <div
      className={cn(
        "z-[40] flex w-full flex-col items-center justify-between gap-8 rounded-xl bg-white p-6 md:sticky md:top-[70px] md:p-12",
        hasShadow ? "shadow-lg" : "",
      )}
    >
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="relative w-full">
          {/* Search Icon (Left) */}
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
            <SearchIcon size={22} />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transaction by invoice code..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 text-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Clear (X) Button (Right) */}
          {search && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-lg text-gray-500 hover:text-gray-700"
              onClick={() => {
                setFilters({ search: undefined });
                setSearchQuery("");
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search by date range */}
        <div className="w-full">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center justify-start gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3 text-lg text-gray-400 shadow-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500">
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

            <PopoverContent className="flex w-[340px] flex-col rounded-xl border bg-white p-4 shadow-lg md:w-full md:flex-row">
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
            setSearchQuery("");
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Select Filter By Status */}
      <div className="w-full">
        <div className="hide-scrollbar flex w-full flex-nowrap items-center gap-3 overflow-x-auto whitespace-nowrap">
          <h3 className="hidden text-lg font-bold md:block">Status</h3>
          {trxStatuses.map((status) => (
            <button
              key={status.id}
              onClick={() =>
                setFilters({ statusId: status.id, page: 0, limit: 10 })
              }
              className={cn(
                "font-nurmal rounded-xl border px-4 py-2 text-sm transition-all md:text-base",
                statusId === status.id
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-300 bg-white text-gray-600 hover:border-green-500",
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
