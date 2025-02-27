import { toast } from "@/hooks/use-toast";
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
  productMutationId,
}: ProductMutationProcessRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  try {
    const response = await axios.put<
      ApiResponse<ProductMutationDetailResponse>
    >(`${productMutationUrl}/manual/approve/${productMutationId}`, {
      reviewerId,
      reviewerNotes,
    });
    toast({
      title: "Approve Mutation success",
      description: "Successfully move product",
      duration: 5000,
    });
    return response.data;
  } catch (error) {
    console.error("Error approving manual product mutation:", error);
    throw error;
  }
};

export const declineManualProductMutation = async ({
  reviewerId,
  reviewerNotes,
  productMutationId,
}: ProductMutationProcessRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  try {
    const response = await axios.put<
      ApiResponse<ProductMutationDetailResponse>
    >(`${productMutationUrl}/manual/decline/${productMutationId}`, {
      reviewerId,
      reviewerNotes,
    });

    return response.data;
  } catch (error) {
    console.error("Error declining manual product mutation:", error);
    throw error;
  }
};
