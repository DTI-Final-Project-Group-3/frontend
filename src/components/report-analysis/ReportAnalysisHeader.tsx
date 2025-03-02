"use client";

import { FC, useEffect } from "react";
import WarehouseSelection from "@/components/warehouse/WarehouseSelection";
import { userRoles } from "@/constant/userConstant";
import { useSession } from "next-auth/react";
import { useProductMutation } from "@/store/productMutationStore";

const ReportAnalysisHeader: FC = () => {
  const { data } = useSession();
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();

  useEffect(() => {
    if (data?.userDetail?.warehouseId) {
      setDestinationWarehouseId(data.userDetail.warehouseId);
    }
  }, [data, setDestinationWarehouseId]);

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Report and Analyis
      </h2>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="w-80">
          <WarehouseSelection
            disable={data?.role !== userRoles.ADMIN_SUPER}
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysisHeader;
