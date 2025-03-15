import { FC } from "react";
import SearchBarAdminComponent from "@/components/common/SearchBarAdminComponent";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";
import { useInventoryAdmin } from "@/store/inventoryAdminStore";
import { Label } from "@/components/ui/label";

const InventoryManagementFilterSelection: FC = () => {
  const { productCategoryId, setProductCategoryId, setSearchQuery } =
    useInventoryAdmin();

  return (
    <div className="space-y-3 rounded-t-lg bg-white px-7 pt-7">
      <div className="grid w-full grid-cols-1 gap-3 bg-white md:grid-cols-5">
        <div className="col-span-1 md:space-y-2">
          <Label className="text-xs text-slate-500">Product Category</Label>
          <ProductCategorySelection
            productCategoryId={productCategoryId}
            setProductCategoryId={setProductCategoryId}
          />
        </div>
        <div className="col-span-1 md:space-y-2">
          <Label className="text-xs text-slate-500">Search Inventory</Label>
          <SearchBarAdminComponent
            setSearchQuery={setSearchQuery}
            placeholder="Search Inventories..."
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementFilterSelection;
