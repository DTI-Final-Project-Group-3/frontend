"use client";

import { FC } from "react";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";
import AddInventoryDialog from "./AddInventoryDialog";
import { useInventoryAdmin } from "@/store/inventoryAdminStore";

const InventoryManagementHeader: FC = () => {
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();
  const { setInventoryPage } = useInventoryAdmin();

  return (
    <div className="z-[40] grid grid-cols-1 gap-3 rounded-xl bg-white p-7 md:sticky md:top-[0] md:grid-cols-3">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Inventory Management
      </h2>

      <div className="grid grid-cols-1 gap-3 md:col-start-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <WarehouseSelection
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
            setPage={setInventoryPage}
          />
        </div>

        <div className="md:col-span-1">
          <AddInventoryDialog />
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementHeader;
