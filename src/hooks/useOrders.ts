import { getAllCustomerOrders } from "@/app/api/order/getCustomerOrders";
import { useQuery } from "@tanstack/react-query";

export const useOrders = (
  page: number,
  limit: number,
  accessToken?: string,
  status?: number,
  search?: string,
  startDate?: Date,
  endDate?: Date
) => {
  return useQuery({
    queryKey: [
      "orders",
      page,
      limit,
      accessToken,
      status,
      search,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getAllCustomerOrders(
        page,
        limit,
        accessToken!,
        status,
        search,
        startDate,
        endDate
      ),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 2, // Cache results for 5 minutes
  });
};
