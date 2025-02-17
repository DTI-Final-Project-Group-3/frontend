"use client";

import CartItemLarge from "@/components/cart/components/CartItemLarge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatter";
import Link from "next/link";
import React, { FC, useEffect, useMemo } from "react";

const CartPage: FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);

  console.log(cartItems);

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
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  // Calculate total quantity
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <section className="py-[40px] px-6 bg-slate-100 min-h-[calc(100vh-70px)] w-full">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-4xl font-semibold">Cart</h1>
        <div className="mt-[40px] flex flex-col-reverse lg:flex-row gap-8 w-full">
          {/* Cart items */}
          <div className="flex flex-col gap-6 w-full">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div className="bg-white p-8 rounded-xl" key={item.id}>
                  <CartItemLarge
                    key={item.id}
                    id={item.id}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    stock={item.stock}
                    category={item.product.category.name}
                  />
                </div>
              ))
            ) : (
              <p className="bg-white px-8 py-10 rounded-xl text-center">
                Your cart is empty.
              </p>
            )}
          </div>

          {/* Checkout summary */}
          <div className="flex flex-col w-full md:w-[480px] lg:w-[600px]">
            <div className="bg-white w- p-6 rounded-xl sticky top-[94px] flex flex-col gap-6">
              <h3 className="text-[22px] font-semibold">Order summary</h3>

              <Separator className="my-2" />

              {/* Total items */}
              <div className="flex items-center justify-between w-full">
                <span>Products</span>
                <span className="text-lg font-bold">
                  {totalQuantity < 1 ? "-" : `${totalQuantity} items`}
                </span>
              </div>

              {/* Total price */}
              <div className="flex items-center justify-between w-full">
                <span>Total price</span>
                <span className="text-lg font-bold">
                  {totalQuantity < 1 ? "-" : formatPrice(String(totalPrice))}
                </span>
              </div>

              <Separator className="my-2" />

              <Button variant="default" disabled={cartItems.length < 1} asChild>
                {cartItems.length > 0 ? (
                  <Link href="/cart/checkout" className="font-semibold">
                    Buy ({totalQuantity})
                  </Link>
                ) : (
                  "Buy"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
