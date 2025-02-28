import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api/apiResponse";
import {
  ProductMutationDetailResponse,
  ProductMutationProcessRequest,
} from "@/types/models/productMutation";
import axios from "axios";

const productMutationUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_PRODUCT_MUTATIONS}`;

interface ProcessMutationRequest extends ProductMutationProcessRequest {
  productMutationId: number;
}

export const approveManualProductMutation = async ({
  userId,
  notes,
  productMutationId,
}: ProcessMutationRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  try {
    const response = await axios.put<
      ApiResponse<ProductMutationDetailResponse>
    >(`${productMutationUrl}/manual/approve/${productMutationId}`, {
      userId,
      notes,
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
  userId,
  notes,
  productMutationId,
}: ProcessMutationRequest): Promise<
  ApiResponse<ProductMutationDetailResponse>
> => {
  try {
    const response = await axios.put<
      ApiResponse<ProductMutationDetailResponse>
    >(`${productMutationUrl}/manual/decline/${productMutationId}`, {
      userId,
      notes,
    });

    return response.data;
  } catch (error) {
    console.error("Error declining manual product mutation:", error);
    throw error;
  }
};
