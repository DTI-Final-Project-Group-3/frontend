import { FC } from "react";
import { cn } from "@/lib/utils";

const ProductMutationStatusColorsConstant = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  declined: "bg-red-100 text-rose-700",
  expired: "bg-red-100 text-rose-700",
  default: "bg-slate-100 text-slate-700",
} as const;

const getProductMutationStatusColor = (status: string): string => {
  const key =
    status.toLowerCase() as keyof typeof ProductMutationStatusColorsConstant;
  return (
    ProductMutationStatusColorsConstant[key] ||
    ProductMutationStatusColorsConstant.default
  );
};

const StatusComponent: FC<{ name: string }> = ({ name }) => {
  const statusColorClass = getProductMutationStatusColor(name);

  return (
    statusColorClass && (
      <span
        className={cn(
          statusColorClass,
          "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        )}
      >
        {name}
      </span>
    )
  );
};

export default StatusComponent;
