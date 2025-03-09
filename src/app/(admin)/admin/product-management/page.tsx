"use client";

import React, { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProductManagementHeader from "@/components/product-management/ProductManagementHeader";
import ProductCategoryTable from "@/components/product-management/categories/ProductCategoryTable";
import ProductListTable from "@/components/product-management/products/ProductListTable";
import { useProductAdmin } from "@/store/productAdminStore";

const ProductManagementPage: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const { setProductPage } = useProductAdmin();

  const tabOptions = [
    { id: 1, value: "products", label: "Product" },
    { id: 2, value: "categories", label: "Categories" },
  ];

  return (
    <div className="space-y-2">
      <ProductManagementHeader selectedTab={selectedTab} />
      <Tabs defaultValue="products" className="w-full">
        <div>
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-lg bg-white shadow-sm sm:h-14">
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
                  setProductPage(0);
                  setSelectedTab(tab.id);
                }}
              >
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full rounded-xl bg-white shadow-sm">
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
