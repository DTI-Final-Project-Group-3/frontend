"use client";

import { FC } from "react";
import WarehouseSelection from "@/components/warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";

const ReportAnalysisHeader: FC = () => {
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Report and Analysis
      </h2>

      <div className="w-80">
        <WarehouseSelection
          captionNoSelection="All Warehouse"
          warehouseId={destinationWarehouseId}
          setWarehouseId={setDestinationWarehouseId}
        />
      </div>
    </div>
  );
};

export default ReportAnalysisHeader;
