import { ProductForm } from "@/types/models/products";
import axios from "axios";

const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCTS}`;

export const updateProductById = async (
  productId: number,
  values: ProductForm
) => {
  const response = await axios.put(`${productUrl}/${productId}`, values);

  console.log(response);
  return response.data;
};
