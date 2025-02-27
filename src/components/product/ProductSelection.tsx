"use client";

import { FC } from "react";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  getAllProductList,
  getProductByWarehouseId,
} from "@/app/api/product/getProducts";
import { useProductMutation } from "@/store/productMutationStore";
import { ProductBasic } from "@/types/models/products";

interface ProductSelectionProps {
  showAll?: boolean;
  productId: number | undefined;
  setProductId: (val: number) => void;
}

const ProductSelection: FC<ProductSelectionProps> = ({
  showAll,
  productId,
  setProductId,
}) => {
  const { destinationWarehouseId } = useProductMutation();

  const {
    data: warehouseProducts,
    isLoading: warehouseProductsLoading,
    isError: warehouseProductsError,
  } = useQuery({
    queryKey: ["warehouse-products", destinationWarehouseId],
    queryFn: () => {
      if (!destinationWarehouseId) {
        return Promise.resolve([]);
      }
      return getProductByWarehouseId(destinationWarehouseId);
    },
    enabled: !!destinationWarehouseId,
  });

  const {
    data: allProducts,
    isLoading: allProductLoading,
    isError: allProductError,
  } = useQuery({
    queryKey: ["product-list"],
    queryFn: getAllProductList,
  });

  const renderContent = (
    data: ProductBasic[],
    isLoading: boolean,
    isError: boolean,
  ) => {
    return (
      <Select
        value={productId ? productId.toString() : "all"}
        onValueChange={(val: string) => setProductId(Number(val))}
      >
        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition-all hover:border-green-500 focus:ring-2 focus:ring-green-500">
          <SelectValue>
            {allProducts?.find((product) => product.id == productId)?.name ||
              "Select Product"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-40 max-w-80">
          <SelectItem value="all" className="text-gray-500">
            Select Product
          </SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Error loading products
            </SelectItem>
          ) : data && data.length === 0 ? (
            <SelectItem value="no-products" disabled>
              No product available
            </SelectItem>
          ) : (
            data &&
            data.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="w-full">
      {showAll &&
        allProducts &&
        renderContent(allProducts, allProductLoading, allProductError)}

      {!showAll &&
        warehouseProducts &&
        renderContent(
          warehouseProducts,
          warehouseProductsLoading,
          warehouseProductsError,
        )}
    </div>
  );
};

export default ProductSelection;
