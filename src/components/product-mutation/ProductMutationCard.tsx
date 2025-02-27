"use client";

import { FC } from "react";
import ImageComponent from "../common/ImageComponent";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { formatDate } from "@/utils/formatter";
import { useProductMutation } from "@/store/productMutationStore";

interface ProductMutationCardProps {
  productMutation: ProductMutationDetailResponse;
  isInbound: boolean;
}

const STATUS_VARIANTS = {
  approved: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  default: "bg-slate-100 text-slate-700",
};

const ProductMutationCard: FC<ProductMutationCardProps> = ({
  productMutation,
  isInbound,
}) => {
  const getStatusColor = (status: string): string => {
    const key = status.toLowerCase() as keyof typeof STATUS_VARIANTS;
    return STATUS_VARIANTS[key] || STATUS_VARIANTS.default;
  };

  const statusColorClass = getStatusColor(
    productMutation?.productMutationStatusName || "",
  );

  const handleAccept = () => console.log("Accept mutation");
  const handleReject = () => console.log("Reject mutation");

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-6 transition-all duration-300 hover:shadow-lg sm:px-6 lg:px-8">
      {productMutation.productMutationTypeId <= 2 && (
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          {isInbound ? (
            <div className="flex w-full flex-col flex-nowrap gap-1 sm:w-auto sm:flex-row sm:gap-3">
              <strong className="flex items-center gap-2 text-slate-800">
                <span className="line-clamp-1 text-base font-medium sm:text-lg">
                  From : {productMutation?.originWarehouseName}
                </span>
              </strong>
            </div>
          ) : (
            <div className="flex w-full flex-col flex-nowrap gap-1 sm:w-auto sm:flex-row sm:gap-3">
              <strong className="flex items-center gap-2 text-slate-800">
                <span className="line-clamp-1 text-base font-medium sm:text-lg">
                  To : {productMutation?.destinationWarehouseName}
                </span>
              </strong>
            </div>
          )}
          <span
            className={`rounded-full px-3 py-1 ${statusColorClass} whitespace-nowrap text-xs font-semibold`}
          >
            {productMutation?.productMutationStatusName}
          </span>
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-6 sm:flex-row">
        <div className="w-full border-slate-200 sm:w-2/3 sm:border-r sm:pr-6">
          <div className="flex flex-row items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 p-2 sm:h-24 sm:w-24">
              <ImageComponent
                src={productMutation.productThumbnail}
                alt={productMutation?.productName || "Product image"}
                width={100}
                height={100}
                className="h-full w-full rounded object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <strong className="text-base text-slate-800 sm:text-lg">
                {productMutation?.productName}
              </strong>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">
                  {productMutation?.quantity}
                </span>
                <span className="text-slate-600">units</span>
              </div>
              {productMutation?.requesterNotes && (
                <p className="mt-1 line-clamp-2 max-w-md text-sm text-slate-600">
                  {productMutation.requesterNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mutation Type */}
        <div className="flex flex-col items-start justify-start gap-2 sm:w-1/3">
          <span className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {productMutation?.productMutationTypeName}
          </span>
        </div>
      </div>

      {/* Footer - Timestamps & Actions */}
      <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
        <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-row sm:gap-6">
          <span className="text-xs text-slate-500">
            Request on {formatDate(productMutation?.createdAt)} by{" "}
            <span className="font-medium">
              {productMutation?.requesterName}
            </span>
          </span>
          {productMutation?.reviewedAt && (
            <span className="text-xs text-slate-500">
              Approve on {formatDate(productMutation?.reviewedAt)} by{" "}
              <span className="font-medium">
                {productMutation?.requesterName}
              </span>
            </span>
          )}
        </div>

        {productMutation.productMutationTypeId <= 2 &&
          productMutation.productMutationStatusId === 1 &&
          !isInbound && (
            <div className="mt-3 flex w-full justify-center gap-3 sm:mt-0 sm:w-auto sm:justify-end">
              <button
                onClick={handleReject}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="rounded-lg bg-warehub-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-warehub-green"
              >
                Approve
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductMutationCard;
