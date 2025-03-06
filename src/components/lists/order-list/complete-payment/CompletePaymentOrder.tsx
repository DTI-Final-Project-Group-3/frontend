import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import Link from "next/link";

type CompletePaymentOrderProps = {
  createdAt: Date;
  orderId: number;
  orderStatusId: number;
  paymentMethodId: number;
  midtransToken?: string;
};

const CompletePaymentOrder: FC<CompletePaymentOrderProps> = ({
  createdAt,
  orderStatusId,
  orderId,
  paymentMethodId,
  midtransToken,
}) => {
  const { timeLeft, formattedTime } = useCountdownTimer(createdAt.toString());

  return (
    <div>
      {timeLeft > 0 &&
      orderStatusId === 1 &&
      (paymentMethodId === 2 || paymentMethodId === 1) ? (
        <>
          {paymentMethodId === 2 ? (
            <Button variant="outline" className="border-green-600" asChild>
              <Link href={`cart/checkout/manual-payment/${orderId}`}>
                Pay before -{" "}
                <span className="font-bold text-green-600">
                  {formattedTime}
                </span>
              </Link>
            </Button>
          ) : paymentMethodId === 1 ? (
            <Button variant="outline" className="border-blue-600" asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://app.sandbox.midtrans.com/snap/v4/redirection/${midtransToken}`}
              >
                Pay before -{" "}
                <span className="font-bold text-green-600">
                  {formattedTime}
                </span>
              </Link>
            </Button>
          ) : null}
        </>
      ) : (
        <span className="text-red-500">Order canceled, payment expired</span>
      )}
    </div>
  );
};

export default CompletePaymentOrder;
