import { FC } from "react";
import DatePickerRange from "@/components/common/DatePickerRange";
import ProductSelection from "@/components/product/ProductSelection";
import { useReport } from "@/store/reportStore";
import ProductMutationTypeSelection from "@/components/product-mutation/ProductMutationTypeSelection";
import ProductMutationStatusSelection from "@/components/product-mutation/ProductMutationStatusSelection";
import ProductCategorySelection from "@/components/product/ProductCategorySelection";

const ProductMutationFilter: FC = () => {
  const {
    dateRange,
    productId,
    productCategoryId,
    productMutationTypeId,
    productMutationStatusId,
    setDateRange,
    setProductId,
    setProductCategoryId,
    setProductMutationTypeId,
    setProductMutationStatusId,
  } = useReport();
  return (
    <div className="p-7">
      <div className="grid w-full grid-cols-1 gap-3 rounded-xl bg-white md:grid-cols-5">
        <DatePickerRange dateRange={dateRange} setDateRange={setDateRange} />
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
        <ProductMutationTypeSelection
          productMutationTypeId={productMutationTypeId}
          setProductMutationTypeId={setProductMutationTypeId}
        />
        <ProductMutationStatusSelection
          productMutationSelectionId={productMutationStatusId}
          setProductMutationSelectionId={setProductMutationStatusId}
        />
      </div>
    </div>
  );
};

export default ProductMutationFilter;
