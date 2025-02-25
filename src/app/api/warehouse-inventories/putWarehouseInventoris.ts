import { ApiResponse } from "@/types/api/apiResponse";
import { ProductMuationQuantity } from "@/types/models/productMutation";
import { WarehouseInventory } from "@/types/models/warehouseInventories";
import axios from "axios";

const warehouseInventoryUrl = process.env.NEXT_PUBLIC_WAREHOUSE_INVENTORIES;

export const updateQuantityWarehouseInventoryById = async (
  productId: number,
  body: ProductMuationQuantity
): Promise<ApiResponse<WarehouseInventory>> => {
  const response = await axios.put<ApiResponse<WarehouseInventory>>(
    `${warehouseInventoryUrl}/quantity/${productId}`,
    body
  );
  return response.data;
};
