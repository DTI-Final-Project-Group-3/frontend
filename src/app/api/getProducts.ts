import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  PaginatedProductParams,
  ProductCategory,
  ProductDetail,
  ProductSummary,
} from "@/types/models/products";
import axios from "axios";

const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCTS}`;
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

export const getNearbyProduct = async ({
  page,
  limit,
  longitude,
  latitude,
  radius,
  productCategoryId,
  searchQuery,
}: PaginatedProductParams): Promise<PaginationResponse<ProductSummary>> => {
  try {
    const response = await axios.get<
      ApiResponse<PaginationResponse<ProductSummary>>
    >(`${productUrl}/nearby`, {
      params: {
        page,
        limit,
        longitude,
        latitude,
        radius,
        productCategoryId,
        searchQuery,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch nearby products");
  }
};

interface LocationParams {
  longitude?: number;
  latitude?: number;
  radius?: number;
}

interface ProductDetailParams extends LocationParams {
  productId: number;
}

export const getProductDetailById = async ({
  productId,
  longitude,
  latitude,
  radius,
}: ProductDetailParams): Promise<ProductDetail> => {
  const response = await axios.get<ApiResponse<ProductDetail>>(
    `${productUrl}/nearby`,
    {
      params: {
        productId: productId,
        longitude: longitude,
        latitude: latitude,
        radius: radius,
      },
    }
  );
  return response.data.data;
};
