"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";
import { SearchIcon } from "lucide-react";
import React, { FC, useState } from "react";

const Search: FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <label
      htmlFor="search-input"
      className={cn(
        "hidden md:block border-[1px] w-full md:max-w-lg py-2 px-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer md:mr-3 mr-3 flex-1",
        isFocused ? "shadow-md border-neutral-300" : ""
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-lg pl-4 pr-6 w-full outline-none">
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search..."
            className="w-full outline-none text-gray-700 text-lg font-semibold focus-visible:ring-offset-0 placeholder:text-grey-500 placeholder:text-[16px] !text-[16px] border-none focus-visible:ring-transparent"
          />
        </div>
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-100 bg-black text-white rounded-full",
            isFocused ? "px-4 py-3 bg-black text-white" : "p-3"
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
