"use client";

import { getPagiantedProductMutation } from "@/app/api/product-mutation/getProductMutation";
import ProductMutationCard from "@/components/product-mutation/ProductMutationCard";
import ProductMutationHeader from "@/components/product-mutation/ProductMutationHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_PRODUCT_MUTATION } from "@/constant/productConstant";
import { cn } from "@/lib/utils";
import { useProductMutation } from "@/store/productMutationStore";
import { TabsContent } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";

const ProductMutation: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const { productMutatationRequest, setProductMutationRequest } =
    useProductMutation();

  const { data: adjustmentJournals } = useQuery({
    queryKey: [
      "adjustment-journal",
      productMutatationRequest?.destinationWarehouseId,
    ],
    queryFn: () =>
      getPagiantedProductMutation({
        page,
        limit: ADMIN_PRODUCT_MUTATION,
        destinationWarehouseId:
          productMutatationRequest?.destinationWarehouseId,
        mutationTypeId: 3,
      }),

    enabled: !!productMutatationRequest?.destinationWarehouseId,
  });
  return (
    <>
      <ProductMutationHeader />
      <Tabs defaultValue="journal">
        <TabsList className="w-full grid grid-cols-3 h-14 bg-white">
          <TabsTrigger
            value="journal"
            className={cn(
              selectedTab === 1 ? "border-b-2 border-b-green-500" : "",
              "h-full rounded-none"
            )}
            onClick={() => setSelectedTab(1)}
          >
            Adjustment Journal
          </TabsTrigger>
          <TabsTrigger
            value="inbound"
            className={cn(
              selectedTab === 2 ? "border-b-2 border-b-green-500" : "",
              "h-full rounded-none"
            )}
            onClick={() => setSelectedTab(2)}
          >
            Inbound Mutation
          </TabsTrigger>
          <TabsTrigger
            value="outbond"
            className={cn(
              selectedTab === 3 ? "border-b-2 border-b-green-500" : "",
              "h-full rounded-none"
            )}
            onClick={() => setSelectedTab(3)}
          >
            Outbond Mutation
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="journal"
          className="grid grid-cols-1 gap-5 px-20 py-8 bg-white"
        >
          {adjustmentJournals &&
            adjustmentJournals?.content.map((journal) => (
              <ProductMutationCard
                key={journal.productMutationId}
                productMutation={journal}
              />
            ))}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductMutation;
