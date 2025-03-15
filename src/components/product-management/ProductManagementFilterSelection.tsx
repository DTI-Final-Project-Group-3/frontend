import { FC } from "react";
import { Label } from "@/components/ui/label";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import SearchBarAdminComponent from "@/components/common/SearchBarAdminComponent";
import { useProductAdmin } from "@/store/productAdminStore";

const ProductManagementFilterSelection: FC = () => {
  const { productCategoryId, setProductCategoryId, setSearchQuery } =
    useProductAdmin();
  return (
    <div className="space-y-3 rounded-b-lg bg-white px-7 pt-7">
      <div className="grid w-full grid-cols-1 gap-3 rounded-xl bg-white md:grid-cols-5">
        <div className="col-span-1 md:space-y-2">
          <Label className="text-xs text-slate-500">Product Category</Label>
          <ProductCategorySelection
            productCategoryId={productCategoryId}
            setProductCategoryId={setProductCategoryId}
          />
        </div>
        <div className="col-span-1 md:space-y-2">
          <Label className="text-xs text-slate-500">Search Product</Label>
          <SearchBarAdminComponent setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </div>
  );
};

export default ProductManagementFilterSelection;
