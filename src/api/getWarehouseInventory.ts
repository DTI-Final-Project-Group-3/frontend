import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  PaginatedWarehouseInventoryRequest,
  PaginatedWarehouseInventoryResponse,
} from "@/types/models/warehouseInventories";
import axios from "axios";

const warehouseInventoryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_INVENTORIES}`;

export const getPaginatedWarehouseInventories = async ({
  page,
  limit,
  category,
  search,
}: PaginatedWarehouseInventoryRequest): Promise<
  PaginationResponse<PaginatedWarehouseInventoryResponse>
> => {
  const response = await axios.get<
    ApiResponse<PaginationResponse<PaginatedWarehouseInventoryResponse>>
  >(warehouseInventoryUrl, {
    params: { page, limit, category, search },
  });

  if (!response.data || !response.data.data) {
    throw new Error("Invalid API response structure.");
  }

  return response.data.data;
};
