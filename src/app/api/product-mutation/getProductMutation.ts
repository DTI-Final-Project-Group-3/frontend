import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  ProductMutationDetailResponse,
  ProductMutationParams,
  ProductMutationReportDailySummaryResponse,
  ProductMutationHistoryParams,
  ProductMutationReportResponse,
  ProductMutationReportTotalResponse,
} from "@/types/models/productMutation";
import axios from "axios";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

const axiosInstance = axios.create({
  paramsSerializer: {
    indexes: null,
  },
});

export const getPaginatedProductMutation = async ({
  page,
  limit,
  originWarehouseId,
  destinationWarehouseId,
  productMutationTypeId,
}: ProductMutationParams): Promise<
  PaginationResponse<ProductMutationDetailResponse>
> => {
  const response = await axiosInstance.get<
    ApiResponse<PaginationResponse<ProductMutationDetailResponse>>
  >(productMutationUrl, {
    params: {
      page,
      limit,
      originWarehouseId,
      destinationWarehouseId,
      productMutationTypeId,
    },
  });
  return response.data.data;
};

export const getProductMutationHistory = async ({
  startedAt,
  endedAt,
  productId,
  productCategoryId,
  productMutationTypeId,
  productMutationStatusId,
  warehouseId,
}: ProductMutationHistoryParams): Promise<ProductMutationReportResponse[]> => {
  const response = await axios.get<
    ApiResponse<ProductMutationReportResponse[]>
  >(`${productMutationUrl}/history`, {
    params: {
      startedAt,
      endedAt,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
      warehouseId,
    },
  });
  return response.data.data;
};

export const getProductMutationReportTotal = async ({
  startedAt,
  endedAt,
  productId,
  productCategoryId,
  productMutationTypeId,
  productMutationStatusId,
  warehouseId,
}: ProductMutationHistoryParams): Promise<
  ApiResponse<ProductMutationReportTotalResponse>
> => {
  const response = await axios.get<
    ApiResponse<ProductMutationReportTotalResponse>
  >(`${productMutationUrl}/total`, {
    params: {
      startedAt,
      endedAt,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
      warehouseId,
    },
  });
  return response.data;
};

export const getProductMutationReportDailySummary = async ({
  startedAt,
  endedAt,
  productId,
  productCategoryId,
  productMutationTypeId,
  productMutationStatusId,
  warehouseId,
}: ProductMutationHistoryParams): Promise<
  ProductMutationReportDailySummaryResponse[]
> => {
  const response = await axios.get<
    ApiResponse<ProductMutationReportDailySummaryResponse[]>
  >(`${productMutationUrl}/daily`, {
    params: {
      startedAt,
      endedAt,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
      warehouseId,
    },
  });

  return response.data.data;
};
