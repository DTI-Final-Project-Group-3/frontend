"use client";

import { FC } from "react";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";
import AddInventoryDialog from "./AddInventoryDialog";
import { useInventoryAdmin } from "@/store/inventoryAdminStore";
import SearchBarAdminComponent from "@/components/common/SearchBarAdminComponent";
import ProductCategorySelection from "@/components/product-management/categories/ProductCategorySelection";

const InventoryManagementHeader: FC = () => {
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();
  const {
    productCategoryId,
    setProductCategoryId,
    setSearchQuery,
    setInventoryPage,
  } = useInventoryAdmin();

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Inventory Management
      </h2>

      <div className="grid grid-cols-4 flex-col gap-3">
        <SearchBarAdminComponent setSearchQuery={setSearchQuery} />

        <ProductCategorySelection
          productCategoryId={productCategoryId}
          setProductCategoryId={setProductCategoryId}
        />

        <WarehouseSelection
          warehouseId={destinationWarehouseId}
          setWarehouseId={setDestinationWarehouseId}
          setPage={setInventoryPage}
        />

        <AddInventoryDialog />
      </div>
    </div>
  );
};

export default InventoryManagementHeader;
