"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import DateRangeSelection from "@/components/common/DateRangeSelection";
import ProductSelection from "@/components/product-management/products/ProductSelection";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import { useProductMutationFilter } from "@/store/productMutationFilterStore";
import { ProductMutationConstant } from "@/constant/productMutationConstant";

interface ProductMutationFilterSelectionProps {
  selectedTab: number;
}

const ProductMutationFilterSelection: FC<
  ProductMutationFilterSelectionProps
> = ({ selectedTab }) => {
  const {
    isRequest,
    dateRange,
    productId,
    productCategoryId,
    setIsRequest,
    setDateRange,
    setProductId,
    setProductCategoryId,
    setProductMutationStatusId,
  } = useProductMutationFilter();

  return (
    <div className="space-y-3 rounded-b-lg bg-white px-10 py-7">
      <div className="grid w-full grid-cols-1 gap-3 rounded-xl bg-white md:grid-cols-5">
        <DateRangeSelection
          dateRange={dateRange}
          setDateRange={setDateRange}
          preSelect={false}
        />
        <ProductSelection
          captionNoSelection="All Products"
          filter={"show-all"}
          productId={productId}
          setProductId={setProductId}
        />
        <ProductCategorySelection
          productCategoryId={productCategoryId}
          setProductCategoryId={setProductCategoryId}
        />
        <div>
          {selectedTab !== 1 && (
            <div className="flex w-full items-center justify-start gap-2">
              <button
                onClick={() => {
                  setIsRequest(true);
                  setProductMutationStatusId(
                    ProductMutationConstant.STATUS_PENDING,
                  );
                }}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-normal transition-all",
                  isRequest
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-white text-gray-600 hover:border-green-500",
                )}
              >
                Request
              </button>

              <button
                onClick={() => {
                  setIsRequest(false);
                  setProductMutationStatusId(undefined);
                }}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-normal transition-all",
                  !isRequest
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-white text-gray-600 hover:border-green-500",
                )}
              >
                History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMutationFilterSelection;
