"use client";

import { FC } from "react";
import ImageComponent from "../common/ImageComponent";
import { ProductMutationDetailResponse } from "@/types/models/productMutation";
import { formatDateString } from "@/utils/formatter";
import ProductMutationReviewDialog from "./ProductMutationReviewDialog";
import StatusComponent from "@/components/common/StatusComponent";
import {
  ArrowLeftRight,
  User,
  Package,
  Clock,
  MessageSquare,
  Tag,
  RefreshCcw,
  Trash2,
  Pen,
  ArrowRightFromLine,
  ArrowLeftFromLine,
} from "lucide-react";
import { ProductMutationConstant } from "@/constant/productMutationConstant";

interface ProductMutationCardProps {
  productMutation: ProductMutationDetailResponse;
  isInbound: boolean;
}

const ProductMutationCard: FC<ProductMutationCardProps> = ({
  productMutation,
  isInbound,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex w-full items-center justify-between sm:w-auto">
          {productMutation.productMutationTypeId <= 2 && (
            <div className="flex flex-row items-center gap-2">
              {isInbound
                ? productMutation?.originWarehouseName && (
                    <div className="flex items-center gap-2">
                      <ArrowLeftFromLine size={18} className="text-blue-600" />
                      <span className="line-clamp-1 text-base font-medium sm:text-lg">
                        <span className="text-blue-600">
                          {productMutation?.originWarehouseName}
                        </span>
                      </span>
                    </div>
                  )
                : productMutation.destinationWarehouseId && (
                    <div className="flex items-center gap-2">
                      <ArrowRightFromLine
                        size={18}
                        className="text-green-600"
                      />
                      <span className="line-clamp-1 text-base font-medium sm:text-lg">
                        <span className="text-green-700">
                          {productMutation?.destinationWarehouseName}
                        </span>
                      </span>
                    </div>
                  )}
            </div>
          )}

          <div className="sm:hidden">
            <StatusComponent
              name={productMutation?.productMutationStatusName}
            />
          </div>
        </div>

        <div className="hidden sm:block">
          <StatusComponent name={productMutation?.productMutationStatusName} />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6 sm:flex-row">
        <div className="w-full border-slate-200 sm:w-2/3 sm:border-r sm:pr-6">
          <div className="flex flex-row items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 p-2 shadow-sm sm:h-24 sm:w-24">
              <ImageComponent
                src={productMutation.productThumbnail}
                alt={productMutation?.productName || "Product image"}
                width={100}
                height={100}
                className="h-full w-full rounded object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <strong className="flex items-center gap-2 text-base text-slate-800 sm:text-lg">
                <Package size={16} className="text-slate-600" />
                {productMutation?.productName}
              </strong>
              <div className="flex w-fit items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
                <Tag size={14} />
                <span className="font-medium text-slate-700">
                  {productMutation?.quantity}
                </span>
                <span className="text-slate-600">units</span>
              </div>
              {productMutation?.requesterNotes && (
                <p className="mt-1 line-clamp-2 flex max-w-md items-start gap-2 rounded-md border-l-2 border-amber-300 bg-amber-50 p-2 text-sm text-slate-600">
                  <MessageSquare
                    size={14}
                    className="mt-1 flex-shrink-0 text-amber-500"
                  />
                  <span>{productMutation.requesterNotes}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-2 sm:w-1/3">
          <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_UPDATE_INVENTORY && (
              <RefreshCcw size={14} className="text-indigo-600" />
            )}
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_DELETE_INVENTORY && (
              <Trash2 size={14} className="text-indigo-600" />
            )}
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_CREATE_INVENTORY && (
              <Pen size={14} className="text-indigo-600" />
            )}
            {(productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_AUTO_MUTATION ||
              productMutation?.productMutationTypeId ===
                ProductMutationConstant.TYPE_MANUAL_MUTATION) && (
              <ArrowLeftRight size={14} className="text-indigo-600" />
            )}

            {productMutation?.productMutationTypeName}
          </span>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />
            <div className="flex flex-col">
              <span>
                Created: {formatDateString(productMutation?.createdAt)}
              </span>
              {productMutation?.reviewedAt && (
                <span className="mt-1">
                  Reviewed: {formatDateString(productMutation?.reviewedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-6">
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
            <User size={12} className="text-slate-400" />
            Requested by:{" "}
            <span className="ml-1 font-medium text-slate-700">
              {productMutation?.requesterName}
            </span>
          </span>
          {productMutation?.reviewedAt && (
            <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
              <User size={12} className="text-green-500" />
              Reviewed by:{" "}
              <span className="ml-1 font-medium text-slate-700">
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
