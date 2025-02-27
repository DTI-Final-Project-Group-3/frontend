import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api/apiResponse";
import {
  WarehouseInventory,
  WarehouseInventoryCreateRequest,
} from "@/types/models/warehouseInventories";
import axios from "axios";

const warehouseInventoryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_INVENTORIES}`;

interface WarehouseInventoryBasic {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
}

export const createWarehouseInventory = async ({
  productId,
  warehouseId,
  quantity,
}: WarehouseInventoryCreateRequest): Promise<
  ApiResponse<WarehouseInventoryBasic>
> => {
  try {
    const response = await axios.post<ApiResponse<WarehouseInventoryBasic>>(
      warehouseInventoryUrl,
      {
        productId,
        warehouseId,
        quantity,
      },
    );
    console.log(warehouseInventoryUrl);
    return response.data;
  } catch (e) {
    throw new Error("Error creating warehouse inventory");
  }
};
