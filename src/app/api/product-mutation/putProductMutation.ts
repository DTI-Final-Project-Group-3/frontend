import { ApiResponse } from "@/types/api/apiResponse";
import {
  ProductMutationDetailResponse,
  ProductMutationProcessRequest,
} from "@/types/models/productMutation";
import axios from "axios";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

export const approveManualProductMutation = async ({
  reviewerId,
  reviewerNotes,
}: ProductMutationProcessRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  const response = await axios.put<ApiResponse<ProductMutationDetailResponse>>(
    `${productMutationUrl}/manual/approve`,
    {
      reviewerId,
      reviewerNotes,
    },
  );

  return response.data;
};

export const declineManualProductMutation = async ({
  reviewerId,
  reviewerNotes,
}: ProductMutationProcessRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  const response = await axios.put<ApiResponse<ProductMutationDetailResponse>>(
    `${productMutationUrl}/manual/decline`,
    {
      reviewerId,
      reviewerNotes,
    },
  );

  return response.data;
};
