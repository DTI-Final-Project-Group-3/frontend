import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ProductMutationType } from "@/types/models/productMutation";
import { getAllProductMutationType } from "@/app/api/product-mutation/getProductMutationType";

interface ProductMutationTypeSelectionProps {
  captionNoSelection?: string;
  productMutationTypeId: number | undefined;
  setProductMutationTypeId: (id: number | undefined) => void;
}

const ProductMutationTypeSelection: FC<ProductMutationTypeSelectionProps> = ({
  captionNoSelection = "All Product Mutation Type",
  productMutationTypeId,
  setProductMutationTypeId,
}) => {
  const {
    data: productMutationTypes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-mutation-types"],
    queryFn: getAllProductMutationType,
  });

  return (
    <div className="w-full">
      <Select
        value={productMutationTypeId ? productMutationTypeId.toString() : "all"}
        onValueChange={(value) => {
          if (value === "all") {
            setProductMutationTypeId(undefined);
          } else {
            setProductMutationTypeId(Number(value));
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
              Error loading product mutation types
            </SelectItem>
          ) : productMutationTypes && productMutationTypes.length === 0 ? (
            <SelectItem value="no-warehouses" disabled>
              No product mutation type available
            </SelectItem>
          ) : (
            productMutationTypes?.map(
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

export default ProductMutationTypeSelection;
