"use client";

import { FC } from "react";
import WarehouseSelection from "@/components/warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";
import ProductSelection from "@/components/product/ProductSelection";
import { useReport } from "@/store/reportStore";
import DatePickerRange from "@/components/common/DatePickerRange";

const ReportAnalysisHeader: FC = () => {
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();
  const { productId, dateRange, setProductId, setDateRange } = useReport();

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Report and Analysis
      </h2>

      <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:flex-row">
        <DatePickerRange dateRange={dateRange} setDateRange={setDateRange} />

        <ProductSelection
          captionNoSelection="All Products"
          filter={"show-all"}
          productId={productId}
          setProductId={setProductId}
        />
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
