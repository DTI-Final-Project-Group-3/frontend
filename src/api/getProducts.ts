import { ApiResponse } from "@/types/api/apiResponse";
import { ProductCategory } from "@/types/models/products";
import axios from "axios";

const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT}`;
const productCategoryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCTS}${process.env.NEXT_PUBLIC_PRODUCT_CATEGORY}`;

export const getProductCategory = async (): Promise<
  ApiResponse<ProductCategory[]>
> => {
  console.log(productCategoryUrl);
  const response = await axios.get<ApiResponse<ProductCategory[]>>(
    `${productCategoryUrl}/all`
  );
  return response.data;
};
