import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  WarehouseInventoryPagination,
  WarehouseInventoryParams,
} from "@/types/models/warehouseInventories";
import axios from "axios";

const warehouseInventoryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_INVENTORIES}`;

export const getPaginatedWarehouseInventories = async ({
  page,
  limit,
  warehouseId,
  searchQuery,
}: WarehouseInventoryParams): Promise<
  PaginationResponse<WarehouseInventoryPagination>
> => {
  const response = await axios.get<
    ApiResponse<PaginationResponse<WarehouseInventoryPagination>>
  >(warehouseInventoryUrl, {
    params: { page, limit, warehouseId, searchQuery },
  });

  if (!response.data || !response.data) {
    throw new Error("Invalid API response structure.");
  }
  return response.data.data;
};
