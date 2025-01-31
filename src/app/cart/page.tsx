"use client";

import CartItem from "@/components/cart/components/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatter";
import Link from "next/link";
import React, { FC, useEffect, useMemo } from "react";

const CartPage: FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);

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

  // Calculate total price
  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <section className="py-[40px] px-6 bg-slate-100 min-h-[calc(100vh-70px)]">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-4xl font-semibold">Cart</h1>
        <div className="mt-[40px] flex gap-8 w-full">
          {/* Cart items */}
          <div className="flex flex-col gap-6 w-full">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div className="bg-white p-8 rounded-xl" key={item.id}>
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    stock={item.stock}
                  />
                </div>
              ))
            ) : (
              <p className="text-center mt-10">Your cart is empty.</p>
            )}
          </div>

          {/* Checkout */}
          <div className="flex flex-col md:w-[480px] lg:w-[600px]">
            <div className="bg-white w- p-6 rounded-xl sticky top-[94px] flex flex-col gap-6">
              <h3 className="text-xl font-semibold">Shopping summary</h3>
              <div className="flex items-center justify-between w-full">
                <span>Total</span>
                <span className="text-lg font-bold">
                  {formatPrice(String(totalPrice))}
                </span>
              </div>
              <Separator className="my-2" />
              <Button variant={"default"}>
                <Link href="/cart/checkout">Buy now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
