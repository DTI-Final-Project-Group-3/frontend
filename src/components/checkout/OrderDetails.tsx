import { formatPrice } from "@/utils/formatter";
import { FC } from "react";
import { Separator } from "../ui/separator";

type OrderDetailsProps = {
  totalPrice: number;
  totalQuantity: number;
  shippingCost: number;
};

const OrderDetails: FC<OrderDetailsProps> = ({
  totalPrice,
  totalQuantity,
  shippingCost,
}) => {
  const totalBill = totalPrice + shippingCost;
  return (
    <>
      <h3 className="text-[18px] font-semibold">Order details :</h3>

      {/* Total items and price */}
      <div className="flex items-center justify-between w-full">
        <span>Products Price ({totalQuantity} items)</span>
        <span className="text-lg font-bold">
          {totalQuantity < 1 ? "-" : formatPrice(String(totalPrice))}
        </span>
      </div>

      {/* Shipping cost */}
      <div className="flex items-center justify-between w-full">
        <span>Shipping cost</span>
        <span className="text-lg font-bold">{formatPrice(String(shippingCost))}</span>
      </div>

      <Separator className="mt-2" />

      {/* Total price */}
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold text-lg">Total price</span>
        <span className="text-lg font-bold">
          {totalQuantity < 1 ? "-" : formatPrice(String(totalBill))}
        </span>
      </div>

      <Separator className="mb-2" />
    </>
  );
};

export default OrderDetails;
