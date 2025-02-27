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
  approved: "bg-green-200 text-green-700",
  completed: "bg-green-200 text-green-700",
  pending: "bg-yellow-200 text-yellow-700",
  cancelled: "bg-red-200 text-red-700",
  default: "bg-gray-200 text-gray-700",
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
    <div className="flex flex-col gap-6 px-16 py-8 border rounded-xl w-full hover:shadow-[0_3px_08px_3px_rgba(0,0,0,0.15)] transition-shadow duration-300">
      {productMutation.productMutationTypeId <= 2 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-nowrap flex-col md:flex-row gap-1 md:gap-5">
            <strong className="flex items-center justify-center gap-3">
              <span className="text-lg line-clamp-1">
                Request from : {productMutation?.originWarehouseName}
              </span>
            </strong>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row md:gap-5 gap-2">
            <span className="text-sm md:text-[16px] font-medium text-gray-800">
              Destination : {productMutation?.destinationWarehouseName}
            </span>
            <span
              className={`px-2 py-1 rounded-full ${statusColorClass} font-semibold text-xs whitespace-nowrap`}
            >
              {productMutation?.productMutationStatusName}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:justify-center items-start md:items-center w-full">
        <div className="w-full md:border-r">
          <div className="flex flex-row gap-8 px-5">
            <ImageComponent
              src={productMutation.productThumbnail}
              alt="Product image"
              width={100}
              height={100}
              className="object-cover w-auto h-auto"
            />
            <div className="flex flex-col gap-1">
              <strong>{productMutation?.productName}</strong>
              <div className="flex gap-2">
                <span>{productMutation?.quantity}</span>
                <span>units</span>
              </div>
              {productMutation?.notes && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {productMutation.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mutation Type */}
        <div className="flex flex-col items-start justify-start gap-2 md:pr-14">
          <span className="font-semibold text-gray-600 text-sm px-2 py-1 bg-slate-100 whitespace-nowrap">
            {productMutation?.productMutationTypeName}
          </span>
        </div>
      </div>

      {/* Footer - Timestamps & Actions */}
      <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row md:gap-10 gap-2">
          <span className="text-gray-500 text-xs">
            Request on {formatDate(productMutation?.createdAt)} by{" "}
            {productMutation?.requesterName}
          </span>
          {productMutation?.acceptedAt && (
            <span className="text-gray-500 text-xs">
              Accept on {formatDate(productMutation?.acceptedAt)} by{" "}
              {productMutation?.approverName}
            </span>
          )}
        </div>

        {productMutation.productMutationTypeId <= 2 && !isInbound && (
          <div className="space-x-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-lg bg-white border border-gray-500 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMutationCard;
