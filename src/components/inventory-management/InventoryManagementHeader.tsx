"use client";

import { FC, useState } from "react";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";
import AddInventoryDialog from "./AddInventoryDialog";

const InventoryManagementHeader: FC = () => {
  const { data } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pb-4 sm:flex-row sm:items-center md:px-7 md:pb-7">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Inventory Management
      </h2>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="min-w-80">
          <WarehouseSelection
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 sm:w-auto"
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
        <AddInventoryDialog />
      </div>
    </div>
  );
};

export default InventoryManagementHeader;
