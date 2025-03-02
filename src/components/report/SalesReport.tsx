// components/SalesReport.tsx
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Dummy data
const monthlySales = [
  { month: "Jan", total: 2400, categoryA: 1400, categoryB: 1000 },
  { month: "Feb", total: 3210, categoryA: 1800, categoryB: 1410 },
];

const productSales = [
  { product: "Product A", sales: 1400 },
  { product: "Product B", sales: 1500 },
];

const categorySales = [
  { category: "Electronics", sales: 3000 },
  { category: "Clothing", sales: 1500 },
];

export default function SalesReport({ isAdmin }: { isAdmin: boolean }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [activeTab, setActiveTab] = useState("monthly");

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex flex-wrap gap-4">
        {isAdmin && (
          <select
            className="rounded border p-2"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="all">All Warehouses</option>
            <option value="warehouse1">Warehouse 1</option>
            <option value="warehouse2">Warehouse 2</option>
          </select>
        )}

        <input
          type="month"
          className="rounded border p-2"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <div className="flex gap-2">
          {["monthly", "category", "product"].map((tab) => (
            <button
              key={tab}
              className={`rounded px-4 py-2 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-blue-500">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export
        </button>
      </div>

      {activeTab === "monthly" && (
        <BarChart width={800} height={300} data={monthlySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      )}

      {activeTab === "category" && (
        <LineChart width={800} height={300} data={categorySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
        </LineChart>
      )}

      {/* Add product sales table */}
      <table className="mt-6 w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {productSales.map((item) => (
            <tr key={item.product} className="border-t">
              <td className="p-2">{item.product}</td>
              <td className="p-2">Category</td>
              <td className="p-2">{item.sales}</td>
              <td className="p-2">${item.sales * 10}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
