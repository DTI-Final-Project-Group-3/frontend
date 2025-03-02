import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import Link from "next/link";

type CompletePaymentOrderProps = {
  createdAt: Date;
  orderId: number;
  orderStatusId: number;
  paymentMethodId: number;
};

const CompletePaymentOrder: FC<CompletePaymentOrderProps> = ({
  createdAt,
  orderStatusId,
  orderId,
  paymentMethodId,
}) => {
  const { timeLeft, formattedTime } = useCountdownTimer(createdAt.toString());

  return (
    <div>
      {timeLeft > 0 && orderStatusId == 1 && paymentMethodId === 2 ? (
        <>
          <Button variant={"outline"} className="border-green-600" asChild>
            <Link href={`cart/checkout/manual-payment/${orderId}`}>
              Pay before -
              <span className="font-bold text-green-600">{formattedTime}</span>
            </Link>
          </Button>
        </>
      ) : (
        <span className="text-red-500">Order canceled, payment expired</span>
      )}
    </div>
  );
};

export default CompletePaymentOrder;
