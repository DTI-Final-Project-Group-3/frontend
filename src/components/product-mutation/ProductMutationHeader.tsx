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
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="w-60">
          <WarehouseSelection
            warehouseId={destinationWarehouseId}
            setWarehouseId={setDestinationWarehouseId}
            setPage={setProductMutationPage}
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search mutation..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 sm:w-auto"
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
          buttonClassName="bg-warehub-green text-white hover:bg-warehub-green-light hover:text-gray-100"
        ></MutationDialog>
      </div>
    </div>
  );
};

export default ProductMutationHeader;
