"use client";

import Link from "next/link";
import { FC, useState } from "react";
import ProductSelection from "../product/ProductSelection";

const InventoryManagementHeader: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center px-4 md:px-7 justify-between gap-4 border-b pb-4 md:pb-7">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
        Inventory Management
      </h2>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Link href={`/admin/product-management/form`}>
          <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition duration-200">
            Add Inventory
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InventoryManagementHeader;
