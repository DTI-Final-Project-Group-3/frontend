"use client";

import { getPaginatedProductMutation } from "@/app/api/product-mutation/getProductMutation";
import ProductMutationCard from "@/components/product-mutation/ProductMutationCard";
import ProductMutationHeader from "@/components/product-mutation/ProductMutationHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ADMIN_PRODUCT_MUTATION } from "@/constant/productConstant";
import { cn } from "@/lib/utils";
import { useProductMutation } from "@/store/productMutationStore";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { PaginationProductAdmin } from "@/components/pagination/PaginationAdmin";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { ApiResponse } from "@/types/api/apiResponse";
import { PaginationResponse } from "@/types/api/pagination";

const ProductMutation: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const { destinationWarehouseId, submitMutation } = useProductMutation();

  const { data: adjustmentJournals, isLoading: isLoadingJournals } = useQuery({
    queryKey: [
      "adjustment-journal",
      destinationWarehouseId,
      selectedTab,
      page,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page,
        limit: ADMIN_PRODUCT_MUTATION,
        destinationWarehouseId: destinationWarehouseId,
        mutationTypeId: 3,
      }),
    enabled: !!destinationWarehouseId,
  });

  const { data: inboundMutation, isLoading: isLoadingInbound } = useQuery({
    queryKey: [
      "inbound-mutation",
      destinationWarehouseId,
      selectedTab,
      page,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page,
        limit: ADMIN_PRODUCT_MUTATION,
        destinationWarehouseId: destinationWarehouseId,
        mutationTypeId: 1,
      }),
    enabled: !!destinationWarehouseId,
  });

  const { data: outbondMutation, isLoading: isLoadingOutbound } = useQuery({
    queryKey: [
      "outbond-mutation",
      destinationWarehouseId,
      selectedTab,
      page,
      submitMutation,
    ],
    queryFn: () =>
      getPaginatedProductMutation({
        page,
        limit: ADMIN_PRODUCT_MUTATION,
        originWarehouseId: destinationWarehouseId,
        mutationTypeId: 1,
      }),
    enabled: !!destinationWarehouseId,
  });

  const tabOptions = [
    { id: 1, value: "journal", label: "Adjustment Journal" },
    { id: 2, value: "inbound", label: "Inbound Mutation" },
    { id: 3, value: "outbond", label: "Outbound Mutation" },
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
        <PaginationProductAdmin
          currentPage={page}
          totalPages={data.totalPages}
          hasNext={data.hasNext}
          hasPrev={data.hasPrev}
          onPageChange={setPage}
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
                  "h-full rounded-none font-medium transition-all",
                  selectedTab === tab.id
                    ? "border-b-2 border-warehub-green text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
                onClick={() => setSelectedTab(tab.id)}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label
                    .replace("Mutation", "")
                    .replace("Adjustment", "Adj.")}
                </span>
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

            <TabsContent value="outbond" className="p-4 sm:p-6">
              {outbondMutation &&
                renderContent(outbondMutation, isLoadingOutbound, false)}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductMutation;
