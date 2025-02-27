import React, { FC } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getNearbyWarehouseByProduct } from "@/app/api/warehouse/getWarehouses";
import { formatDistance } from "@/utils/formatter";
import { useProductMutation } from "@/store/productMutationStore";

const AvailableWarehouseSelection: FC = () => {
  const {
    destinationWarehouseId,
    productId,
    originWarehouseId,
    setOriginWarehouseId,
  } = useProductMutation();

  const {
    data: warehouses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["available-warehouse", productId],
    queryFn: () => {
      if (destinationWarehouseId !== undefined && productId !== undefined) {
        return getNearbyWarehouseByProduct(destinationWarehouseId, productId);
      }
      return Promise.reject("Invalid product or warehouse ID");
    },
    enabled: !!destinationWarehouseId && !!productId,
  });

  const handleValueChange = (value: string) => {
    setOriginWarehouseId(Number(value));
  };

  return (
    <div className="w-full">
      <Select
        value={originWarehouseId ? originWarehouseId.toString() : "all"}
        onValueChange={handleValueChange}
        disabled={!destinationWarehouseId || !productId}
      >
        <SelectTrigger
          className="w-full border border-gray-300 bg-white text-gray-600 rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
          disabled={!destinationWarehouseId || !productId}
        >
          <SelectValue>
            {warehouses?.data.find(
              (warehouse) => warehouse.id === originWarehouseId
            )?.name || "Select Nearby Available Warehouse"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectItem value="all">Select Nearby Available Warehouse</SelectItem>

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
              No warehouse available
            </SelectItem>
          ) : (
            warehouses?.data?.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                <div className="flex flex-col p-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-800">
                    {warehouse.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Available: {warehouse.totalQuantity}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistance(warehouse.distanceInMeters)} away
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AvailableWarehouseSelection;
