"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useProductUser } from "@/store/productUserStore";
import { useDebounce } from "@/hooks/useDebounce";

const Search: FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  const { setSearchQuery } = useProductUser();

  const debouncedSearch = useDebounce(internalSearchQuery, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <label
      htmlFor="search-input"
      className={cn(
        "mr-3 hidden w-full flex-1 cursor-pointer rounded-full border-[1px] px-2 py-2 shadow-sm transition hover:shadow-md md:mr-3 md:block md:max-w-lg",
        isFocused ? "border-neutral-300 shadow-md" : "",
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="w-full pl-4 pr-6 text-lg outline-none">
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            id="search-input"
            type="text"
            value={internalSearchQuery ?? ""}
            onChange={(e) => setInternalSearchQuery(e.target.value)}
            placeholder="Search..."
            className="placeholder:text-grey-500 w-full border-none !text-[16px] text-lg font-semibold text-gray-700 outline-none placeholder:text-[16px] focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-warehub-green text-white transition-all duration-100",
            isFocused ? "bg-warehub-green px-4 py-3 text-white" : "p-3",
          )}
        >
          <div className="flex items-center gap-2">
            <SearchIcon size={20} />
            {isFocused && <span className="text-sm font-semibold">Search</span>}
          </div>
        </div>
      </div>
    </label>
  );
};

export default Search;
