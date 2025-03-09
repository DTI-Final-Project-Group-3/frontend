import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

const productSales = [
  { product: "Product A", sales: 1400 },
  { product: "Product B", order: 1500 },
];

export default function SalesReport() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex flex-wrap gap-4"></div>

      <LineChart width={800} height={300} data={productSales}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
      </LineChart>

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
              <td className="p-2">{item.order}</td>
              <td className="p-2">${item.order * 10}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
