"use client";

import CartItemsList from "@/components/checkout/CartItemsList";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cartStore";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { Address } from "@/types/models/checkout/userAddresses";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Script from "next/script";
import React, { FC, useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
    };
  }
}

const CheckoutPage: FC = () => {
  const { data: session } = useSession();

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>("gateway");
  const [userAddress, setUserAddress] = useState<Address[]>([]);

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

  // Handle checkout
  const handleCheckout = async () => {
    try {
      // Set order items
      const orderItems = cartItems.map((item) => ({
        productId: 3,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      // Set payload
      const payload = {
        orderId: `ORD-${Date.now()}-${Math.random().toString(10)}`,
        grossAmount: Math.ceil(totalPrice + 25000),
        userId: 3,
        warehouseId: 3,
        paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
        shippingCost: 25000,
        orderStatusId: 1,
        orderItems: orderItems,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/transactions/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create transaction");

      const data = await response.json();

      await window.snap.pay(data.data.token);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Payment failed",
        duration: 2000,
        description: "Please check your order and payment detail.",
      });
    }
  };

  // Get all current user address
  const getAllAddress = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/user/address",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        toast({
          title: "Failed to fetch address",
          description: "Please login first and try again",
          variant: "destructive",
          duration: 2000,
        });
      }

      const data = await response.json();
      console.log(data);
      return data.data as Address;
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: `${error}`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userAddress = await getAllAddress();
        setUserAddress(userAddress ?? []);
      } catch (error) {
        console.error(error);
        setUserAddress([]);
      }
    };

    if (session) fetchUserAddress();
  }, [session]);

  return (
    <>
      {/* Midtrans snap pop up  */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <section className="py-[40px] px-6 bg-slate-100 min-h-[calc(100vh-70px)] w-full">
        <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
          {/* Breadcrumbs */}
          <div className="flex">
            <h1 className="text-4xl text-gray-500 font-medium">
              <Link href="/cart">Cart</Link>
            </h1>
            <span className="text-4xl text-gray-500 mx-2">/</span>
            <h1 className="text-4xl font-semibold">Checkout</h1>
          </div>

          <div className="mt-[40px] flex flex-col-reverse lg:flex-row gap-8 w-full">
            {/* Checkout details & shipping address */}
            <div className="flex flex-col gap-6 w-full">
              <ShippingAddress userAddress={userAddress} />
              <CartItemsList cartItems={cartItems} />
            </div>

            {/* Checkout Summary */}
            <div className="flex flex-col w-full md:w-[480px] lg:w-[600px]">
              <CheckoutSummary
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                totalQuantity={totalQuantity}
                totalPrice={totalPrice}
                shippingCost={25000} // Or any other cost
                handleCheckout={handleCheckout}
                isDisabled={cartItems.length < 1}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
