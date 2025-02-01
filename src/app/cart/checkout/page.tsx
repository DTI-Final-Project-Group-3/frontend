"use client";

import CartItemLarge from "@/components/cart/components/CartItemLarge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatter";
import { VerifiedIcon } from "lucide-react";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useState } from "react";

const CheckoutPage: FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const [paymentMethod, setPaymentMethod] = useState<string>("gateway");

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

  // Calculate total quantity
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <section className="py-[40px] px-6 bg-slate-100 min-h-[calc(100vh-70px)]">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-4xl font-semibold">Checkout</h1>
        <div className="mt-[40px] flex flex-col-reverse lg:flex-row gap-8 w-full">
          {/* Checkout details & shipping address */}
          <div className="flex flex-col gap-6 w-full">
            {/* Shipping address */}
            <div className="bg-white p-8 rounded-xl">
              <h3>Shipping address</h3>

              <div></div>
            </div>

            {/* Products lists */}
            <div className="bg-white rounded-xl">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div className="p-8" key={item.id}>
                    <CartItemLarge
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
                <p className="bg-white px-8 py-10 rounded-xl text-center">
                  Your cart is empty.
                </p>
              )}
            </div>
          </div>

          {/* Checkout payment options */}
          <div className="flex flex-col w-full md:w-[480px] lg:w-[600px]">
            <div className="bg-white w- p-6 rounded-xl sticky top-[94px] flex flex-col gap-4">
              <h3 className="text-[22px] font-bold">Payment Detail</h3>

              <Separator className="my-2" />

              {/* Payment method */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-semibold">
                  Payment Method :
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-lg" htmlFor="gateway">
                    Payment gateway
                  </label>
                  <input
                    type="radio"
                    id="gateway"
                    name="paymentMethod"
                    value="gateway"
                    checked={paymentMethod === "gateway"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-[20px] w-[20px] checked:accent-green-600 text-green-700"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-lg" htmlFor="manual">
                    Manual Transfer
                  </label>
                  <input
                    type="radio"
                    id="manual"
                    name="paymentMethod"
                    value="manual"
                    checked={paymentMethod === "manual"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-[20px] w-[20px] checked:accent-green-600 text-green-700"
                  />
                </div>
              </div>

              <Separator className="my-2" />

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
                <span className="text-lg font-bold">
                  {formatPrice(String(25000))}
                </span>
              </div>

              <Separator className="mt-2" />

              {/* Total price */}
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">Total price</span>
                <span className="text-lg font-bold">
                  {totalQuantity < 1 ? "-" : formatPrice(String(totalPrice))}
                </span>
              </div>

              <Separator className="mb-2" />

              <Button
                variant={"default"}
                disabled={cartItems.length < 1}
                asChild
              >
                <Link href="/cart/checkout" className="font-semibold">
                  <VerifiedIcon height={34} width={34} className="text-white" />
                  Buy now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
