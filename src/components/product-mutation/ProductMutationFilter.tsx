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
    <div className="grid w-full grid-cols-5 gap-3 rounded-xl bg-white p-7">
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
  );
};

export default ProductMutationFilter;
