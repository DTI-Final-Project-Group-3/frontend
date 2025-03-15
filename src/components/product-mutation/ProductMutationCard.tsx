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
  Edit3,
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
    <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-4 transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:px-4 sm:py-6">
      {/* Card Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Origin/Destination Warehouse */}
          {(productMutation.productMutationTypeId ===
            ProductMutationConstant.TYPE_INBOUND_MANUAL_MUTATION ||
            productMutation.productMutationTypeId ===
              ProductMutationConstant.TYPE_OUTBOUND_MANUAL_MUTATION ||
            productMutation.productMutationTypeId ===
              ProductMutationConstant.TYPE_INBOUND_AUTO_MUTATION) && (
            <div className="flex items-center gap-1 text-sm sm:text-base">
              {isInbound
                ? productMutation?.originWarehouseName && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ArrowLeftFromLine size={16} className="flex-shrink-0" />
                      <span className="line-clamp-1 font-medium text-slate-800">
                        {productMutation?.originWarehouseName}
                      </span>
                    </div>
                  )
                : productMutation.destinationWarehouseId && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ArrowRightFromLine size={16} className="flex-shrink-0" />
                      <span className="line-clamp-1 font-medium text-slate-800">
                        {productMutation?.destinationWarehouseName}
                      </span>
                    </div>
                  )}
            </div>
          )}

          {/* Mutation/Invoice Code */}
          {(productMutation.mutationCode || productMutation.invoiceCode) && (
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <Edit3 size={14} className="flex-shrink-0 text-slate-800" />
              <p className="rounded-xl bg-slate-50 px-2 py-1 text-xs text-slate-800 sm:text-sm">
                {productMutation.mutationCode || productMutation.invoiceCode}
              </p>
            </div>
          )}
        </div>

        {/* Status Component */}
        <StatusComponent name={productMutation?.productMutationStatusName} />
      </div>

      {/* Card Body */}
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        {/* Product Information */}
        <div className="w-full sm:w-2/3 sm:border-r sm:border-slate-200 sm:pr-4">
          <div className="flex items-start gap-3">
            {/* Product Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1 shadow-sm sm:h-20 sm:w-20 md:h-24 md:w-24">
              <ImageComponent
                src={productMutation.productThumbnail}
                alt={productMutation?.productName || "Product image"}
                width={100}
                height={100}
                className="h-full w-full rounded object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <strong className="flex items-center gap-1 text-sm text-gray-600 sm:text-base">
                <Package size={14} className="flex-shrink-0 text-slate-600" />
                <span className="line-clamp-2">
                  {productMutation?.productName}
                </span>
              </strong>

              {/* Quantity */}
              <div className="flex w-fit items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs sm:text-sm">
                <Tag size={12} className="flex-shrink-0" />
                <span className="font-medium text-slate-700">
                  {productMutation?.quantity}
                </span>
                <span className="text-slate-600">units</span>
              </div>

              {/* Notes */}
              {productMutation?.requesterNotes && (
                <p className="mt-1 line-clamp-2 flex items-start gap-1 rounded-md border-l-2 border-amber-300 bg-amber-50 p-2 text-xs text-slate-600 sm:text-sm">
                  <MessageSquare
                    size={12}
                    className="mt-0.5 flex-shrink-0 text-amber-500"
                  />
                  <span>{productMutation.requesterNotes}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mutation Details */}
        <div className="flex flex-col gap-2 sm:w-1/3">
          {/* Mutation Type */}
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_UPDATE_INVENTORY && (
              <RefreshCcw size={12} className="flex-shrink-0 text-indigo-600" />
            )}
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_DELETE_INVENTORY && (
              <Trash2 size={12} className="flex-shrink-0 text-indigo-600" />
            )}
            {productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_CREATE_INVENTORY && (
              <Pen size={12} className="flex-shrink-0 text-indigo-600" />
            )}
            {(productMutation?.productMutationTypeId ===
              ProductMutationConstant.TYPE_INBOUND_AUTO_MUTATION ||
              productMutation?.productMutationTypeId ===
                ProductMutationConstant.TYPE_INBOUND_MANUAL_MUTATION ||
              productMutation?.productMutationTypeId ===
                ProductMutationConstant.TYPE_OUTBOUND_MANUAL_MUTATION ||
              productMutation.productMutationTypeId ===
                ProductMutationConstant.TYPE_OUTBOUND_AUTO_MUTATION) && (
              <ArrowLeftRight
                size={12}
                className="flex-shrink-0 text-indigo-600"
              />
            )}
            <span className="line-clamp-1">
              {productMutation?.productMutationTypeName}
            </span>
          </span>

          {/* Timestamps */}
          <div className="mt-1 flex items-start gap-1 text-xs text-slate-500">
            <Clock size={12} className="mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <span>
                Created: {formatDateString(productMutation?.createdAt)}
              </span>
              {productMutation?.reviewedAt && (
                <span className="mt-0.5">
                  Reviewed: {formatDateString(productMutation?.reviewedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-2 flex w-full flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:justify-between">
        {/* User Information */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
            <User size={10} className="flex-shrink-0 text-slate-400" />
            Requested by:
            <span className="ml-1 line-clamp-1 font-medium text-slate-700">
              {productMutation?.requesterName}
            </span>
          </span>

          {productMutation?.reviewerName && (
            <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
              <User size={10} className="flex-shrink-0 text-green-500" />
              Reviewed by:
              <span className="ml-1 line-clamp-1 font-medium text-slate-700">
                {productMutation?.reviewerName}
              </span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {!isInbound &&
          productMutation.productMutationTypeId ===
            ProductMutationConstant.TYPE_OUTBOUND_MANUAL_MUTATION &&
          productMutation.productMutationStatusId ===
            ProductMutationConstant.STATUS_PENDING && (
            <div className="mt-2 flex justify-end gap-2 sm:mt-0">
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
