import axios from "axios";
import { ApiResponse } from "@/types/api/apiResponse";
import {
  NearbyWarehouseQuantityResponse,
  WarehouseDetail,
} from "@/types/models/warehouses";

const warehouseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSES}`;

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

export const getNearbyWarehouseByProduct = async (
  warehouseId: number,
  productId: number
): Promise<ApiResponse<NearbyWarehouseQuantityResponse[]>> => {
  try {
    const response = await axios.get<
      ApiResponse<NearbyWarehouseQuantityResponse[]>
    >(`${warehouseUrl}/available/all`, {
      params: {
        productId,
        warehouseId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby warehouses by product:", error);
    throw error;
  }
};
