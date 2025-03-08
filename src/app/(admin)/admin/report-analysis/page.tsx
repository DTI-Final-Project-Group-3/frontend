"use client";

import React, { useState } from "react";
import ReportAnalysisHeader from "@/components/report-analysis/ReportAnalysisHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProductMutationHistoryTable from "@/components/report-analysis/ProductMutationHistoryTable";
import ProductMutationTotal from "@/components/report-analysis/ProductMutationTotal";
import ProductMutationChart from "@/components/report-analysis/ProductMutationChart";
import ProductMutationFilter from "@/components/product-mutation/ProductMutationFilter";
import CustomerOrderHistoryTable from "@/components/report-analysis/CustomerOrderHistoryTable";
import CustomerOrderChart from "@/components/report-analysis/CustomerOrderChart";

const ReportAnalysisPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const tabOptions = [
    { id: 1, value: "sales", label: "Sales Report" },
    { id: 2, value: "mutation", label: "Product Mutation Report" },
  ];

  return (
    <div>
      <ReportAnalysisHeader />
      <Tabs defaultValue="sales" className="w-full">
        <div>
          <TabsList className="mb-6 mt-4 grid h-12 w-full grid-cols-2 rounded-lg bg-white shadow-sm sm:h-14">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.value}
                className={cn(
                  "h-full rounded-none font-medium",
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
            <ProductMutationFilter isProductMutation={selectedTab === 2} />
            <TabsContent value="sales" className="p-4 sm:p-6">
              <CustomerOrderChart />
              <CustomerOrderHistoryTable />
            </TabsContent>

            <TabsContent value="mutation" className="space-y-10 p-4 sm:p-6">
              <ProductMutationTotal />
              <ProductMutationChart />
              <ProductMutationHistoryTable />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ReportAnalysisPage;
