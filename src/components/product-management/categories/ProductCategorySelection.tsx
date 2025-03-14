import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getProductCategory } from "@/app/api/product/getProducts";
import { Grid2X2 } from "lucide-react";

interface ProductCategorySelectionProps {
  captionNoSelection?: string;
  productCategoryId: number | undefined;
  setProductCategoryId: (id: number | undefined) => void;
  setPage?: (page: number) => void;
}

const ProductCategorySelection: FC<ProductCategorySelectionProps> = ({
  captionNoSelection = "All Product Category",
  productCategoryId,
  setProductCategoryId,
  setPage,
}) => {
  const {
    data: productCategories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategory,
  });

  return (
    <div className="w-full">
      <Select
        value={productCategoryId ? productCategoryId.toString() : "all"}
        onValueChange={(value) => {
          if (value === "all") {
            setProductCategoryId(undefined);
          } else {
            setProductCategoryId(Number(value));
          }
          if (setPage) {
            setPage(0);
          }
        }}
      >
        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500">
          <div className="flex gap-2">
            <Grid2X2 className="h-5 w-5 text-gray-400" />
            <SelectValue placeholder="Select Warehouse" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectItem value="all">{captionNoSelection}</SelectItem>

          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Error loading warehouses
            </SelectItem>
          ) : productCategories?.data && productCategories.data.length === 0 ? (
            <SelectItem value="no-warehouses" disabled>
              No warehouses available
            </SelectItem>
          ) : (
            productCategories?.data?.map((productCategory) => (
              <SelectItem
                key={productCategory.id}
                value={productCategory.id.toString()}
              >
                {productCategory.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductCategorySelection;
