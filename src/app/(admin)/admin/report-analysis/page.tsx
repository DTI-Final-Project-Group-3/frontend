"use client";

import React, { useState } from "react";
import ReportAnalysisHeader from "@/components/report-analysis/ReportAnalysisHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProductMutationHistoryTable from "@/components/report-analysis/ProductMutationHistoryTable";
import ProductMutationTotal from "@/components/report-analysis/ProductMutationTotal";
import ProductMutationChart from "@/components/report-analysis/ProductMutationChart";
import ReportAnalysisFilter from "@/components/report-analysis/ReportAnalysisFilter";
import CustomerOrderHistoryTable from "@/components/report-analysis/CustomerOrderHistoryTable";
import CustomerOrderChart from "@/components/report-analysis/CustomerOrderChart";

const ReportAnalysisPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const tabOptions = [
    { id: 1, value: "order", label: "Customer Order" },
    { id: 2, value: "mutation", label: "Product Mutation" },
  ];

  return (
    <div>
      <ReportAnalysisHeader />
      <Tabs defaultValue="order" className="w-full">
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
            <ReportAnalysisFilter isProductMutation={selectedTab === 2} />
            <TabsContent value="order" className="p-4 sm:p-6">
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
