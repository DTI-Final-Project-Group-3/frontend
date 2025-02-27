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
    productMutation?.productMutationStatusName || ""
  );

  const handleAccept = () => console.log("Accept mutation");
  const handleReject = () => console.log("Reject mutation");

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-6 border border-slate-200 rounded-xl w-full hover:shadow-lg transition-all duration-300 bg-white">
      {productMutation.productMutationTypeId <= 2 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {isInbound ? (
            <div className="flex flex-nowrap flex-col sm:flex-row gap-1 sm:gap-3 w-full sm:w-auto">
              <strong className="flex items-center gap-2 text-slate-800">
                <span className="text-base sm:text-lg line-clamp-1 font-medium">
                  From : {productMutation?.originWarehouseName}
                </span>
              </strong>
            </div>
          ) : (
            <div className="flex flex-nowrap flex-col sm:flex-row gap-1 sm:gap-3 w-full sm:w-auto">
              <strong className="flex items-center gap-2 text-slate-800">
                <span className="text-base sm:text-lg line-clamp-1 font-medium">
                  To : {productMutation?.destinationWarehouseName}
                </span>
              </strong>
            </div>
          )}
          <span
            className={`px-3 py-1 rounded-full ${statusColorClass} font-semibold text-xs whitespace-nowrap`}
          >
            {productMutation?.productMutationStatusName}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
        <div className="w-full sm:w-2/3 sm:pr-6 sm:border-r border-slate-200">
          <div className="flex flex-row gap-4 items-center">
            <div className="relative rounded-lg overflow-hidden bg-slate-50 p-2 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <ImageComponent
                src={productMutation.productThumbnail}
                alt={productMutation?.productName || "Product image"}
                width={100}
                height={100}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div className="flex flex-col gap-2">
              <strong className="text-slate-800 text-base sm:text-lg">
                {productMutation?.productName}
              </strong>
              <div className="flex gap-2 items-center">
                <span className="font-medium text-slate-700">
                  {productMutation?.quantity}
                </span>
                <span className="text-slate-600">units</span>
              </div>
              {productMutation?.notes && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2 max-w-md">
                  {productMutation.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mutation Type */}
        <div className="flex flex-col items-start justify-start gap-2 sm:w-1/3">
          <span className="font-medium text-slate-700 text-sm px-3 py-1.5 bg-slate-100 rounded-md whitespace-nowrap">
            {productMutation?.productMutationTypeName}
          </span>
        </div>
      </div>

      {/* Footer - Timestamps & Actions */}
      <div className="flex flex-col sm:flex-row w-full gap-4 items-center justify-between mt-2 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 w-full sm:w-auto">
          <span className="text-slate-500 text-xs">
            Request on {formatDate(productMutation?.createdAt)} by{" "}
            <span className="font-medium">
              {productMutation?.requesterName}
            </span>
          </span>
          {productMutation?.acceptedAt && (
            <span className="text-slate-500 text-xs">
              Accept on {formatDate(productMutation?.acceptedAt)} by{" "}
              <span className="font-medium">
                {productMutation?.approverName}
              </span>
            </span>
          )}
        </div>

        {productMutation.productMutationTypeId <= 2 && !isInbound && (
          <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end mt-3 sm:mt-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-warehub-green text-white hover:bg-warehub-green transition-colors font-medium text-sm"
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
