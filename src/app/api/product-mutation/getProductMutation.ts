import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  ProductMutationDetailResponse,
  ProductMutationParams,
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
