import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatter";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

type CartItemProps = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  showButton?: boolean;
};

const CartItemLarge: FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  stock,
  showButton = false,
}) => {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeFromCart);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 h-full w-full">
        <div className="flex gap-6 w-full">
          <div className="h-[100px] w-[100px] bg-slate-50 flex-shrink-0 rounded-xl">
            <Image
              src="/images/WareHub.png"
              alt="Product image"
              height={100}
              width={100}
              className="cursor-pointer w-auto h-auto object-cover"
            />
          </div>

          <div className="flex flex-col items-start justify-between">
            {/* Product name */}
            <h3 className="text-xl font-semibold line-clamp-2">{name}</h3>
            {/* product Description */}
            <p className="text-[16px] line-clamp-1 text-gray-600">
              Descrption here
            </p>
            {/* product stock */}
            <p className="text-[16px] text-[#6C7275] line-clamp-1">
              Stock left : <span className="font-semibold">{stock} </span>
            </p>
          </div>
        </div>

        {/* Prices and Item Controls */}
        <div className="flex flex-col justify-between items-end h-full gap-2 w-full">
          {/* Price */}
          <h3 className="text-lg font-bold">
            {quantity} x {formatPrice(String(price))}
          </h3>

          {/* Quantity and remove button */}
          <div
            className={cn(
              "flex items-end justify-center gap-4",
              showButton && "hidden"
            )}
          >
            {/* Remove button */}
            <div
              onClick={() => removeItem(id)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer pt-[8px] text-gray-400 hover:text-black"
            >
              <Trash2 width={24} height={24} />
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center mt-[8px] border border-gray-400 rounded-sm h-[36px]">
              <button
                className={cn(
                  "px-3 py-[2px] text-xl text-black bg-whitetransition-all rounded-sm",
                  quantity <= 1 ? "text-gray-400" : "hover:bg-slate-100"
                )}
                onClick={() => decreaseQuantity(id)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center py-1 border-none outline-none"
              />
              <button
                className={cn(
                  "px-3 py-[2px] text-xl text-black bg-white transition-all rounded-sm",
                  quantity >= stock ? "text-gray-300" : "hover:bg-slate-100"
                )}
                onClick={() => increaseQuantity(id)}
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <Separator className={cn("hidden mt-6", showButton && "block")} />
    </>
  );
};

export default CartItemLarge;
