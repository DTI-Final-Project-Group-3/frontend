import axios from "axios";
import { ApiResponse } from "@/types/api/apiResponse";
import { WarehouseDetail } from "@/types/models/warehouses";

const warehouseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSE}`;

export const getNearbyWarehouse = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<WarehouseDetail[]>> => {
  const response = await axios.get<ApiResponse<WarehouseDetail[]>>(
    `${warehouseUrl}/nearby?latitude=${latitude}&longitude=${longitude}`
  );
  return response.data;
};

export const getAllWarehouses = async (): Promise<
  ApiResponse<WarehouseDetail[]>
> => {
  const response = await axios.get<ApiResponse<WarehouseDetail[]>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/warehouses/all`
  );
  return response.data;
};
