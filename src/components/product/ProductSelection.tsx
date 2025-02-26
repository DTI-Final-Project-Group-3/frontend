"use client";

import { FC, useEffect } from "react";
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
  productId?: number;
  setProductId: (id: number) => void;
}

const ProductSelection: FC<ProductSelectionProps> = ({ productId }) => {
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | undefined
  >(productId);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-list"],
    queryFn: getAllProductList,
  });

  useEffect(() => {
    if (productId) {
      setSelectedProductId(productId);
    }
  }, [productId]);

  return (
    <div className="w-full">
      <Select
        value={selectedProductId ? selectedProductId.toString() : "all"}
        onValueChange={(value) => setSelectedProductId(Number(value))}
      >
        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-600 rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all">
          <SelectValue placeholder="Select Product" />
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
