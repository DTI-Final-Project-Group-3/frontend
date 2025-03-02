// components/StockReport.tsx
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Dummy data
const stockHistory = [
  {
    date: "2024-01-01",
    product: "Product A",
    type: "restock",
    quantity: 100,
    user: "Admin",
  },
  {
    date: "2024-01-05",
    product: "Product A",
    type: "sale",
    quantity: -20,
    user: "User 1",
  },
];

const stockSummary = [{ month: "Jan", added: 500, reduced: 200, ending: 300 }];

export default function StockReport({ isAdmin }: { isAdmin: boolean }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");

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
          </select>
        )}

        <input
          type="month"
          className="rounded border p-2"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <button className="flex items-center gap-2 px-4 py-2 text-blue-500">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded bg-blue-50 p-4">
          <h3 className="text-sm text-gray-500">Total Added</h3>
          <p className="text-2xl font-bold">500</p>
        </div>
        <div className="rounded bg-blue-50 p-4">
          <h3 className="text-sm text-gray-500">Total Reduced</h3>
          <p className="text-2xl font-bold">200</p>
        </div>
        <div className="rounded bg-blue-50 p-4">
          <h3 className="text-sm text-gray-500">Ending Stock</h3>
          <p className="text-2xl font-bold">300</p>
        </div>
      </div>

      <LineChart width={800} height={300} data={stockSummary}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ending" stroke="#8884d8" />
      </LineChart>

      <table className="mt-6 w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stockHistory.map((item) => (
            <tr key={item.date} className="border-t">
              <td className="p-2">{item.date}</td>
              <td className="p-2">{item.product}</td>
              <td className="p-2">
                <span
                  className={`rounded px-2 py-1 ${item.type === "restock" ? "bg-green-100" : "bg-red-100"}`}
                >
                  {item.type}
                </span>
              </td>
              <td className="p-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
