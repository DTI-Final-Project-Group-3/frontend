"use client";

import { FC, useEffect } from "react";
import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getPaginatedProducts } from "@/app/api/product/getProducts";

interface ProductSelectionProps {
  productId?: number;
  setProductId: (id: number) => void;
}

const ProductSelection: FC<ProductSelectionProps> = ({ productId }) => {
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | undefined
  >(productId);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["product-list"],
    queryFn: async ({ pageParam = 0 }) => {
      return await getPaginatedProducts({
        page: pageParam,
        limit: 5,
      });
    },
    getNextPageParam: (page) =>
      page.hasNext ? page.currentPage + 1 : undefined,
    initialPageParam: 0,
  });

  const products = data?.pages.flatMap((page) => page.content) || [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      if (hasNextPage && !isFetchingNextPage) {
        console.log("Fetching next page...");
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    if (productId) {
      setSelectedProductId(productId);
    }
  }, [productId]);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  return (
    <div className="w-full">
      <Select
        value={selectedProductId ? selectedProductId.toString() : "all"}
        onValueChange={(value) => setSelectedProductId(Number(value))}
      >
        <SelectTrigger className="w-full border border-gray-300 bg-white text-lg text-gray-600 px-3 py-[26px] rounded-lg shadow-sm hover:border-green-500 focus:ring-2 focus:ring-green-500 transition-all">
          <SelectValue placeholder="Select Product" />
        </SelectTrigger>
        <SelectContent
          className="max-h-40 overflow-auto"
          onScrollCapture={handleScroll}
        >
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
            products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))
          )}
          {isFetchingNextPage && (
            <SelectItem value="loading-more" disabled>
              Loading more...
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelection;
