"use client";

import React, { FC } from "react";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import OrderListLoadingSkeleton from "@/components/skeleton/OrderListLoadingSkeleton";
import PaginationComponent from "./PaginationComponent";
import ConfirmOrderModal from "./ConfirmOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";
import Image from "next/image";
import { useOrders } from "@/hooks/useOrders";

const OrderLists: FC = () => {
  const { data: session } = useSession();

  const { page, limit, search, statusId, startDate, endDate, setFilters } =
    useOrderStore();

  const { data, isLoading, isError } = useOrders(
    page,
    limit,
    session?.accessToken,
    statusId ? Number(statusId) : undefined,
    search,
    startDate,
    endDate
  );

  return (
    <div className="w-full min-h-[500px] bg-white rounded-xl md:p-6">
      <div className="p-6 flex flex-col gap-6">
        {/* Handle loading state */}
        {isLoading && (
          <div className="min-h-[500px] flex flex-col items-center justify-center w-full gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <OrderListLoadingSkeleton key={num} />
            ))}
          </div>
        )}

        {/* Handle error fetch */}
        {isError && (
          <div className="h-[500px] flex items-center justify-center w-full">
            Error loading orders, Please try to reload your page.
          </div>
        )}

        {/* Handle No order list found */}
        {data?.data.content.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center w-full">
            No order lists found.
          </div>
        ) : (
          data?.data.content.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-6 p-6 border rounded-xl w-full hover:shadow-[0_3px_08px_3px_rgba(0,0,0,0.15)] transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="flex flex-nowrap flex-col md:flex-row gap-1 md:gap-5">
                  <strong className="flex items-center justify-center gap-3">
                    <ShoppingBag size={18} />
                    <span className="text-lg line-clamp-1">
                      {order.warehouseName}
                    </span>
                  </strong>
                  <span className="text-base text-gray-500">
                    {formatDateTime(order.createdAt).formattedDate}
                  </span>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row md:gap-5 gap-2">
                  <span className="px-2 py-1 rounded-full bg-green-200 text-green-700 font-semibold text-xs whitespace-nowrap">
                    {order.orderStatusName}
                  </span>
                  <span className="text-sm md:text-[16px] font-medium text-gray-800">
                    {order.invoiceCode}
                  </span>
                </div>
              </div>

              {/* Order items & detail payment */}
              <div className="flex flex-col md:flex-row gap-6 md:justify-center items-start md:items-center w-full">
                {/* Order items */}
                <div className="flex flex-col w-full gap-6 py-4 md:py-0 md:border-r">
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
                        className="w-[60px] h-[60px] object-cover"
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
                              String(order.customerOrderitems[0].unitPrice)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail payment */}
                <div className="flex flex-col items-start justify-start gap-2 md:pr-14">
                  <span className="font-semibold text-gray-600 text-sm px-2 py-1 bg-slate-100 whitespace-nowrap">
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
              <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4 items-center justify-end md:px-6">
                <OrderDetailsModal orderId={order.id} />
                <ConfirmOrderModal orderStatusId={order.orderStatusId} />
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
