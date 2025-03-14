import { FC } from "react";
import MutationDialog from "../inventory-management/MutationDialog";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";

const ProductMutationHeader: FC = () => {
  const {
    destinationWarehouseId,
    setDestinationWarehouseId,
    setProductMutationPage,
  } = useProductMutation();

  return (
    <div className="z-[40] flex w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-7 md:sticky md:top-[0]">
      <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
        Product Mutation & Journal
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="col-span-2">
          <WarehouseSelection
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
            setPage={setProductMutationPage}
          />
        </div>

        <div className="w-40 md:col-span-1">
          <MutationDialog
            isProductMutation={true}
            buttonName="New Mutation"
            buttonClassName="bg-warehub-green text-white hover:bg-warehub-green-light hover:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductMutationHeader;
