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
import { Loader2 } from "lucide-react";
import { PaginationAdmin } from "@/components/pagination/PaginationAdmin";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { PaginationResponse } from "@/types/api/pagination";
import { ProductMutationConstant } from "@/constant/productMutationConstant";

const ProductMutation: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const {
    destinationWarehouseId,
    submitMutation,
    productMutationPage,
    setProductMutationPage,
  } = useProductMutation();

  const { data: adjustmentJournals, isLoading: isLoadingJournals } = useQuery({
    queryKey: [
      "inventory-journal",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        destinationWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_CREATE_INVENTORY,
          ProductMutationConstant.TYPE_UPDATE_INVENTORY,
          ProductMutationConstant.TYPE_DELETE_INVENTORY,
        ],
      }),
    enabled: !!destinationWarehouseId,
  });

  const { data: inboundMutation, isLoading: isLoadingInbound } = useQuery({
    queryKey: [
      "inbound-mutation",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        destinationWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_MANUAL_MUTATION,
          ProductMutationConstant.TYPE_AUTO_MUTATION,
        ],
      }),
    enabled: !!destinationWarehouseId,
  });

  const { data: outboundMutation, isLoading: isLoadingOutbound } = useQuery({
    queryKey: [
      "outbound-mutation",
      destinationWarehouseId,
      selectedTab,
      productMutationPage,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page: productMutationPage,
        limit: ADMIN_PRODUCT_MUTATION,
        originWarehouseId: destinationWarehouseId,
        productMutationTypeId: [
          ProductMutationConstant.TYPE_MANUAL_MUTATION,
          ProductMutationConstant.TYPE_AUTO_MUTATION,
        ],
      }),
    enabled: !!destinationWarehouseId,
  });

  const tabOptions = [
    { id: 1, value: "journal", label: "Inventory Journal" },
    { id: 2, value: "inbound", label: "Inbound Mutation" },
    { id: 3, value: "outbound", label: "Outbound Mutation" },
  ];

  const renderContent = (
    data: PaginationResponse<ProductMutationDetailResponse>,
    isLoading: boolean,
    isInbound: boolean,
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-warehub-green" />
          <span className="ml-2 text-slate-600">Loading data...</span>
        </div>
      );
    }

    if (!data || data.content.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <p>No data available</p>
          <p className="mt-2 text-sm">
            Try selecting a different warehouse or tab
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-grow flex-col items-center justify-between gap-10">
        <div className="grid w-[90%] grid-cols-1 gap-4">
          {data.content.map((item: ProductMutationDetailResponse) => (
            <ProductMutationCard
              key={item.productMutationId}
              productMutation={item}
              isInbound={isInbound}
            />
          ))}
        </div>
        <PaginationAdmin
          desc="mutation"
          page={productMutationPage}
          setPage={setProductMutationPage}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          currentPageSize={data.content.length}
        />
      </div>
    );
  };

  return (
    <div className="bg-slate-50">
      <ProductMutationHeader />

      <Tabs defaultValue="journal" className="w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <TabsList className="mb-6 mt-4 grid h-12 w-full grid-cols-3 rounded-lg bg-white shadow-sm sm:h-14">
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
                }}
              >
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="rounded-xl bg-white shadow-sm">
            <TabsContent value="journal" className="p-4 sm:p-6">
              {adjustmentJournals &&
                renderContent(adjustmentJournals, isLoadingJournals, false)}
            </TabsContent>

            <TabsContent value="inbound" className="p-4 sm:p-6">
              {inboundMutation &&
                renderContent(inboundMutation, isLoadingInbound, true)}
            </TabsContent>

            <TabsContent value="outbound" className="p-4 sm:p-6">
              {outboundMutation &&
                renderContent(outboundMutation, isLoadingOutbound, false)}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductMutation;
