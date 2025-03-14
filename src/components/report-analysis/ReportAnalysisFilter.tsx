import { FC } from "react";
import ProductSelection from "@/components/product-management/products/ProductSelection";
import { useReport } from "@/store/reportStore";
import ProductMutationTypeSelection from "@/components/product-mutation/ProductMutationTypeSelection";
import ProductMutationStatusSelection from "@/components/product-mutation/ProductMutationStatusSelection";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import CustomerOrderStatusSelection from "@/components/report-analysis/CustomerOrderStatusSelection";
import DateRangeSelection from "@/components/common/DateRangeSelection";
import { Label } from "@/components/ui/label";

interface ProductMutationFilterProps {
  isProductMutation?: boolean;
}

const ReportAnalysisFilter: FC<ProductMutationFilterProps> = ({
  isProductMutation = false,
}) => {
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
    <div className="px-7 pt-7">
      <div className="grid w-full grid-cols-1 gap-3 rounded-xl bg-white md:grid-cols-5">
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Date Range</Label>
          <DateRangeSelection
            dateRange={dateRange}
            setDateRange={setDateRange}
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

        {isProductMutation ? (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">
                Product Mutation Type
              </Label>
              <ProductMutationTypeSelection
                productMutationTypeId={productMutationTypeId}
                setProductMutationTypeId={setProductMutationTypeId}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">
                Product Mutation Status
              </Label>
              <ProductMutationStatusSelection
                productMutationSelectionId={productMutationStatusId}
                setProductMutationSelectionId={setProductMutationStatusId}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Order Status</Label>
            <CustomerOrderStatusSelection />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalysisFilter;
