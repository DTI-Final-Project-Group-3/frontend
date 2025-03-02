import React, { FC } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { paymentOptions } from "@/constant/paymentOptionConstant";
import { Loader2, ShoppingCart, VerifiedIcon } from "lucide-react";
import PaymentOption from "./PaymentOption";
import OrderDetails from "./OrderDetails";

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
}) => {
  console.log(paymentMethod);

  return (
    <div className="bg-white p-6 rounded-xl sticky top-[94px] flex flex-col gap-4 w-full">
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="font-semibold text-md" disabled={isDisabled}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
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
        <DialogContent className="sm:min-w-[400px] p-6">
          <DialogHeader className="flex flex-col gap-2 w-full">
            <DialogTitle className="text-3xl font-semibold m-0 p-0 text-black flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 black mr-2" />
              Process this order ?
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <>
            <p className="text-black font-normal text-[16px] py-4">
              This action cannot be undone. Please make sure you did not buy the
              wrong items.
            </p>

            {/* Show error message if an error occurs */}
            {isError && (
              <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">
                Failed to process transaction. Please try again.
              </p>
            )}
          </>
          <Separator className="mt-4" />
          <DialogFooter className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="green"
              className="px-6"
              disabled={isDisabled}
              onClick={
                paymentMethod === "gateway"
                  ? handleCheckout
                  : handleManualCheckout
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
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
