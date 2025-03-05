import { getProductMutationHistory } from "@/app/api/product-mutation/getProductMutation";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReport } from "@/store/reportStore";
import { useProductMutation } from "@/store/productMutationStore";
import { formatDateHyphen, formatDateString } from "@/utils/formatter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductMutationHistoryTable() {
  const {
    dateRange,
    productMutationTypeId,
    productMutationStatusId,
    productId,
    productCategoryId,
  } = useReport();
  const { destinationWarehouseId } = useProductMutation();

  const {
    data: mutationHistory,
    isLoading: mutationHistoryIsLoading,
    isError: mutationHistoryIsError,
  } = useQuery({
    queryKey: [
      "mutation-history",
      dateRange,
      destinationWarehouseId,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
    ],
    queryFn: () => {
      if (!dateRange.from || !dateRange.to) {
        return Promise.resolve([]);
      }
      return getProductMutationHistory({
        startedAt: formatDateHyphen(dateRange.from),
        endedAt: formatDateHyphen(dateRange.to),
        productId,
        productCategoryId,
        productMutationTypeId,
        productMutationStatusId,
        warehouseId: destinationWarehouseId,
      });
    },
    enabled: !!dateRange.from && !!dateRange.to,
  });

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {mutationHistoryIsLoading ? (
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
      ) : mutationHistoryIsError ? (
        <div>Error loading mutation history</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Mutation Type</TableHead>
              <TableHead>Mutation Status</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mutationHistory &&
              mutationHistory?.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{formatDateString(history.createdAt)}</TableCell>
                  <TableCell>{history.product.name}</TableCell>
                  <TableCell>{history.productCategory.name}</TableCell>
                  <TableCell>{history.productMutationType.name}</TableCell>
                  <TableCell>{history.productMutationStatus.name}</TableCell>
                  <TableCell>{history.quantity}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
