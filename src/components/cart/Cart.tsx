"use client";

import Image from "next/image";
import React, { FC, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import CartItem from "./components/CartItem";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";
import { cn } from "@/lib/utils";

const Cart: FC = () => {
  const [toggleCart, setToggleCart] = useState(false);

  return (
    <>
      {/* Open Cart Button */}
      <button
        onClick={() => setToggleCart(true)}
        className="fixed top-4 left-4 bg-black text-white px-4 py-2 rounded-md z-50"
      >
        Open Cart
      </button>

      {/* Overlay and Cart Section */}
      <section
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          toggleCart
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          onClick={() => setToggleCart(false)}
          className={cn(
            "fixed inset-0 bg-black bg-opacity-35 z-20 transition-opacity duration-300",
            toggleCart ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Cart panel */}
        <div
          className={cn(
            "border-l-[1px] z-30 fixed top-0 right-0 h-screen w-full md:w-[482px] bg-white py-[40px] px-[24px] transform transition-transform duration-300 ease-in-out",
            toggleCart ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Cart</h1>
            <div
              onClick={() => setToggleCart(false)}
              className="bg-slate-100 p-[10px] rounded-full hover:bg-slate-200 transition-all cursor-pointer"
            >
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
            <div className="overflow-y-auto max-x-[30vh] space-y-4 mt-[40px] mb-[24px]">
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
            </div>

            {/* Footer */}
            <div className="mb-[24px]">
              {/* Pricing */}
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(String(40000))}
                </span>
              </div>
              <Separator className="my-[14px]" />
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold">Total</span>
                <span className="font-bold">{formatPrice(String(40000))}</span>
              </div>

              {/* Action button */}
              <div className="flex flex-col w-full gap-4">
                <Button variant={"default"}>Checkout</Button>
                <Button variant={"link"} asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
