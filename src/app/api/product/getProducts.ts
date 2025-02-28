import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import { LocationParams } from "@/types/location";
import {
  PaginatedProductParams,
  ProductBasic,
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
    `${productCategoryUrl}/all`,
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
    },
  );
  return response.data.data;
};

export const getPaginatedProducts = async ({
  page,
  limit,
  productId,
  productCategoryId,
  searchQuery,
}: PaginatedProductParams): Promise<PaginationResponse<ProductSummary>> => {
  const response = await axios.get<
    ApiResponse<PaginationResponse<ProductSummary>>
  >(productUrl, {
    params: {
      page,
      limit,
      productId,
      productCategoryId,
      searchQuery,
    },
  });

  return response.data.data;
};

export const getAllProductList = async (): Promise<ProductBasic[]> => {
  const response = await axios.get<ApiResponse<ProductBasic[]>>(
    `${productUrl}/all`,
  );
  return response.data.data;
};

export const getProductIncludeFilter = async (
  warehouseId: number,
): Promise<ProductBasic[]> => {
  const response = await axios.get<ApiResponse<ProductBasic[]>>(
    `${productUrl}/filter/include`,
    {
      params: {
        warehouseId,
      },
    },
  );
  return response.data.data;
};

export const getProductExcludeFilter = async (
  warehouseId: number,
): Promise<ProductBasic[]> => {
  const response = await axios.get<ApiResponse<ProductBasic[]>>(
    `${productUrl}/filter/exclude`,
    {
      params: {
        warehouseId,
      },
    },
  );
  return response.data.data;
};
