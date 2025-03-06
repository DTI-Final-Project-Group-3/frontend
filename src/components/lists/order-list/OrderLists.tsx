"use client";

import React, { FC } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { addOneHour } from "@/utils/time";
import { ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import OrderListLoadingSkeleton from "@/components/skeleton/OrderListLoadingSkeleton";
import CompletePaymentOrder from "./complete-payment/CompletePaymentOrder";
import PaginationComponent from "./PaginationComponent";
import ConfirmOrderModal from "./ConfirmOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";
import CancelOrderModal from "./CancelOrderModal";
import Image from "next/image";
import AdminManageOrderActions from "./admin-manage-order/AdminManageOrderActions";

const OrderLists: FC = () => {
  const { data: session } = useSession();

  const {
    page,
    limit,
    search,
    statusId,
    startDate,
    endDate,
    warehouseId,
    setFilters,
  } = useOrderStore();

  const { data, isLoading, isError } = useOrders(
    page,
    limit,
    session?.accessToken,
    statusId ? Number(statusId) : undefined,
    search,
    startDate,
    endDate,
    warehouseId ? Number(warehouseId) : undefined,
  );

  console.log(session?.userDetail?.role);
  return (
    <div className="min-h-[500px] w-full rounded-xl bg-white md:p-6">
      <div className="flex flex-col gap-6 p-6">
        {/* Handle loading state */}
        {isLoading && (
          <div className="flex min-h-[500px] w-full flex-col items-center justify-center gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <OrderListLoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Handle error fetch */}
        {isError && (
          <div className="flex h-[500px] w-full items-center justify-center">
            Error loading orders, Please try to reload your page.
          </div>
        )}

        {/* Handle No order list found */}
        {data?.data.content.length === 0 ? (
          <div className="flex h-[500px] w-full items-center justify-center">
            No order lists found.
          </div>
        ) : (
          data?.data.content.map((order) => (
            <div
              key={order.id}
              className="flex w-full flex-col gap-6 rounded-xl border p-6 transition-shadow duration-300 hover:shadow-[0_3px_08px_3px_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col items-center gap-5 md:flex-row">
                <div className="flex flex-col flex-nowrap gap-1 md:flex-row md:gap-5">
                  <strong className="flex items-center justify-center gap-3">
                    <ShoppingBag size={18} />
                    <span className="line-clamp-1 text-lg">
                      {order.warehouseName}
                    </span>
                  </strong>
                  <span className="text-base text-gray-500">
                    {formatDateTime(order.createdAt).formattedDateTime}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
                  <span className="whitespace-nowrap rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-700">
                    {order.orderStatusName}
                  </span>
                  <span className="text-sm font-medium text-gray-800 md:text-[16px]">
                    {order.invoiceCode}
                  </span>
                </div>
              </div>

              {/* Order items & detail payment */}
              <div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-center md:justify-center">
                {/* Order items */}
                <div className="flex w-full flex-col gap-6 py-4 md:border-r md:py-0">
                  {order.customerOrderitems.length > 0 && (
                    <div
                      className="flex flex-row gap-4"
                      key={order.customerOrderitems[0].id}
                    >
                      <Image
                        src="/images/no-image-icon.jpg"
                        alt="Product image"
                        width={60}
                        height={60}
                        className="h-[60px] w-[60px] object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <strong>
                          {order.customerOrderitems[0].productName}
                        </strong>
                        <div className="flex gap-2">
                          <span>
                            ({order.customerOrderitems[0].quantity}) item
                          </span>
                          <span>x</span>
                          <span>
                            {formatPrice(
                              String(order.customerOrderitems[0].unitPrice),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail payment */}
                <div className="flex flex-col items-start justify-start gap-2 md:pr-14">
                  <span className="whitespace-nowrap bg-slate-100 px-2 py-1 text-sm font-semibold text-gray-600">
                    {order.paymentMethodName}
                  </span>
                  <span className="text-sm">Total amount : </span>
                  <strong className="text-lg">
                    {formatPrice(String(order.totalAmount))}
                  </strong>
                </div>
              </div>

              <Separator />

              {/* Button modals */}
              <div className="flex w-full flex-col items-center justify-end gap-2 md:flex-row md:gap-4 md:px-6">
                {/* Always visible for all roles */}
                <OrderDetailsModal orderId={order.id} />

                {/* CUSTOMER_VERIFIED: Show all other buttons */}
                {session?.userDetail?.role === "CUSTOMER_VERIFIED" && (
                  <>
                    {order.orderStatusId === 1 &&
                      order.paymentProofImageUrl === null && (
                        <CompletePaymentOrder
                          createdAt={order.createdAt}
                          orderId={order.id}
                          orderStatusId={order.orderStatusId}
                          paymentMethodId={order.paymentMethodId}
                          midtransToken={order.gatewayTrxId}
                        />
                      )}
                    {order.orderStatusId === 1 &&
                      order.paymentProofImageUrl === null &&
                      new Date() < addOneHour(order.createdAt.toString()) && (
                        <CancelOrderModal
                          orderId={order.id}
                          orderStatusId={order.orderStatusId}
                        />
                      )}
                    {order.orderStatusId === 4 && (
                      <ConfirmOrderModal
                        accessToken={session?.accessToken}
                        orderId={order.id}
                        orderStatusId={order.orderStatusId}
                      />
                    )}
                  </>
                )}
                {/* ADMIN_WAREHOUSE & ADMIN_SUPER customer order actions */}
                <AdminManageOrderActions
                  order={order}
                  // addOneHour={addOneHour}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && (
        <PaginationComponent
          page={page}
          totalPages={data?.data.totalPages ?? 0}
          setPage={(newPage) => setFilters({ page: newPage })}
        />
      )}
    </div>
  );
};

export default OrderLists;
