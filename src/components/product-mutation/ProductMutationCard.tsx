"use client";

import { FC } from "react";
import ImageComponent from "../common/ImageComponent";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { formatDateString } from "@/utils/formatter";
import ProductMutationReviewDialog from "./ProductMutationReviewDialog";
import StatusComponent from "@/components/common/StatusComponent";

interface ProductMutationCardProps {
  productMutation: ProductMutationDetailResponse;
  isInbound: boolean;
}

const ProductMutationCard: FC<ProductMutationCardProps> = ({
  productMutation,
  isInbound,
}) => {
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

          <StatusComponent name={productMutation?.productMutationStatusName} />
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

        <div className="flex flex-col items-start justify-start gap-2 sm:w-1/3">
          <span className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {productMutation?.productMutationTypeName}
          </span>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
        <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-row sm:gap-6">
          <span className="text-xs text-slate-500">
            Request on {formatDateString(productMutation?.createdAt)} by{" "}
            <span className="font-medium">
              {productMutation?.requesterName}
            </span>
          </span>
          {productMutation?.reviewedAt && (
            <span className="text-xs text-slate-500">
              Reviewed on {formatDateString(productMutation?.reviewedAt)} by{" "}
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
              <ProductMutationReviewDialog
                isApprove={false}
                productMutationId={productMutation.productMutationId}
              />
              <ProductMutationReviewDialog
                isApprove={true}
                productMutationId={productMutation.productMutationId}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductMutationCard;
