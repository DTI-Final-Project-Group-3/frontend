"use client";

import { getPaginatedWarehouseInventories } from "@/app/api/warehouse-inventories/getWarehouseInventories";
import ImageComponent from "@/components/common/ImageComponent";
import InventoryManagementHeader from "@/components/inventory-management/InventoryManagementHeader";
import MutationDialog from "@/components/inventory-management/MutationDialog";
import { PaginationProductAdmin } from "@/components/pagination/PaginationProductAdmin";
import { INVENTORY_PER_PAGE } from "@/constant/warehouseInventoryConstant";
import { useProductMutation } from "@/store/productMutationStore";
import { formatPrice } from "@/utils/formatter";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const InventoryManagementPage = () => {
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>();
  const { productMutatationRequest } = useProductMutation();

  const {
    data: inventories,
    isLoading: inventoriesLoading,
    error: inventoriesError,
  } = useQuery({
    queryKey: [
      "warehouse-inventories-admin",
      page,
      searchQuery,
      productMutatationRequest,
    ],
    queryFn: () =>
      getPaginatedWarehouseInventories({
        page,
        limit: INVENTORY_PER_PAGE,
        warehouseId: productMutatationRequest?.destinationWarehouseId,
        searchQuery,
      }),
    enabled: !!productMutatationRequest?.destinationWarehouseId,
  });

  return (
    <section className="w-full rounded-2xl bg-white py-4 md:py-7 min-h-[calc(100vh-178px)] shadow-sm">
      <InventoryManagementHeader />

      <div className="mt-4 md:mt-7 px-4 md:px-10">
        {!productMutatationRequest?.destinationWarehouseId ? (
          <div className="text-center py-16 text-red-500">
            Please select warehouse !
          </div>
        ) : inventoriesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : inventoriesError ? (
          <div className="text-center py-16 text-red-500">
            Failed to load inventories. Please try again.
          </div>
        ) : inventories?.content?.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
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
              <div className="grid grid-cols-[30%_20%_10%_10%_10%_20%] mb-2 px-2 border-b border-gray-200 pb-7">
                <div className="text-gray-700 font-medium">Name</div>
                <div className="text-gray-700 font-medium">Category</div>
                <div className="text-gray-700 font-medium">Price</div>
                <div className="text-gray-700 font-medium text-center">
                  Thumbnail
                </div>
                <div className="text-gray-700 font-medium text-center">
                  Quantity
                </div>
                <div className="text-gray-700 font-medium text-center">
                  Actions
                </div>
              </div>

              <div className="space-y-2">
                {inventories?.content.map((inventory) => (
                  <div
                    key={inventory.id}
                    className="grid grid-cols-[30%_20%_10%_10%_10%_20%] items-center p-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {inventory.productName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        ID: {inventory.id}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-200 truncate inline-block max-w-full">
                        {inventory.productCategoryName}
                      </span>
                    </div>
                    <div className="font-medium text-gray-800 truncate">
                      {formatPrice(String(inventory.productPrice))}
                    </div>
                    <div className="flex justify-center">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
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
                    <div className="flex justify-center space-x-2">
                      <MutationDialog
                        warehouseInventoryId={inventory.id}
                        productId={inventory.productId}
                        buttonName="Change quantity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:hidden space-y-4">
              {inventories?.content.map((inventory) => (
                <div
                  key={inventory.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageComponent
                        src={inventory.productThumbnail}
                        fill={true}
                        className="object-cover"
                        alt={`${inventory.productName} thumbnail`}
                        sizes="50px, 50px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {inventory.productName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {inventory.id}
                      </p>
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-200 mt-1 truncate">
                        {inventory.productCategoryName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
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
            <PaginationProductAdmin
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
