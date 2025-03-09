"use client";

import React, { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductCategoryTable from "@/components/product-management/ProductCategoryTable";
import ProductListTable from "@/components/product-management/ProductListTable";

const ProductManagementPage: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const tabOptions = [
    { id: 1, value: "products", label: "Product" },
    { id: 2, value: "categories", label: "Categories" },
  ];

  return (
    <div>
      <ProductManagementHeader selectedTab={selectedTab} />
      <Tabs defaultValue="products" className="w-full">
        <div>
          <TabsList className="my-4 grid h-12 w-full grid-cols-2 rounded-lg bg-white shadow-sm sm:h-14">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.value}
                className={cn(
                  "relative h-full rounded-none font-medium",
                  "data-[state=active]:border-b-2 data-[state=active]:border-warehub-green data-[state=active]:text-emerald-700",
                  "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
                onClick={() => setSelectedTab(tab.id)}
              >
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="rounded-xl bg-white shadow-sm">
            <TabsContent value="products">
              <ProductListTable />
            </TabsContent>

            <TabsContent value="categories">
              <ProductCategoryTable />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductManagementPage;
