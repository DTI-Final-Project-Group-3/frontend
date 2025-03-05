import { FC } from "react";
import { useReport } from "@/store/reportStore";
import { useProductMutation } from "@/store/productMutationStore";
import { useQuery } from "@tanstack/react-query";
import { getProductMutationReportDailySummary } from "@/app/api/product-mutation/getProductMutation";
import { formatDateHyphen } from "@/utils/formatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Define chart configuration with hex colors
const chartConfig = {
  added: {
    label: "In",
    color: "#4CAF50", // Green hex color for added quantities
  },
  reduced: {
    label: "Out",
    color: "#F44336", // Red hex color for reduced quantities
  },
} satisfies ChartConfig;

const ProductMutationGraph: FC = () => {
  // Get filter values from report and product mutation stores
  const {
    dateRange,
    productMutationTypeId,
    productMutationStatusId,
    productId,
    productCategoryId,
  } = useReport();
  const { destinationWarehouseId } = useProductMutation();

  // Fetch daily summary data using react-query
  const { data: mutationDailySummary } = useQuery({
    queryKey: [
      "mutation-summary",
      dateRange,
      productId,
      productCategoryId,
      productMutationTypeId,
      productMutationStatusId,
      destinationWarehouseId,
    ],
    queryFn: () => {
      if (!dateRange.from || !dateRange.to || !destinationWarehouseId) {
        return Promise.resolve([]);
      }
      return getProductMutationReportDailySummary({
        startedAt: formatDateHyphen(dateRange.from),
        endedAt: formatDateHyphen(dateRange.to),
        productId,
        productCategoryId,
        productMutationTypeId,
        productMutationStatusId,
        warehouseId: destinationWarehouseId,
      });
    },
  });

  return (
    <Card>
      {/* Card Header */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          {/*<CardTitle>Product Mutation Over Time</CardTitle>*/}
          <CardDescription>
            Showing daily added and reduced product quantities
          </CardDescription>
        </div>
      </CardHeader>

      {/* Card Content with Chart */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={mutationDailySummary ?? []}>
            {/* Define gradients using hex colors */}
            <defs>
              <linearGradient id="fillAdded" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.added.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.added.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReduced" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.reduced.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.reduced.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* Chart Components */}
            <CartesianGrid vertical={false} />

            <YAxis />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {/* Area for Added Quantities */}
            <Area
              dataKey="added"
              type="monotone"
              fill="url(#fillAdded)"
              stroke={chartConfig.added.color}
            />

            {/* Area for Reduced Quantities */}
            <Area
              dataKey="reduced"
              type="monotone"
              fill="url(#fillReduced)"
              stroke={chartConfig.reduced.color}
            />

            {/* Chart Legend */}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductMutationGraph;
