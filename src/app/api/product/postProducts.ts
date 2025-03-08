import axios from "axios";
import { ApiResponse } from "@/types/api/apiResponse";
import { ProductForm } from "@/types/models/products";

const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCTS}`;

export const postProducts = async (
  form: ProductForm,
): Promise<ApiResponse<ProductForm>> => {
  const response = await axios.post<ApiResponse<ProductForm>>(productUrl, form);

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data;
};
