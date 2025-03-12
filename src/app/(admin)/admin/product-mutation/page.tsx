"use client";

import { getPaginatedProductMutation } from "@/app/api/product-mutation/getProductMutation";
import ProductMutationCard from "@/components/product-mutation/ProductMutationCard";
import ProductMutationHeader from "@/components/product-mutation/ProductMutationHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ADMIN_PRODUCT_MUTATION } from "@/constant/productConstant";
import { cn } from "@/lib/utils";
import { useProductMutation } from "@/store/productMutationStore";
import { useQuery } from "@tanstack/react-query";
import React, { FC, useState } from "react";
import { AlertCircle } from "lucide-react";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { PaginationResponse } from "@/types/api/pagination";
import { ProductMutationConstant } from "@/constant/productMutationConstant";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import ProductMutationFilterSelection from "@/components/product-mutation/ProductMutationFilterSelection";
import { useProductMutationFilter } from "@/store/productMutationFilterStore";

const ProductMutation: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const {
    dateRange,
    productId,
    productCategoryId,
    productMutationTypeId,
    productMutationStatusId,
    setIsRequest,
  } = useProductMutationFilter();
  const { data } = useSession();
  const {
    destinationWarehouseId,
    submitMutation,
    productMutationPage,
    setProductMutationPage,
  } = useProductMutation();

  const { isRequest } = useProductMutationFilter();

  const {
    data: adjustmentJournals,
    isLoading: isLoadingJournals,
    isError: isErrorJournals,
  } = useQuery({
    queryKey: [
      "inventory-journal",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
      isRequest,
      dateRange,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        startDate: dateRange.from,
        endDate: dateRange.to,
        isRequest: false,
        productId,
        productCategoryId,
        destinationWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_CREATE_INVENTORY,
          ProductMutationConstant.TYPE_UPDATE_INVENTORY,
          ProductMutationConstant.TYPE_DELETE_INVENTORY,
        ],
      }),
    enabled: !!destinationWarehouseId && !!data?.accessToken,
  });

  const {
    data: inboundMutation,
    isLoading: isLoadingInbound,
    isError: isErrorInbound,
  } = useQuery({
    queryKey: [
      "inbound-mutation",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
      isRequest,
      dateRange,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        startDate: dateRange.from,
        endDate: dateRange.to,
        isRequest,
        productId,
        productCategoryId,
        destinationWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_INBOUND_MANUAL_MUTATION,
          ProductMutationConstant.TYPE_AUTO_MUTATION,
        ],
        productMutationStatusId: productMutationStatusId,
      }),
    enabled: !!destinationWarehouseId && !!data?.accessToken,
  });

  const {
    data: outboundMutation,
    isLoading: isLoadingOutbound,
    isError: isErrorOutbound,
  } = useQuery({
    queryKey: [
      "outbound-mutation",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
      isRequest,
      dateRange,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        startDate: dateRange.from,
        endDate: dateRange.to,
        isRequest,
        productId,
        productCategoryId,
        originWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_OUTBOUND_MANUAL_MUTATION,
          ProductMutationConstant.TYPE_AUTO_MUTATION,
        ],
        productMutationStatusId: productMutationStatusId,
      }),
    enabled: !!destinationWarehouseId && !!data?.accessToken,
  });

  const tabOptions = [
    { id: 1, value: "journal", label: "Manual Adjustment" },
    { id: 2, value: "inbound", label: "Inbound" },
    { id: 3, value: "outbound", label: "Outbound" },
  ];

  const renderWarehouseNotSelected = () => (
    <Alert variant="destructive" className="mx-auto my-16 max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Please select warehouse!</AlertDescription>
    </Alert>
  );

  const renderSkeletonLoading = () => (
    <div className="w-full space-y-4">
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

  const renderError = () => (
    <Alert variant="destructive" className="mx-auto my-16 max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load product mutation. Please try again.
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
      <h3 className="mt-2 text-lg font-medium">No product mutation found</h3>
    </div>
  );

  const renderContent = (
    data: PaginationResponse<ProductMutationDetailResponse> | undefined,
    isLoading: boolean,
    isError: boolean,
    isInbound: boolean,
  ) => {
    return (
      <section className="flex min-h-[calc(100vh-155px)] flex-col justify-between rounded-lg bg-white px-4 pt-2 md:px-10">
        <div
          className={`flex w-full flex-grow ${!data || data.content.length === 0 || isLoading || isError ? "items-center justify-center" : "items-start justify-center pt-4"}`}
        >
          {!destinationWarehouseId
            ? renderWarehouseNotSelected()
            : isLoading
              ? renderSkeletonLoading()
              : isError
                ? renderError()
                : data && data.content.length === 0
                  ? renderEmptyState()
                  : data && (
                      <div className="grid w-[90%] grid-cols-1 gap-4">
                        {data.content.map(
                          (item: ProductMutationDetailResponse) => (
                            <ProductMutationCard
                              key={item.productMutationId}
                              productMutation={item}
                              isInbound={isInbound}
                              isRequest={isRequest && selectedTab !== 1}
                            />
                          ),
                        )}
                      </div>
                    )}
        </div>
        {data && data.content.length > 0 && (
          <div className="py-2">
            <PaginationAdmin
              desc="mutation"
              page={productMutationPage}
              setPage={setProductMutationPage}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              currentPageSize={data.content.length}
            />
          </div>
        )}
      </section>
    );
  };

  return (
    <section className="w-full space-y-2 rounded-lg shadow-sm">
      <ProductMutationHeader />

      <Tabs defaultValue="journal" className="w-full">
        <div>
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-lg bg-white shadow-sm sm:h-14">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.value}
                className={cn(
                  "relative h-full rounded-none font-medium",
                  "data-[state=active]:border-b-2 data-[state=active]:border-warehub-green data-[state=active]:text-emerald-700",
                  "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
                onClick={() => {
                  setProductMutationPage(0);
                  setSelectedTab(tab.id);
                  setIsRequest(true);
                }}
              >
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ProductMutationFilterSelection selectedTab={selectedTab} />

          <div className="w-full rounded-xl bg-white shadow-sm">
            <TabsContent value="journal" className="p-4 sm:p-6">
              {renderContent(
                adjustmentJournals,
                isLoadingJournals,
                isErrorJournals,
                false,
              )}
            </TabsContent>

            <TabsContent value="inbound" className="p-4 sm:p-6">
              {renderContent(
                inboundMutation,
                isLoadingInbound,
                isErrorInbound,
                true,
              )}
            </TabsContent>

            <TabsContent value="outbound" className="p-4 sm:p-6">
              {renderContent(
                outboundMutation,
                isLoadingOutbound,
                isErrorOutbound,
                false,
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </section>
  );
};

export default ProductMutation;
