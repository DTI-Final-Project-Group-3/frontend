"use client";

import Image from "next/image";
import React, { FC, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import CartItem from "./components/CartItem";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter";
import { cn } from "@/lib/utils";
import { useCartToggleStore } from "@/store/cartToggle";
import { useCartStore } from "@/store/cartStore";

const Cart: FC = () => {
  const { showCart, toggleShowCart } = useCartToggleStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);

  // Handle scroll disable
  useEffect(() => {
    if (showCart) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

  // Load cart data from local storage if there is any data on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart-storage");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, [setCartItems]);

  // Sync cart data to local storage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0)
      localStorage.setItem("cart-storage", JSON.stringify(cartItems));
    else localStorage.removeItem("cart-storage");
  }, [cartItems]);

  return (
    <>
      {/* Overlay and Cart Section */}
      <section
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 text-black",
          showCart
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          onClick={toggleShowCart}
          className={cn(
            "fixed inset-0 bg-black bg-opacity-35 z-20 transition-opacity duration-300",
            showCart ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Cart panel */}
        <div
          className={cn(
            "border-l-[1px] z-30 fixed top-0 right-0 h-screen w-full md:w-[502px] bg-white py-[40px] px-[24px] transform transition-transform duration-300 ease-in-out",
            showCart ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Cart</h1>
            <div
              onClick={toggleShowCart}
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
            <div className="overflow-y-auto max-x-[30vh] space-y-4 mt-[40px] mb-[24px] pr-2">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    stock={item.stock}
                  />
                ))
              ) : (
                <p className="text-center mt-10">Your cart is empty.</p>
              )}
            </div>

            {/* Footer */}
            <div className="mb-[24px]">
              {/* Pricing */}
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Subtotal</span>
                <span className="text-[16px] font-semibold">
                  {formatPrice(String(40000))}
                </span>
              </div>
              <Separator className="my-[14px]" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[20px] font-semibold">Total</span>
                <span className="text-[20px] font-semibold">
                  {formatPrice(String(40000))}
                </span>
              </div>

              {/* Action button */}
              <div className="flex flex-col w-full gap-4">
                <Button variant={"default"}>Checkout</Button>
                <Button variant={"link"} asChild>
                  <Link onClick={toggleShowCart} href="/cart">
                    View Cart
                  </Link>
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
