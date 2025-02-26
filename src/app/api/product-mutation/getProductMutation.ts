import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  ProductMutationDetailResponse,
  ProductMutationParams,
} from "@/types/models/productMutation";
import axios from "axios";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

export const getPagiantedProductMutation = async ({
  page,
  limit,
  originWarehouseId,
  destinationWarehouseId,
  mutationTypeId,
}: ProductMutationParams): Promise<
  PaginationResponse<ProductMutationDetailResponse>
> => {
  const response = await axios.get<
    ApiResponse<PaginationResponse<ProductMutationDetailResponse>>
  >(productMutationUrl, {
    params: {
      page,
      limit,
      originWarehouseId,
      destinationWarehouseId,
      mutationTypeId,
    },
  });
  console.log(response.data.data);
  return response.data.data;
};
