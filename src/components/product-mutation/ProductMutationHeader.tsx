import { FC } from "react";
import MutationDialog from "../inventory-management/MutationDialog";
import WarehouseSelection from "../warehouse/WarehouseSelection";
import { useProductMutation } from "@/store/productMutationStore";

const ProductMutationHeader: FC = () => {
  const { destinationWarehouseId, setDestinationWarehouseId } =
    useProductMutation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-7 md:sticky md:top-[0] z-[40] bg-white w-full rounded-xl">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
        Product Mutation & Journal
      </h2>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
        <div className="w-60">
          <WarehouseSelection
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search mutation..."
            className="w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg border border-gray-300"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <MutationDialog
          isProductMutation={true}
          buttonName="New Mutation"
        ></MutationDialog>
      </div>
    </div>
  );
};

export default ProductMutationHeader;
