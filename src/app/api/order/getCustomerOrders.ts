import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";
import {
  CustomerOrderHistoryRequestParams,
  CustomerOrderHistoryResponse,
  Order,
} from "@/types/models/orders/orders";
import axios from "axios";

const customerOrderUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`;

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
  if (startDate) params.append("startDate", startDate.toISOString());
  if (endDate) params.append("endDate", endDate.toISOString());
  if (warehouseId) params.append("warehouseId", warehouseId.toString());

  console.log("whid:", warehouseId);

  if (!accessToken) {
    throw new Error("Access token is missing");
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

export const getHistoryCustomerOrders = async ({
  page,
  limit,
  startDate,
  endDate,
  warehouseId,
  customerOrderStatusId,
  productId,
  productCategoryId,
  accessToken,
}: CustomerOrderHistoryRequestParams): Promise<
  PaginationResponse<CustomerOrderHistoryResponse>
> => {
  const response = await axios.get<
    ApiResponse<PaginationResponse<CustomerOrderHistoryResponse>>
  >(`${customerOrderUrl}/history`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      limit,
      startDate,
      endDate,
      warehouseId,
      customerOrderStatusId,
      productId,
      productCategoryId,
    },
  });
  console.log(response.data.data);
  return response.data.data;
};
