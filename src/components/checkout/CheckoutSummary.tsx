import React, { FC } from "react";
import { Separator } from "../ui/separator";
import OrderDetails from "./OrderDetails";
import { Button } from "../ui/button";
import { VerifiedIcon } from "lucide-react";
import PaymentOption from "./PaymentOption";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { paymentOptions } from "@/constant/paymentOptionConstant";

type CheckoutSummaryProps = {
  paymentMethod: PaymentMethods;
  setPaymentMethod: (method: PaymentMethods) => void;
  totalQuantity: number;
  totalPrice: number;
  shippingCost: number;
  handleCheckout: () => void;
  isDisabled: boolean;
};

const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  totalQuantity,
  totalPrice,
  shippingCost,
  paymentMethod,
  setPaymentMethod,
  handleCheckout,
  isDisabled,
}) => {
  return (
    <div className="bg-white w- p-6 rounded-xl sticky top-[94px] flex flex-col gap-4">
      <h3 className="text-[22px] font-bold">Checkout summary</h3>

      <Separator className="my-2" />

      {/* Select Payment Method */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-semibold mb-2">
          Select Payment Method :
        </h3>

        <PaymentOption
          options={paymentOptions}
          selectedOption={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </div>

      <Separator className="my-2" />

      {/* Order Details */}
      <OrderDetails
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        shippingCost={shippingCost}
      />

      {/* Buy Now Button */}
      <Button
        variant={"default"}
        disabled={isDisabled}
        onClick={handleCheckout}
      >
        <VerifiedIcon height={34} width={34} className="text-white" />
        Buy now
      </Button>
    </div>
  );
};

export default CheckoutSummary;
