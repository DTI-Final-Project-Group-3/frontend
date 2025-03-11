import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatPrice } from "@/utils/formatter";

interface AreaChartCardProps<T> {
  title: string;
  description: string;
  data: T[];
  dataKey: string;
  config: ChartConfig;
  height?: string;
}

const AreaChartCard = <T,>({
  title,
  description,
  data,
  dataKey,
  config,
  height = "h-[250px]",
}: AreaChartCardProps<T>) => {
  const formatRupiahPriceShort = (value: number): string => {
    if (dataKey === "totalValue") {
      if (value >= 1000000000) {
        return `Rp${(value / 1000000000).toFixed(1)}M`;
      } else if (value >= 1000000) {
        return `Rp${(value / 1000000).toFixed(1)}Jt`;
      } else if (value >= 1000) {
        return `Rp${(value / 1000).toFixed(1)}Rb`;
      } else {
        return `Rp${value}`;
      }
    }
    return value.toString();
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-md font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className={`aspect-auto ${height} w-full`}
        >
          <AreaChart
            data={data}
            margin={{ left: 10, right: 10, top: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`fill${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={Object.values(config)[0].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={Object.values(config)[0].color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={formatRupiahPriceShort}
              padding={{ top: 10 }}
            />

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
                  formatter={(value) => {
                    const formattedValue = formatPrice(value.toString());
                    const label =
                      dataKey === "totalValue"
                        ? "Total value"
                        : "Total quantity";
                    return `${label} : ${formattedValue}`;
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey={dataKey}
              type="monotone"
              fill={`url(#fill${dataKey})`}
              stroke={Object.values(config)[0].color}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
