import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { useReport } from "@/store/reportStore";
import { useProductMutation } from "@/store/productMutationStore";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomerOrders } from "@/app/api/order/getCustomerOrders";
import { ADMIN_PRODUCT_MUTATION } from "@/constant/productConstant";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import { Order, OrderItems } from "@/types/models/orders/orders";
import { formatDateString } from "@/utils/formatter";

const CustomerOrderHistoryTable: FC = () => {
  const [page, setPage] = useState<number>(0);
  const { data } = useSession();
  const { dateRange } = useReport();
  const { destinationWarehouseId } = useProductMutation();

  const {
    data: customerOrders,
    isError: customerOrderIsError,
    isLoading: customerOrderIsLoading,
  } = useQuery({
    queryKey: ["customer-order-chart"],
    queryFn: () =>
      getAllCustomerOrders(
        page,
        ADMIN_PRODUCT_MUTATION,
        data?.accessToken.toString() || "",
        undefined,
        undefined,
        dateRange.from,
        dateRange.to,
        destinationWarehouseId,
      ),
  });
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {customerOrderIsLoading ? (
        <div>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>

          <Skeleton className={"h-40 w-full"} />

          <div className="flex flex-col gap-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      ) : customerOrderIsError ? (
        <div>Error loading mutation history</div>
      ) : (
        customerOrders && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice Code</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders?.data.content.map((customerOrder: Order) =>
                  customerOrder.customerOrderitems.map(
                    (item: OrderItems, index: number) => (
                      <TableRow key={`${customerOrder.id}-${index}`}>
                        <TableCell>
                          {formatDateString(
                            customerOrder.createdAt.toUTCString(),
                          )}
                        </TableCell>
                        <TableCell>{customerOrder.invoiceCode}</TableCell>
                        <TableCell>{customerOrder.orderStatusName}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                      </TableRow>
                    ),
                  ),
                )}
              </TableBody>
            </Table>

            <PaginationAdmin
              desc="History"
              page={page}
              setPage={setPage}
              totalPages={customerOrders.data.totalPages}
              totalElements={customerOrders.data.totalElements}
              currentPageSize={customerOrders.data.content.length}
            />
          </>
        )
      )}
    </div>
  );
};

export default CustomerOrderHistoryTable;
