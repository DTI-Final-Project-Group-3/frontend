import { ApiResponse } from "@/types/api/apiResponse";
import {
  ProductMutationRequest,
  ProductMutationManualResponse,
} from "@/types/models/productMutation";
import axios from "axios";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

export const createProductMutationManual = async (
  body: ProductMutationRequest
): Promise<ApiResponse<ProductMutationManualResponse>> => {
  const response = await axios.post<ApiResponse<ProductMutationManualResponse>>(
    `${productMutationUrl}/manual`,
    body
  );
  return response.data;
};
