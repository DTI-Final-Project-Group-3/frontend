"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatter";
import Image from "next/image";
import React, { FC } from "react";

type CartItemProps = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

const CartItem: FC<CartItemProps> = ({ id, name, price, quantity, stock }) => {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeFromCart);

  return (
    <div className="">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 w-full">
          <div className="h-[96px] w-[86px] bg-slate-50 flex-shrink-0">
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
            <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>

            {/* product stock */}
            <p className="text-sm text-[#6C7275] line-clamp-1">
              Stock : {stock}
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center mt-[8px] border border-black rounded-sm">
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

        {/* Prices */}
        <div className="flex flex-col justify-start items-end h-full">
          <h3 className="text-[16px] font-semibold">
            {formatPrice(String(quantity * price))}
          </h3>
          <div
            onClick={() => removeItem(id)}
            className="p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer pt-[8px]"
          >
            <Image
              src="/icons/close.svg"
              alt="Remove icon"
              height={24}
              width={24}
            />
          </div>
        </div>
      </div>
      <Separator className="mt-[24px] mb-[48px]" />
    </div>
  );
};

export default CartItem;
