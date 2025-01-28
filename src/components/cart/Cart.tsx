import Image from "next/image";
import React, { FC } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const Cart: FC = () => {
  // const showCart = true;

  return (
    <section className="bg-black w-full h-full">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-35 z-20" />

      {/* Cart items */}
      <div className="border-l-[1px] z-30 fixed top-0 right-0 h-screen md:w-[512px] bg-white py-[40px] px-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cart</h1>
          <Image
            src="/icons/close.svg"
            alt="close icon"
            height={32}
            width={32}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col justify-between h-full">
          {/* Cart Items */}
          <div>
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
                    <h3 className="text-lg font-bold">Tray Table</h3>
                    <p className="text-sm text-[#6C7275]">Color : Black</p>
                    <input
                      type="text"
                      className="mt-[10px] border-2 w-[80px]"
                    />
                  </div>
                </div>

                {/* Prices */}
                <div className="flex flex-col justify-start items-end h-full">
                  <h3 className="text-lg font-bold">IDR40.000</h3>
                  <Image
                    src="/icons/close.svg"
                    alt="close icon"
                    height={24}
                    width={24}
                    className="cursor-pointer pt-[8px]"
                  />
                </div>
              </div>
              <Separator className="my-[24px]" />
            </div>
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
                    <h3 className="text-lg font-bold">Tray Table</h3>
                    <p className="text-sm text-[#6C7275]">Color : Black</p>
                    <input
                      type="text"
                      className="mt-[10px] border-2 w-[80px]"
                    />
                  </div>
                </div>

                {/* Prices */}
                <div className="flex flex-col justify-start items-end h-full">
                  <h3 className="text-lg font-bold">IDR40.000</h3>
                  <Image
                    src="/icons/close.svg"
                    alt="close icon"
                    height={24}
                    width={24}
                    className="cursor-pointer pt-[8px]"
                  />
                </div>
              </div>
              <Separator className="my-[24px]" />
            </div>
          </div>

          {/* Footer */}
          <div className="mb-[40px]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold">IDR40.000</span>
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
