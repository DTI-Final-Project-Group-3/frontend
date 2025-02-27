import React, { FC, useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/app/api/warehouse/getWarehouses";

interface WarohouseSelectionProps {
  warehouseId: number | undefined;
  setWarehouseId: (id: number) => void;
}

const WarehouseSelection: FC<WarohouseSelectionProps> = ({
  warehouseId,
  setWarehouseId,
}) => {
  const {
    data: warehouses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getAllWarehouses,
  });

  return (
    <div className="w-full">
      <Select
        value={warehouseId ? warehouseId.toString() : "all"}
        onValueChange={(value) => setWarehouseId(Number(value))}
      >
        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-600 rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all">
          <SelectValue placeholder="Select Warehouse" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectItem value="all">Select Warehouse</SelectItem>

          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Error loading warehouses
            </SelectItem>
          ) : warehouses?.data && warehouses.data.length === 0 ? (
            <SelectItem value="no-warehouses" disabled>
              No warehouses available
            </SelectItem>
          ) : (
            warehouses?.data?.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                {warehouse.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WarehouseSelection;
