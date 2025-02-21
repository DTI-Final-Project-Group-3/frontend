"use client";

import React, { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/models/orders/orders";
import { ApiResponse } from "@/types/api/apiResponse";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime, formatPrice } from "@/utils/formatter";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

type OrderDetailsModalProps = {
  orderId: number;
};

export const fetchOrderDetail = async (
  orderId: number,
  accessToken: string
): Promise<ApiResponse<Order>> => {
  const ENDPOINT_URL = "/api/v1/orders";

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${ENDPOINT_URL}/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const OrderDetailsModal: FC<OrderDetailsModalProps> = ({ orderId }) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderDetails", orderId, accessToken],
    queryFn: () => fetchOrderDetail(orderId, accessToken!),
    enabled: !!accessToken && isOpen, // Fetch data only when modal is open
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-green-600 font-semibold text-md"
        >
          See transaction detail
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:min-w-[360px] md:min-w-[900px] md:min-h-[700px] overflow-y-auto"
      >
        <DialogHeader className="flex flex-col gap-2 w-full">
          <DialogTitle className="text-3xl font-semibold m-0 p-0">
            Order details
          </DialogTitle>
          <Separator />
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            Loading order details...
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-40 text-red-600">
            Failed to load order details.
          </div>
        ) : (
          data && (
            <div className="py-4 w-full max-h-[50vh] overflow-y-auto pr-4">
              <div className="flex flex-col gap-2">
                {/* Order status */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold mb-4 bg-green-200 text-green-800 px-4 py-2 rounded-xl whitespace-nowrap inline-flex w-fit">
                    {data.data.orderStatusName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-gray-500 font-medium">
                      Invoice code
                    </p>
                    <span className="flex gap-2 justify-center items-center text-[16px] font-semibold text-green-600">
                      {data.data.invoiceCode}{" "}
                      <SquareArrowOutUpRight size={18} className="text-black" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-gray-500 font-medium">
                      Order date
                    </p>
                    <span className="text-[16px] font-semibold text-gray-600">
                      {formatDateTime(data.data.createdAt).formattedDateTime}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Order items */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold mb-3">Order Items</h3>
                  {data.data.customerOrderitems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 py-4 flex gap-4"
                    >
                      <Image
                        src="/images/no-image-icon.jpg"
                        alt="Product image"
                        width={60}
                        height={60}
                        className="w-[60px] h-[60px] object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold line-clamp-3 max-w-[700px]">
                          {item.productName}
                        </span>
                        <span className="text-[15px] text-gray-500">
                          {item.quantity} x{" "}
                          {formatPrice(String(item.unitPrice))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order payment details */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold mb-3">Payment Details</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-gray-500 font-normal">
                      Send from warehouse
                    </p>
                    <span className="text-[16px] font-semibold text-black">
                      {data.data.warehouseName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-gray-500 font-normal">
                      Payment method
                    </p>
                    <span className="text-[16px] font-semibold text-black">
                      {data.data.paymentMethodName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-gray-500 font-normal">
                      Shipping cost
                    </p>
                    <span className="text-[16px] font-semibold text-black">
                      {formatPrice(String(data.data.shippingCost))}
                    </span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <p className="text-[20px] font-bold">Total Amount</p>
                    <span className="text-[20px] font-bold">
                      {formatPrice(String(data.data.totalAmount))}
                    </span>
                  </div>

                  <Separator className="my-4" />
                </div>
              </div>
            </div>
          )
        )}

        <DialogFooter className="flex items-end justify-end">
          <Button variant={"outline"} onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
