"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React, { FC, useState } from "react";
import { useProductUser } from "@/store/productUserStore";

const Search: FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useProductUser();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
            value={searchQuery ?? ""}
            onChange={handleSearchInput}
            placeholder="Search..."
            className="placeholder:text-grey-500 w-full border-none !text-[16px] text-lg font-semibold text-gray-700 outline-none placeholder:text-[16px] focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-black text-white transition-all duration-100",
            isFocused ? "bg-black px-4 py-3 text-white" : "p-3",
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
