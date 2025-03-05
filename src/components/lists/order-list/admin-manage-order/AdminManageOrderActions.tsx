"use client";

import { Order } from "@/types/models/orders/orders";
import { useSession } from "next-auth/react";
import React, { FC } from "react";
import CancelCustomerOrderModal from "./CancelCustomerOrderModal";
import ConfirmCustomerOrderModal from "./ConfirmCustomerOrderModal";
import SendCustomerOrderModal from "./SendCustomerOrderModal";

type AdminmanageOrderActionsProps = {
  // accessToken: string | undefined;
  order: Order;
  // addOneHour: (date: string) => Date;
};

const AdminManageOrderActions: FC<AdminmanageOrderActionsProps> = ({
  order,
  // addOneHour,
}) => {
  const { data: session } = useSession();

  const isAdmin =
    session?.userDetail?.role === "ADMIN_WAREHOUSE" ||
    session?.userDetail?.role === "ADMIN_SUPER";

  const isCancelable =
    isAdmin &&
    (order.orderStatusId === 1 ||
      order.orderStatusId === 2 ||
      order.orderStatusId === 3);
  // && new Date() < addOneHour(order.createdAt.toString());

  const isConfirmable =
    isAdmin && order.orderStatusId === 2 && order.paymentMethodId === 2;

  const isSentable = isAdmin && order.orderStatusId === 3;

  return (
    <>
      {isCancelable && (
        <CancelCustomerOrderModal
          orderId={order.id}
          orderStatusId={order.orderStatusId}
        />
      )}

      {isConfirmable && (
        <ConfirmCustomerOrderModal
          accessToken={session?.accessToken}
          paymentProofImage={order.paymentProofImageUrl}
          paymentMethodId={order.paymentMethodId}
          orderId={order.id}
          orderStatusId={order.orderStatusId}
        />
      )}

      {isSentable && (
        <SendCustomerOrderModal
          accessToken={session?.accessToken}
          orderId={order.id}
          orderItems={order.customerOrderitems}
          orderStatusId={order.orderStatusId}
          // paymentMethodId={order.paymentMethodId}
        />
      )}
    </>
  );
};

export default AdminManageOrderActions;
