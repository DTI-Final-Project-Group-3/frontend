"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import {
  getAllAddress,
  getMainAddress,
} from "@/app/api/transaction/getUserAddresses";
import { Address } from "@/types/models/checkout/userAddresses";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { CartItem, useCartStore } from "@/store/cartStore";
import { createManualTransaction } from "@/app/api/transaction/createManualTransaction";
import { createGatewayTransaction } from "@/app/api/transaction/createGatewayTransaction";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import { toast } from "@/hooks/use-toast";
import { CartItem, useCartStore } from "@/store/cartStore";
import { PaymentMethods } from "@/types/models/checkout/paymentMethods";
import { Address } from "@/types/models/checkout/userAddresses";
import { ShippingCost } from "@/types/models/shippingCost";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

const shipping_cost_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/shipping/cost`;
const shipping_cost_dummy_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/shipping/cost-dummy`;

const CheckoutPage: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>("gateway");
  const [userAddress, setUserAddress] = useState<Address[]>([]);
  const [mainAddress, setMainAddress] = useState<Address | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCostResponse, setShippingCostResponse] = useState<ShippingCost | null>(null);

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
        (acc, item) => acc + item.product.price * item.cartQuantity,
        0
      ),
    [cartItems]
  );

  // Calculate total quantity
  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.cartQuantity, 0),
    [cartItems]
  );


  // Handle payment gateway checkout
  const handleCheckout = async () => {
    try {
      // Set order items
      const orderItems = cartItems.map((item) => ({
        productId: 3,
        quantity: item.cartQuantity,
        unitPrice: item.product.price,
      }));

      // Set payload
      const payload = {
        orderId: `ORDER-${Date.now()}-${Math.random().toString(10)}`,
        grossAmount: Math.ceil(totalPrice + shippingCost),
        userId: 3,
        warehouseId: 3,
        paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
        shippingCost: shippingCost,
        orderStatusId: 1, // Default status for waiting payment
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
        variant: "destructive",
        description: "Please check your order and payment detail.",
      });
    }
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (session) {
        const userAddress = await getAllAddress(session.accessToken);
        const mainAddress = await getMainAddress(session.accessToken);
        setUserAddress(userAddress);
        setMainAddress(mainAddress);
        console.log(mainAddress);
        
        const res = await fetch(shipping_cost_dummy_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            warehouseId: 1,
            userAddressId: mainAddress?.id,
            courier: "jne",
            weight: 100, // gram
          }),
        });
        const response = await res.json();
        if (response.success) {
          setShippingCostResponse(response.data);
          setShippingCost(response.data.costs[0].cost);  // mengambil harga pertama yang juga lowest price
        } else {
          alert("Failed to get shipping cost. Message = " + response.message);
        }
      }
    };

    fetchUserAddress();
  }, [session]);

  // Tanstack Query mutations transaction
  const gatewayTransaction = useMutation({
    mutationFn: () =>
      createGatewayTransaction({
        accessToken: session?.accessToken,
        latitude: mainAddress?.latitude || 0,
        longitude: mainAddress?.longitude || 0,
        shippingCost: 25000,
        paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
        totalPrice: totalPrice,
        cartItems: cartItems as CartItem[],
      }),
  });

  const manualTransaction = useMutation({
    mutationFn: () =>
      createManualTransaction(
        {
          accessToken: session?.accessToken,
          latitude: mainAddress?.latitude || 0,
          longitude: mainAddress?.longitude || 0,
          shippingCost: 25000,
          paymentMethodId: paymentMethod === "gateway" ? 1 : 2,
          totalPrice: totalPrice,
          cartItems: cartItems as CartItem[],
        },
        router
      ),
  });

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
            <div className="flex flex-col w-full md:w-[480px] lg:w-[600px] relative">
              <CheckoutSummary
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                totalQuantity={totalQuantity}
                totalPrice={totalPrice}
<!--                 shippingCost={25000} // Still waiting the API -->
                handleCheckout={gatewayTransaction.mutate}
                handleManualCheckout={manualTransaction.mutate}
                isLoading={
                  gatewayTransaction.isPending || manualTransaction.isPending
                }
                isError={
                  gatewayTransaction.isError || manualTransaction.isError
                shippingCost={shippingCost} // Still waiting the API
                }
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
