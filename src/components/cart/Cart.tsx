import Image from "next/image";
import React, { FC } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import CartItem from "./components/CartItem";

const Cart: FC = () => {
  return (
    <section className="bg-black w-full h-full">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-35 z-20" />

      {/* Cart items */}
      <div className="border-l-[1px] z-30 fixed top-0 right-0 h-screen w-full md:w-[462px] bg-white py-[40px] px-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Cart</h1>
          <div className="bg-slate-50 p-2 rounded-full hover:bg-slate-200 transition-all cursor-pointer">
            <Image
              src="/icons/close.svg"
              alt="close icon"
              height={24}
              width={24}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between h-full">
          {/* Cart Items */}
          <div>
            <CartItem />
            <CartItem />
          </div>

          {/* Footer */}
          <div className="mb-[24px]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">IDR40.000</span>
            </div>
            <Separator className="my-[8px]" />
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold">Total</span>
              <span className="font-bold">IDR40.000</span>
            </div>

            <div className="flex flex-col w-full gap-4">
              <Button variant={"default"}>Checkout</Button>
              <Button variant={"link"}>View Cart</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
