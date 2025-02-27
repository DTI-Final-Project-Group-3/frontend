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
import { getAllProductList } from "@/app/api/product/getProducts";

interface ProductSelectionProps {
  productId: number | undefined;
  setProductId: (val: number) => void;
}

const ProductSelection: FC<ProductSelectionProps> = ({
  productId,
  setProductId,
}) => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-list"],
    queryFn: getAllProductList,
  });

  return (
    <div className="w-full">
      <Select
        value={productId ? productId.toString() : "all"}
        onValueChange={(val: string) => setProductId(Number(val))}
      >
        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-600 rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all">
          <SelectValue>
            {products?.find((product) => product.id == productId)?.name ||
              "Select Product"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-auto">
          <SelectItem value="all">Select Product</SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Error loading products
            </SelectItem>
          ) : products && products.length === 0 ? (
            <SelectItem value="no-products" disabled>
              No product available
            </SelectItem>
          ) : (
            products &&
            products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelection;
