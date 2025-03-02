"use client";

import { getPaginatedWarehouseInventories } from "@/app/api/warehouse-inventories/getWarehouseInventories";
import ImageComponent from "@/components/common/ImageComponent";
import { DeleteInventoryDialog } from "@/components/inventory-management/DeleteInventoryDialog";
import InventoryManagementHeader from "@/components/inventory-management/InventoryManagementHeader";
import MutationDialog from "@/components/inventory-management/MutationDialog";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import { useProductMutation } from "@/store/productMutationStore";
import { formatPrice } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const InventoryManagementPage = () => {
  const { data } = useSession();
  const [page, setPage] = useState<number>(0);
  const [searchQuery] = useState<string>();
  const {
    destinationWarehouseId,
    submitMutation,
    setProductId,
    setWarehouseInventoryId,
    setDestinationWarehouseId,
  } = useProductMutation();

  useEffect(() => {
    if (data?.userDetail?.warehouseId && data.role !== "ADMIN_SUPER") {
      setDestinationWarehouseId(data?.userDetail?.warehouseId);
    }
  }, [data]);

  const {
    data: inventories,
    isLoading: inventoriesLoading,
    error: inventoriesError,
  } = useQuery({
    queryKey: [
      "warehouse-inventories-admin",
      page,
      searchQuery,
      submitMutation,
      destinationWarehouseId,
    ],
    queryFn: () =>
      getPaginatedWarehouseInventories({
        page,
        limit: INVENTORY_PER_PAGE,
        warehouseId: destinationWarehouseId,
        searchQuery,
      }),
    enabled: !!destinationWarehouseId,
  });

  return (
    <section className="min-h-[calc(100vh-178px)] w-full rounded-2xl bg-white py-4 shadow-sm md:py-7">
      <InventoryManagementHeader />

      <div className="mt-4 px-4 md:mt-7 md:px-10">
        {!destinationWarehouseId ? (
          <div className="py-16 text-center text-red-500">
            Please select warehouse !
          </div>
        ) : inventoriesLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
          </div>
        ) : inventoriesError ? (
          <div className="py-16 text-center text-red-500">
            Failed to load inventories. Please try again.
          </div>
        ) : inventories?.content?.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No products found</h3>
          </div>
        ) : (
          <div className="md:min-h-[calc(100vh-300px)]">
            <div className="hidden md:block">
              <div className="mb-2 grid grid-cols-[30%_10%_15%_15%_15%_15%] border-b border-gray-200 px-2 pb-7">
                <div className="font-medium text-gray-700">Name</div>
                <div className="font-medium text-gray-700">Category</div>
                <div className="text-center font-medium text-gray-700">
                  Price
                </div>
                <div className="text-center font-medium text-gray-700">
                  Thumbnail
                </div>
                <div className="text-center font-medium text-gray-700">
                  Quantity
                </div>
                <div className="text-center font-medium text-gray-700">
                  Actions
                </div>
              </div>

              <div className="space-y-2">
                {inventories?.content.map((inventory) => (
                  <div
                    key={inventory.id}
                    className="grid grid-cols-[30%_10%_15%_15%_15%_15%] items-center rounded-lg border-b border-gray-100 p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-800">
                        {inventory.productName}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        ID: {inventory.id}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block max-w-full truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {inventory.productCategoryName}
                      </span>
                    </div>
                    <div className="flex justify-center font-medium text-gray-800">
                      {formatPrice(String(inventory.productPrice))}
                    </div>
                    <div className="flex justify-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                        <ImageComponent
                          src={inventory.productThumbnail}
                          fill={true}
                          className="object-cover"
                          alt={`${inventory.productName} thumbnail`}
                          sizes="50px, 50px"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center space-x-2">
                      {inventory.quantity}
                    </div>
                    <div className="flex justify-center space-x-2 md:px-10">
                      <MutationDialog
                        buttonName="Change"
                        onClick={() => {
                          setWarehouseInventoryId(inventory.id);
                          setProductId(inventory.productId);
                        }}
                      />
                      <DeleteInventoryDialog
                        warehouseInventoryId={inventory.id}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {inventories?.content.map((inventory) => (
                <div
                  key={inventory.id}
                  className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <ImageComponent
                        src={inventory.productThumbnail}
                        fill={true}
                        className="object-cover"
                        alt={`${inventory.productName} thumbnail`}
                        sizes="50px, 50px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-800">
                        {inventory.productName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {inventory.id}
                      </p>
                      <span className="mt-1 inline-block truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {inventory.productCategoryName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="font-medium text-gray-800">
                      {formatPrice(String(inventory.productPrice))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inventories && (
          <div className="mt-6">
            <PaginationAdmin
              currentPage={page}
              totalPages={inventories.totalPages}
              hasNext={inventories.hasNext}
              hasPrev={inventories.hasPrev}
              onPageChange={setPage}
              totalElements={inventories.totalElements}
              currentPageSize={inventories.content.length}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default InventoryManagementPage;
