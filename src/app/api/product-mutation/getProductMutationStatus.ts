import axios from "axios";
import { ProductMutationStatus } from "@/types/models/productMutation";
import { ApiResponse } from "@/types/api/apiResponse";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

export const getAllProductMutationStatus = async (): Promise<
  ProductMutationStatus[]
> => {
  try {
    const response = await axios.get<ApiResponse<ProductMutationStatus[]>>(
      `${productMutationUrl}/statuses`,
    );

    return response.data.data;
  } catch {
    throw new Error("Error fetching product mutation status");
  }
};
