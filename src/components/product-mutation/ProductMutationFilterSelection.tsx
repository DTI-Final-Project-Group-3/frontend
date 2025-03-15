"use client";

import React, { FC } from "react";
import DateRangeSelection from "@/components/common/DateRangeSelection";
import ProductSelection from "@/components/product-management/products/ProductSelection";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import { useProductMutationFilter } from "@/store/productMutationFilterStore";
import ProductMutationStatusSelection from "@/components/product-mutation/ProductMutationStatusSelection";
import { Label } from "@/components/ui/label";

interface ProductMutationFilterSelectionProps {
  selectedTab: number;
}

const ProductMutationFilterSelection: FC<
  ProductMutationFilterSelectionProps
> = ({ selectedTab }) => {
  const {
    dateRange,
    productId,
    productCategoryId,
    productMutationStatusId,
    setDateRange,
    setProductId,
    setProductCategoryId,
    setProductMutationStatusId,
  } = useProductMutationFilter();

  return (
    <div className="space-y-3 rounded-b-lg bg-white px-10 py-7">
      <div className="grid w-full grid-cols-1 gap-3 rounded-xl bg-white md:grid-cols-5">
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Date Range</Label>
          <DateRangeSelection
            dateRange={dateRange}
            setDateRange={setDateRange}
            preSelect={false}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Product</Label>
          <ProductSelection
            captionNoSelection="All Products"
            filter={"show-all"}
            productId={productId}
            setProductId={setProductId}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Product Category</Label>
          <ProductCategorySelection
            productCategoryId={productCategoryId}
            setProductCategoryId={setProductCategoryId}
          />
        </div>
        {selectedTab !== 1 && (
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">
              Product Mutation Status
            </Label>
            <ProductMutationStatusSelection
              productMutationSelectionId={productMutationStatusId}
              setProductMutationSelectionId={setProductMutationStatusId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMutationFilterSelection;
