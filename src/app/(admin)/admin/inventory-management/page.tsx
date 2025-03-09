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
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const InventoryManagementPage = () => {
  const [page, setPage] = useState<number>(0);
  const [searchQuery] = useState<string>();
  const {
    destinationWarehouseId,
    submitMutation,
    setProductId,
    setWarehouseInventoryId,
  } = useProductMutation();

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

  const renderSkeletonLoading = () => (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-6 w-[100px] rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[80px]" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderWarehouseNotSelected = () => (
    <Alert variant="destructive" className="mx-auto my-16 max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Please select warehouse!</AlertDescription>
    </Alert>
  );

  const renderError = () => (
    <Alert variant="destructive" className="mx-auto my-16 max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load inventories. Please try again.
      </AlertDescription>
    </Alert>
  );

  const renderEmptyState = () => (
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
  );

  const renderDesktopTable = () => (
    <div className="hidden md:block md:min-h-[calc(100vh-300px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Name</TableHead>
            <TableHead className="w-[10%]">Category</TableHead>
            <TableHead className="w-[15%] text-center">Price</TableHead>
            <TableHead className="w-[15%] text-center">Thumbnail</TableHead>
            <TableHead className="w-[15%] text-center">Quantity</TableHead>
            <TableHead className="w-[15%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventories?.content.map((inventory) => (
            <TableRow key={inventory.id} className="hover:bg-gray-50">
              <TableCell className="min-w-0">
                <div className="truncate font-medium text-gray-800">
                  {inventory.productName}
                </div>
                <div className="truncate text-xs text-gray-500">
                  ID: {inventory.id}
                </div>
              </TableCell>
              <TableCell className="min-w-0">
                <span className="inline-block max-w-full truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {inventory.productCategoryName}
                </span>
              </TableCell>
              <TableCell className="text-center font-medium text-gray-800">
                {formatPrice(String(inventory.productPrice))}
              </TableCell>
              <TableCell className="text-center">
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
              </TableCell>
              <TableCell className="text-center">
                {inventory.quantity}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-5 md:px-6">
                  <MutationDialog
                    buttonName="Change"
                    onClick={() => {
                      setWarehouseInventoryId(inventory.id);
                      setProductId(inventory.productId);
                    }}
                  />
                  <DeleteInventoryDialog warehouseInventoryId={inventory.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderMobileView = () => (
    <div className="space-y-4 md:hidden">
      {inventories?.content.map((inventory) => (
        <Card key={inventory.id}>
          <CardContent className="p-4">
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
                <p className="text-xs text-gray-500">ID: {inventory.id}</p>
                <span className="mt-1 inline-block truncate rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {inventory.productCategoryName}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="space-y-1">
                <span className="font-medium text-gray-800">
                  {formatPrice(String(inventory.productPrice))}
                </span>
                <div className="text-sm text-gray-500">
                  Quantity: {inventory.quantity}
                </div>
              </div>
              <div className="flex space-x-2">
                <MutationDialog
                  buttonName="Change"
                  onClick={() => {
                    setWarehouseInventoryId(inventory.id);
                    setProductId(inventory.productId);
                  }}
                />
                <DeleteInventoryDialog warehouseInventoryId={inventory.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="min-h-[calc(100vh-178px)] w-full rounded-2xl bg-white py-4 shadow-sm md:py-7">
      <InventoryManagementHeader />

      <div className="mt-4 px-4 md:mt-7 md:px-10">
        {!destinationWarehouseId ? (
          renderWarehouseNotSelected()
        ) : inventoriesLoading ? (
          renderSkeletonLoading()
        ) : inventoriesError ? (
          renderError()
        ) : inventories?.content?.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDesktopTable()}
            {renderMobileView()}
          </>
        )}

        {inventories && (
          <div className="mt-6">
            <PaginationAdmin
              desc="Inventories"
              page={page}
              setPage={setPage}
              totalPages={inventories.totalPages}
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
