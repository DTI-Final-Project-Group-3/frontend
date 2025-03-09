import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import { Order } from "@/types/models/orders/orders";
import axios from "axios";

const toUTCDateString = (date: Date, isEndDate = false) => {
  if (isEndDate) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)).toISOString();
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
};

export const getAllCustomerOrders = async (
  page: number,
  limit: number,
  accessToken: string,
  status?: number,
  search?: string,
  startDate?: Date,
  endDate?: Date,
  warehouseId?: number,
): Promise<ApiResponse<PaginationResponse<Order>>> => {
  const ENDPOINT_URL = "/api/v1/orders";

  // Set query params
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append("customerOrderStatusId", status.toString());
  if (search) params.append("search", search);
  if (startDate) params.append("startDate", toUTCDateString(startDate));
  if (endDate) params.append("endDate", toUTCDateString(endDate, true));
  if (warehouseId) params.append("warehouseId", warehouseId.toString());

  if (!accessToken) {
    toast({
      title: "Access token is missing",
      description: "Please sign in with correct account",
      variant: "destructive",
      duration: 3000,
    });
  }

  // Fetch the API
  const response = await axios.get<ApiResponse<PaginationResponse<Order>>>(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }${ENDPOINT_URL}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};
