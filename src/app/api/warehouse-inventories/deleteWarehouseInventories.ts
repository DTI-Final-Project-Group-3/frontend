import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api/apiResponse";
import {
  ProductMutationProcessRequest,
  ProductMutationRequest,
} from "@/types/models/productMutation";
import axios from "axios";

const warehouseInventoryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_INVENTORIES}`;

interface DeleteWarehouseInventoryRequest
  extends ProductMutationProcessRequest {
  warehouseInventoryId: number;
}

export const deleteWarehouseInventoryById = async ({
  userId,
  notes,
  warehouseInventoryId,
}: DeleteWarehouseInventoryRequest): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete<ApiResponse<any>>(
      `${warehouseInventoryUrl}/${warehouseInventoryId}`,
      {
        data: {
          userId,
          notes,
        },
      },
    );

    toast({
      title: "Success",
      description: "Successfully deleted warehouse inventory",
      duration: 2000,
    });

    return response.data;
  } catch (e) {
    throw new Error("Error deleting warehouse inventory");
  }
};
