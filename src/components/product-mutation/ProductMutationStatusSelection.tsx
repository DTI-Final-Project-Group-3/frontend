import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductMutationType } from "@/types/models/productMutation";
import React, { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProductMutationStatus } from "@/app/api/product-mutation/getProductMutationStatus";

interface ProductMutationStatusSelectionProps {
  captionNoSelection?: string;
  productMutationSelectionId: number | undefined;
  setProductMutationSelectionId: (id: number | undefined) => void;
}

const ProductMutationStatusSelection: FC<
  ProductMutationStatusSelectionProps
> = ({
  captionNoSelection = "All Product Mutation Status",
  productMutationSelectionId,
  setProductMutationSelectionId,
}) => {
  const {
    data: productMutationStatuses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-mutation-statuses"],
    queryFn: getAllProductMutationStatus,
  });

  return (
    <div className="w-full">
      <Select
        value={
          productMutationSelectionId
            ? productMutationSelectionId.toString()
            : "all"
        }
        onValueChange={(value) => {
          if (value === "all") {
            setProductMutationSelectionId(undefined);
          } else {
            setProductMutationSelectionId(Number(value));
          }
        }}
      >
        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500">
          <SelectValue placeholder="Select Warehouse" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectItem value="all">{captionNoSelection}</SelectItem>

          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Error loading product mutation statuses
            </SelectItem>
          ) : productMutationStatuses &&
            productMutationStatuses.length === 0 ? (
            <SelectItem value="no-warehouses" disabled>
              No product mutation status available
            </SelectItem>
          ) : (
            productMutationStatuses?.map(
              (productMutationType: ProductMutationType) => (
                <SelectItem
                  key={productMutationType.id}
                  value={productMutationType.id.toString()}
                >
                  {productMutationType.name}
                </SelectItem>
              ),
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductMutationStatusSelection;
