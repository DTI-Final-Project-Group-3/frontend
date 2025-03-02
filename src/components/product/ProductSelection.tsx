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
  getProductExcludeFilter,
  getProductIncludeFilter,
} from "@/app/api/product/getProducts";
import { useProductMutation } from "@/store/productMutationStore";
import { ProductBasic } from "@/types/models/products";

interface ProductSelectionProps {
  filter: string;
  productId: number | undefined;
  setProductId: (val: number) => void;
}

const ProductSelection: FC<ProductSelectionProps> = ({
  filter,
  productId,
  setProductId,
}) => {
  const { destinationWarehouseId } = useProductMutation();

  const {
    data: excludeProducs,
    isLoading: excludeProductsLoading,
    isError: excludeProductError,
  } = useQuery({
    queryKey: ["exclude-filter-products", destinationWarehouseId],
    queryFn: () => {
      if (!destinationWarehouseId) {
        return Promise.resolve([]);
      }
      return getProductExcludeFilter(destinationWarehouseId);
    },
    enabled: !!destinationWarehouseId,
  });

  const {
    data: includeProducts,
    isLoading: includeProductsLoading,
    isError: includeProductsError,
  } = useQuery({
    queryKey: ["include-filter-products", destinationWarehouseId],
    queryFn: () => {
      if (!destinationWarehouseId) {
        return Promise.resolve([]);
      }
      return getProductIncludeFilter(destinationWarehouseId);
    },
    enabled: !!destinationWarehouseId,
  });

  const {
    data: allProducts,
    isLoading: allProductLoading,
    isError: allProductError,
  } = useQuery({
    queryKey: ["all-products"],
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
      {(() => {
        switch (filter) {
          case "show-all":
            return (
              allProducts &&
              renderContent(allProducts, allProductLoading, allProductError)
            );
          case "include":
            return (
              includeProducts &&
              renderContent(
                includeProducts,
                includeProductsLoading,
                includeProductsError,
              )
            );
          case "exclude":
            return (
              excludeProducs &&
              renderContent(
                excludeProducs,
                excludeProductsLoading,
                excludeProductError,
              )
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default ProductSelection;
