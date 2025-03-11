import { FC } from "react";
import { PaginationResponse } from "@/types/api/pagination";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { Loader2 } from "lucide-react";
import ProductMutationCard from "@/components/product-mutation/ProductMutationCard";

const ReportAnalysisTabs: FC = () => {
  return <div>Test</div>;
};

export default ReportAnalysisTabs;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderContent = (
  data: PaginationResponse<ProductMutationDetailResponse>,
  isLoading: boolean,
  isInbound: boolean,
) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-warehub-green" />
        <span className="ml-2 text-slate-600">Loading data...</span>
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <p>No data available</p>
        <p className="mt-2 text-sm">
          Try selecting a different warehouse or tab
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-between gap-10">
      <div className="grid w-[90%] grid-cols-1 gap-4">
        {data.content.map((item: ProductMutationDetailResponse) => (
          <ProductMutationCard
            key={item.productMutationId}
            productMutation={item}
            isInbound={isInbound}
          />
        ))}
      </div>
    </div>
  );
};
