import axios from "axios";
import { ApiResponse } from "@/types/api/apiResponse";
import { ProductMutationType } from "@/types/models/productMutation";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

export const getAllProductMutationType = async (): Promise<
  ProductMutationType[]
> => {
  try {
    const response = await axios.get<ApiResponse<ProductMutationType[]>>(
      `${productMutationUrl}/types`,
    );

    return response.data.data;
  } catch {
    throw new Error("Error fetching product mutation type");
  }
};
