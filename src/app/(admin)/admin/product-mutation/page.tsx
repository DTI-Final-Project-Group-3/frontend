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
import { PaginationProductAdmin } from "@/components/pagination/PaginationProductAdmin";

const ProductMutation: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const { destinationWarehouseId } = useProductMutation();

  const { data: adjustmentJournals, isLoading: isLoadingJournals } = useQuery({
    queryKey: ["adjustment-journal", destinationWarehouseId, selectedTab, page],
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
    queryKey: ["inbound-mutation", destinationWarehouseId, selectedTab, page],
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
    queryKey: ["outbond-mutation", destinationWarehouseId, selectedTab, page],
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

  const renderContent = (data: any, isLoading: boolean, isInbound: boolean) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-warehub-green" />
          <span className="ml-2 text-slate-600">Loading data...</span>
        </div>
      );
    }

    if (!data || data.content.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-16 text-slate-500">
          <p>No data available</p>
          <p className="text-sm mt-2">
            Try selecting a different warehouse or tab
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-between flex-grow items-center gap-10">
        <div className="grid grid-cols-1 gap-4 w-[90%]">
          {data.content.map((item: any) => (
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
        <div className="px-4 sm:px-6 lg:px-8 mx-auto">
          <TabsList className="w-full grid grid-cols-3 h-12 sm:h-14 bg-white rounded-lg shadow-sm mb-6 mt-4">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.value}
                className={cn(
                  "h-full transition-all font-medium rounded-none",
                  selectedTab === tab.id
                    ? "text-emerald-700 border-b-2 border-warehub-green"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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

          <div className="bg-white rounded-xl shadow-sm">
            <TabsContent value="journal" className="p-4 sm:p-6">
              {renderContent(adjustmentJournals, isLoadingJournals, false)}
            </TabsContent>

            <TabsContent value="inbound" className="p-4 sm:p-6">
              {renderContent(inboundMutation, isLoadingInbound, true)}
            </TabsContent>

            <TabsContent value="outbond" className="p-4 sm:p-6">
              {renderContent(outbondMutation, isLoadingOutbound, false)}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductMutation;
