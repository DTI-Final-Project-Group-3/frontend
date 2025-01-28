"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useState } from "react";

const CartItem = () => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="mt-[40px]">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="h-[96px] w-[86px] bg-slate-50">
            <Image
              src="/images/WareHub.png"
              alt="close icon"
              height={100}
              width={100}
              className="cursor-pointer w-auto h-auto object-cover"
            />
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold line-clamp-1">Tray Table</h3>
            <p className="text-sm text-[#6C7275]">Description</p>

            {/* Quantity Controls */}
            <div className="flex items-center mt-[8px] border border-black rounded-sm">
              <button
                className="px-3 py-1 text-xl text-black bg-white hover:bg-slate-50 transition-all rounded-sm"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center"
              />
              <button
                className="px-3 py-1 text-xl text-black bg-white hover:bg-slate-50 transition-all rounded-sm"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Prices */}
        <div className="flex flex-col justify-start items-end h-full">
          <h3 className="text-lg font-semibold">IDR{quantity * 40000}</h3>
          <div className="p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer pt-[8px]">
            <Image
              src="/icons/close.svg"
              alt="close icon"
              height={24}
              width={24}
            />
          </div>
        </div>
      </div>
      <Separator className="my-[24px]" />
    </div>
  );
};

export default CartItem;
