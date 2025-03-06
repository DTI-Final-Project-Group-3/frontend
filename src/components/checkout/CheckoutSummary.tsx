"use client";

import React, { FC, useState } from "react";
import { paymentOptions } from "@/constant/paymentOptionConstant";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { ShippingDetail, ShippingList } from "@/types/models/shippingList";
import { Loader2, ShoppingCart, VerifiedIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import OrderDetails from "./OrderDetails";
import PaymentOption from "./PaymentOption";

type CheckoutSummaryProps = {
  paymentMethod: PaymentMethods;
  setPaymentMethod: (method: PaymentMethods) => void;
  totalQuantity: number;
  totalPrice: number;
  shippingCost: number;
  handleCheckout: () => void;
  handleManualCheckout: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  isError: boolean;
  shippingList : ShippingList | null;
  setShippingMethod : (method: ShippingDetail | null) => void;
  shippingMethodSelected : boolean;
};

const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  totalQuantity,
  totalPrice,
  shippingCost,
  paymentMethod,
  setPaymentMethod,
  handleCheckout,
  handleManualCheckout,
  isLoading,
  isError,
  isDisabled,
  shippingList,
  setShippingMethod,
  shippingMethodSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const processCheckout = async () => {
    try {
      if (paymentMethod === "gateway") {
        await handleCheckout();
      } else {
        await handleManualCheckout();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <div className="sticky top-[94px] flex w-full flex-col gap-4 rounded-xl bg-white p-6">
      <h3 className="text-[22px] font-bold">Checkout summary</h3>

      <Separator className="my-2" />

      {/* Select Payment Method */}
      <div className="flex flex-col gap-4">
        <h3 className="mb-2 text-[18px] font-semibold">
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
        shippingMethodSelected={shippingMethodSelected}
        shippingList={shippingList}
        setShippingMethod={setShippingMethod}
      />

      {/* Buy Now Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="font-semibold text-md" disabled={!shippingMethodSelected || isDisabled || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <VerifiedIcon height={34} width={34} className="text-white" />
                <p>Buy now</p>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 sm:min-w-[400px]">
          <DialogHeader className="flex w-full flex-col gap-2">
            <DialogTitle className="m-0 flex items-center gap-2 p-0 text-3xl font-semibold text-black">
              <ShoppingCart className="black mr-2 h-6 w-6" />
              Process this order ?
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <>
            <p className="py-4 text-[16px] font-normal text-black">
              This action cannot be undone. Please make sure you did not buy the
              wrong items.
            </p>

            {/* Show error message if an error occurs */}
            {isError && (
              <p className="rounded-md bg-red-100 p-2 text-sm text-red-500">
                Failed to process transaction. Please try again.
              </p>
            )}
          </>
          <Separator className="mt-4" />
          <DialogFooter className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="green"
              className="px-6"
              disabled={isDisabled || isLoading}
              onClick={
                // paymentMethod === "gateway"
                //   ? handleCheckout
                //   : handleManualCheckout
                processCheckout
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-center text-sm text-gray-600">
        By proceeding with payment, you agree to the Terms & Conditions.
      </p>
    </div>
  );
};

export default CheckoutSummary;
