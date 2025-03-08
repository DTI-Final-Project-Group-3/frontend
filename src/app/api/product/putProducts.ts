import { ProductForm } from "@/types/models/products";
import axios from "axios";
import { ApiResponse } from "@/types/api/apiResponse";

const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCTS}`;

export const updateProductById = async (
  productId: number,
  values: ProductForm,
): Promise<ApiResponse<ProductForm>> => {
  const response = await axios.put<ApiResponse<ProductForm>>(
    `${productUrl}/${productId}`,
    values,
  );

  return response.data;
};
