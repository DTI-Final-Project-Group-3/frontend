"use client";

import React, { FC } from "react";
import DateRangeSelection from "@/components/common/DateRangeSelection";
import ProductSelection from "@/components/product-management/products/ProductSelection";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import { useProductMutationFilter } from "@/store/productMutationFilterStore";
import ProductMutationStatusSelection from "@/components/product-mutation/ProductMutationStatusSelection";

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
        {selectedTab !== 1 && (
          <ProductMutationStatusSelection
            productMutationSelectionId={productMutationStatusId}
            setProductMutationSelectionId={setProductMutationStatusId}
          />
        )}
      </div>
    </div>
  );
};

export default ProductMutationFilterSelection;
