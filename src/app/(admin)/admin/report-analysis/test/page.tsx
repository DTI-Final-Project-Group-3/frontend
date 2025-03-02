"use client";
import { useState } from "react";
import StockReport from "@/components/report-analysis/StockReport";
import SalesReport from "@/components/report-analysis/SalesReport";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState("sales");
  const [userRole, setUserRole] = useState<"admin" | "warehouse">("admin");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between">
          <div className="flex gap-4">
            <button
              className={`rounded px-4 py-2 ${activeReport === "sales" ? "bg-blue-500 text-white" : "bg-white"}`}
              onClick={() => setActiveReport("sales")}
            >
              Sales Report
            </button>
            <button
              className={`rounded px-4 py-2 ${activeReport === "stock" ? "bg-blue-500 text-white" : "bg-white"}`}
              onClick={() => setActiveReport("stock")}
            >
              Stock Report
            </button>
          </div>

          <select
            className="rounded border p-2"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
          >
            <option value="admin">Admin</option>
            <option value="warehouse">Warehouse Admin</option>
          </select>
        </div>

        {activeReport === "sales" ? (
          <SalesReport isAdmin={userRole === "admin"} />
        ) : (
          <StockReport isAdmin={userRole === "admin"} />
        )}
      </div>
    </div>
  );
}
